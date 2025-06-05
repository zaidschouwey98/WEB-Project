import { Player } from "../public/Player.js";
import { GameWorld } from "./GameWorld.js";
import { PlayerManager } from "./PlayerManager.js";

export class GameEngine{
    constructor(socketManager){
        this.world = new GameWorld(5000, 5000);
        this.playerManager = new PlayerManager();
        this.socketManager = socketManager;
        this.gameLoop();
    }

    addPlayer(id,name){
        this.playerManager.addPlayer(id,name,{x:0, y:0});
    }

    removePlayer(id){
        
    }

    gameLoop() {
        const TICK_RATE = 30;
        setInterval(() => {
            this.playerManager.updateDirection();
            //this.handleCollisions();
            this.emitGameState();
        }, 1000 / TICK_RATE);
    }

    emitGameState() {
        const gameState = {
            players: this.players.getAllPlayers(),
            foods: this.world.foods,
        };
        this.socketManager.broadcastGameState(gameState);
    }
}