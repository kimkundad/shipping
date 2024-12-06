import { io } from "socket.io-client";

const socket = io("https://chat.loadmasterth.com/", {
    transports: ["websocket"],
});


export default socket;