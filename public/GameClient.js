import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";

export class GameClient {
    constructor(socketManager, app, username = "Player") {
        this.username = username;
        this.socket = socketManager;
        this.players = new Map();
        this.foods = new Map();
        this.initNetwork();
        this.app = app;
        this.renderer = new Renderer(this.app);
        this.gameStarted = false;
        this.initControls();
    }

    initNetwork() {
        this.socket.onConnect(() => {
            this.socket.sendJoinGame(this.username);
        });

        this.socket.onMessage('GameInitMessage', (message) => {
            this.handleGameInit(message);
        });
        this.socket.onMessage('GameUpdateMessage', (message) => {
            this.handleGameUpdate(message);
        });

        this.socket.onMessage('NewFoodMessage',(message)=>{
            this.handleNewFood(message);
        });

        this.socket.onMessage('DeleteFoodMessage',(message)=>{
            this.handleRemoveFood(message);
        });

        this.socket.onMessage('QuitPlayerMessage', (message) => {
            this.handleQuitPlayer(message);
        });
            
    }

    handleQuitPlayer(message) {
        const playerId = message.data;
        if (this.players.has(playerId)) {
            this.renderer.deletePlayer(playerId);
            this.players.delete(playerId);
        }
    }
    /**
     * 
     * @param {NewFoodMessage} message 
     */
    handleNewFood(message){
        let food = message.data;
        this.foods.set(food.id,food);
        this.renderer.addFood(food);
    }
    
    handleRemoveFood(message){
        this.foods.delete(message.data);
        this.renderer.deleteFood(message.data);
    }

    handleGameInit(message) {
        this.worldSize = message.getWorldSize();

        for (let key of Object.keys(message.data.players)) {
            let playerData = message.data.players[key];
            this.players.set(playerData.id, new Player(playerData.id,
                playerData.name,
                playerData.position,
                playerData.direction,
                playerData.color
            ));
            this.renderer.addPlayer(this.players.get(playerData.id));
        }

        this.myPlayer = this.players.get(message.getPlayerId());
        this.renderer.setCurrentPlayerId(message.getPlayerId());
        // Initialize foods
        const foodsData = message.data.foods;
        for (let foodId in foodsData) {
            if (foodsData.hasOwnProperty(foodId)) {
                this.foods.set(foodsData[foodId].id, foodsData[foodId]);  
                this.renderer.addFood(foodsData[foodId]);
            }
        }

        this.renderer.initialize(this.worldSize);
        this.centerViewOnPlayer();
        this.gameStarted = true;
    }


    handleGameUpdate(message) {
        if (!this.gameStarted) return;
        // Update players
        this.players.clear();
        for (let playerData of message.data.players){
            this.players.set(playerData.id, new Player(playerData.id,
                playerData.name,
                playerData.position,
                playerData.direction,
                playerData.color,
                playerData.score,
                playerData.radius,
                playerData.speed
            ));
        }
        if(this.players.has(this.myPlayer.id)) {
            this.myPlayer = this.players.get(this.myPlayer.id);
        }
        this.renderer.update(this.players);
    }
    centerViewOnPlayer() {
        if(this.myPlayer != undefined)
            this.renderer.centerView(this.myPlayer.getCenterPosition());
    }
    initControls() {
        const mouseDirection = new PIXI.Point(0, 0);

        this.app.stage.interactive = true;
        this.app.stage.hitArea = new PIXI.Rectangle(0, 0, this.app.screen.width, this.app.screen.height);

        this.app.stage.on('pointermove', (event) => {

            const mousePos = event.global;
            const center = new PIXI.Point(this.app.screen.width / 2, this.app.screen.height / 2);

            mouseDirection.set(mousePos.x - center.x, mousePos.y - center.y);
            const length = Math.sqrt(mouseDirection.x ** 2 + mouseDirection.y ** 2);
            if (length > 0) {
                mouseDirection.x /= length;
                mouseDirection.y /= length;
            }
        });
        // Game loop
        this.app.ticker.add((delta) => {
            if (mouseDirection.x !== 0 || mouseDirection.y !== 0) {
                this.socket.sendMove(mouseDirection);
            }
            this.centerViewOnPlayer();
        });
    }
}