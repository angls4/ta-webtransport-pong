#
# demo application for http3_server.py
#

import datetime
import os
import json
from urllib.parse import urlencode
import asyncio
import uvicorn
# import h2
import ssl

import uvicorn.config
from helpers import *
from classes import *
from http3_server import Handler

from starlette.applications import Starlette
from starlette.responses import PlainTextResponse, Response, JSONResponse
from starlette.routing import Mount, Route, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.types import Receive, Scope, Send
from starlette.websockets import WebSocketDisconnect, WebSocket
from starlette.middleware.cors import CORSMiddleware

ROOT = os.path.dirname(__file__)
STATIC_ROOT = os.environ.get("STATIC_ROOT", os.path.join(ROOT, "htdocs"))
STATIC_URL = "/"
LOGS_PATH = os.path.join(STATIC_ROOT, "logs")
QVIS_URL = "https://qvis.quictools.info/"
USER_ID_LENGTH = 4
ROOM_ID_LENGTH = 5
FLAG_LOGIN = 0
FLAG_PADDLE_Y = 1
FLAG_START_PAUSE = 2
UPDATE_INTERVAL = 1 / 30

templates = Jinja2Templates(directory=os.path.join(ROOT, "templates"))

rooms:dict[str, Room] ={}
users:dict[str, User] ={}
connections:dict[str, Connection] ={}


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

async def list_room_get(request):
    res = {
        "code": 200,
        "status": "success",
        "rooms": [room.get_dict() for room in rooms.values()]
    }
    # print([room.__dict__ for room in rooms.values()])
    return JSONResponse(res)

async def get_room_get(request):
    room_id = request.path_params["id"]
    room = rooms.get(room_id)
    if room:
        res = {
            "code": 200,
            "status": "success",
            "room": room.get_dict()
        }
        return JSONResponse(res)
    else:
        return error_response(404, "room not found")

# Define a new endpoint function for handling POST requests
async def create_room_post(request):
    # Assuming you want to echo back the received JSON data
    data = await request.json()
    try:
        if data.get("name") == "":
            return error_response(400, "name cannot be empty")
        if data.get("ballSpeedY") == "" or data.get("ballSpeedX") == "":
            return error_response(400, "ball speed cannot be empty")
        roomConfig: RoomConfig = RoomConfig(**data)
        print(data)
        utc = datetime.datetime.now(datetime.UTC).timestamp()
        room_id = hash_number_to_alphanumeric(utc, ROOM_ID_LENGTH)
        room:Room = Room(room_id, roomConfig)
        print(room.get_dict())
        rooms[room_id] = room
        res = {
            "code": 200,
            "status": "success",
            "room": room.get_dict()
        }
        return JSONResponse(res)
    except Exception as e:
        print(e)
        return error_response(500, "failed creating room")

async def join_room_post(request):
    # print(users)
    # print(rooms)
    data: RoomJoinForm = await request.json()
    # print(data)
    room_id = data.get("room_id")
    user_id = data.get("user_id")
    if(room_id and user_id):
        room = rooms.get(room_id)
        user = users.get(user_id)
        if room and user:
            # password = data["password"]
            if room.gameState.players.get(user.id):
                res = {
                    "code": 200,
                    "status": "success",
                    "room": room.get_dict(),
                    "user": user.get_dict(),
                    # "gameState": room.gameState.getState()
                }
                return JSONResponse(res)
            if len(room.gameState.players) < 2:
                player = Player(user=user)
                user.room = room
                user.player = player
                a = dict.copy(room.gameState.players)
                a[user.id] = player
                room.gameState.players = a
                # print(room.gameState.players)
                if list(room.gameState.players.keys())[0] == user.id:
                    room.gameState.p0index = user.id
                else:
                    room.gameState.p1index = user.id
                # print("p0index",room.gameState.p0index)
                players = list(room.gameState.players.values())
                try:
                    if(len(players) == 2):
                        asyncio.create_task(players[0].user.connection.send(room.gameState.get_dict()))
                        asyncio.create_task(players[1].user.connection.send(room.gameState.get_dict()))
                except Exception as e:
                    print(e)
                res = {
                    "code": 200,
                    "status": "success",
                    "room": room.get_dict(),
                    "user": user.get_dict()
                    # "gameState": room.gameState.getState()
                }
                return JSONResponse(res)
            else:
                return error_response(400, "room full")
        else:
            return error_response(400, "room not found or user not found")
    else:
        return error_response(400, "invalid data")
    # print(data)
    # return JSONResponse(data)

async def leave_room_post(request):
    try:
        data: RoomJoinForm = await request.json()
        room_id = data.get("room_id")
        user_id = data.get("user_id")
        if room_id and user_id:
            room = rooms.get(room_id)
            user = users.get(user_id)
            if room and user and user.room.id == room.id:
                # password = data["password"]
                kicked = room.kick(user.id)
                print("kicked", kicked.__dict__)
                if kicked:
                    res = {
                        "code": 200,
                        "status": "success",
                        "room": room.get_dict(),
                        "user": kicked.get_dict()
                        # "gameState": room.gameState.getState()
                    }
                else:
                    return error_response(400, "user not found in room")
                return JSONResponse(res)
            else:
                return error_response(400, "room not found or not joined or user not found")
        else:
            return error_response(400, "invalid data")
    except Exception as e:
        print(e)
        return error_response(500, "failed leaving room")

