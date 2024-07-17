from typing import TypedDict
from starlette.types import Receive, Scope, Send
import asyncio
GAMESTATE_UPDATE_INTERVAL = 1 / 40 

class Connection:
    def __init__(self, id: str, scope: Scope, send: Send, receive: Receive, user: 'User' = None, closed = False):
        self.id = id
        self.scope = scope
        self.send = send
        self.receive = receive
        self.user = user
        self.closed = closed
        # self.stream = None

class User:
    def __init__(self, id: str, name: str, connection: Connection = None, room: 'Room' = None, player: 'Player' = None):
        self.id = id
        self.name = name
        self.connection = connection # gaperlu?
        self.room = room
        self.player = player
    def get_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "room": self.room.id if self.room else None,
            # "player": self.player
        }

class RoomJoinForm(TypedDict):
    room_id: str
    user_id: str
    # password: str

class RoomConfig:
    def __init__(self, name: str, width: int, height: int, paddleWidth: int, paddleHeight: int, ballRadius: int, ballSpeedX: int, ballSpeedY: int):
        self.name = name
        self.width = width
        self.height = height
        self.paddleWidth = paddleWidth
        self.paddleHeight = paddleHeight
        self.ballRadius = ballRadius
        self.ballSpeedX = ballSpeedX
        self.ballSpeedY = ballSpeedY


class Player:
    def __init__(self, paddleY: int = 0, score: int = 0, wins: int = 0, user: User = None):
        self.paddleY = paddleY
        self.score = score
        self.wins = wins
        self.user = user
    def get_dict(self) -> dict:
        return {
            "paddleY": self.paddleY,
            "score": self.score,
            "wins": self.wins,
            "user": self.user.get_dict()
        }

class State:
    def __init__(
        self,
        ballX=0,
        ballY=0,
        # paddle1Y=0,
        # paddle2Y=0,
        # score=0,
        # score=0,
        # wins1=0,
        # wins2=0,
        players: dict[str,Player] = None
    ):
        self.ballX = ballX
        self.ballY = ballY
        self.players = players
        if self.players is None:
            self.players = dict()
        # self.players[self.p0index].paddleY = paddle1Y
        # self.players[self.p1index].paddleY = paddle2Y
        # self.players[self.p0index].score = score
        # self.players[self.p1index].score = score
        # self.players[self.p0index].wins = wins1
        # self.players[self.p1index].wins = wins2
    # def set_state(self) -> None:
    #     self.__init__()
    def get_dict(self) -> dict:
        return {
            "ballX": self.ballX,
            "ballY": self.ballY,
            "players": [player.get_dict() for player in self.players.values()]
        }

class Room(RoomConfig):
    def __init__(self, id: str, roomConfig: RoomConfig, state: State = State()):
        super().__init__(**roomConfig.__dict__)
        # print("RoomConfig",roomConfig.__dict__)
        self.gameState: GameState = GameState(self,state)
        # print("GameState",self.gameState.__dict__)
        self.id = id
    def get_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "width": self.width,
            "height": self.height,
            "paddleWidth": self.paddleWidth,
            "paddleHeight": self.paddleHeight,
            "ballRadius": self.ballRadius,
            "ballSpeedX": self.ballSpeedX,
            "ballSpeedY": self.ballSpeedY,
            "gameState": self.gameState.get_dict()
        }
    def pause(self) -> bool:
        self.gameState.isRunning = False
        return self.gameState.isRunning
    def kick(self,user_id: str) -> User | None:
        player: Player = self.gameState.players.pop(user_id,None)
        user = player.user
        if user is not None:
            user.room = None
            user.player = None
            if len(self.gameState.players) < 2:
                self.pause()
            if len(self.gameState.players) < 1:
                self.gameState.reset()
            return user
        else:
            return None
    # winner: int
    # active: bool


