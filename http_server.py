import argparse
import asyncio
import selectors
import logging
import time

import uvicorn.config
import pong as asgi_app
from collections import deque
from email.utils import formatdate
from typing import Callable, Deque, Dict, List, Optional, Union, cast

import aioquic
import wsproto
import wsproto.events
from aioquic.asyncio import QuicConnectionProtocol, serve as serve_quic
from aioquic.h0.connection import H0_ALPN, H0Connection
from aioquic.h3.connection import H3_ALPN, H3Connection
from aioquic.h3.events import (
    DatagramReceived,
    DataReceived,
    H3Event,
    HeadersReceived,
    WebTransportStreamDataReceived,
)
from aioquic.h3.exceptions import NoAvailablePushIDError
from aioquic.quic.configuration import QuicConfiguration
from aioquic.quic.events import DatagramFrameReceived, ProtocolNegotiated, QuicEvent
from aioquic.quic.logger import QuicFileLogger
from aioquic.tls import SessionTicket

import uvicorn

try:
    import uvloop
except ImportError:
    uvloop = None

AsgiApplication = Callable
# HttpConnection = Union[H0Connection, H3Connection]

SERVER_NAME = "aioquic/" + aioquic.__version__
HTTP_CERT = "certs/cert.pem"
HTTP_KEY = "certs/key.pem"
HTTP3_CERT = "certs/ecdsa_cert.pem"
HTTP3_KEY = "certs/ecdsa_key.pem"


class WebTransportHandler:
    def __init__(
        self,
        *,
        connection: H3Connection,
        scope: Dict,
        stream_id: int,
        transmit: Callable[[], None],
    ) -> None:
        self.accepted = False
        self.closed = False
        self.connection = connection
        print("connection", connection._quic._close_event)
        self.http_event_queue: Deque[H3Event] = deque()
        self.queue: asyncio.Queue[Dict] = asyncio.Queue()
        self.scope = scope
        self.stream_id = stream_id
        self.transmit = transmit

    def http_event_received(self, event: H3Event) -> None:
        if not self.closed:
            if self.accepted:
                if isinstance(event, DatagramReceived):
                    self.queue.put_nowait(
                        {
                            "data": event.data,
                            "type": "webtransport.datagram.receive",
                        }
                    )
                elif isinstance(event, WebTransportStreamDataReceived):
                    self.queue.put_nowait(
                        {
                            "data": event.data,
                            "stream": event.stream_id,
                            "type": "webtransport.stream.receive",
                        }
                    )
            else:
                # delay event processing until we get `webtransport.accept`
                # from the ASGI application
                self.http_event_queue.append(event)

    async def run_asgi(self, app: AsgiApplication) -> None:
        self.queue.put_nowait({"type": "webtransport.connect"})

        try:
            await app(self, self.scope, self.receive, self.send)
        finally:
            if not self.closed:
                await self.send({"type": "webtransport.close"})

    async def receive(self) -> Dict:
        return await self.queue.get()

    async def send(self, message: Dict) -> None:
        data = b""
        end_stream = False

        if message["type"] == "webtransport.accept":
            self.accepted = True

            headers = [
                (b":status", b"200"),
                (b"server", SERVER_NAME.encode()),
                (b"date", formatdate(time.time(), usegmt=True).encode()),
                (b"sec-webtransport-http3-draft", b"draft02"),
            ]
            self.connection.send_headers(stream_id=self.stream_id, headers=headers)

            # consume backlog
            while self.http_event_queue:
                self.http_event_received(self.http_event_queue.popleft())
        elif message["type"] == "webtransport.close":
            if not self.accepted:
                self.connection.send_headers(
                    stream_id=self.stream_id, headers=[(b":status", b"403")]
                )
            end_stream = True
        elif message["type"] == "webtransport.datagram.send":
            self.connection.send_datagram(
                stream_id=self.stream_id, data=message["data"]
            )
        elif message["type"] == "webtransport.stream.send":
            self.connection._quic.send_stream_data(
                stream_id=message["stream"], data=message["data"]
            )

        if data or end_stream:
            self.connection.send_data(
                stream_id=self.stream_id, data=data, end_stream=end_stream
            )
        if end_stream:
            self.closed = True
        self.transmit()