def error_response(code:int, message: str):
    return JSONResponse({"code": code, "status": "error", "message": message})

async def login_post(request):
    data = await request.json()
    print(data)
    id = data.get("id")
    name = data.get("name")
    user: User
    if(id):
        user = users.get(id)
        if user:
            if(name): # Kalo ganti nama
                user.name = name
        else:
            print("user not found", id)
            return error_response(404, f"user not found; id={id}")
    elif(name):
        utc = datetime.datetime.now(datetime.UTC).timestamp()
        id = hash_number_to_alphanumeric(utc, USER_ID_LENGTH)
        user = User(id=id, name=name)
        users[id] = user
    else:
        return error_response(400, f"missing id or name; id={id}, name={name}")
    res = {
        "code": 200,
        "status": "success",
        "user": user.get_dict()
    }
    # print(res)
    return JSONResponse(res)

def register_connection(id: str, connection: Connection, stream):
    user = users.get(id)
    if user:
        if connection.scope["type"] == "webtransport":
            user.connection = connection
        connection.user = user
        asyncio.create_task(connection.send({"success": True}, True, stream))
        start_transmtting_state(connection)
        return True
    else:
        print("user not found", id)
        connection.closed = True
        return False

def handle_received_state(connection: Connection, paddleY: int):
    if connection.user and connection.user.player and paddleY > 0:
        connection.user.player.paddleY = paddleY
        return True
    else:
        print("user or player not found", connection.user)
        return False

def handle_start_pause(connection: Connection, stream):
    if connection.user and connection.user.room:
        current = connection.user.room.gameState.isRunning
        if current is False and len(connection.user.room.gameState.players) == 2:
            connection.user.room.gameState.isRunning = True
        else:
            connection.user.room.gameState.isRunning = False
        players = list(connection.user.room.gameState.players.values())
        if(len(players) == 2):
            asyncio.create_task(players[0].user.connection.send(connection.user.room.gameState.get_dict(), True, stream))
            asyncio.create_task(players[1].user.connection.send(connection.user.room.gameState.get_dict(), True, stream))
        # asyncio.create_task(connection.send(connection.user.room.gameState.get_dict(), True, stream))
#         , True, players[0].user.connection.stream
# , True, players[1].user.connection.stream
        return True
    else:
        print("user or room not found", connection.user)
        return False

def handle_message(message: bytes, connection: Connection, stream = None):
    # read flag
    # print("handling message", message)
    flag: int = message[0]
    # print("paddleY", message,flag)
    if flag is FLAG_LOGIN:
        id: str = message[1:].decode('utf-8')
        return register_connection(id, connection, stream)
    if flag is FLAG_PADDLE_Y:
        paddleY: str = int.from_bytes(message[1:],'little')
        return handle_received_state(connection, paddleY)
    if flag is FLAG_START_PAUSE:
        # paddleY: str = int.from_bytes(message[1:])
        return handle_start_pause(connection, stream)
    return False

def start_transmtting_state(connection: Connection):
    asyncio.create_task(transmitting_state(connection))

async def transmitting_state(connection: Connection):
    while not connection.closed:
        await asyncio.sleep(UPDATE_INTERVAL)
        if connection.user and connection.user.room and connection.user.room.gameState and connection.user.room.gameState.isRunning:
            state = connection.user.room.gameState.get_dict()
            # state['players'][0].pop('user')
            # state['players'][1].pop('user')
            await connection.send(state)


async def ws(websocket: WebSocket):
    """
    WebSocket echo endpoint.
    """
    if "chat" in websocket.scope["subprotocols"]:
        subprotocol = "chat"
    else:
        subprotocol = None
    await websocket.accept(subprotocol=subprotocol)
    id = websocket.scope["client"][0] + "-" + str(websocket.scope["client"][1])
    print(id)
    def send_wrapped(data: dict, realiable: bool = False, stream = None):
        return websocket.send_json(data)
    connection = Connection(id, websocket.scope, send_wrapped, websocket.receive_bytes)
    try:
        while True:
            message = await websocket.receive_bytes()
            result = handle_message(message, connection)
            if result == False:
                connection.closed = True
            if connection.closed:
                print("closing websocket")
                websocket.close()
                break
    except WebSocketDisconnect:
        connection.closed = True
        pass
    if connection.closed:
        if connection.user and connection.user.room:
            connection.user.room.gameState.isRunning = False


def print_close_event(handler: Handler):
    closeEvent = handler.connection._quic._close_event
    state = handler.connection._quic._state
    # print("close event", closeEvent, state)
    if closeEvent is not None:
        return False
    return True

