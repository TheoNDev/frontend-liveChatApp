import io from "socket.io-client";

const socket = io("https://backend-livechatapp-production.up.railway.app");

export default socket;
