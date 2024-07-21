<script>
  //  @ts-nocheck
    import { onMount, onDestroy } from "svelte";
    import { connection, user, state } from "$lib/store";
  import { json } from "@sveltejs/kit";

    let canvas;
    let ws_canvas;
    let ctx;
    let ws_ctx
    let requestId;
    let show_ws = false;
    const TRANSMIT_INTERVAL = 1000 / 30;
    const hostUrl = window.location.origin;
    const PUBLIC_API = hostUrl;
    const PUBLIC_API_WT = hostUrl
    const PUBLIC_API_WS =  hostUrl;   
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

    //   const ball = {
    //     x: null,
    //     y: null,
    //     radius: 10,
    //     speedX: 2,
    //     speedY: 2,
    //   };

    //   const paddleWidth = 10;
    //   const paddleHeight = 100;
    //   let leftPaddleY = 50;
    //   let rightPaddleY = 150;
    //   const paddleSpeed = 2;

    function initializeGame() {
        console.log("Initializing game")
        ctx = canvas.getContext("2d");
        ws_ctx = ws_canvas.getContext("2d");
        draw(ctx,gameState);
        draw(ws_ctx,ws_gameState);
        // console.log("Initialized game")
        drawLoop();
        transmitLoop();
    }
    export function setPlayerSide(){
        const index = gameState.players.findIndex(player => player.user.id == $user.id);
        if(index > -1){
            playerIndex = index;
            // playerIndex = gameState.p0index == $user.id ? 0 : 1;
        }
        else{
            console.error("Player not found in game state", gameState.players, $user.id);
        }
    }
    export function setState(state,newState) {
        try{
            newState.players[$user.id].paddleY = localState.paddleY;
        }
        catch(e){
            console.error("Error in converting state", e);
        }
        gameState = {...newState};
        // if (newState?.players?.[playerIndex]?.paddleY)
    }
    export function setRoomConfig(newRoomConfig){
        roomConfig = {...newRoomConfig};
    }
    export function setRunning(isRunning){
        gameState.isRunning = isRunning;
    }

    async function transmitLoop() {
        while (true) {
            await new Promise(resolve => setTimeout(resolve, TRANSMIT_INTERVAL));
            try{
                if(gameState.isRunning){
                    // console.log("Transmitting", localState.paddleY)
                    if ($connection.connected) {
                        let uint8Array = new Uint8Array(Uint16Array.of(localState.paddleY).buffer);
                        let resultArray = [1, uint8Array[0], uint8Array[1]];
                        const message = Uint8Array.of(...resultArray);
                        // console.log("Transmitting", message  )
                        $connection.wt.send(message);
                    } else {
                        console.error("Connection not ready");
                        continue;
                    }
                }
                else{
                    // console.log("Game not running");
                }
            }
            catch(e){
                console.error("Error in transmit loop", e);
            }
            
        }
    }
    function drawLoop() {
        try{
            // console.log("Drawing")
            draw(ctx,gameState);
            draw(ws_ctx,ws_gameState);
        }
        catch(e){
            console.error("Error in draw loop", e);
        }
        requestId = requestAnimationFrame(drawLoop);
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
        if (!gameState.isRunning) {
            ctx.fillStyle = "white";
            ctx.font = "bold 50px Arial";
            ctx.fillText("▐▐ ", 20, 80, 200);
        }
    }

    onMount(() => {
        initializeGame();
    });

    // Cleanup on component destroy
    onDestroy(() => {
        cancelAnimationFrame(requestId);
    });

    // Example of moving paddles (expand upon this for actual control)
    function movePaddle(event) {
        // if(!gameState.isRunning) return;
        // console.log("move paddle", event.clientY);
        const rect = canvas.getBoundingClientRect();
        const mouseY = event.clientY - rect.top - roomConfig.paddleHeight / 2;
        const paddleY = Math.max(1, Math.min(canvas.height - roomConfig.paddleHeight, mouseY));
        // console.log("move paddle", paddleY, localState.paddleY)
        localState.paddleY = paddleY;
        gameState.players[$user.id].paddleY = paddleY;
    }
    function handle_pause(){
        console.log($connection)
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
                    // Handle success
                    console.log("Leave room successful");
                    $user = data.user;
                    // $user.room = null;
                    $state = "harusnya mainmenu";
                } else {
                    // Handle error
                    console.error("Failed to leave room", data);
                }
            })
            .catch(error => {
                console.error("Error in leave room request", error);
            });
        }

    $connection.addListener('wt',(protocol, message) => {
        // console.log("WT listened canvas", message);
        // if(gameState.isRunning){
            setState(message);
        // }
    });
    $connection.addListener('ws',(protocol, message) => {
        // console.log("WS listened canvas", message);
        // if(gameState.isRunning){
            ws_gameState = {...message};
        // }
    });

    state.subscribe(value => {
        if(value == "play"){
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
            // initialState = $user.room.gameState;
            setState($user.room.gameState)
            // setPlayerSide();
        }
    });
    function toggle_ws(){
        show_ws = !show_ws;
    }
</script>

<!-- <svelte:window on:keydown={movePaddle} /> -->

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
</style>
<div style="width: 800px;" class="cent">
    
    <div class="scoreboard">
        <div class="player1">
            <h3>{gameState?.players?.[gameState?.p0index]?.user?.name}</h3>
            <p>Wins: {gameState?.players?.[gameState?.p0index]?.wins}</p>
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
    <button style="margin-right: 5px; margin-left:5px" on:click={handle_pause}>{gameState?.isRunning ? "pause" : "start"}</button>
    <button style="margin-right: 5px; margin-left:5px" on:click={toggle_ws}>{show_ws ? "hide" : "show"} WS</button>
    <button style="margin-right: 5px; margin-left:5px" on:click={handle_leave}>leave</button>
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
