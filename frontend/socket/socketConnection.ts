import { io } from "socket.io-client";

// Connect to your backend server (update the URL/port if needed)
const socket = io("http://localhost:3000");

export default socket;