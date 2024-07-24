#
# demo application for http3_server.py
#

import datetime
import os
import json
from urllib.parse import urlencode
import asyncio

from helpers import *
from classes import *
from http_server import WebTransportHandler

from starlette.applications import Starlette
from starlette.responses import PlainTextResponse, Response, JSONResponse
from starlette.routing import Mount, Route, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.types import Receive, Scope, Send
from starlette.websockets import WebSocketDisconnect, WebSocket
from starlette.middleware.cors import CORSMiddleware

# ROOT = os.path.dirname(__file__)
# STATIC_ROOT = os.environ.get("STATIC_ROOT", os.path.join(ROOT, "htdocs"))
# STATIC_URL = "/"
# LOGS_PATH = os.path.join(STATIC_ROOT, "logs")
# QVIS_URL = "https://qvis.quictools.info/"

# FLAGS
FLAG_REGISTER = 0
FLAG_GAME_STATE = 1
FLAG_START_PAUSE = 2
# CONSTANTS
FRONTEND_PATH = "frontend/build"
WELL_KNOWN_PATH = "public/.well-known"
USER_ID_LENGTH = 4
ROOM_ID_LENGTH = 5
UPDATE_INTERVAL = 1 / 60

rooms:dict[str, Room] ={}
users:dict[str, User] ={}

async def list_room_get(request):
    res = {
        "code": 200,
        "status": "success",
        "rooms": [room.get_dict() for room in rooms.values()]
    }
    return JSONResponse(res)

async def create_room_post(request):
    data = await request.json()
    try:
        if data.get("name") == "":
            return error_response(400, "name cannot be empty")
        if data.get("ballSpeedY") == "" or data.get("ballSpeedX") == "":
            return error_response(400, "ball speed cannot be empty")
        roomConfig: RoomConfig = RoomConfig(**data)
        utc = datetime.datetime.now(datetime.UTC).timestamp()
        room_id = hash_number_to_alphanumeric(utc, ROOM_ID_LENGTH)
        room:Room = Room(room_id, roomConfig)
        rooms[room_id] = room
        print("room created",room.get_dict())
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
    data: RoomJoinForm = await request.json()
    room_id = data.get("room_id")
    user_id = data.get("user_id")
    if(room_id and user_id):
        room = rooms.get(room_id)
        user = users.get(user_id)
        if room and user:
            if room.gameState.players.get(user.id):
                res = {
                    "code": 200,
                    "status": "success",
                    "room": room.get_dict(),
                    "user": user.get_dict(),
                }
                return JSONResponse(res)
            if len(room.gameState.players) < 2:
                room.add_player(user)
                # send game state to both players
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
                }
                return JSONResponse(res)
            else:
                return error_response(400, "room full")
        else:
            return error_response(400, "room not found or user not found")
    else:
        return error_response(400, "invalid data")

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
                kicked = room.kick(user)
                print("kicked", kicked.__dict__)
                if kicked:
                    res = {
                        "code": 200,
                        "status": "success",
                        "room": room.get_dict(),
                        "user": kicked.get_dict()
                    }
                    if len(room.gameState.players) == 0:
                        rooms.pop(room.id)
                    players = list(room.gameState.players.values())
                    if(len(players) == 1):
                        try:
                            asyncio.create_task(players[0].user.connection.send(room.gameState.get_dict()))
                        except Exception as e:
                            print(e)
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

def register_connection(user_id: str, connection: Connection, stream):
    user = users.get(user_id)
    if user:
        # attach user to connection
        if connection.scope["type"] == "webtransport":
            user.connection = connection
        connection.user = user
        asyncio.create_task(connection.send({"success": True}, True, stream))
        start_transmtting_state(connection)
        return True
    else:
        print("user not found", user_id)
        connection.closed = True
        return False

def handle_received_state(connection: Connection, message: bytes):
    paddleY = int.from_bytes(message[1:],'little')
    if connection.user and connection.user.player and paddleY > 0:
        connection.user.player.paddleY = paddleY
        return True
    else:
        print("user or player not found", connection.user)
        return False

def handle_play_pause(connection: Connection, stream):
    if connection.user and connection.user.room:
        players = list(connection.user.room.gameState.players.values())
        isRunning = connection.user.room.gameState.isRunning
        if isRunning is False and len(players) == 2:
            connection.user.room.gameState.isRunning = True
        else:
            connection.user.room.gameState.isRunning = False
        if(len(players) == 2):
            try:
                asyncio.create_task(players[0].user.connection.send(connection.user.room.gameState.get_dict(), True, stream))
                asyncio.create_task(players[1].user.connection.send(connection.user.room.gameState.get_dict(), True, stream))
            except Exception as e:
                print(e)
        return True
    else:
        print("user or room not found", connection.user)
        return False

