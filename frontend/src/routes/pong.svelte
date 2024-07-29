<script>
//    @ts-nocheck
    import { onMount, onDestroy } from "svelte";
    import { connection, user, state } from "$lib/store";
    import { json } from "@sveltejs/kit";

    // CONSTANTS
    const TRANSMIT_INTERVAL = 1000 / 30;
    
    const hostUrl = window.location.origin;
    const PUBLIC_API = hostUrl;
    const PUBLIC_API_WT = hostUrl
    const PUBLIC_API_WS =  hostUrl;   
    // VARIABLES
    let canvas;
    let ws_canvas;
    let ctx;
    let ws_ctx
    let drawRequestId;
    let show_ws = true;
    let initialState;
    let playerIndex = 0;
    let roomConfig = {
        name: "placeholder",
        width: 800,
        height: 400,
        paddleWidth: 10,
        paddleHeight: 100,
        ballRadius: 10,
        ballSpeedX: 10,
        ballSpeedY: 10,
    };

    let gameState = {
        ballX : Math.floor(roomConfig.width / 2),
        ballY : Math.floor(roomConfig.height / 2),
        players : {a:
            {
                paddleY : Math.floor(roomConfig.height / 2),
                score: 0,
                wins: 0,
                user: {
                    id: "",
                    name: "",
                    room: "",
                }
            },b:
            {
                paddleY : Math.floor(roomConfig.height / 2),
                score: 0,
                wins: 0,
                user: {
                    id: "",
                    name: "",
                    room: "",
                }
            }
        },
        isRunning: false,
        p0index: "a",
        p1index: "b",
    }
    let ws_gameState = {...gameState};
    let localState = {
        paddleY: Math.floor(roomConfig.height / 2),
    }

    export function setRoomConfig(newRoomConfig){
        roomConfig = {...newRoomConfig};
    }

    async function transmitLoop() {
        while ($state == "game room") {
            await new Promise(resolve => setTimeout(resolve, TRANSMIT_INTERVAL));
            try{
                if(gameState.isRunning){
                    if ($connection.connected) {
                        // encode paddleY as 16 bit number across 2 8 bit numbers
                        let uint8Array = new Uint8Array(Uint16Array.of(localState.paddleY).buffer);
                        let resultArray = [1, uint8Array[0], uint8Array[1]];
                        const message = Uint8Array.of(...resultArray);
                        $connection.wt.send(message);
                    } else {
                        console.error("Connection not ready");
                        continue;
                    }
                }
            }
            catch(e){
                console.error("Error in transmit loop", e);
            }
            
        }
    }

    function drawLoop() {
        if($state != "game room"){
            cancelAnimationFrame(drawRequestId);
            return;
        }
        try{
            draw(ctx,gameState);
            draw(ws_ctx,ws_gameState);
        }
        catch(e){
            console.error("Error in draw loop", e);
        }
        drawRequestId = requestAnimationFrame(drawLoop);
    }
    function draw(ctx,gameState) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw ball
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(gameState.ballX, gameState.ballY, roomConfig.ballRadius, 0, Math.PI * 2);
        ctx.fill();
        if(Object.keys(gameState?.players ?? {}).length > 0){
            // Draw left paddle
            ctx.fillRect(0, gameState.players[gameState.p0index]?.paddleY, roomConfig.paddleWidth, roomConfig.paddleHeight);
            // Draw right paddle
            ctx.fillRect(
                canvas.width - roomConfig.paddleWidth,
                gameState.players[gameState.p1index]?.paddleY,
                roomConfig.paddleWidth,
                roomConfig.paddleHeight
            );
            // Draw middle dotted line
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.setLineDash([20, 40]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            // Draw scores
            ctx.fillStyle = "white";
            ctx.font = "bold 50px Arial";
            ctx.fillText(gameState.players[gameState.p0index]?.score?.toString() ?? "0", canvas.width / 2 - 70, 70, 100);
            ctx.fillText(gameState.players[gameState.p1index]?.score?.toString() ?? "0", canvas.width / 2 + 40, 70, 100);
        }
        // Draw pause symbol
        if (!gameState.isRunning) {
            ctx.fillStyle = "white";
            ctx.font = "bold 50px Arial";
            ctx.fillText("▐▐ ", 20, 80, 200);
        }
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        ws_ctx = ws_canvas.getContext("2d");
    });

    onDestroy(() => {
        cancelAnimationFrame(drawRequestId);
    });

    function movePaddle(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseY = event.clientY - rect.top - roomConfig.paddleHeight / 2;
        const paddleY = Math.max(1, Math.min(canvas.height - roomConfig.paddleHeight, mouseY));
        localState.paddleY = paddleY;
        gameState.players[$user.id].paddleY = paddleY;
    }
    function handle_play_pause(){
        console.log("play/pause ing...");
        if($connection.connected)
            $connection.wt.send_reliable(Uint8Array.of(2));
        else
            console.error("Connection not ready");
    }
    function handle_leave(){
        const data = {
            room_id: $user.room.id,
            user_id: $user.id
        };
        const url = `${PUBLIC_API}/leave_room`;
        console.log("Leaving room...", data, url)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status == "success" && data.user?.id && data.room?.id) {
                console.log("Leave room successful, returning to room list...");
                $user = data.user;
                $state = "room list";
            } else {
                console.error("Failed to leave room", data);
            }
        })
        .catch(error => {
            console.error("Error in leave room request", error);
        });
    }
    export function setState(newState) {
        try{
            newState.players[$user.id].paddleY = localState.paddleY;
        }
        catch(e){
            console.error("Error in converting state", e);
        }
        gameState = {...newState};
    }
    $connection.addListener('wt',(protocol, message) => {
        setState(message);
    });
    $connection.addListener('ws',(protocol, message) => {
        ws_gameState = {...message};
    });
    function startLoops() {
        console.log("starting loops")
        drawLoop();
        transmitLoop();
    }
    state.subscribe(value => {
        if(value == "game room"){
            setRoomConfig({
                name: $user.room.name,
                width: $user.room.width,
                height: $user.room.height,
                paddleWidth: $user.room.paddleWidth,
                paddleHeight: $user.room.paddleHeight,
                ballRadius: $user.room.ballRadius,
                ballSpeedX: $user.room.ballSpeedX,
                ballSpeedY: $user.room.ballSpeedY,
            });
            setState($user.room.gameState);
            startLoops();
        }
    });
    function toggle_ws(){
        show_ws = !show_ws;
    }
