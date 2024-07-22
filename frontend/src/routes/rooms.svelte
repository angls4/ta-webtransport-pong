<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { connection, user, state } from "$lib/store";

    // const PUBLIC_API = import.meta.env.VITE_PUBLIC_API
    // const PUBLIC_API_WT = import.meta.env.VITE_PUBLIC_API_WT
    // const PUBLIC_API_WS = import.meta.env.VITE_PUBLIC_API_WS
    const hostUrl = window.location.origin;
    const PUBLIC_API = hostUrl;
    const PUBLIC_API_WT = hostUrl
    const PUBLIC_API_WS =  hostUrl;     
    let rooms = [];
    let room_name = "";
    let ball_speed;
    let user_name = $user?.name ?? "";
    let error = ""
    let error_timeout;
    import { afterUpdate } from "svelte";

    onMount(() => {
        console.log("Rooms page mounted");
        state.subscribe(value => {
            console.log("State changed", value);
            if(value = "room list" && $connection.connected) {
                console.log("User", $user)
                if($user.room) {
                    if($user.room?.id)
                        handle_join_room($user.room);
                    else
                        handle_join_room({id:$user.room});
                }
                else{
                    getRooms();
                }
            }
        });
    });

    afterUpdate(() => {
        if (error) {
            clearTimeout(error_timeout);
            error_timeout = setTimeout(() => {
                    error = "";
            }, 3000);
        }
    });

    async function getRooms() {
        const res = await fetch(`${PUBLIC_API}/list_room`);
        const resJson = (await res.json());
        console.log("resJson",resJson)
        if(resJson.status == "success") {
            if(resJson.rooms) {
                rooms = resJson.rooms;
            }
            else {
                console.error("Failed to get rooms",resJson);
                error = "Failed to get rooms";
            }
        }
        else {
            console.error("Failed to get rooms",resJson);
            error = resJson.message ?? "Failed to get rooms";
        }
        console.log("got rooms",rooms)
    }
    function handle_refresh() {
        getRooms();
    }
    async function handle_create_room() {
            if (!room_name  || !ball_speed) {
                console.error("Room name and ball speed are required");
                error = "Room name and ball speed are required";
                return;
            }
            const roomData = {
                name: room_name,
                width: 800,
                height: 400,
                paddleWidth: 10,
                paddleHeight: 100,
                ballRadius: 10,
                ballSpeedX: ball_speed,
                ballSpeedY: ball_speed
            };
            const url = `${PUBLIC_API}/create_room`;
            console.log("Creating room...", url, roomData);
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(roomData)
            })
            .then(res => res.json())
            .then(data => {
                console.log("create room", data);
                if(data.status == "success" && data.room?.id) {
                    console.log("Room created successfully, joining...", data.room);
                    handle_join_room(data.room);
                }
                else {
                    console.error("Failed to create room", data.message);
                    error = data.message ?? "Failed to create room";
                }
            })
            .catch(err => {
                console.error("Failed to create room", err);
                error = err.message ?? "Failed to create room";
            });

            // const data = await res.json();
            // if (data.status == "success") {
            //     handle_join_room(data.room);
            // } else{
            //     console.error("Failed to create room", data.message);
            //     return;
            // }

            console.log("Room created successfully");
            getRooms();
        }
    async function handle_join_room(room) {
        console.log("Joining room...", room.id);
        const url = `${PUBLIC_API}/join_room`;
        const form = {
            room_id: room.id,
            user_id: $user.id
        };
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            console.log("joining room", data);
            if(data.status == "success" && data.room?.id && data.user?.id) {
                console.log("Joined room successfully");
                $user = data.user;
                $user.room = data.room;
                console.log("User", $user);
                play(room);
            }
            else {
                console.error("Failed to join room", data);
                $user.room = null
                error = data.message ?? "Failed to join room";
                getRooms();
            }
        })
        .catch(err => {
            console.error("Failed to join room", err);
            error = err.message ?? "Failed to join room";
        });
    }
    function play(room) {
        console.log("Playing room...", room);
        // connection.wt.send(Uint8Array.of(2))
        // console.log($connection)
        $state = "play";
        // console.log($connection)
        // $connection.addListener('wt',(protocol,message)=>{
        //     console.log("WT listened",message)
        //     // if(protocol == 2) {
        //     //     console.log("play",message)
        //     // }
        // })
    }
    function handle_rename() {
        if(!user_name) {
            console.error("Nickname is required");
            error = "Nickname is required";
            return;
        }
        console.log("Renaming room...", room_name);
        const url = `${PUBLIC_API}/login`;
        const form = {
            id: $user.id,
            name: user_name
        };
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            console.log("rename user", data);
            if(data.status == "success" && data.user?.id) {
                console.log("User renamed successfully");
                $user = data.user;
            }
            else {
                console.error("Failed to rename user", data);
                error = data.message ?? "Failed to rename user";
            }
        })
        .catch(err => {
            console.error("Failed to rename user", err);
            error = err.message ?? "Failed to rename user";
        });
    }
