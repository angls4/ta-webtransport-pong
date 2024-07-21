// @ts-nocheck
import { writable } from "svelte/store";

const _connection = {
  wt: null,
  ws: null,
  connected: false,
  wt_listeners: [],
  ws_listeners: [],
  addListener: () => {},
//   wt: new WebTransport(""),
//   ws: new WebSocket(""),
};  

const _user = {
    id: null,
    name: "",
    room:null,
    player:null
}
export const connection = writable(_connection);
export const user = writable(_user);
export const state = writable('idle');
