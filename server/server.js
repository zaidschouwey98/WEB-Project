import express from "express";
import { Server } from "socket.io";
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000

app.use(express.static("public"));

console.log("starting server");

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});