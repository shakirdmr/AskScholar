import { io } from "socket.io-client";

// Connect to your backend server (update the URL/port if needed)
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

export default socket;