async def wt(handler: Handler, scope: Scope, receive: Receive, send: Send) -> None:
    """
    WebTransport echo endpoint.
    """
    # accept connection
    wt_message = await receive()
    assert wt_message["type"] == "webtransport.connect"
    await send({"type": "webtransport.accept"})

    id = scope["client"][0] + '-' + str(scope["client"][1])
    print(id)
    def send_wrapped(data: dict, reliable: bool = False, stream = None):
        data_encoded = json.dumps(data).encode("utf-8")
        messageType = ""
        dataType = ""
        if reliable:
            dataType = "stream"
            messageType = "webtransport.stream.send"
        else:
            dataType = "datagram"
            messageType = "webtransport.datagram.send"
        payload = {"type": messageType, "data": data_encoded}
        if reliable:
            if stream is None:
                print("stream not found")
                return
            payload["stream"] = stream
        return send(payload)
    connection = Connection(id, scope, send_wrapped, receive)
    room_name = None
    testTog = False
    # if(id not in counts):
    #     counts[id] = 0
    # echo back received data
    asyncio.create_task(
        setInterval(print_close_event, 1, handler  )
    )
    while True:

        # print("waiting to receive")
        if not testTog:
            if connection.closed:
                print("closing webtransport")
                handler.connection._quic.close()
                handler.closed = True
                break
            try:
                wt_message = await asyncio.wait_for(receive(), timeout=10)
            except asyncio.TimeoutError:
                print("timeout")
                if(handler.connection._quic._close_event is not None or handler.connection._quic._state == 4):
                    connection.closed = True
                continue
            message: bytes = wt_message["data"]
            stream = wt_message.get("stream")
            # if stream:
            #     connection.stream = stream
            result = handle_message(message, connection, stream)
            if result == False:
                connection.closed = True
                continue
            # print("received", wt_message)
            # message: str = wt_message["data"].decode()
            # message_type = message[0]
            # if(message_type == FLAG_LOGIN):
            #     room_name = message
            #     if(room_name not in rooms):
            #         rooms[room_name] = {'count' : 0, 'sends' : []}
            #     rooms[room_name]["sends"].append(send)
            #     continue
        # if testTog:
        #     await asyncio.sleep(0.5)
        #     response = (room_name + str(rooms[room_name]["count"])).encode()
        #     rooms[room_name]["count"] += 1
        #     a = await send({"data": response, "type": "webtransport.datagram.send"})
        #     print(a)
        #     continue
        # message = message[1:]
        # response = (message + str(rooms[room_name]['count'])).encode()
        # rooms[room_name]['count'] += 1
        # print(response)
        # if wt_message["type"] == "webtransport.datagram.receive":
        #     for send in rooms[room_name]["sends"]:
        #         asyncio.create_task(send(
        #             {
        #                 "data": response,
        #                 "type": "webtransport.datagram.send",
        #             }
        #         ))
        #     # asyncio.create_task(send(
        #     #     {
        #     #         "data": response,
        #     #         "type": "webtransport.datagram.send",
        #     #     }
        #     # ))
        # elif wt_message["type"] == "webtransport.stream.receive":
        #     await send(
        #         {
        #             "data": response,
        #             "stream": wt_message["stream"],
        #             "type": "webtransport.stream.send",
        #         }
        #     )
        # testTog = True
    if connection.closed:
        if connection.user and connection.user.room:
            connection.user.room.gameState.isRunning = False

starlette = Starlette(
    debug=True,
    routes=[
        # Route("/", homepage),
        # Route("/{size:int}", padding),
        Route("/echo", echo, methods=["POST"]),
        Route("/list_room", list_room_get),
        Route("/get_room", get_room_get),
        Route("/login", login_post, methods=["POST"]),
        Route("/leave_room", leave_room_post, methods=["POST"]),
        Route("/join_room", join_room_post, methods=["POST"]),
        Route("/create_room", create_room_post, methods=["POST"]),
        Route("/logs", logs),
        WebSocketRoute("/ws", ws),
        # Mount(STATIC_URL, StaticFiles(directory=STATIC_ROOT, html=True)),
        Mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend"),
    ],
)

# starlette.mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend")

# Add CORSMiddleware to your Starlette application
starlette.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
print("added middlewaressss")
certfile = "ssl_cert.pem"
keyfile = "ssl_key.pem"
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(certfile, keyfile)
print(ssl_context.__dict__)
async def run_uvicorn():
    config = uvicorn.Config(starlette, host="0.0.0.0",ws='wsproto', http='auto', port=443, log_level="info", ssl_certfile=certfile, ssl_keyfile=keyfile)
    server = uvicorn.Server(config)
    await server.serve()


async def app(handler: Handler,scope: Scope, receive: Receive, send: Send) -> None:
    if scope["type"] == "webtransport" and scope["path"] == "/wt":
        await wt(handler ,scope, receive, send)
    # else:
        # print(scope)
        # await starlette(scope, receive, send)
