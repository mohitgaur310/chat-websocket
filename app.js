const express = require("express");
const app = express();
const port = 5001;
const path = require("path");
const server = app.listen(port, () => console.log("Server listing on ", port));
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", onConnected);
let socketConnection = new Set();
function onConnected(socket) {
  console.log("new user connected !!", socket.id);
  socketConnection.add(socket.id);
  io.emit("total_client", socketConnection.size);
  socket.on("disconnect", () => {
    socketConnection.delete(socket.id);
    io.emit("total_client", socketConnection.size);
  });

  socket.on("message", (data) => {
    console.log("🚀 ~ socket.on ~ data:", data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
