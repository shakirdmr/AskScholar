import React, { useEffect, useState } from "react";
import VideoChat from "./components/VideoChat";
import socket from "../socket/socketConnection.ts";

function App() {
  const [socketId, setSocketId] = useState<string>("");

  useEffect(() => {
    // Listen for connection and get your socket ID
    socket.on("connect", () => {
      setSocketId(socket.id ?? "");
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <VideoChat />
      <div className="mt-4 p-2 bg-white rounded shadow">
        <span className="font-mono text-xs text-gray-700">
          Your Socket ID: {socketId || "Connecting..."}
        </span>
      </div>
    </div>
  );
}

export default App;