import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost; 5173",
  },
});

io.listen(3001);

io.on("connection", (socket) => {
  console.log("user connected");

  socket.emit("Hello~👋🏻");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
