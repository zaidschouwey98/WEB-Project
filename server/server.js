import express from "express";
import { Server } from "socket.io";
import { createServer } from 'node:http';
import { SocketManager } from "./SocketManager.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000

app.use(express.static("public"));

new SocketManager(io);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});