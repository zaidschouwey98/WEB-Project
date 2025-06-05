import { Player } from "../public/Player.js";

export class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  addPlayer(id, name, position) {
    const player = new Player(id, name,{x:0,y:0}, position);
    this.players.set(id, player);
  }

  updateDirection(id, direction) {
    const player = this.players.get(id);
    if (player) {
      player.direction = direction;
    }
  }

  updatePositions(world) {
    this.players.forEach(player => {
      player.move(world);
    });
  }

  getAllPlayers(){
    return this.players;
  }
}