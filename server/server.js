import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import { setupSocketEvents } from "./sockets/chessSockets.js";

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://chess-multiplayer.pages.dev/",
  methods: ["GET", "POST"],
};

const corsOptions = {
  origin: "http://localhost:5174/",
  methods: ["GET", "POST"],
};*/

const app = express();
const httpServer = createServer(app);

app.use(cors(corsOptions));
const io = new Server(httpServer, { cors: corsOptions });

setupSocketEvents(io);

app.get("/", (req, res) => {
  res.send("GET request to the homepage");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