class GameState(State):
    # updateInterval: int
    # lastUpdate: int
    # isRunning: bool

    def __init__(self, room: Room, state: State = State()):
        super().__init__(**state.__dict__)
        self.room = room
        # self.updateInterval = GAMESTATE_UPDATE_INTERVAL
        self.reset()
        self.isRunning = False
        self.p0index = ""
        self.p1index = ""
        asyncio.create_task(self.update_gamestate())
        # self.reset_paddle()

    def get_dict(self) -> State:

        # state: State = {
        #     "ballX": self.ballX,
        #     "ballY": self.ballY,
        #     "paddle1Y": self.players[self.p0index].paddleY,
        #     "paddle2Y": self.players[self.p1index].paddleY,
        #     "score1": self.players[self.p0index].score,
        #     "score2": self.players[self.p1index].score,
        #     "wins1": self.players[self.p0index].wins,
        #     "wins2": self.players[self.p1index].wins,
        # }
        return {
            "isRunning": self.isRunning,
            **State(self.ballX, self.ballY, self.players).get_dict(),
        }

    def reset(self):
        """Reset the game state to start a new game."""
        self.reset_ball()
        self.reset_score()
        # self.players[self.p0index].score = 0
        # self.players[self.p1index].score = 0
        # self.players[self.p0index].wins = 0
        # self.players[self.p1index].wins = 0
        # self.room.winner = 0
        # self.room.active = True

    # def reset_paddle(self):
    #     self.players[self.p0index].paddleY = (self.room.height - self.room.paddleHeight) // 2
    #     self.players[self.p1index].paddleY = (self.room.height - self.room.paddleHeight) // 2

    def reset_ball(self):
        self.ballX = self.room.width // 2
        self.ballY = self.room.height // 2
        self.room.ballSpeedX *= -1

    def reset_score(self):
        if len(self.players) == 0:
            return
        self.players[self.p0index].score = 0
        self.players[self.p1index].score = 0

    # def update_ball_position(self):
    #     """Update the ball's position based on current speed and direction."""
    #     self.ballX += self.room.ballSpeedX
    #     self.ballY += self.room.ballSpeedY

    async def update_gamestate(self):
        while True:
            # try:
            # print("update_gamestate?")
            await asyncio.sleep(GAMESTATE_UPDATE_INTERVAL)
            if not self.isRunning:
                continue
            # print("update_gamestate")
            # Update wins and score
            if self.players[self.p0index].score >= 10:
                self.players[self.p0index].wins += 1
                self.reset_score()
            if self.players[self.p1index].score >= 10:
                self.players[self.p1index].wins += 1
                self.reset_score()
            # Simple collision detection with walls
            if (
                self.ballY + self.room.ballRadius > self.room.height
                or self.ballY - self.room.ballRadius < 0
            ):
                self.room.ballSpeedY *= -1

            # Collision detection with left paddle
            if (
                self.ballX - self.room.ballRadius < self.room.paddleWidth
                and self.ballY + self.room.ballRadius > self.players[self.p0index].paddleY
                and self.ballY - self.room.ballRadius
                < self.players[self.p0index].paddleY + self.room.paddleHeight
            ):
                self.room.ballSpeedX *= -1

            # Collision detection with right paddle
            if (
                self.ballX + self.room.ballRadius
                > self.room.width - self.room.paddleWidth
                and self.ballY + self.room.ballRadius > self.players[self.p1index].paddleY
                and self.ballY - self.room.ballRadius
                < self.players[self.p1index].paddleY + self.room.paddleHeight
            ):
                self.room.ballSpeedX *= -1

            # Update ball position
            self.ballX += self.room.ballSpeedX * GAMESTATE_UPDATE_INTERVAL * 10
            self.ballY += self.room.ballSpeedY * GAMESTATE_UPDATE_INTERVAL * 10

            # Reset ball position if it goes past paddles
            if self.ballX + self.room.ballRadius > self.room.width:
                self.reset_ball()
                self.players[self.p0index].score += 1
            if self.ballX - self.room.ballRadius < 0:
                self.reset_ball()
                self.players[self.p1index].score += 1
            # except Exception as e:
            #     print("update_gamestate error",e)
            #     continue