def handle_message(message: bytes, connection: Connection, stream = None):
    # read flag
    flag: int = message[0]
    # handle the payload
    if flag is FLAG_REGISTER:
        user_id: str = message[1:].decode('utf-8')
        return register_connection(user_id, connection, stream)
    if flag is FLAG_GAME_STATE:
        return handle_received_state(connection, message)
    if flag is FLAG_START_PAUSE:
        return handle_play_pause(connection, stream)
    return False

def start_transmtting_state(connection: Connection):
    asyncio.create_task(transmitting_state(connection))

async def transmitting_state(connection: Connection):
    while not connection.closed:
        try:
            await asyncio.sleep(UPDATE_INTERVAL)
            if connection.user and connection.user.room and connection.user.room.gameState and connection.user.room.gameState.isRunning:
                state = connection.user.room.gameState.get_dict()
                await connection.send(state)
        except Exception as e:
            print(e)

async def ws(websocket: WebSocket):
    # accept connection
    await websocket.accept()
    # wrap/normalize send function
    def send_wrapped(data: dict, realiable: bool = False, stream = None):
        return websocket.send_json(data)
    # initialize connection object
    id = websocket.scope["client"][0] + "-" + str(websocket.scope["client"][1])
    print("ws connected",id)
    connection = Connection(id, websocket.scope, send_wrapped, websocket.receive_bytes)
    try:
        while True:
            # handle connection close
            if connection.closed:
                print("ws closing",id)
                # close connection
                websocket.close()
                break
            # retrieve message
            message = await websocket.receive_bytes()
            result = handle_message(message, connection)
            if result == False:
                connection.closed = True
    except WebSocketDisconnect:
        connection.closed = True

async def wt(handler: WebTransportHandler, scope: Scope, receive: Receive, send: Send) -> None:
    # accept connection
    wt_message = await receive()
    assert wt_message["type"] == "webtransport.connect"
    await send({"type": "webtransport.accept"})
    # wrap/normalize send function
    def send_wrapped(data: dict, reliable: bool = False, stream = None):
        data_encoded = json.dumps(data).encode("utf-8")
        messageType = ""
        if reliable:
            messageType = "webtransport.stream.send"
        else:
            messageType = "webtransport.datagram.send"
        payload = {"type": messageType, "data": data_encoded}
        if reliable:
            if stream is None:
                print("stream not found")
                return
            payload["stream"] = stream
        return send(payload)
    # initialize connection object
    id = scope["client"][0] + '-' + str(scope["client"][1])
    print("wt connected",id)
    connection = Connection(id, scope, send_wrapped, receive)
    stream = None
    while True:
        # handle connection close
        if connection.closed:
            print("wt closing",id)
            # pause room if exists
            if connection.user and connection.user.room:
                room = connection.user.room
                room.pause()
                players = list(room.gameState.players.values())
                if(len(players) == 2):
                    try:
                        asyncio.create_task(players[0].user.connection.send(room.gameState.get_dict(),True,stream))
                        asyncio.create_task(players[1].user.connection.send(room.gameState.get_dict(),True,stream))
                    except Exception as e:
                        print(e)
            # close connection
            handler.connection._quic.close()
            handler.closed = True
            break
        # retrieve message
        try:
            wt_message = await asyncio.wait_for(receive(), timeout=10)
        except asyncio.TimeoutError:
            if(handler.connection._quic._close_event is not None or handler.connection._quic._state == 4):
                connection.closed = True
            continue
        message: bytes = wt_message["data"]
        stream = wt_message.get("stream")
        result = handle_message(message, connection, stream)
        if result == False:
            connection.closed = True
            continue


# def print_close_event(handler: WebTransportHandler):
#     closeEvent = handler.connection._quic._close_event
#     state = handler.connection._quic._state
#     # print("close event", closeEvent, state)
#     if closeEvent is not None:
#         return False
#     return True

starlette = Starlette(
    debug=True,
    routes=[
        Route("/list_room", list_room_get),
        Route("/login", login_post, methods=["POST"]),
        Route("/leave_room", leave_room_post, methods=["POST"]),
        Route("/join_room", join_room_post, methods=["POST"]),
        Route("/create_room", create_room_post, methods=["POST"]),
        WebSocketRoute("/ws", ws),
        Mount("/well-known", StaticFiles(directory=WELL_KNOWN_PATH, html=True), name="well-known"),
        Mount("/", StaticFiles(directory=FRONTEND_PATH, html=True), name="frontend"),
    ],
)
starlette.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
http_app = starlette

async def wt_app(handler: WebTransportHandler,scope: Scope, receive: Receive, send: Send) -> None:
    if scope["type"] == "webtransport" and scope["path"] == "/wt":
        await wt(handler ,scope, receive, send)
    # else:
        # print(scope)
        # await starlette(scope, receive, send)
