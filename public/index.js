import { GameClient } from "./GameClient.js";
import { SocketManager } from "./SocketManager.js";

const sm = new SocketManager();
const gc = new GameClient(sm);
console.log(gc);