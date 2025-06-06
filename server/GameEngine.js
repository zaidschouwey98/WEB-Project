import { GameWorld } from "./GameWorld.js";
import { PlayerManager } from "./PlayerManager.js";

export class GameEngine{
    constructor(socketManager){
        this.world = new GameWorld(5000, 5000,10000);
        this.playerManager = new PlayerManager();
        this.socketManager = socketManager;
        this.gameLoop();
    }

    addPlayer(id,name){
        return this.playerManager.addPlayer(id,name,{x:0, y:0});
    }

    removePlayer(id){
        this.playerManager.removePlayer(id);
    }

    updatePlayerDirection(id,direction){
        this.playerManager.updateDirection(id,direction);
    }

    gameLoop() {
        const TICK_RATE = 30;
        setInterval(() => {
            this.playerManager.updatePositions(this.world);
            this.handleCollisions();
            this.emitGameState();
        }, 1000 / TICK_RATE);
    }

    handleCollisions(){
        this.playerManager.players.forEach((player)=>{
            let {other, distance} = this.playerManager.getClosestPlayer(player.id);
           
            if(other != undefined && player.radius > other.radius + other.radius / 10)
                if(distance < player.radius / 4){
                    // Eat
                    player.eat(other.getMass());
                    this.playerManager.removePlayer(other.id);
                }

            let {food,foodDistance} = this.world.getClosestFood(player);
            if(foodDistance < player.radius - 2)
            {
                // eat
                player.eat(75);
                this.world.removeFood(food.id);
                let newFood = this.world.spawnFood();
                this.socketManager.addFood(newFood)
                this.socketManager.removeFood(food.id);
            }
        })
    }



    emitGameState() {
        const gameState = {
            players: this.playerManager.getAllPlayers(),
            foods: this.world.foods
        };
        this.socketManager.broadcastGameState(gameState);
    }
}