# Handler = Union[HttpRequestHandler, WebSocketHandler, WebTransportHandler]


class HttpServerProtocol(QuicConnectionProtocol):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self._handlers: Dict[int, WebTransportHandler] = {}
        self._http: Optional[H3Connection] = None

    def http_event_received(self, event: H3Event) -> None:
        if isinstance(event, HeadersReceived) and event.stream_id not in self._handlers:
            authority = None
            headers = []
            # http_version = "0.9" if isinstance(self._http, H0Connection) else "3"
            raw_path = b""
            method = ""
            protocol = None
            for header, value in event.headers:
                if header == b":authority":
                    authority = value
                    headers.append((b"host", value))
                elif header == b":method":
                    method = value.decode()
                elif header == b":path":
                    raw_path = value
                elif header == b":protocol":
                    protocol = value.decode()
                elif header and not header.startswith(b":"):
                    headers.append((header, value))

            if b"?" in raw_path:
                path_bytes, query_string = raw_path.split(b"?", maxsplit=1)
            else:
                path_bytes, query_string = raw_path, b""
            path = path_bytes.decode()
            self._quic._logger.info("HTTP request %s %s", method, path)

            # FIXME: add a public API to retrieve peer address
            client_addr = self._http._quic._network_paths[0].addr
            client = (client_addr[0], client_addr[1])

            handler: WebTransportHandler
            scope: Dict
            if method == "CONNECT" and protocol == "webtransport":
                assert isinstance(
                    self._http, H3Connection
                ), "WebTransport is only supported over HTTP/3"
                scope = {
                    "client": client,
                    "headers": headers,
                    # "http_version": http_version,
                    "http_version": "3",
                    "method": method,
                    "path": path,
                    "query_string": query_string,
                    "raw_path": raw_path,
                    "root_path": "",
                    "scheme": "https",
                    "type": "webtransport",
                }
                handler = WebTransportHandler(
                    connection=self._http,
                    scope=scope,
                    stream_id=event.stream_id,
                    transmit=self.transmit,
                )
            self._handlers[event.stream_id] = handler
            asyncio.ensure_future(handler.run_asgi(asgi_app.wt_app))
        elif (
            isinstance(event, (DataReceived, HeadersReceived))
            and event.stream_id in self._handlers
        ):
            handler = self._handlers[event.stream_id]
            handler.http_event_received(event)
        elif isinstance(event, DatagramReceived):
            handler = self._handlers[event.stream_id]
            handler.http_event_received(event)
        elif isinstance(event, WebTransportStreamDataReceived):
            handler = self._handlers[event.session_id]
            handler.http_event_received(event)

    def quic_event_received(self, event: QuicEvent) -> None:
        if isinstance(event, ProtocolNegotiated):
            if event.alpn_protocol in H3_ALPN:
                self._http = H3Connection(self._quic, enable_webtransport=True)
            # elif event.alpn_protocol in H0_ALPN:
            #     self._http = H0Connection(self._quic)
        elif isinstance(event, DatagramFrameReceived):
            if event.data == b"quack":
                self._quic.send_datagram_frame(b"quack-ack")

        #  pass event to the HTTP layer
        if self._http is not None:
            for http_event in self._http.handle_event(event):
                self.http_event_received(http_event)


class SessionTicketStore:
    """
    Simple in-memory store for session tickets.
    """

    def __init__(self) -> None:
        self.tickets: Dict[bytes, SessionTicket] = {}

    def add(self, ticket: SessionTicket) -> None:
        self.tickets[ticket.ticket] = ticket

    def pop(self, label: bytes) -> Optional[SessionTicket]:
        return self.tickets.pop(label, None)


