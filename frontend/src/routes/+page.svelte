<script>
    // @ts-nocheck
    import { afterUpdate, onMount } from "svelte";
    import { connection, user, state } from "$lib/store.js"
    import Rooms from "./rooms.svelte";
    import Pong from "./pong.svelte";
    import {env} from '$env/dynamic/public'


    let pongComponent;
    const hostUrl = window.location.origin;
    const PUBLIC_API = hostUrl;
    const PUBLIC_API_WT = hostUrl
    const PUBLIC_API_WS =  hostUrl;   
    // const PUBLIC_API = env.PUBLIC_API
    // const PUBLIC_API = import.meta.env.VITE_PUBLIC_API
    // const PUBLIC_API_WT = import.meta.env.VITE_PUBLIC_API_WT
    // const PUBLIC_API_WS = import.meta.env.VITE_PUBLIC_API_WS
    let input_name = ""
    let id_user = null
    $state = "idle";
    let error_message = "";
    let error_timeout;

    onMount(() => {
        console.log("mounted")
        id_user = localStorage.getItem("id_user")
        console.log("saved id_user",id_user)
        if(id_user){
            handleLogin();
        };
        user.subscribe(value => {
            console.log("user changed", value);
        });
    });

     afterUpdate(() => {
        if (error_message) {    
            clearTimeout(error_timeout);
            error_timeout = setTimeout(() => {
                error_message = "";
            }, 3000);
        }
    });

    function handleLogin() {
        if(!input_name && !id_user) {
            error_message = "Please enter your nickname";
            return;
        }
        const url = `${PUBLIC_API}/login`
        id_user = localStorage.getItem("id_user")
        console.log(`logging in... name=${input_name} id=${id_user} host=${url}`);
        const data = { name: input_name, id: id_user ?? undefined };
        $state = "logging in";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("logged in with user", data);
            // Handle the response data here
            // Update the state based on the response
            if (data.code == 200) {
                $state = "connecting transport";
                user.set(data.user)
                reconnect()
                .then(()=>{
                    localStorage.setItem("id_user", $user.id);
                })
                .catch(error => {
                    console.error(error);
                    $state = "idle";
                })
            } else {
                error_message = data.message ?? "Error logging in";
                localStorage.clear('id_user')
                id_user = null
                user.set(null)
                $state = "idle";
            }
        })
        .catch(error => {
            // Handle any errors here
            error_message = error.message ?? "Error logging in";
            console.error(error);
            $state = "idle";
        });
    }

    async function connectTransport() {
        console.log("connecting transport...");
        $state = "connecting webTransport";
        const wtSuccess = await createWt();
        if(wtSuccess){
            console.log("connected webtransport")
            $state = "registering webTransport";
            if(!await registerWt()){
                console.log("failed to register webTransport")
                // $state = "idle";
                return 1
            }
        }
        else{
            console.log("failed to connect webtransport")
            // $state = "idle";
            return 0
        }
        console.log("Registered webTransport");
        $state = "connecting webSocket";
        const wsSuccess = await createWs();
        if(wsSuccess){
            console.log("connected webSocket")
            $state = "registering webSocket";
            if(!await registerWs()){
                console.log("failed to register webSocket")
                // $state = "idle";
                return 1
            }
        }
        else{
            console.log("failed to connect webSocket")
            // $state = "idle";
            return 0
        }
        $connection.connected = true;
        $state = "harusnya mainmenu";
        return 2
    }

    async function waitForRegistration(transport){
        console.log("waiting for registration...", transport);
        const timeoutDuration = 5000; // Timeout after 5000 milliseconds (5 seconds)
        const waitForRegistration = new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                if (transport.register_status === "registered") {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100); // Check every 100 milliseconds
        });

        const timeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Registration timeout"));
            }, timeoutDuration);
        });

        return await Promise.race([waitForRegistration, timeout])
            .then(() => {console.log("Registered successfully", transport); return true;})
            .catch(error => {
                return false;
            });
    }

    async function registerWt() {
        console.log("registering webtransport...");
        await $connection.wt.send_reliable(Uint8Array.of(0, ...new TextEncoder().encode($user.id)));
        $connection.wt.register_status = "registering";
        return await waitForRegistration($connection.wt);
    }
    async function registerWs() {
        console.log("registering websocket...");
        await $connection.ws.send_reliable(Uint8Array.of(0, ...new TextEncoder().encode($user.id)));
        $connection.ws.register_status = "registering";
        return await waitForRegistration($connection.ws);
    }
    
    $connection.addListener = (protocol,listener) => {
        if ($connection[protocol+"_listeners"] == null) {
            $connection[protocol+"_listeners"] = [];
        }
        const index = $connection[protocol+"_listeners"].length;
        $connection[protocol+"_listeners"].push(listener);
        return index;
    }
    $connection.removeListener = (protocol,index) => {
        $connection[protocol+"_listeners"]= null;
    }
    function handle_message(transport,message){
        console.log("handling message", message)
        // console.log("handling message", message)
        if(transport.register_status === "registering"){
            // if(message[0] === 1){
                transport.register_status = "registered";
                console.log("register messsage received", transport);
            // }
        }
        $connection[transport.protocol+"_listeners"].forEach(listener => {
            // console.log("calling listener", listener, transport, message)
            try{
                if(listener) listener(transport,message);
            }
            catch(e){
                console.error("Error calling listener", e);
            }
        });
    }
    function handle_datagram_bytes(bytes){
        // console.log("handling datagram bytes")
        // to javascript object
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(bytes);
        const object = JSON.parse(jsonString);
        return object
    }
    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function handle_disconnect(transport){
        if(!$connection.connected) return;
        console.log("handling disconnect", transport);
        try {
            delete $connection[transport?.protocol];
            delete $connection.ws;
        } catch (error) {
            console.log("error deleting transport", error);
        }
        $connection.connected = false;
        await reconnect();
    }
    async function reconnect(){
        console.log("reconnecting...");
        $state = "reconnecting";
        while (true) {
            console.log("reconnecting...")
            const success = await connectTransport();
            if (success === 2 || success === 1) {
                if(success === 1) {
                    console.log("reconnected, but failed registering");
                    window.location.href = "/";
                }
                else console.log("reconnected");
                $state = "harusnya mainmenu";
                break;
            }
            console.log("reconnecting again in 3 sec...")
            await pause(3000);
        }
    }
    function hexStringToArrayBuffer(hexString) {
    // Remove the colons
    let cleanHexString = hexString.replace(/:/g, '');

    // Ensure the string length is even
    if (cleanHexString.length % 2 !== 0) {
        throw new Error('Invalid hex string');
    }

    // Create an ArrayBuffer
    let buffer = new ArrayBuffer(cleanHexString.length / 2);
    let byteArray = new Uint8Array(buffer);

    // Populate the Uint8Array with hexadecimal values
    for (let i = 0; i < cleanHexString.length; i += 2) {
        byteArray[i / 2] = parseInt(cleanHexString.substr(i, 2), 16);
    }

    return buffer;
}
    async function createWt() {
        const url = `${PUBLIC_API_WT}/wt`
        const transport = new WebTransport(url,{serverCertificateHashes:[{algorithm:"sha-256",value:hexStringToArrayBuffer("43:6E:11:10:0C:94:51:4C:10:FD:D8:F6:46:5F:DD:A4:18:70:EC:11:44:8E:C0:4D:A4:1A:B9:69:23:C3:7B:95")}]});
        transport.closed.then(() => {
            console.log('WebTransport closed', transport);
            handle_disconnect(transport);
        })
        .catch((error) => {
            console.error('WebTransport $connection died:', error, transport);
            handle_disconnect(transport);
        })
        console.log('webtransport connecting...',url)
        const success = await transport.ready
        .then(() => {
            console.log('WebTransport connected', transport);
            return true;
        })
        .catch((error) => {
            console.error('WebTransport $connection failed:', error);
            return false;
        })
        if(!success) return false;

        const wt = {
            // room_name,
            protocol: "wt",
            // id: room_name + '-' + wt_count++,
            register_status: "unregistered",
            transport,
            // text:"🥺",
            // datagrams: transport.datagrams,
            // stream: await transport.createBidirectionalStream(),
            // writer: transport.datagrams.writable.getWriter(),
            // reader: transport.datagrams.readable.getReader(),
            isReading: false,
        };
        // unreliable
        const datagrams = wt.transport.datagrams;
        const writer_datagram = datagrams.writable.getWriter();
        const reader_datagram = datagrams.readable.getReader();
        wt.send = (message) => {
            writer_datagram.write(message)
        }
        // start receiving datagrams
        (async function() {
            while (true) {
                const { value: message, done } = await reader_datagram.read();
                if (done) {
                    console.log("Done reading datagram, stop reading...", value);
                    return;
                }
                // let decoder = new TextDecoder("utf-8");
                // let receivedText = decoder.decode(value);
                // console.log("received datagram", message);
                handle_message(wt,handle_datagram_bytes(message));
            }
        })()
        .catch((error) => {
            console.error('reading datagram failed, stop reading...:', error);
        })
        // reliable
        const stream = await transport.createBidirectionalStream();
        const writer_stream = stream.writable.getWriter();
        const reader_stream = stream.readable.getReader();
        wt.send_reliable = (message) => {
            writer_stream.write(message)
        };
        // start receiving stream
        (async function() {
            while (true) {
                const { value: message, done } = await reader_stream.read();
                if (done) {
                    console.log("Done reading stream, stop reading...", value);
                    return;
                }
                // let decoder = new TextDecoder("utf-8");
                // let receivedText = decoder.decode(value);
                // console.log("received stream", message);
                handle_message(wt,handle_datagram_bytes(message));
            }
        })()
        .catch((error) => {
            console.error('reading datagram failed, stop reading...:', error);
        })
        $connection.wt = wt;
        return true;
    }

    async function createWs() {
        const url = `${PUBLIC_API_WS}/ws`;
        const socket = new WebSocket(url);
        console.log('websocket connecting...',url);

        const success = await new Promise((resolve, reject) => {
            socket.onopen = () => {
                console.log(socket, 'WebSocket connected');
                resolve(true);
            };
            socket.onerror_message = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };
        })
        .catch((error) => {
            console.error('WebSocket $connection failed:', error);
            return false;
        })
        if(!success) return false;

        const ws = {
            protocol: "ws",
            // room_name,
            // id: room_name + '-' + ws_count++,
            register_status: "unregistered",
            transport: socket,
            // text: "🥺",
            isReading: false,
        };
        // unreliable
        ws.send = (message) => {
            ws.transport.send(message);
        }
        // reliable
        ws.send_reliable = (message) => {
            ws.transport.send(message);
        }
        // start receiving messages
        socket.addEventListener('message', (event) => {
            // console.log('received websocket', event.data);
            handle_message(ws,JSON.parse(event.data));
        });
        socket.addEventListener('close', (event) => {
            if (event.wasClean) {
                console.log('WebSocket closed', event);
            } else {
                console.error('WebSocket $connection died', event);
            }
            // handle_disconnect(ws);
        });
        $connection.ws = ws;
        return true;
    }

