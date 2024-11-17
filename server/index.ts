import http from 'http';
import { Server } from "socket.io"

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomId = 'public';

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // socket.on("join_room", (roomId) => {
  socket.join(roomId);
  console.log(`user with id-${socket.id} joined room - ${roomId}`);
  // });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    // This will send a message to all clients in the room, including the sender
    io.to(roomId).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