</script>

<style>
    .scoreboard {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        width: 100%;
    }

    .player1 {
        flex: 1;
        text-align: left;
        color: black;
    }
    .player2 {
        flex: 1;
        text-align: right;
        color: black;
    }
    .cent{
        text-align: center;
        position:absolute;
        /* top:50%; */
        left:50%;
        transform:translate(-50%);
        width:300px;
        height:400px;
        /*   background:red; */
    }
    button {
        padding: 10px 20px;
        border-radius: 15px;
        outline: none;
        background: none;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1.5px;
        cursor: pointer;
        box-shadow: 0 4px 6px -6px #222;
        transition: 0.3s;
    }
    button:hover {
        transform: scale(1.1);
    }
    h1{
        letter-spacing:10px;
        text-transform:uppercase;
        font-family:sans-serif;
        font-size:3vh;;
    }
    .game_button{
        margin-right: 5px;
        margin-left:5px;
        margin-right: 5px;
        margin-left:5px;
    }
</style>
<div style="width: 800px;" class="cent">
    <div class="scoreboard">
        <div class="player1">
            <h3>{gameState?.players?.[gameState?.p0index]?.user?.name ?? "..."}</h3>
            <p>Wins: {gameState?.players?.[gameState?.p0index]?.wins ?? 0}</p>
        </div>
        <h1>PONG</h1>
        <div class="player2">
            <h3>{gameState?.players?.[gameState?.p1index]?.user?.name ?? "..."}</h3>
            <p>Wins: {gameState?.players?.[gameState?.p1index]?.wins ?? 0}</p>
        </div>
    </div>
    <p>
    <canvas
      bind:this={canvas}
      on:mousemove={movePaddle}
      width={roomConfig.width}
      height={roomConfig.height}
      style="background: black;"
    ></canvas>
    </p>
    <button class="game_button" on:click={handle_play_pause}>play/pause</button>
    <button class="game_button" on:click={toggle_ws}>{show_ws ? "hide" : "show"} WebSocket view</button>
    <button class="game_button" on:click={handle_leave}>leave</button>
    <p>
    <canvas
    hidden={!show_ws}
      bind:this={ws_canvas}
      width={roomConfig.width}
      height={roomConfig.height}
      style="background: black;"
    ></canvas>
    </p>
</div>    