</script>

<style>
body{
  background:white;
  font-family: sans-serif;
}
.cent{
  text-align: center;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:300px;
  height:400px;
/*   background:red; */
}
input[type="text"]{
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
h1{
  letter-spacing:10px;
  text-transform:uppercase;
  font-family:sans-serif;
  font-size:3vh;
}
input:hover{
  cursor:pointer;
  transform:scale(1.1);
  transition:0.3s;
  
}
input:focus{
  cursor:pointer;
  transform:scale(1.1);
  transition:0.3s; 
}
input[type="submit"]{
  width:100px;
  height:30px;
  border-radius:15px;
  outline:none;
  background:none;
  text-transform:uppercase;
   font-family:sans-serif;
  font-weight:bold;
  letter-spacing:1.5px;
}
input::placeholder{
  font-weight:bold;
  /* color:; */
  letter-spacing:2px;
}
.error-message {
    color: red;
    font-weight: bold;
    margin-bottom: 10px;
}

</style>
<body>
<div>
    <p>state = {$state}</p>
</div>

<div class ="cent">
{#if $state === "idle"}
  <h1>username</h1>
  <input type="text" placeholder="your nickname" bind:value={input_name} autocomplete="off" spellcheck="false" maxlength="20">
  
  <input type="submit" on:click={handleLogin} value="Enter">
    {#if error_message}
        <div class="error-message">
            <p>{error_message}</p>
        </div>
        {/if}
        <!-- <input class="login_input" type="text" bind:value={input_name} placeholder="Enter your name" />
        <button class="login_submit" on:click={handleLogin}>Submit</button> -->
        <!-- {:else if $state === "harusnya mainmenu" || $state === "play"} -->

{:else if $state !== "harusnya mainmenu" && $state !== "play"}
<h2>{$state}</h2>
{/if}
</div>

<div hidden={$state !== "harusnya mainmenu"}>
<div class ="cent">
    <Rooms />

</div>
</div>
<div hidden={$state !== "play"}>
    <Pong bind:this={pongComponent}/>
</div>
</body>