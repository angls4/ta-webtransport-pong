import{s as Se,n as Ee,r as Pe,e as ge,o as Re,a as xe,f as q,h as et,b as ke}from"../chunks/scheduler.CTimOCLo.js";import{S as je,i as Ne,g as h,s as L,m as ee,h as f,j as A,c as F,y as ue,n as te,f as g,k as u,l as fe,a as oe,x as l,z as pe,A as le,o as ie,B as $e,C as tt,r as We,u as Le,v as Fe,d as Be,t as Ve,w as He,e as Ye}from"../chunks/index.CRnmY6F2.js";import{w as Ae}from"../chunks/index.BXnrS5-F.js";import{_ as ot}from"../chunks/preload-helper.CRk0x-X1.js";function Me(s){return s?.length!==void 0?s:Array.from(s)}const nt={wt:null,ws:null,connected:!1,wt_listeners:[],ws_listeners:[],addListener:()=>{}},st={id:null,name:"",room:null,player:null},se=Ae(nt),de=Ae(st),$=Ae("login page");function qe(s,t,n){const e=s.slice();return e[21]=t[n],e}function Je(s){let t,n,e;return{c(){t=h("div"),n=h("p"),e=ee(s[4]),this.h()},l(o){t=f(o,"DIV",{class:!0});var d=A(t);n=f(d,"P",{});var v=A(n);e=te(v,s[4]),v.forEach(g),d.forEach(g),this.h()},h(){u(t,"class","error-message svelte-17jni71")},m(o,d){oe(o,t,d),l(t,n),l(n,e)},p(o,d){d&16&&ie(e,o[4])},d(o){o&&g(t)}}}function Ge(s){let t,n,e,o,d=s[21].name+"",v,B,S,w,T=Math.abs(s[21].ballSpeedX)+"",a,i,b,E=Object.keys(s[21].gameState.players).length+"",m,O,y,R,Y,z,U,P,j,c;function J(){return s[13](s[21])}return{c(){t=h("div"),n=h("div"),e=h("div"),o=h("span"),v=ee(d),B=L(),S=h("span"),w=ee("Ball speed : "),a=ee(T),i=L(),b=h("span"),m=ee(E),O=ee("/2 Players"),y=L(),R=h("div"),Y=h("button"),z=ee("JOIN"),P=L(),this.h()},l(G){t=f(G,"DIV",{class:!0});var V=A(t);n=f(V,"DIV",{class:!0});var p=A(n);e=f(p,"DIV",{class:!0});var I=A(e);o=f(I,"SPAN",{});var D=A(o);v=te(D,d),D.forEach(g),I.forEach(g),B=F(p),S=f(p,"SPAN",{class:!0});var r=A(S);w=te(r,"Ball speed : "),a=te(r,T),r.forEach(g),i=F(p),b=f(p,"SPAN",{class:!0});var _=A(b);m=te(_,E),O=te(_,"/2 Players"),_.forEach(g),p.forEach(g),y=F(V),R=f(V,"DIV",{});var W=A(R);Y=f(W,"BUTTON",{class:!0});var K=A(Y);z=te(K,"JOIN"),K.forEach(g),W.forEach(g),P=F(V),V.forEach(g),this.h()},h(){u(e,"class","room__name svelte-17jni71"),u(S,"class","room__detail svelte-17jni71"),u(b,"class","room__detail svelte-17jni71"),u(n,"class","room__info svelte-17jni71"),u(Y,"class","button svelte-17jni71"),Y.disabled=U=Object.keys(s[21].gameState.players).length>=2,u(t,"class","room svelte-17jni71")},m(G,V){oe(G,t,V),l(t,n),l(n,e),l(e,o),l(o,v),l(n,B),l(n,S),l(S,w),l(S,a),l(n,i),l(n,b),l(b,m),l(b,O),l(t,y),l(t,R),l(R,Y),l(Y,z),l(t,P),j||(c=le(Y,"click",J),j=!0)},p(G,V){s=G,V&1&&d!==(d=s[21].name+"")&&ie(v,d),V&1&&T!==(T=Math.abs(s[21].ballSpeedX)+"")&&ie(a,T),V&1&&E!==(E=Object.keys(s[21].gameState.players).length+"")&&ie(m,E),V&1&&U!==(U=Object.keys(s[21].gameState.players).length>=2)&&(Y.disabled=U)},d(G){G&&g(t),j=!1,c()}}}function Xe(s){let t,n="<span>No rooms available</span>";return{c(){t=h("p"),t.innerHTML=n,this.h()},l(e){t=f(e,"P",{style:!0,"data-svelte-h":!0}),ue(t)!=="svelte-156qi2m"&&(t.innerHTML=n),this.h()},h(){fe(t,"color","grey")},m(e,o){oe(e,t,o)},d(e){e&&g(t)}}}function lt(s){let t,n,e,o="PONG",d,v,B,S=s[5]?.name+"",w,T,a,i,b,E,m="rename user",O,y,R,Y,z,U,P,j,c,J,G,V="Create Room",p,I,D,r="Refresh",_,W,K="",re,ne,he,X,Z,be="credit: angls4",_e,me,M=s[4]&&Je(s),ae=Me(s[0]),Q=[];for(let N=0;N<ae.length;N+=1)Q[N]=Ge(qe(s,ae,N));let x=s[0].length==0&&Xe();return{c(){t=h("div"),M&&M.c(),n=L(),e=h("h1"),e.textContent=o,d=L(),v=h("h2"),B=ee("Welcome, "),w=ee(S),T=L(),a=h("div"),i=h("input"),b=L(),E=h("button"),E.textContent=m,O=L(),y=h("br"),R=L(),Y=h("br"),z=L(),U=h("input"),P=L(),j=h("span"),c=h("input"),J=L(),G=h("button"),G.textContent=V,p=L(),I=h("p"),D=h("button"),D.textContent=r,_=L(),W=h("div"),W.innerHTML=K,re=L(),ne=h("div");for(let N=0;N<Q.length;N+=1)Q[N].c();he=L(),x&&x.c(),X=L(),Z=h("p"),Z.textContent=be,this.h()},l(N){t=f(N,"DIV",{class:!0});var H=A(t);M&&M.l(H),n=F(H),e=f(H,"H1",{class:!0,"data-svelte-h":!0}),ue(e)!=="svelte-1jnr5i3"&&(e.textContent=o),d=F(H),v=f(H,"H2",{class:!0});var C=A(v);B=te(C,"Welcome, "),w=te(C,S),C.forEach(g),T=F(H),a=f(H,"DIV",{class:!0,style:!0});var k=A(a);i=f(k,"INPUT",{type:!0,placeholder:!0,maxlength:!0,class:!0}),b=F(k),E=f(k,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(E)!=="svelte-5cerf9"&&(E.textContent=m),O=F(k),y=f(k,"BR",{}),R=F(k),Y=f(k,"BR",{}),z=F(k),U=f(k,"INPUT",{type:!0,placeholder:!0,maxlength:!0,class:!0}),P=F(k),j=f(k,"SPAN",{});var ce=A(j);c=f(ce,"INPUT",{type:!0,min:!0,max:!0,placeholder:!0,style:!0,class:!0}),J=F(ce),G=f(ce,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(G)!=="svelte-136z9rb"&&(G.textContent=V),ce.forEach(g),k.forEach(g),p=F(H),I=f(H,"P",{});var ve=A(I);D=f(ve,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(D)!=="svelte-1nuptru"&&(D.textContent=r),ve.forEach(g),_=F(H),W=f(H,"DIV",{class:!0,"data-svelte-h":!0}),ue(W)!=="svelte-1hf6hku"&&(W.innerHTML=K),re=F(H),ne=f(H,"DIV",{class:!0});var ye=A(ne);for(let we=0;we<Q.length;we+=1)Q[we].l(ye);ye.forEach(g),he=F(H),x&&x.l(H),H.forEach(g),X=F(N),Z=f(N,"P",{style:!0,"data-svelte-h":!0}),ue(Z)!=="svelte-apo9jk"&&(Z.textContent=be),this.h()},h(){u(e,"class","card__title svelte-17jni71"),u(v,"class","svelte-17jni71"),u(i,"type","text"),u(i,"placeholder","New nickname"),u(i,"maxlength","20"),u(i,"class","svelte-17jni71"),u(E,"class","button-small svelte-17jni71"),u(U,"type","text"),U.required=!0,u(U,"placeholder","Enter room name"),u(U,"maxlength","20"),u(U,"class","svelte-17jni71"),u(c,"type","number"),u(c,"min","0"),u(c,"max","100"),c.required=!0,u(c,"placeholder","Ball speed"),fe(c,"width","100px"),fe(c,"margin-left","0"),fe(c,"margin-right","10px"),u(c,"class","svelte-17jni71"),u(G,"class","button-small svelte-17jni71"),u(a,"class","room svelte-17jni71"),fe(a,"display","block"),u(D,"class","button svelte-17jni71"),u(W,"class","card__header svelte-17jni71"),u(ne,"class","room-list svelte-17jni71"),u(t,"class","card svelte-17jni71"),fe(Z,"color","white")},m(N,H){oe(N,t,H),M&&M.m(t,null),l(t,n),l(t,e),l(t,d),l(t,v),l(v,B),l(v,w),l(t,T),l(t,a),l(a,i),pe(i,s[3]),l(a,b),l(a,E),l(a,O),l(a,y),l(a,R),l(a,Y),l(a,z),l(a,U),pe(U,s[1]),l(a,P),l(a,j),l(j,c),pe(c,s[2]),l(j,J),l(j,G),l(t,p),l(t,I),l(I,D),l(t,_),l(t,W),l(t,re),l(t,ne);for(let C=0;C<Q.length;C+=1)Q[C]&&Q[C].m(ne,null);l(t,he),x&&x.m(t,null),oe(N,X,H),oe(N,Z,H),_e||(me=[le(i,"input",s[10]),le(E,"click",s[9]),le(U,"input",s[11]),le(c,"input",s[12]),le(G,"click",s[7]),le(D,"click",s[6])],_e=!0)},p(N,[H]){if(N[4]?M?M.p(N,H):(M=Je(N),M.c(),M.m(t,n)):M&&(M.d(1),M=null),H&32&&S!==(S=N[5]?.name+"")&&ie(w,S),H&8&&i.value!==N[3]&&pe(i,N[3]),H&2&&U.value!==N[1]&&pe(U,N[1]),H&4&&$e(c.value)!==N[2]&&pe(c,N[2]),H&257){ae=Me(N[0]);let C;for(C=0;C<ae.length;C+=1){const k=qe(N,ae,C);Q[C]?Q[C].p(k,H):(Q[C]=Ge(k),Q[C].c(),Q[C].m(ne,null))}for(;C<Q.length;C+=1)Q[C].d(1);Q.length=ae.length}N[0].length==0?x||(x=Xe(),x.c(),x.m(t,null)):x&&(x.d(1),x=null)},i:Ee,o:Ee,d(N){N&&(g(t),g(X),g(Z)),M&&M.d(),tt(Q,N),x&&x.d(),_e=!1,Pe(me)}}}const rt=3e3;function it(s,t,n){let e,o,d;ge(s,de,P=>n(5,e=P)),ge(s,$,P=>n(15,o=P)),ge(s,se,P=>n(16,d=P));const B=window.location.origin;let S=[],w="",T,a=e?.name??"",i="",b;Re(()=>{$.subscribe(P=>{d.connected&&(e.room?e.room?.id?O(e.room):O({id:e.room}):E())})}),xe(()=>{i&&(clearTimeout(b),b=setTimeout(()=>{n(4,i="")},rt))});async function E(){const j=await(await fetch(`${B}/list_room`)).json();j.status=="success"?j.rooms?n(0,S=j.rooms):(console.error("Failed to get rooms",j),n(4,i="Failed to get rooms")):(console.error("Failed to get rooms",j),n(4,i=j.message??"Failed to get rooms")),console.log("room list refreshed",S)}async function m(){if(!w||!T){console.error("Room name and ball speed are required"),n(4,i="Room name and ball speed are required");return}const P={name:w,width:800,height:400,paddleWidth:10,paddleHeight:100,ballRadius:10,ballSpeedX:T,ballSpeedY:T},j=`${B}/create_room`;console.log("Creating room...",j,P),await fetch(j,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(P)}).then(c=>c.json()).then(c=>{console.log("create room",c),c.status=="success"&&c.room?.id?(console.log("Room created successfully, joining...",c.room),O(c.room)):(console.error("Failed to create room",c.message),n(4,i=c.message??"Failed to create room"))}).catch(c=>{console.error("Failed to create room",c),n(4,i=c.message??"Failed to create room")}),console.log("Room created successfully"),E()}async function O(P){console.log("Joining room...",P.id);const j=`${B}/join_room`,c={room_id:P.id,user_id:e.id};await fetch(j,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)}).then(J=>J.json()).then(J=>{J.status=="success"&&J.room?.id&&J.user?.id?(console.log("Joined room successfully"),q(de,e=J.user,e),q(de,e.room=J.room,e),console.log("Playing room...",P),q($,o="game room",o)):(console.error("Failed to join room",J),q(de,e.room=null,e),n(4,i=J.message??"Failed to join room"),E())}).catch(J=>{console.error("Failed to join room",J),n(4,i=J.message??"Failed to join room")})}function y(){if(!a){console.error("Nickname is required"),n(4,i="Nickname is required");return}console.log("Renaming room...",w);const P=`${B}/login`,j={id:e.id,name:a};fetch(P,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(j)}).then(c=>c.json()).then(c=>{console.log("rename user",c),c.status=="success"&&c.user?.id?(console.log("User renamed successfully"),q(de,e=c.user,e)):(console.error("Failed to rename user",c),n(4,i=c.message??"Failed to rename user"))}).catch(c=>{console.error("Failed to rename user",c),n(4,i=c.message??"Failed to rename user")})}function R(){a=this.value,n(3,a)}function Y(){w=this.value,n(1,w)}function z(){T=$e(this.value),n(2,T)}return[S,w,T,a,i,e,E,m,O,y,R,Y,z,P=>O(P)]}class at extends je{constructor(t){super(),Ne(this,t,it,lt,Se,{})}}new TextEncoder;function ct(s){let t,n,e,o,d=(s[4]?.players?.[s[4]?.p0index]?.user?.name??"...")+"",v,B,S,w,T=(s[4]?.players?.[s[4]?.p0index]?.wins??0)+"",a,i,b,E="PONG",m,O,y,R=(s[4]?.players?.[s[4]?.p1index]?.user?.name??"...")+"",Y,z,U,P,j=(s[4]?.players?.[s[4]?.p1index]?.wins??0)+"",c,J,G,V,p,I,D,r,_="play/pause",W,K,re=s[2]?"hide":"show",ne,he,X,Z,be="leave",_e,me,M,ae,Q,x,N,H;return{c(){t=h("div"),n=h("div"),e=h("div"),o=h("h3"),v=ee(d),B=L(),S=h("p"),w=ee("Wins: "),a=ee(T),i=L(),b=h("h1"),b.textContent=E,m=L(),O=h("div"),y=h("h3"),Y=ee(R),z=L(),U=h("p"),P=ee("Wins: "),c=ee(j),J=L(),G=h("p"),V=h("canvas"),D=L(),r=h("button"),r.textContent=_,W=L(),K=h("button"),ne=ee(re),he=ee(" ws"),X=L(),Z=h("button"),Z.textContent=be,_e=L(),me=h("p"),M=h("canvas"),this.h()},l(C){t=f(C,"DIV",{style:!0,class:!0});var k=A(t);n=f(k,"DIV",{class:!0});var ce=A(n);e=f(ce,"DIV",{class:!0});var ve=A(e);o=f(ve,"H3",{});var ye=A(o);v=te(ye,d),ye.forEach(g),B=F(ve),S=f(ve,"P",{});var we=A(S);w=te(we,"Wins: "),a=te(we,T),we.forEach(g),ve.forEach(g),i=F(ce),b=f(ce,"H1",{class:!0,"data-svelte-h":!0}),ue(b)!=="svelte-106hqp2"&&(b.textContent=E),m=F(ce),O=f(ce,"DIV",{class:!0});var Te=A(O);y=f(Te,"H3",{});var Oe=A(y);Y=te(Oe,R),Oe.forEach(g),z=F(Te),U=f(Te,"P",{});var Ce=A(U);P=te(Ce,"Wins: "),c=te(Ce,j),Ce.forEach(g),Te.forEach(g),ce.forEach(g),J=F(k),G=f(k,"P",{});var Ue=A(G);V=f(Ue,"CANVAS",{width:!0,height:!0,style:!0}),A(V).forEach(g),Ue.forEach(g),D=F(k),r=f(k,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(r)!=="svelte-1f8r5w0"&&(r.textContent=_),W=F(k),K=f(k,"BUTTON",{class:!0});var Ie=A(K);ne=te(Ie,re),he=te(Ie," ws"),Ie.forEach(g),X=F(k),Z=f(k,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(Z)!=="svelte-101srf3"&&(Z.textContent=be),_e=F(k),me=f(k,"P",{});var De=A(me);M=f(De,"CANVAS",{width:!0,height:!0,style:!0}),A(M).forEach(g),De.forEach(g),k.forEach(g),this.h()},h(){u(e,"class","player1 svelte-c69nol"),u(b,"class","svelte-c69nol"),u(O,"class","player2 svelte-c69nol"),u(n,"class","scoreboard svelte-c69nol"),u(V,"width",p=s[3].width),u(V,"height",I=s[3].height),fe(V,"background","black"),u(r,"class","game_button svelte-c69nol"),u(K,"class","game_button svelte-c69nol"),u(Z,"class","game_button svelte-c69nol"),M.hidden=ae=!s[2],u(M,"width",Q=s[3].width),u(M,"height",x=s[3].height),fe(M,"background","black"),fe(t,"width","800px"),u(t,"class","cent svelte-c69nol")},m(C,k){oe(C,t,k),l(t,n),l(n,e),l(e,o),l(o,v),l(e,B),l(e,S),l(S,w),l(S,a),l(n,i),l(n,b),l(n,m),l(n,O),l(O,y),l(y,Y),l(O,z),l(O,U),l(U,P),l(U,c),l(t,J),l(t,G),l(G,V),s[11](V),l(t,D),l(t,r),l(t,W),l(t,K),l(K,ne),l(K,he),l(t,X),l(t,Z),l(t,_e),l(t,me),l(me,M),s[12](M),N||(H=[le(V,"mousemove",s[5]),le(r,"click",s[6]),le(K,"click",s[8]),le(Z,"click",s[7])],N=!0)},p(C,[k]){k&16&&d!==(d=(C[4]?.players?.[C[4]?.p0index]?.user?.name??"...")+"")&&ie(v,d),k&16&&T!==(T=(C[4]?.players?.[C[4]?.p0index]?.wins??0)+"")&&ie(a,T),k&16&&R!==(R=(C[4]?.players?.[C[4]?.p1index]?.user?.name??"...")+"")&&ie(Y,R),k&16&&j!==(j=(C[4]?.players?.[C[4]?.p1index]?.wins??0)+"")&&ie(c,j),k&8&&p!==(p=C[3].width)&&u(V,"width",p),k&8&&I!==(I=C[3].height)&&u(V,"height",I),k&4&&re!==(re=C[2]?"hide":"show")&&ie(ne,re),k&4&&ae!==(ae=!C[2])&&(M.hidden=ae),k&8&&Q!==(Q=C[3].width)&&u(M,"width",Q),k&8&&x!==(x=C[3].height)&&u(M,"height",x)},i:Ee,o:Ee,d(C){C&&g(t),s[11](null),s[12](null),N=!1,Pe(H)}}}function ut(s,t,n){let e,o,d;ge(s,de,r=>n(18,e=r)),ge(s,se,r=>n(19,o=r)),ge(s,$,r=>n(20,d=r));const v=1e3/30,S=window.location.origin;let w,T,a,i,b,E=!1,m={name:"placeholder",width:800,height:400,paddleWidth:10,paddleHeight:100,ballRadius:10,ballSpeedX:10,ballSpeedY:10},O={ballX:Math.floor(m.width/2),ballY:Math.floor(m.height/2),players:{a:{paddleY:Math.floor(m.height/2),score:0,wins:0,user:{id:"",name:"",room:""}},b:{paddleY:Math.floor(m.height/2),score:0,wins:0,user:{id:"",name:"",room:""}}},isRunning:!1,p0index:"a",p1index:"b"},y={...O},R={paddleY:Math.floor(m.height/2)};function Y(){console.log("Initializing game"),a=w.getContext("2d"),i=T.getContext("2d"),c(a,O),c(i,y),j(),P()}function z(r){try{r.players[e.id].paddleY=R.paddleY}catch(_){console.error("Error in converting state",_)}n(4,O={...r})}function U(r){n(3,m={...r})}async function P(){for(;;){await new Promise(r=>setTimeout(r,v));try{if(O.isRunning)if(o.connected){let r=new Uint8Array(Uint16Array.of(R.paddleY).buffer),_=[1,r[0],r[1]];const W=Uint8Array.of(..._);o.wt.send(W)}else{console.error("Connection not ready");continue}}catch(r){console.error("Error in transmit loop",r)}}}function j(){try{c(a,O),c(i,y)}catch(r){console.error("Error in draw loop",r)}b=requestAnimationFrame(j)}function c(r,_){r.clearRect(0,0,w.width,w.height),r.fillStyle="white",r.beginPath(),r.arc(_.ballX,_.ballY,m.ballRadius,0,Math.PI*2),r.fill(),Object.keys(_?.players??{}).length>0&&(r.fillRect(0,_.players[_.p0index]?.paddleY,m.paddleWidth,m.paddleHeight),r.fillRect(w.width-m.paddleWidth,_.players[_.p1index]?.paddleY,m.paddleWidth,m.paddleHeight),r.strokeStyle="white",r.lineWidth=3,r.setLineDash([20,40]),r.beginPath(),r.moveTo(w.width/2,0),r.lineTo(w.width/2,w.height),r.stroke(),r.fillStyle="white",r.font="bold 50px Arial",r.fillText(_.players[_.p0index]?.score?.toString()??"0",w.width/2-70,70,100),r.fillText(_.players[_.p1index]?.score?.toString()??"0",w.width/2+40,70,100)),_.isRunning||(r.fillStyle="white",r.font="bold 50px Arial",r.fillText("▐▐ ",20,80,200))}Re(()=>{Y()}),et(()=>{cancelAnimationFrame(b)});function J(r){const _=w.getBoundingClientRect(),W=r.clientY-_.top-m.paddleHeight/2,K=Math.max(1,Math.min(w.height-m.paddleHeight,W));R.paddleY=K,n(4,O.players[e.id].paddleY=K,O)}function G(){console.log(o),o.connected?o.wt.send_reliable(Uint8Array.of(2)):console.error("Connection not ready")}function V(){const r={room_id:e.room.id,user_id:e.id},_=`${S}/leave_room`;console.log("Leaving room...",r,_),fetch(_,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then(W=>W.json()).then(W=>{W.status=="success"&&W.user?.id&&W.room?.id?(console.log("Leave room successful"),q(de,e=W.user,e),q($,d="room list",d)):console.error("Failed to leave room",W)}).catch(W=>{console.error("Error in leave room request",W)})}o.addListener("wt",(r,_)=>{z(_)}),o.addListener("ws",(r,_)=>{y={..._}}),$.subscribe(r=>{r=="game room"&&(U({name:e.room.name,width:e.room.width,height:e.room.height,paddleWidth:e.room.paddleWidth,paddleHeight:e.room.paddleHeight,ballRadius:e.room.ballRadius,ballSpeedX:e.room.ballSpeedX,ballSpeedY:e.room.ballSpeedY}),z(e.room.gameState))});function p(){n(2,E=!E)}function I(r){ke[r?"unshift":"push"](()=>{w=r,n(0,w)})}function D(r){ke[r?"unshift":"push"](()=>{T=r,n(1,T)})}return[w,T,E,m,O,J,G,V,p,z,U,I,D]}class dt extends je{constructor(t){super(),Ne(this,t,ut,ct,Se,{setState:9,setRoomConfig:10})}get setState(){return this.$$.ctx[9]}get setRoomConfig(){return this.$$.ctx[10]}}const ze=globalThis.__sveltekit_qsi7lj.env??(await ot(()=>import(globalThis.__sveltekit_qsi7lj.base+"/_app/env.js"),__vite__mapDeps([]),import.meta.url)).env;function ht(s){let t,n;return{c(){t=h("h2"),n=ee(s[3])},l(e){t=f(e,"H2",{});var o=A(t);n=te(o,s[3]),o.forEach(g)},m(e,o){oe(e,t,o),l(t,n)},p(e,o){o&8&&ie(n,e[3])},d(e){e&&g(t)}}}function ft(s){let t,n="PONG",e,o,d,v,B,S,w,T,a=s[2]&&Ke(s);return{c(){t=h("h1"),t.textContent=n,e=L(),o=h("input"),d=L(),v=h("input"),B=L(),a&&a.c(),S=Ye(),this.h()},l(i){t=f(i,"H1",{class:!0,"data-svelte-h":!0}),ue(t)!=="svelte-106hqp2"&&(t.textContent=n),e=F(i),o=f(i,"INPUT",{type:!0,placeholder:!0,autocomplete:!0,spellcheck:!0,maxlength:!0,class:!0}),d=F(i),v=f(i,"INPUT",{type:!0,class:!0}),B=F(i),a&&a.l(i),S=Ye(),this.h()},h(){u(t,"class","svelte-1av3m61"),u(o,"type","text"),u(o,"placeholder","your nickname"),u(o,"autocomplete","off"),u(o,"spellcheck","false"),u(o,"maxlength","20"),u(o,"class","svelte-1av3m61"),u(v,"type","submit"),v.value="Enter",u(v,"class","svelte-1av3m61")},m(i,b){oe(i,t,b),oe(i,e,b),oe(i,o,b),pe(o,s[1]),oe(i,d,b),oe(i,v,b),oe(i,B,b),a&&a.m(i,b),oe(i,S,b),w||(T=[le(o,"input",s[5]),le(v,"click",s[4])],w=!0)},p(i,b){b&2&&o.value!==i[1]&&pe(o,i[1]),i[2]?a?a.p(i,b):(a=Ke(i),a.c(),a.m(S.parentNode,S)):a&&(a.d(1),a=null)},d(i){i&&(g(t),g(e),g(o),g(d),g(v),g(B),g(S)),a&&a.d(i),w=!1,Pe(T)}}}function Ke(s){let t,n,e;return{c(){t=h("div"),n=h("p"),e=ee(s[2]),this.h()},l(o){t=f(o,"DIV",{class:!0});var d=A(t);n=f(d,"P",{});var v=A(n);e=te(v,s[2]),v.forEach(g),d.forEach(g),this.h()},h(){u(t,"class","error-message svelte-1av3m61")},m(o,d){oe(o,t,d),l(t,n),l(n,e)},p(o,d){d&4&&ie(e,o[2])},d(o){o&&g(t)}}}function gt(s){let t,n,e,o,d,v,B,S,w,T,a,i;function b(y,R){if(y[3]==="login page")return ft;if(y[3]!=="room list"&&y[3]!=="game room")return ht}let E=b(s),m=E&&E(s);v=new at({});let O={};return T=new dt({props:O}),s[6](T),{c(){t=h("body"),n=h("div"),m&&m.c(),e=L(),o=h("div"),d=h("div"),We(v.$$.fragment),S=L(),w=h("div"),We(T.$$.fragment),this.h()},l(y){t=f(y,"BODY",{class:!0});var R=A(t);n=f(R,"DIV",{class:!0});var Y=A(n);m&&m.l(Y),Y.forEach(g),e=F(R),o=f(R,"DIV",{});var z=A(o);d=f(z,"DIV",{class:!0});var U=A(d);Le(v.$$.fragment,U),U.forEach(g),z.forEach(g),S=F(R),w=f(R,"DIV",{});var P=A(w);Le(T.$$.fragment,P),P.forEach(g),R.forEach(g),this.h()},h(){u(n,"class","cent svelte-1av3m61"),u(d,"class","cent svelte-1av3m61"),o.hidden=B=s[3]!=="room list",w.hidden=a=s[3]!=="game room",u(t,"class","svelte-1av3m61")},m(y,R){oe(y,t,R),l(t,n),m&&m.m(n,null),l(t,e),l(t,o),l(o,d),Fe(v,d,null),l(t,S),l(t,w),Fe(T,w,null),i=!0},p(y,[R]){E===(E=b(y))&&m?m.p(y,R):(m&&m.d(1),m=E&&E(y),m&&(m.c(),m.m(n,null))),(!i||R&8&&B!==(B=y[3]!=="room list"))&&(o.hidden=B);const Y={};T.$set(Y),(!i||R&8&&a!==(a=y[3]!=="game room"))&&(w.hidden=a)},i(y){i||(Be(v.$$.fragment,y),Be(T.$$.fragment,y),i=!0)},o(y){Ve(v.$$.fragment,y),Ve(T.$$.fragment,y),i=!1},d(y){y&&g(t),m&&m.d(),He(v),s[6](null),He(T)}}}const mt=1,pt=2,_t=3e3,vt=5e3;async function Qe(s){console.log("waiting for registration...",s);const t=vt,n=new Promise((o,d)=>{const v=setInterval(()=>{s.register_status==="registered"&&(clearInterval(v),o())},100)}),e=new Promise((o,d)=>{setTimeout(()=>{d(new Error("Registration timeout"))},t)});return await Promise.race([n,e]).then(()=>(console.log("Registered successfully",s),!0)).catch(o=>!1)}function Ze(s){const n=new TextDecoder("utf-8").decode(s);return JSON.parse(n)}function wt(s){return new Promise(t=>setTimeout(t,s))}function bt(s){let t=s.replace(/:/g,"");if(t.length%2!==0)throw new Error("Invalid hex string");let n=new ArrayBuffer(t.length/2),e=new Uint8Array(n);for(let o=0;o<t.length;o+=2)e[o/2]=parseInt(t.substr(o,2),16);return n}function yt(s,t,n){let e,o,d;ge(s,se,p=>n(9,e=p)),ge(s,$,p=>n(3,o=p)),ge(s,de,p=>n(10,d=p));const v=ze.PUBLIC_RECONNECT_INTERVAL??3,B=window.location.origin,S=B,w=B,T=B,a=ze.PUBLIC_HTTP3_CERTIFICATE_FINGERPRINT??"43:6E:11:10:0C:94:51:4C:10:FD:D8:F6:46:5F:DD:A4:18:70:EC:11:44:8E:C0:4D:A4:1A:B9:69:23:C3:7B:95";let i,b="",E=null,m="",O;Re(()=>{E=localStorage.getItem("user_id"),E&&(console.log("logging in with saved user_id...",E),y())}),xe(()=>{m&&(clearTimeout(O),O=setTimeout(()=>{n(2,m="")},_t))});function y(){if(!b&&!E){n(2,m="Please enter your nickname");return}const p=`${S}/login`;E=localStorage.getItem("user_id"),console.log(`logging in... name=${b} id=${E} host=${p}`);const I={name:b,id:E??void 0};q($,o="logging in",o),fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(I)}).then(D=>{if(!D.ok)throw new Error("Network response was not ok");return D.json()}).then(D=>{console.log("logged in with user",D),D.code==200?(q($,o="connecting transport",o),de.set(D.user),j().then(()=>{localStorage.setItem("user_id",d.id)}).catch(r=>{console.error(r),q($,o="login page",o)})):(n(2,m=D.message??"Error logging in"),localStorage.clear("user_id"),E=null,de.set(null),q($,o="login page",o))}).catch(D=>{n(2,m=D.message??"Error logging in"),console.error(D),q($,o="login page",o)})}async function R(){if(console.log("connecting transport..."),q($,o="connecting webTransport",o),await c()){if(console.log("connected webtransport"),q($,o="registering webTransport",o),!await Y())return console.log("failed to register webTransport"),1}else return console.log("failed to connect webtransport"),0;if(console.log("Registered webTransport"),q($,o="connecting webSocket",o),await J()){if(console.log("connected webSocket"),q($,o="registering webSocket",o),!await z())return console.log("failed to register webSocket"),1}else return console.log("failed to connect webSocket"),0;return q(se,e.connected=!0,e),q($,o="room list",o),2}async function Y(){return console.log("registering webtransport..."),await e.wt.send_reliable(Uint8Array.of(0,...new TextEncoder().encode(d.id))),q(se,e.wt.register_status="registering",e),await Qe(e.wt)}async function z(){return console.log("registering websocket..."),await e.ws.send_reliable(Uint8Array.of(0,...new TextEncoder().encode(d.id))),q(se,e.ws.register_status="registering",e),await Qe(e.ws)}q(se,e.addListener=(p,I)=>{e[p+"_listeners"]==null&&q(se,e[p+"_listeners"]=[],e);const D=e[p+"_listeners"].length;return e[p+"_listeners"].push(I),D},e),q(se,e.removeListener=(p,I)=>{q(se,e[p+"_listeners"]=null,e)},e);function U(p,I){console.log("handling message",I),p.register_status==="registering"&&(p.register_status="registered",console.log("register messsage received",p)),e[p.protocol+"_listeners"].forEach(D=>{try{D&&D(p,I)}catch(r){console.error("Error calling listener",r)}})}async function P(p){if(e.connected){console.log("webtransport disconnected, handling...");try{delete e.wt,delete e.ws}catch(I){console.log("error deleting transport",I)}q(se,e.connected=!1,e),await j()}}async function j(){for(q($,o="reconnecting",o);;){console.log("reconnecting...");const p=await R();if(p==mt)console.log("reconnected, but failed registering. returning to login page..."),window.location.href="/";else if(p==pt){console.log("reconnected"),q($,o="room list",o);break}console.log(`reconnecting again in ${v} sec...`),await wt(v*1e3)}}async function c(){const p=`${w}/wt`,I=new WebTransport(p,{serverCertificateHashes:[{algorithm:"sha-256",value:bt(a)}]});if(I.closed.then(()=>{console.log("WebTransport closed",I),P()}).catch(X=>{console.error("WebTransport connection died:",X,I),P()}),console.log("webtransport connecting...",p),!await I.ready.then(()=>(console.log("WebTransport connected",I),!0)).catch(X=>(console.error("WebTransport connection failed:",X),!1)))return!1;const r={protocol:"wt",register_status:"unregistered",transport:I},_=r.transport.datagrams,W=_.writable.getWriter(),K=_.readable.getReader();r.send=X=>{W.write(X)},async function(){for(;;){const{value:X,done:Z}=await K.read();if(Z){console.log("Done reading datagram, stop reading...",value);return}U(r,Ze(X))}}().catch(X=>{console.error("reading datagram failed, stop reading...:",X)});const re=await I.createBidirectionalStream(),ne=re.writable.getWriter(),he=re.readable.getReader();return r.send_reliable=X=>{ne.write(X)},async function(){for(;;){const{value:X,done:Z}=await he.read();if(Z){console.log("Done reading stream, stop reading...",value);return}U(r,Ze(X))}}().catch(X=>{console.error("reading datagram failed, stop reading...:",X)}),q(se,e.wt=r,e),!0}async function J(){const p=`${T}/ws`,I=new WebSocket(p);if(console.log("websocket connecting...",p),!await new Promise((_,W)=>{I.onopen=()=>{console.log(I,"WebSocket connected"),_(!0)},I.onerror_message=K=>{console.error("WebSocket error:",K),W(K)}}).catch(_=>(console.error("WebSocket $connection failed:",_),!1)))return!1;const r={protocol:"ws",register_status:"unregistered",transport:I};return r.send_reliable=_=>{r.transport.send(_)},I.addEventListener("message",_=>{U(r,JSON.parse(_.data))}),I.addEventListener("close",_=>{_.wasClean?console.log("WebSocket closed",_):console.error("WebSocket $connection died",_)}),q(se,e.ws=r,e),!0}function G(){b=this.value,n(1,b)}function V(p){ke[p?"unshift":"push"](()=>{i=p,n(0,i)})}return[i,b,m,o,y,G,V]}class kt extends je{constructor(t){super(),Ne(this,t,yt,gt,Se,{})}}export{kt as component};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}