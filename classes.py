from typing import TypedDict
from starlette.types import Receive, Scope, Send
import asyncio
GAMESTATE_UPDATE_INTERVAL = 1 / 60

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

        players: dict[str,Player] = None
    ):
        self.ballX = ballX
        self.ballY = ballY
        self.players = players
        if self.players is None:
            self.players = dict()

    def get_dict(self) -> dict:
        return {
            "ballX": self.ballX,
            "ballY": self.ballY,
            "players" : {k: v.get_dict() for k, v in self.players.items()}
        }

class Room(RoomConfig):
    def __init__(self, id: str, roomConfig: RoomConfig, state: State = None):
        super().__init__(**roomConfig.__dict__)
        if state is None:
            state = State()
        self.gameState: GameState = GameState(self,state)
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
    def kick(self,user: User) -> User | None:
        player: Player = self.gameState.players.pop(user.id,None)
        user = player.user
        if user is not None:
            if self.gameState.p0index == user.id:
                self.gameState.p0index = None
            if self.gameState.p1index == user.id:
                self.gameState.p1index = None
            user.room = None
            user.player = None
            if len(self.gameState.players) < 2:
                self.pause()
            if len(self.gameState.players) < 1:
                self.gameState.reset()
            return user
        else:
            return None
    def add_player(self,user: User) -> None:
        player = Player(user=user)
        user.room = self
        user.player = player
        # players = dict.copy(self.gameState.players)
        self.gameState.players[user.id] = player
        # self.gameState.players = players
        if not self.gameState.p0index:
            self.gameState.p0index = user.id
        elif not self.gameState.p1index:
            self.gameState.p1index = user.id



class GameState(State):
    def __init__(self, room: Room, state: State = None):
        if state is None:
            state = State()
        super().__init__(**state.__dict__)
        self.room = room
        self.reset()
        self.isRunning = False
        self.p0index = ""
        self.p1index = ""
        asyncio.create_task(self.update_gamestate())

    def get_dict(self) -> State:
        return {
            "isRunning": self.isRunning,
            "p0index": self.p0index,
            "p1index": self.p1index,
            **State(self.ballX, self.ballY, self.players).get_dict(),
        }

    def reset(self):
        """Reset the game state to start a new game."""
        self.reset_ball()
        self.reset_score()

    def reset_ball(self):
        self.ballX = self.room.width // 2
        self.ballY = self.room.height // 2
        self.room.ballSpeedX *= -1

    def reset_score(self):
        print(self.players)
        if len(self.players) == 0:
            return
        print("bodoh")
        self.players[self.p0index].score = 0
        self.players[self.p1index].score = 0

    async def update_gamestate(self):
        while True:
            try:
                await asyncio.sleep(GAMESTATE_UPDATE_INTERVAL)
                if not self.isRunning or len(self.players) < 2:
                    continue
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
            except Exception as e:
                print(e)