</script>
<style>
    h1 {
        letter-spacing: 10px;
        text-transform: uppercase;
        font-size: 3vh;
    }
    h2 {
        letter-spacing: 2px;
        font-size: 2vh;
    }
    input:hover, input:focus {
        cursor: pointer;
        transform: scale(1.1);
        transition: 0.3s;
    }
    input[type="text"], input[type="number"]{
        padding:10px 10px 10px;
        margin:5px 25px 20px;
        width:225px;
        text-align:center;
        outline:none;
        border:none;
        background:none;
        border-radius:15px;
        
        letter-spacing:2px;
        border-bottom:2px lightgrey solid;
        -webkit-box-shadow: 0 4px 6px -6px #222;
        -moz-box-shadow: 0 4px 6px -6px #222;
        box-shadow: 0 8px 8px -5px #222;
        
    }
    input::placeholder {
        font-weight: bold;
        letter-spacing: 2px;
    }
    .card {
        text-align: center;
        /* position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); */
        width: 350px;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 8px 16px -5px #222;
        margin-bottom: 250px;
    }
    .card__header {
        margin-bottom: 20px;
    }
    .card__title {
        letter-spacing: 5px;
        text-transform: uppercase;
        font-size: 3vh;
        margin: 0;
    }
    .room-list {
        text-align: left;
    }
    .room {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin: 10px 0;
        border-bottom: 2px lightgrey solid;
    }
    .room__info {
        display: flex;
        flex-direction: column;
    }
    .room__name {
        display: flex;
        align-items: center;
    }
    .room__detail {
        font-size: 0.9em;
        color: grey;
    }
    .button {
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
    .button :disabled {
        background: grey;
        color: white;
        cursor: not-allowed;
    }
    .button-small {
        padding: 5px 10px;
        /* font-size: sm; */
        border-radius: 15px;
        outline: none;
        background: none;
        letter-spacing: 1.5px;
        cursor: pointer;
        /* box-shadow: 0 4px 6px -6px #222; */
        transition: 0.3s;
    }
    .button:hover, .button-small:hover {
        transform: scale(1.1);
    }
    .error-message {
        color: red;
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>


<div class="card">
    {#if error}
        <div class="error-message">
            <p>{error}</p>
        </div>
    {/if}
    <h1 class="card__title">PONG</h1>
    <h2 >Welcome, {$user.name}</h2>
    <div class="room" style="display: block;">
    <input type="text" bind:value={user_name} placeholder="New nickname" maxlength="20" />
    <button class="button-small" on:click={handle_rename}>rename user</button>
    <br>
    <br>
    <input type="text" required bind:value={room_name} placeholder="Enter room name" maxlength="20"/>
    <span>
        <input type="number" min="0" max="100" required bind:value={ball_speed} placeholder="Ball speed" style="width: 100px; margin-left:0; margin-right: 10px;"/>
        <button class="button-small"  on:click={handle_create_room}>Create Room</button>
    </span>
    </div>
    <p>
        <button class="button"  on:click={handle_refresh}>Refresh</button>
    </p>
    <div class="card__header">
    </div>
    <div class="room-list">
        {#each rooms as room}
        <div class="room">
            <div class="room__info">
                <div class="room__name">
                    <span>{room.name}</span>
                </div>
                <span class="room__detail">Ball speed : {Math.abs(room.ballSpeedX)}</span>
                <span class="room__detail">{Object.keys(room.gameState.players).length}/2 Players</span>
            </div>
            <div>
                <button on:click={()=>handle_join_room(room)} class="button" disabled={Object.keys(room.gameState.players).length >= 2}>JOIN</button>
            </div>
        </div>
         {/each}
        </div>
        {#if rooms.length == 0}
            <p style="color: grey;"><span>No rooms available</span></p>
        {/if}
</div>
<p style="color:white">s</p>