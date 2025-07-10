// File: frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import VideoChat from "./components/VideoChat";
import CallControls from "./components/callControls";
import socket from "../socket/socketConnection.ts";
import { Toaster,toast } from "react-hot-toast";

function App() {
  const [socketId, setSocketId] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id ?? "");
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  // Copy to clipboard handler
  const handleCopyId = () => {
    if (socketId) {
      navigator.clipboard.writeText(socketId);
      toast.success("Socket ID copied!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-2">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-4 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-indigo-700 mb-2 text-center">React Video Call 🚀</h1>
        <CallControls myId={socketId} />
        <button
          className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition text-xs font-mono"
          onClick={handleCopyId}
          disabled={!socketId}
        >

          {socketId} 
          {socketId ? ` | Copy My Socket ID` : "Connecting..."}
        </button>
      </div>
    </div>
  );
}

export default App;