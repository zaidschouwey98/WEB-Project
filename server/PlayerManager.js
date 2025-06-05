import { Player } from "../public/Player";

export class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  addPlayer(id, name, position) {
    const player = new Player(id, name, position);
    this.players.set(id, player);
    return player;
  }

  updateDirection(id, direction) {
    this.players.map((p)=>{
        
    })
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
}