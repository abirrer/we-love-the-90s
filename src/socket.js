import * as io from "socket.io-client";
import { store } from "./start";
import { onlineUsers, userJoined, userLeft } from "./Actions";

let socket;

export function initSocket() {
    console.log("hello");

    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", id => {
            store.dispatch(userLeft(id));
        });
    }
}
