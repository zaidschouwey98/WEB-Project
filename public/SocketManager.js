import { JoinGameMessage, MessageCodec, MoveMessage } from "./Message.js";



export class SocketManager {
  constructor() {
    this.socket = io();
    this.messageHandlers = new Map();
  }
  

  onConnect(callback) {
    this.socket.on('connect', callback);
  }


  onMessage(handler){
    this.socket.on('message',(data)=>{
        const msg = MessageCodec.decode(data);
    })
  }

  sendJoinGame(playerName) {
    const message = new JoinGameMessage(playerName);
    this.socket.emit('message', MessageCodec.encode(message));
  }

  sendMove(direction) {
    const message = new MoveMessage(direction);
    this.socket.emit('message', MessageCodec.encode(message));
  }
}