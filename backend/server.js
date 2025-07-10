import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {

  console.log(`\n\n User connected: ${socket.id}`);

  // When a user joins, they get a unique socket.id
  socket.on("call-user", (data) => {
    // Forward the offer to the target user
    io.to(data.to).emit("call-made", {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on("make-answer", (data) => {
    // Forward the answer to the caller
    io.to(data.to).emit("answer-made", {
      answer: data.answer,
      from: socket.id
    });
  });

  // Let users know about new connections
  socket.on("disconnect", () => {});
});

console.log("Signaling server running on port 3000");