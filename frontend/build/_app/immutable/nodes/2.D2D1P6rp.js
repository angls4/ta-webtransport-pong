import{s as Se,n as Ee,r as Pe,e as ge,o as Re,a as xe,f as q,h as et,b as Ie}from"../chunks/scheduler.CTimOCLo.js";import{S as je,i as Ne,g as h,s as L,m as ee,h as f,j as N,c as F,y as ue,n as te,f as g,k as u,l as fe,a as oe,x as l,z as pe,A as le,o as ie,B as $e,C as tt,r as De,u as Le,v as Fe,d as Be,t as Ve,w as He,e as Ye}from"../chunks/index.CRnmY6F2.js";import{w as Ae}from"../chunks/index.BXnrS5-F.js";import{_ as ot}from"../chunks/preload-helper.CRk0x-X1.js";function Me(s){return s?.length!==void 0?s:Array.from(s)}const nt={wt:null,ws:null,connected:!1,wt_listeners:[],ws_listeners:[],addListener:()=>{}},st={id:null,name:"",room:null,player:null},se=Ae(nt),de=Ae(st),$=Ae("login page");function qe(s,t,n){const e=s.slice();return e[21]=t[n],e}function Je(s){let t,n,e;return{c(){t=h("div"),n=h("p"),e=ee(s[4]),this.h()},l(o){t=f(o,"DIV",{class:!0});var c=N(t);n=f(c,"P",{});var v=N(n);e=te(v,s[4]),v.forEach(g),c.forEach(g),this.h()},h(){u(t,"class","error-message svelte-17jni71")},m(o,c){oe(o,t,c),l(t,n),l(n,e)},p(o,c){c&16&&ie(e,o[4])},d(o){o&&g(t)}}}function Ge(s){let t,n,e,o,c=s[21].name+"",v,B,S,w,T=Math.abs(s[21].ballSpeedX)+"",a,i,b,E=Object.keys(s[21].gameState.players).length+"",m,O,y,R,Y,Z,U,P,A,d;function G(){return s[13](s[21])}return{c(){t=h("div"),n=h("div"),e=h("div"),o=h("span"),v=ee(c),B=L(),S=h("span"),w=ee("Ball speed : "),a=ee(T),i=L(),b=h("span"),m=ee(E),O=ee("/2 Players"),y=L(),R=h("div"),Y=h("button"),Z=ee("JOIN"),P=L(),this.h()},l(J){t=f(J,"DIV",{class:!0});var V=N(t);n=f(V,"DIV",{class:!0});var p=N(n);e=f(p,"DIV",{class:!0});var I=N(e);o=f(I,"SPAN",{});var W=N(o);v=te(W,c),W.forEach(g),I.forEach(g),B=F(p),S=f(p,"SPAN",{class:!0});var r=N(S);w=te(r,"Ball speed : "),a=te(r,T),r.forEach(g),i=F(p),b=f(p,"SPAN",{class:!0});var _=N(b);m=te(_,E),O=te(_,"/2 Players"),_.forEach(g),p.forEach(g),y=F(V),R=f(V,"DIV",{});var D=N(R);Y=f(D,"BUTTON",{class:!0});var z=N(Y);Z=te(z,"JOIN"),z.forEach(g),D.forEach(g),P=F(V),V.forEach(g),this.h()},h(){u(e,"class","room__name svelte-17jni71"),u(S,"class","room__detail svelte-17jni71"),u(b,"class","room__detail svelte-17jni71"),u(n,"class","room__info svelte-17jni71"),u(Y,"class","button svelte-17jni71"),Y.disabled=U=Object.keys(s[21].gameState.players).length>=2,u(t,"class","room svelte-17jni71")},m(J,V){oe(J,t,V),l(t,n),l(n,e),l(e,o),l(o,v),l(n,B),l(n,S),l(S,w),l(S,a),l(n,i),l(n,b),l(b,m),l(b,O),l(t,y),l(t,R),l(R,Y),l(Y,Z),l(t,P),A||(d=le(Y,"click",G),A=!0)},p(J,V){s=J,V&1&&c!==(c=s[21].name+"")&&ie(v,c),V&1&&T!==(T=Math.abs(s[21].ballSpeedX)+"")&&ie(a,T),V&1&&E!==(E=Object.keys(s[21].gameState.players).length+"")&&ie(m,E),V&1&&U!==(U=Object.keys(s[21].gameState.players).length>=2)&&(Y.disabled=U)},d(J){J&&g(t),A=!1,d()}}}function Xe(s){let t,n="<span>No rooms available</span>";return{c(){t=h("p"),t.innerHTML=n,this.h()},l(e){t=f(e,"P",{style:!0,"data-svelte-h":!0}),ue(t)!=="svelte-156qi2m"&&(t.innerHTML=n),this.h()},h(){fe(t,"color","grey")},m(e,o){oe(e,t,o)},d(e){e&&g(t)}}}function lt(s){let t,n,e,o="PONG",c,v,B,S=s[5]?.name+"",w,T,a,i,b,E,m="rename user",O,y,R,Y,Z,U,P,A,d,G,J,V="Create Room",p,I,W,r="Refresh",_,D,z="",re,ne,he,X,Q,be="credit: angls4",_e,me,M=s[4]&&Je(s),ae=Me(s[0]),K=[];for(let j=0;j<ae.length;j+=1)K[j]=Ge(qe(s,ae,j));let x=s[0].length==0&&Xe();return{c(){t=h("div"),M&&M.c(),n=L(),e=h("h1"),e.textContent=o,c=L(),v=h("h2"),B=ee("Welcome, "),w=ee(S),T=L(),a=h("div"),i=h("input"),b=L(),E=h("button"),E.textContent=m,O=L(),y=h("br"),R=L(),Y=h("br"),Z=L(),U=h("input"),P=L(),A=h("span"),d=h("input"),G=L(),J=h("button"),J.textContent=V,p=L(),I=h("p"),W=h("button"),W.textContent=r,_=L(),D=h("div"),D.innerHTML=z,re=L(),ne=h("div");for(let j=0;j<K.length;j+=1)K[j].c();he=L(),x&&x.c(),X=L(),Q=h("p"),Q.textContent=be,this.h()},l(j){t=f(j,"DIV",{class:!0});var H=N(t);M&&M.l(H),n=F(H),e=f(H,"H1",{class:!0,"data-svelte-h":!0}),ue(e)!=="svelte-1jnr5i3"&&(e.textContent=o),c=F(H),v=f(H,"H2",{class:!0});var C=N(v);B=te(C,"Welcome, "),w=te(C,S),C.forEach(g),T=F(H),a=f(H,"DIV",{class:!0,style:!0});var k=N(a);i=f(k,"INPUT",{type:!0,placeholder:!0,maxlength:!0,class:!0}),b=F(k),E=f(k,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(E)!=="svelte-5cerf9"&&(E.textContent=m),O=F(k),y=f(k,"BR",{}),R=F(k),Y=f(k,"BR",{}),Z=F(k),U=f(k,"INPUT",{type:!0,placeholder:!0,maxlength:!0,class:!0}),P=F(k),A=f(k,"SPAN",{});var ce=N(A);d=f(ce,"INPUT",{type:!0,min:!0,max:!0,placeholder:!0,style:!0,class:!0}),G=F(ce),J=f(ce,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(J)!=="svelte-136z9rb"&&(J.textContent=V),ce.forEach(g),k.forEach(g),p=F(H),I=f(H,"P",{});var ve=N(I);W=f(ve,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(W)!=="svelte-1nuptru"&&(W.textContent=r),ve.forEach(g),_=F(H),D=f(H,"DIV",{class:!0,"data-svelte-h":!0}),ue(D)!=="svelte-1hf6hku"&&(D.innerHTML=z),re=F(H),ne=f(H,"DIV",{class:!0});var ye=N(ne);for(let we=0;we<K.length;we+=1)K[we].l(ye);ye.forEach(g),he=F(H),x&&x.l(H),H.forEach(g),X=F(j),Q=f(j,"P",{style:!0,"data-svelte-h":!0}),ue(Q)!=="svelte-apo9jk"&&(Q.textContent=be),this.h()},h(){u(e,"class","card__title svelte-17jni71"),u(v,"class","svelte-17jni71"),u(i,"type","text"),u(i,"placeholder","New nickname"),u(i,"maxlength","20"),u(i,"class","svelte-17jni71"),u(E,"class","button-small svelte-17jni71"),u(U,"type","text"),U.required=!0,u(U,"placeholder","Enter room name"),u(U,"maxlength","20"),u(U,"class","svelte-17jni71"),u(d,"type","number"),u(d,"min","0"),u(d,"max","100"),d.required=!0,u(d,"placeholder","Ball speed"),fe(d,"width","100px"),fe(d,"margin-left","0"),fe(d,"margin-right","10px"),u(d,"class","svelte-17jni71"),u(J,"class","button-small svelte-17jni71"),u(a,"class","room svelte-17jni71"),fe(a,"display","block"),u(W,"class","button svelte-17jni71"),u(D,"class","card__header svelte-17jni71"),u(ne,"class","room-list svelte-17jni71"),u(t,"class","card svelte-17jni71"),fe(Q,"color","white")},m(j,H){oe(j,t,H),M&&M.m(t,null),l(t,n),l(t,e),l(t,c),l(t,v),l(v,B),l(v,w),l(t,T),l(t,a),l(a,i),pe(i,s[3]),l(a,b),l(a,E),l(a,O),l(a,y),l(a,R),l(a,Y),l(a,Z),l(a,U),pe(U,s[1]),l(a,P),l(a,A),l(A,d),pe(d,s[2]),l(A,G),l(A,J),l(t,p),l(t,I),l(I,W),l(t,_),l(t,D),l(t,re),l(t,ne);for(let C=0;C<K.length;C+=1)K[C]&&K[C].m(ne,null);l(t,he),x&&x.m(t,null),oe(j,X,H),oe(j,Q,H),_e||(me=[le(i,"input",s[10]),le(E,"click",s[9]),le(U,"input",s[11]),le(d,"input",s[12]),le(J,"click",s[7]),le(W,"click",s[6])],_e=!0)},p(j,[H]){if(j[4]?M?M.p(j,H):(M=Je(j),M.c(),M.m(t,n)):M&&(M.d(1),M=null),H&32&&S!==(S=j[5]?.name+"")&&ie(w,S),H&8&&i.value!==j[3]&&pe(i,j[3]),H&2&&U.value!==j[1]&&pe(U,j[1]),H&4&&$e(d.value)!==j[2]&&pe(d,j[2]),H&257){ae=Me(j[0]);let C;for(C=0;C<ae.length;C+=1){const k=qe(j,ae,C);K[C]?K[C].p(k,H):(K[C]=Ge(k),K[C].c(),K[C].m(ne,null))}for(;C<K.length;C+=1)K[C].d(1);K.length=ae.length}j[0].length==0?x||(x=Xe(),x.c(),x.m(t,null)):x&&(x.d(1),x=null)},i:Ee,o:Ee,d(j){j&&(g(t),g(X),g(Q)),M&&M.d(),tt(K,j),x&&x.d(),_e=!1,Pe(me)}}}const rt=3e3;function it(s,t,n){let e,o,c;ge(s,de,P=>n(5,e=P)),ge(s,$,P=>n(15,o=P)),ge(s,se,P=>n(16,c=P));const B=window.location.origin;let S=[],w="",T,a=e?.name??"",i="",b;Re(()=>{$.subscribe(P=>{c.connected&&(e.room?e.room?.id?O(e.room):O({id:e.room}):E())})}),xe(()=>{i&&(clearTimeout(b),b=setTimeout(()=>{n(4,i="")},rt))});async function E(){const A=await(await fetch(`${B}/list_room`)).json();A.status=="success"?A.rooms?n(0,S=A.rooms):(console.error("Failed to get rooms",A),n(4,i="Failed to get rooms")):(console.error("Failed to get rooms",A),n(4,i=A.message??"Failed to get rooms")),console.log("room list refreshed",S)}async function m(){if(!w||!T){console.error("Room name and ball speed are required"),n(4,i="Room name and ball speed are required");return}const P={name:w,width:800,height:400,paddleWidth:10,paddleHeight:100,ballRadius:10,ballSpeedX:T,ballSpeedY:T},A=`${B}/create_room`;console.log("Creating room...",A,P),await fetch(A,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(P)}).then(d=>d.json()).then(d=>{console.log("create room",d),d.status=="success"&&d.room?.id?(console.log("Room created successfully, joining...",d.room),O(d.room)):(console.error("Failed to create room",d.message),n(4,i=d.message??"Failed to create room"))}).catch(d=>{console.error("Failed to create room",d),n(4,i=d.message??"Failed to create room")}),console.log("Room created successfully"),E()}async function O(P){console.log("Joining room...",P.id);const A=`${B}/join_room`,d={room_id:P.id,user_id:e.id};await fetch(A,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(G=>G.json()).then(G=>{G.status=="success"&&G.room?.id&&G.user?.id?(console.log("Joined room successfully"),q(de,e=G.user,e),q(de,e.room=G.room,e),console.log("Playing room...",P),q($,o="game room",o)):(console.error("Failed to join room",G),q(de,e.room=null,e),n(4,i=G.message??"Failed to join room"),E())}).catch(G=>{console.error("Failed to join room",G),n(4,i=G.message??"Failed to join room")})}function y(){if(!a){console.error("Nickname is required"),n(4,i="Nickname is required");return}console.log("Renaming room...",w);const P=`${B}/login`,A={id:e.id,name:a};fetch(P,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(A)}).then(d=>d.json()).then(d=>{console.log("rename user",d),d.status=="success"&&d.user?.id?(console.log("User renamed successfully"),q(de,e=d.user,e)):(console.error("Failed to rename user",d),n(4,i=d.message??"Failed to rename user"))}).catch(d=>{console.error("Failed to rename user",d),n(4,i=d.message??"Failed to rename user")})}function R(){a=this.value,n(3,a)}function Y(){w=this.value,n(1,w)}function Z(){T=$e(this.value),n(2,T)}return[S,w,T,a,i,e,E,m,O,y,R,Y,Z,P=>O(P)]}class at extends je{constructor(t){super(),Ne(this,t,it,lt,Se,{})}}new TextEncoder;function ct(s){let t,n,e,o,c=(s[4]?.players?.[s[4]?.p0index]?.user?.name??"...")+"",v,B,S,w,T=(s[4]?.players?.[s[4]?.p0index]?.wins??0)+"",a,i,b,E="PONG",m,O,y,R=(s[4]?.players?.[s[4]?.p1index]?.user?.name??"...")+"",Y,Z,U,P,A=(s[4]?.players?.[s[4]?.p1index]?.wins??0)+"",d,G,J,V,p,I,W,r,_="play/pause",D,z,re=s[2]?"hide":"show",ne,he,X,Q,be="leave",_e,me,M,ae,K,x,j,H;return{c(){t=h("div"),n=h("div"),e=h("div"),o=h("h3"),v=ee(c),B=L(),S=h("p"),w=ee("Wins: "),a=ee(T),i=L(),b=h("h1"),b.textContent=E,m=L(),O=h("div"),y=h("h3"),Y=ee(R),Z=L(),U=h("p"),P=ee("Wins: "),d=ee(A),G=L(),J=h("p"),V=h("canvas"),W=L(),r=h("button"),r.textContent=_,D=L(),z=h("button"),ne=ee(re),he=ee(" WebSocket view"),X=L(),Q=h("button"),Q.textContent=be,_e=L(),me=h("p"),M=h("canvas"),this.h()},l(C){t=f(C,"DIV",{style:!0,class:!0});var k=N(t);n=f(k,"DIV",{class:!0});var ce=N(n);e=f(ce,"DIV",{class:!0});var ve=N(e);o=f(ve,"H3",{});var ye=N(o);v=te(ye,c),ye.forEach(g),B=F(ve),S=f(ve,"P",{});var we=N(S);w=te(we,"Wins: "),a=te(we,T),we.forEach(g),ve.forEach(g),i=F(ce),b=f(ce,"H1",{class:!0,"data-svelte-h":!0}),ue(b)!=="svelte-106hqp2"&&(b.textContent=E),m=F(ce),O=f(ce,"DIV",{class:!0});var Te=N(O);y=f(Te,"H3",{});var Oe=N(y);Y=te(Oe,R),Oe.forEach(g),Z=F(Te),U=f(Te,"P",{});var Ce=N(U);P=te(Ce,"Wins: "),d=te(Ce,A),Ce.forEach(g),Te.forEach(g),ce.forEach(g),G=F(k),J=f(k,"P",{});var Ue=N(J);V=f(Ue,"CANVAS",{width:!0,height:!0,style:!0}),N(V).forEach(g),Ue.forEach(g),W=F(k),r=f(k,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(r)!=="svelte-18inrs7"&&(r.textContent=_),D=F(k),z=f(k,"BUTTON",{class:!0});var ke=N(z);ne=te(ke,re),he=te(ke," WebSocket view"),ke.forEach(g),X=F(k),Q=f(k,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(Q)!=="svelte-101srf3"&&(Q.textContent=be),_e=F(k),me=f(k,"P",{});var We=N(me);M=f(We,"CANVAS",{width:!0,height:!0,style:!0}),N(M).forEach(g),We.forEach(g),k.forEach(g),this.h()},h(){u(e,"class","player1 svelte-c69nol"),u(b,"class","svelte-c69nol"),u(O,"class","player2 svelte-c69nol"),u(n,"class","scoreboard svelte-c69nol"),u(V,"width",p=s[3].width),u(V,"height",I=s[3].height),fe(V,"background","black"),u(r,"class","game_button svelte-c69nol"),u(z,"class","game_button svelte-c69nol"),u(Q,"class","game_button svelte-c69nol"),M.hidden=ae=!s[2],u(M,"width",K=s[3].width),u(M,"height",x=s[3].height),fe(M,"background","black"),fe(t,"width","800px"),u(t,"class","cent svelte-c69nol")},m(C,k){oe(C,t,k),l(t,n),l(n,e),l(e,o),l(o,v),l(e,B),l(e,S),l(S,w),l(S,a),l(n,i),l(n,b),l(n,m),l(n,O),l(O,y),l(y,Y),l(O,Z),l(O,U),l(U,P),l(U,d),l(t,G),l(t,J),l(J,V),s[11](V),l(t,W),l(t,r),l(t,D),l(t,z),l(z,ne),l(z,he),l(t,X),l(t,Q),l(t,_e),l(t,me),l(me,M),s[12](M),j||(H=[le(V,"mousemove",s[5]),le(r,"click",s[6]),le(z,"click",s[8]),le(Q,"click",s[7])],j=!0)},p(C,[k]){k&16&&c!==(c=(C[4]?.players?.[C[4]?.p0index]?.user?.name??"...")+"")&&ie(v,c),k&16&&T!==(T=(C[4]?.players?.[C[4]?.p0index]?.wins??0)+"")&&ie(a,T),k&16&&R!==(R=(C[4]?.players?.[C[4]?.p1index]?.user?.name??"...")+"")&&ie(Y,R),k&16&&A!==(A=(C[4]?.players?.[C[4]?.p1index]?.wins??0)+"")&&ie(d,A),k&8&&p!==(p=C[3].width)&&u(V,"width",p),k&8&&I!==(I=C[3].height)&&u(V,"height",I),k&4&&re!==(re=C[2]?"hide":"show")&&ie(ne,re),k&4&&ae!==(ae=!C[2])&&(M.hidden=ae),k&8&&K!==(K=C[3].width)&&u(M,"width",K),k&8&&x!==(x=C[3].height)&&u(M,"height",x)},i:Ee,o:Ee,d(C){C&&g(t),s[11](null),s[12](null),j=!1,Pe(H)}}}function ut(s,t,n){let e,o,c;ge(s,de,r=>n(18,e=r)),ge(s,se,r=>n(19,o=r)),ge(s,$,r=>n(20,c=r));const v=1e3/60,S=window.location.origin;let w,T,a,i,b,E=!0,m={name:"placeholder",width:800,height:400,paddleWidth:10,paddleHeight:100,ballRadius:10,ballSpeedX:10,ballSpeedY:10},O={ballX:Math.floor(m.width/2),ballY:Math.floor(m.height/2),players:{a:{paddleY:Math.floor(m.height/2),score:0,wins:0,user:{id:"",name:"",room:""}},b:{paddleY:Math.floor(m.height/2),score:0,wins:0,user:{id:"",name:"",room:""}}},isRunning:!1,p0index:"a",p1index:"b"},y={...O},R={paddleY:Math.floor(m.height/2)};function Y(r){n(3,m={...r})}async function Z(){for(;c=="game room";){await new Promise(r=>setTimeout(r,v));try{if(O.isRunning)if(o.connected){let r=new Uint8Array(Uint16Array.of(R.paddleY).buffer),_=[1,r[0],r[1]];const D=Uint8Array.of(..._);o.wt.send(D)}else{console.error("Connection not ready");continue}}catch(r){console.error("Error in transmit loop",r)}}}function U(){if(c!="game room"){cancelAnimationFrame(b);return}try{P(a,O),P(i,y)}catch(r){console.error("Error in draw loop",r)}b=requestAnimationFrame(U)}function P(r,_){r.clearRect(0,0,w.width,w.height),r.fillStyle="white",r.beginPath(),r.arc(_.ballX,_.ballY,m.ballRadius,0,Math.PI*2),r.fill(),Object.keys(_?.players??{}).length>0&&(r.fillRect(0,_.players[_.p0index]?.paddleY,m.paddleWidth,m.paddleHeight),r.fillRect(w.width-m.paddleWidth,_.players[_.p1index]?.paddleY,m.paddleWidth,m.paddleHeight),r.strokeStyle="white",r.lineWidth=3,r.setLineDash([20,40]),r.beginPath(),r.moveTo(w.width/2,0),r.lineTo(w.width/2,w.height),r.stroke(),r.fillStyle="white",r.font="bold 50px Arial",r.fillText(_.players[_.p0index]?.score?.toString()??"0",w.width/2-70,70,100),r.fillText(_.players[_.p1index]?.score?.toString()??"0",w.width/2+40,70,100)),_.isRunning||(r.fillStyle="white",r.font="bold 50px Arial",r.fillText("▐▐ ",20,80,200))}Re(()=>{a=w.getContext("2d"),i=T.getContext("2d")}),et(()=>{cancelAnimationFrame(b)});function A(r){const _=w.getBoundingClientRect(),D=r.clientY-_.top-m.paddleHeight/2,z=Math.max(1,Math.min(w.height-m.paddleHeight,D));R.paddleY=z,n(4,O.players[e.id].paddleY=z,O)}function d(){console.log("play/pause ing..."),o.connected?o.wt.send_reliable(Uint8Array.of(2)):console.error("Connection not ready")}function G(){const r={room_id:e.room.id,user_id:e.id},_=`${S}/leave_room`;console.log("Leaving room...",r,_),fetch(_,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then(D=>D.json()).then(D=>{D.status=="success"&&D.user?.id&&D.room?.id?(console.log("Leave room successful, returning to room list..."),q(de,e=D.user,e),q($,c="room list",c)):console.error("Failed to leave room",D)}).catch(D=>{console.error("Error in leave room request",D)})}function J(r){try{r.players[e.id].paddleY=R.paddleY}catch(_){console.error("Error in converting state",_)}n(4,O={...r})}o.addListener("wt",(r,_)=>{J(_)}),o.addListener("ws",(r,_)=>{y={..._}});function V(){console.log("starting loops"),U(),Z()}$.subscribe(r=>{r=="game room"&&(Y({name:e.room.name,width:e.room.width,height:e.room.height,paddleWidth:e.room.paddleWidth,paddleHeight:e.room.paddleHeight,ballRadius:e.room.ballRadius,ballSpeedX:e.room.ballSpeedX,ballSpeedY:e.room.ballSpeedY}),J(e.room.gameState),V())});function p(){n(2,E=!E)}function I(r){Ie[r?"unshift":"push"](()=>{w=r,n(0,w)})}function W(r){Ie[r?"unshift":"push"](()=>{T=r,n(1,T)})}return[w,T,E,m,O,A,d,G,p,Y,J,I,W]}class dt extends je{constructor(t){super(),Ne(this,t,ut,ct,Se,{setRoomConfig:9,setState:10})}get setRoomConfig(){return this.$$.ctx[9]}get setState(){return this.$$.ctx[10]}}const ze=globalThis.__sveltekit_1ifrxi6.env??(await ot(()=>import(globalThis.__sveltekit_1ifrxi6.base+"/_app/env.js"),__vite__mapDeps([]),import.meta.url)).env;function ht(s){let t,n;return{c(){t=h("h2"),n=ee(s[3])},l(e){t=f(e,"H2",{});var o=N(t);n=te(o,s[3]),o.forEach(g)},m(e,o){oe(e,t,o),l(t,n)},p(e,o){o&8&&ie(n,e[3])},d(e){e&&g(t)}}}function ft(s){let t,n="PONG",e,o,c,v,B,S,w,T,a=s[2]&&Ke(s);return{c(){t=h("h1"),t.textContent=n,e=L(),o=h("input"),c=L(),v=h("input"),B=L(),a&&a.c(),S=Ye(),this.h()},l(i){t=f(i,"H1",{class:!0,"data-svelte-h":!0}),ue(t)!=="svelte-106hqp2"&&(t.textContent=n),e=F(i),o=f(i,"INPUT",{type:!0,placeholder:!0,autocomplete:!0,spellcheck:!0,maxlength:!0,class:!0}),c=F(i),v=f(i,"INPUT",{type:!0,class:!0}),B=F(i),a&&a.l(i),S=Ye(),this.h()},h(){u(t,"class","svelte-1av3m61"),u(o,"type","text"),u(o,"placeholder","your nickname"),u(o,"autocomplete","off"),u(o,"spellcheck","false"),u(o,"maxlength","20"),u(o,"class","svelte-1av3m61"),u(v,"type","submit"),v.value="Enter",u(v,"class","svelte-1av3m61")},m(i,b){oe(i,t,b),oe(i,e,b),oe(i,o,b),pe(o,s[1]),oe(i,c,b),oe(i,v,b),oe(i,B,b),a&&a.m(i,b),oe(i,S,b),w||(T=[le(o,"input",s[5]),le(v,"click",s[4])],w=!0)},p(i,b){b&2&&o.value!==i[1]&&pe(o,i[1]),i[2]?a?a.p(i,b):(a=Ke(i),a.c(),a.m(S.parentNode,S)):a&&(a.d(1),a=null)},d(i){i&&(g(t),g(e),g(o),g(c),g(v),g(B),g(S)),a&&a.d(i),w=!1,Pe(T)}}}function Ke(s){let t,n,e;return{c(){t=h("div"),n=h("p"),e=ee(s[2]),this.h()},l(o){t=f(o,"DIV",{class:!0});var c=N(t);n=f(c,"P",{});var v=N(n);e=te(v,s[2]),v.forEach(g),c.forEach(g),this.h()},h(){u(t,"class","error-message svelte-1av3m61")},m(o,c){oe(o,t,c),l(t,n),l(n,e)},p(o,c){c&4&&ie(e,o[2])},d(o){o&&g(t)}}}function gt(s){let t,n,e,o,c,v,B,S,w,T,a,i;function b(y,R){if(y[3]==="login page")return ft;if(y[3]!=="room list"&&y[3]!=="game room")return ht}let E=b(s),m=E&&E(s);v=new at({});let O={};return T=new dt({props:O}),s[6](T),{c(){t=h("body"),n=h("div"),m&&m.c(),e=L(),o=h("div"),c=h("div"),De(v.$$.fragment),S=L(),w=h("div"),De(T.$$.fragment),this.h()},l(y){t=f(y,"BODY",{class:!0});var R=N(t);n=f(R,"DIV",{class:!0});var Y=N(n);m&&m.l(Y),Y.forEach(g),e=F(R),o=f(R,"DIV",{});var Z=N(o);c=f(Z,"DIV",{class:!0});var U=N(c);Le(v.$$.fragment,U),U.forEach(g),Z.forEach(g),S=F(R),w=f(R,"DIV",{});var P=N(w);Le(T.$$.fragment,P),P.forEach(g),R.forEach(g),this.h()},h(){u(n,"class","cent svelte-1av3m61"),u(c,"class","cent svelte-1av3m61"),o.hidden=B=s[3]!=="room list",w.hidden=a=s[3]!=="game room",u(t,"class","svelte-1av3m61")},m(y,R){oe(y,t,R),l(t,n),m&&m.m(n,null),l(t,e),l(t,o),l(o,c),Fe(v,c,null),l(t,S),l(t,w),Fe(T,w,null),i=!0},p(y,[R]){E===(E=b(y))&&m?m.p(y,R):(m&&m.d(1),m=E&&E(y),m&&(m.c(),m.m(n,null))),(!i||R&8&&B!==(B=y[3]!=="room list"))&&(o.hidden=B);const Y={};T.$set(Y),(!i||R&8&&a!==(a=y[3]!=="game room"))&&(w.hidden=a)},i(y){i||(Be(v.$$.fragment,y),Be(T.$$.fragment,y),i=!0)},o(y){Ve(v.$$.fragment,y),Ve(T.$$.fragment,y),i=!1},d(y){y&&g(t),m&&m.d(),He(v),s[6](null),He(T)}}}const mt=1,pt=2,_t=3e3,vt=5e3;async function Qe(s){console.log("waiting for registration...",s);const t=vt,n=new Promise((o,c)=>{const v=setInterval(()=>{s.register_status==="registered"&&(clearInterval(v),o())},100)}),e=new Promise((o,c)=>{setTimeout(()=>{c(new Error("Registration timeout"))},t)});return await Promise.race([n,e]).then(()=>(console.log("Registered successfully",s),!0)).catch(o=>!1)}function Ze(s){const n=new TextDecoder("utf-8").decode(s);return JSON.parse(n)}function wt(s){return new Promise(t=>setTimeout(t,s))}function bt(s){let t=s.replace(/:/g,"");if(t.length%2!==0)throw new Error("Invalid hex string");let n=new ArrayBuffer(t.length/2),e=new Uint8Array(n);for(let o=0;o<t.length;o+=2)e[o/2]=parseInt(t.substr(o,2),16);return n}function yt(s,t,n){let e,o,c;ge(s,se,p=>n(9,e=p)),ge(s,$,p=>n(3,o=p)),ge(s,de,p=>n(10,c=p));const v=ze.PUBLIC_RECONNECT_INTERVAL??3,B=window.location.origin,S=B,w=B,T=B,a=ze.PUBLIC_HTTP3_CERTIFICATE_FINGERPRINT??"06:B0:F3:64:3A:61:E6:39:82:6F:E5:9E:D5:7E:8D:DC:A0:E6:7C:A9:4E:5D:00:2C:BC:60:13:05:63:1B:3C:78";let i,b="",E=null,m="",O;Re(()=>{E=localStorage.getItem("user_id"),E&&(console.log("logging in with saved user_id...",E),y())}),xe(()=>{m&&(clearTimeout(O),O=setTimeout(()=>{n(2,m="")},_t))});function y(){if(!b&&!E){n(2,m="Please enter your nickname");return}const p=`${S}/login`;E=localStorage.getItem("user_id"),console.log(`logging in... name=${b} id=${E} host=${p}`);const I={name:b,id:E??void 0};q($,o="logging in",o),fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(I)}).then(W=>{if(!W.ok)throw new Error("Network response was not ok");return W.json()}).then(W=>{console.log("logged in with user",W),W.code==200?(q($,o="connecting transport",o),de.set(W.user),A().then(()=>{localStorage.setItem("user_id",c.id)}).catch(r=>{console.error(r),q($,o="login page",o)})):(n(2,m=W.message??"Error logging in"),localStorage.clear("user_id"),E=null,de.set(null),q($,o="login page",o))}).catch(W=>{n(2,m=W.message??"Error logging in"),console.error(W),q($,o="login page",o)})}async function R(){if(console.log("connecting transport..."),q($,o="connecting webTransport",o),await d()){if(console.log("connected webtransport"),q($,o="registering webTransport",o),!await Y())return console.log("failed to register webTransport"),1}else return console.log("failed to connect webtransport"),0;if(console.log("Registered webTransport"),q($,o="connecting webSocket",o),await G()){if(console.log("connected webSocket"),q($,o="registering webSocket",o),!await Z())return console.log("failed to register webSocket"),1}else return console.log("failed to connect webSocket"),0;return q(se,e.connected=!0,e),q($,o="room list",o),2}async function Y(){return console.log("registering webtransport..."),await e.wt.send_reliable(Uint8Array.of(0,...new TextEncoder().encode(c.id))),q(se,e.wt.register_status="registering",e),await Qe(e.wt)}async function Z(){return console.log("registering websocket..."),await e.ws.send_reliable(Uint8Array.of(0,...new TextEncoder().encode(c.id))),q(se,e.ws.register_status="registering",e),await Qe(e.ws)}q(se,e.addListener=(p,I)=>{e[p+"_listeners"]==null&&q(se,e[p+"_listeners"]=[],e);const W=e[p+"_listeners"].length;return e[p+"_listeners"].push(I),W},e),q(se,e.removeListener=(p,I)=>{q(se,e[p+"_listeners"]=null,e)},e);function U(p,I){p.register_status==="registering"&&(p.register_status="registered",console.log("register messsage received",p)),e[p.protocol+"_listeners"].forEach(W=>{try{W&&W(p,I)}catch(r){console.error("Error calling listener",r)}})}async function P(p){if(e.connected){console.log("webtransport disconnected, handling...");try{delete e.wt,delete e.ws}catch(I){console.log("error deleting transport",I)}q(se,e.connected=!1,e),await A()}}async function A(){for(q($,o="reconnecting",o);;){console.log("reconnecting...");const p=await R();if(p==mt)console.log("reconnected, but failed registering. returning to login page..."),window.location.href="/";else if(p==pt){console.log("reconnected"),q($,o="room list",o);break}console.log(`reconnecting again in ${v} sec...`),await wt(v*1e3)}}async function d(){const p=`${w}/wt`,I=new WebTransport(p,{serverCertificateHashes:[{algorithm:"sha-256",value:bt(a)}]});if(I.closed.then(()=>{console.log("WebTransport closed",I),P()}).catch(X=>{console.error("WebTransport connection died:",X,I),P()}),console.log("webtransport connecting...",p),!await I.ready.then(()=>(console.log("WebTransport connected",I),!0)).catch(X=>(console.error("WebTransport connection failed:",X),!1)))return!1;const r={protocol:"wt",register_status:"unregistered",transport:I},_=r.transport.datagrams,D=_.writable.getWriter(),z=_.readable.getReader();r.send=X=>{D.write(X)},async function(){for(;;){const{value:X,done:Q}=await z.read();if(Q){console.log("Done reading datagram, stop reading...",value);return}U(r,Ze(X))}}().catch(X=>{console.error("reading datagram failed, stop reading...:",X)});const re=await I.createBidirectionalStream(),ne=re.writable.getWriter(),he=re.readable.getReader();return r.send_reliable=X=>{ne.write(X)},async function(){for(;;){const{value:X,done:Q}=await he.read();if(Q){console.log("Done reading stream, stop reading...",value);return}U(r,Ze(X))}}().catch(X=>{console.error("reading datagram failed, stop reading...:",X)}),q(se,e.wt=r,e),!0}async function G(){const p=`${T}/ws`,I=new WebSocket(p);if(console.log("websocket connecting...",p),!await new Promise((_,D)=>{I.onopen=()=>{console.log(I,"WebSocket connected"),_(!0)},I.onerror_message=z=>{console.error("WebSocket error:",z),D(z)}}).catch(_=>(console.error("WebSocket $connection failed:",_),!1)))return!1;const r={protocol:"ws",register_status:"unregistered",transport:I};return r.send_reliable=_=>{r.transport.send(_)},I.addEventListener("message",_=>{U(r,JSON.parse(_.data))}),I.addEventListener("close",_=>{_.wasClean?console.log("WebSocket closed",_):console.error("WebSocket $connection died",_)}),q(se,e.ws=r,e),!0}function J(){b=this.value,n(1,b)}function V(p){Ie[p?"unshift":"push"](()=>{i=p,n(0,i)})}return[i,b,m,o,y,J,V]}class It extends je{constructor(t){super(),Ne(this,t,yt,gt,Se,{})}}export{It as component};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}