async def serve_http(config: uvicorn.Config) -> None:
    server = uvicorn.Server(config)
    await server.serve()


async def main(
    host: str,
    port: int,
    configuration: QuicConfiguration,
    session_ticket_store: SessionTicketStore,
    retry: bool,
    args
) -> None:
    print(f"Listening on {host}:{port}")
    await asyncio.gather(
        serve_http(
            uvicorn.Config(
                asgi_app.http_app,
                host=host,
                ws="wsproto",
                http="auto",
                port=80 if args.http and port is 443 else port,
                log_level="info" if args.verbose else "warning",
            )
            if args.http
            else uvicorn.Config(
                asgi_app.http_app,
                host=host,
                ws="wsproto",
                http="auto",
                port=port,
                log_level="info" if args.verbose else "warning",
                ssl_certfile=HTTP_CERT,
                ssl_keyfile=HTTP_KEY,
            )
        ),
        serve_quic(
            host,
            port,
            configuration=configuration,
            create_protocol=HttpServerProtocol,
            session_ticket_fetcher=session_ticket_store.pop,
            session_ticket_handler=session_ticket_store.add,
            retry=retry,
        ),
    )

    await asyncio.Future()


if __name__ == "__main__":
    defaults = QuicConfiguration(is_client=False)

    parser = argparse.ArgumentParser(description="QUIC server")

    parser.add_argument(
        "--congestion-control-algorithm",
        type=str,
        default="reno",
        help="use the specified congestion control algorithm",
    )
    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
        help="listen on the specified address (defaults to ::)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=443,
        help="listen on the specified port (defaults to 4433)",
    )
    parser.add_argument(
        "-l",
        "--secrets-log",
        type=str,
        help="log secrets to a file, for use with Wireshark",
    )
    parser.add_argument(
        "--max-datagram-size",
        type=int,
        default=defaults.max_datagram_size,
        help="maximum datagram size to send, excluding UDP or IP overhead",
    )
    parser.add_argument(
        "-q",
        "--quic-log",
        type=str,
        help="log QUIC events to QLOG files in the specified directory",
    )
    parser.add_argument(
        "--retry",
        action="store_true",
        help="send a retry for new connections",
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true", help="increase logging verbosity"
    )
    parser.add_argument(
        "--http",
        action="store_true",
        help="user unsecure http",
    )
    args = parser.parse_args()

    logging.basicConfig(
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        level=logging.DEBUG if args.verbose else logging.INFO,
    )

    # create QUIC logger
    if args.quic_log:
        quic_logger = QuicFileLogger(args.quic_log)
    else:
        quic_logger = None

    # open SSL log file
    if args.secrets_log:
        secrets_log_file = open(args.secrets_log, "a")
    else:
        secrets_log_file = None

    configuration = QuicConfiguration(
        alpn_protocols=H3_ALPN + H0_ALPN + ["siduck"],
        congestion_control_algorithm=args.congestion_control_algorithm,
        is_client=False,
        max_datagram_frame_size=65536,
        max_datagram_size=args.max_datagram_size,
        quic_logger=quic_logger,
        secrets_log_file=secrets_log_file,
    )
    # load SSL certificate and key
    configuration.load_cert_chain(HTTP3_CERT, HTTP3_KEY)

    if uvloop is not None:
        print("installing uvloop event loop...")
        uvloop.install()
        print("Using uvloop event loop")

    try:
        selector = selectors.SelectSelector()
        loop = asyncio.SelectorEventLoop(selector)
        asyncio.set_event_loop(loop)
        # asyncio.run(
        loop.run_until_complete(
            main(
                host=args.host,
                port=args.port,
                configuration=configuration,
                session_ticket_store=SessionTicketStore(),
                retry=args.retry,
                args=args
            )
        )
    except KeyboardInterrupt:
        pass
