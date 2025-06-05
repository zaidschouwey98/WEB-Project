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

    updatePlayerDirection(id,direction){
        this.playerManager.updateDirection(id,direction);
    }

    gameLoop() {
        // const TICK_RATE = 30;
        // setInterval(() => {
        //     this.playerManager.updatePositions();
        //     //this.handleCollisions();
        //     this.emitGameState();
        // }, 1000 / TICK_RATE);
    }

    emitGameState() {
        const gameState = {
            players: this.playerManager.getAllPlayers(),
            foods: this.world.foods
        };
        this.socketManager.broadcastGameState(gameState);
    }
}