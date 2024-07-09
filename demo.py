#
# demo application for http3_server.py
#

import datetime
import os
from urllib.parse import urlencode
import asyncio

from starlette.applications import Starlette
from starlette.responses import PlainTextResponse, Response, JSONResponse
from starlette.routing import Mount, Route, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.types import Receive, Scope, Send
from starlette.websockets import WebSocketDisconnect

ROOT = os.path.dirname(__file__)
STATIC_ROOT = os.environ.get("STATIC_ROOT", os.path.join(ROOT, "htdocs"))
STATIC_URL = "/"
LOGS_PATH = os.path.join(STATIC_ROOT, "logs")
QVIS_URL = "https://qvis.quictools.info/"

templates = Jinja2Templates(directory=os.path.join(ROOT, "templates"))


async def homepage(request):
    """
    Simple homepage.
    """
    await request.send_push_promise("/style.css")
    return templates.TemplateResponse("index.html", {"request": request})


async def echo(request):
    """
    HTTP echo endpoint.
    """
    content = await request.body()
    media_type = request.headers.get("content-type")
    return Response(content, media_type=media_type)


async def logs(request):
    """
    Browsable list of QLOG files.
    """
    logs = []
    for name in os.listdir(LOGS_PATH):
        if name.endswith(".qlog"):
            s = os.stat(os.path.join(LOGS_PATH, name))
            file_url = "https://" + request.headers["host"] + "/logs/" + name
            logs.append(
                {
                    "date": datetime.datetime.utcfromtimestamp(s.st_mtime).strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
                    "file_url": file_url,
                    "name": name[:-5],
                    "qvis_url": QVIS_URL
                    + "?"
                    + urlencode({"file": file_url})
                    + "#/sequence",
                    "size": s.st_size,
                }
            )
    return templates.TemplateResponse(
        "logs.html",
        {
            "logs": sorted(logs, key=lambda x: x["date"], reverse=True),
            "request": request,
        },
    )


async def padding(request):
    """
    Dynamically generated data, maximum 50MB.
    """
    size = min(50000000, request.path_params["size"])
    return PlainTextResponse("Z" * size)

# Define a new endpoint function for handling POST requests
async def create_room_post(request):
    # Assuming you want to echo back the received JSON data
    data = await request.json()
    # Modify or process the data as needed
    response_data = {"received_data": data}
    return JSONResponse(response_data)


async def ws(websocket):
    """
    WebSocket echo endpoint.
    """
    if "chat" in websocket.scope["subprotocols"]:
        subprotocol = "chat"
    else:
        subprotocol = None
    await websocket.accept(subprotocol=subprotocol)

    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_text(message)
    except WebSocketDisconnect:
        pass

# counts = {}
rooms = {}


async def wt(scope: Scope, receive: Receive, send: Send) -> None:
    """
    WebTransport echo endpoint.
    """
    # accept connection
    message = await receive()
    assert message["type"] == "webtransport.connect"
    await send({"type": "webtransport.accept"})

    id = scope["client"][0] + '-' + str(scope["client"][1])
    print(id)
    room_name = None
    testTog = False
    # if(id not in counts):
    #     counts[id] = 0
    # echo back received data

    while True:

        print("waiting to receive")
        if not testTog:
            message = await receive()
            print("received", message)
            decoded = message["data"].decode()
            decoded_type = decoded[0]
            if(decoded_type == '0'):
                room_name = decoded
                if(room_name not in rooms):
                    rooms[room_name] = {'count' : 0, 'sends' : []}
                rooms[room_name]["sends"].append(send)
                continue
        if testTog:
            await asyncio.sleep(0.5)
            response = (room_name + str(rooms[room_name]["count"])).encode()
            rooms[room_name]["count"] += 1
            a = await send({"data": response, "type": "webtransport.datagram.send"})
            print(a)
            continue
        decoded = decoded[1:]
        response = (decoded + str(rooms[room_name]['count'])).encode()
        rooms[room_name]['count'] += 1
        print(response)
        if message["type"] == "webtransport.datagram.receive":
            for send in rooms[room_name]["sends"]:
                asyncio.create_task(send(
                    {
                        "data": response,
                        "type": "webtransport.datagram.send",
                    }
                ))
            # asyncio.create_task(send(
            #     {
            #         "data": response,
            #         "type": "webtransport.datagram.send",
            #     }
            # ))
        elif message["type"] == "webtransport.stream.receive":
            await send(
                {
                    "data": response,
                    "stream": message["stream"],
                    "type": "webtransport.stream.send",
                }
            )
        # testTog = True


starlette = Starlette(
    routes=[
        Route("/", homepage),
        Route("/{size:int}", padding),
        Route("/echo", echo, methods=["POST"]),
        Route("/logs", logs),
        WebSocketRoute("/ws", ws),
        Mount(STATIC_URL, StaticFiles(directory=STATIC_ROOT, html=True)),
    ]
)


async def app(scope: Scope, receive: Receive, send: Send) -> None:
    if scope["type"] == "webtransport" and scope["path"] == "/wt":
        await wt(scope, receive, send)
    else:
        print(scope)
        await starlette(scope, receive, send)
