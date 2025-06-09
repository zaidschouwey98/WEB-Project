import { JoinGameMessage, Message, MessageCodec, MoveMessage } from "./Message.js";



export class SocketManager {
  #socket;
  constructor() {
    this.#socket = io();
  }

  get socket(){
    return this.#socket;
  }

  onConnect(callback) {
    this.#socket.on('connect', callback);
  }

  onMessage(messageType, handler) {
    this.#socket.on('message', (data) => {
      const message = MessageCodec.decode(data);
      if (message.constructor.name === messageType) {
        handler(message);
      }
    });
  }

  sendJoinGame(playerName) {
    const message = new JoinGameMessage(playerName);
    this.#socket.emit('message', MessageCodec.encode(message));
  }

  sendMove(direction) {
    const message = new MoveMessage(direction);
    this.#socket.emit('message', MessageCodec.encode(message));
  }
}