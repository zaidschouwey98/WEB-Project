import { Player } from "../public/Player.js";
import { GameEngine } from "./GameEngine.js";

export class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  addPlayer(id, name) {
    const player = new Player(id, name,this.generatePlayerPosition(), {x:0, y:0}, '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'));
    this.players.set(id, player);
    return player;
  }

  removePlayer(id){
    this.players.delete(id);
  }

  updateDirection(id, direction) {
    const player = this.players.get(id);
    if (player) {
      player.direction = direction;
    }
  }

  generatePlayerPosition() {
    const x = Math.floor(Math.random() * GameEngine.WIDTH);
    const y = Math.floor(Math.random() * GameEngine.HEIGHT);
    for(let player of this.players.values()){
      let distanceX = player.position.x - x;
      let distanceY = player.position.y - y;
      let tmpdistance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
      if(tmpdistance < player.radius * 2){
        return this.generatePlayerPosition();
      }
    }
    console.log(`Generated position: (${x}, ${y})`);
    return { x, y };
  }

  getClosestPlayer(playerId){
    const player = this.players.get(playerId);
    let distance = Number.MAX_SAFE_INTEGER;
    let target;
    this.players.forEach((other)=>{
      if(other.id == playerId)
        return;
      let distanceX = player.position.x - other.position.x;
      let distanceY = player.position.y - other.position.y;
      let tmpdistance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
      if(tmpdistance < distance){
        distance = tmpdistance;
        target = other;
      }
        
    })
    return {
      other: target,
      distance: distance
    };
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