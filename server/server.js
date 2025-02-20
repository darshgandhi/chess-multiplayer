import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});
 
const allUsers = {};

io.on("connection", (socket) => {

  if(allUsers[socket.id]) {
    allUsers[socket.id].online = true
  } else {
    allUsers[socket.id] = { socket: socket, online: true};
  }

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.name = data.name;

    const opponentUser = Object.values(allUsers).find(user => user.online && user.name !== currentUser.name);
    
    if(opponentUser) {
      const colors = ["w", "b"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      opponentUser.socket.emit("found_opponent", {opponentName: currentUser.name, color: color});
      currentUser.socket.emit("found_opponent", {opponentName: opponentUser.name, color: color === "w" ? "b" : "w"});
      currentUser.online = false;
      opponentUser.online = false;

      currentUser.socket.on("update_game", (data) => {
        console.log("Updating Socket")
        opponentUser.socket.emit("get_server_state", {localFen: data.localFen, score: data.score});
      });
      opponentUser.socket.on("update_game", (data) => {
        console.log("Updating Socket")
        currentUser.socket.emit("get_server_state", {localFen: data.localFen, score: data.score});
      });

    } else {
      currentUser.socket.emit("waiting_for_opponent");
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected User: ", socket.id)
    if (allUsers[socket.id]) {
      delete allUsers[socket.id]
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});