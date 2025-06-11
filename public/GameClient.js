import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";

export class GameClient {
    #username;
    #socket;
    #players;
    #foods;
    #app;
    #chart;
    #renderer;
    #gameStarted;
    #playerId;
    #worldSize;

    constructor(socketManager, app, username = "Player",chart) {
        this.#username = username;
        this.#socket = socketManager;
        this.#players = new Map();
        this.#foods = new Map();
        this.initNetwork();
        this.#app = app;
        this.#chart = chart;
        this.#renderer = new Renderer(app);
        this.#gameStarted = false;
        this.initControls();
        this.initChartUpdate();
    }

    get username(){
        return this.#username;
    }

    get socket(){
        return this.#socket;
    }

    get players(){
        return this.#players;
    }
    
    get playerId(){
        return this.#playerId;
    }

    get worldSize(){
        return this.#worldSize;
    }

    initChartUpdate() {
        setInterval(() => {
            const now = new Date().toLocaleTimeString();
            if(this.#playerId){
                const value = this.#players.get(this.#playerId).score;    
                //Limit to last 40 points
                if (this.#chart.data.labels.length >= 20) {
                  this.#chart.data.labels.shift();
                  this.#chart.data.datasets[0].data.shift();
                }
            
                this.#chart.data.labels.push(now);
                this.#chart.data.datasets[0].data.push(value);
                this.#chart.update();
            }
        }, 5000);
    }

    initNetwork() {
        this.#socket.onConnect(() => {
            this.#socket.sendJoinGame(this.#username);
        });

        this.#socket.onMessage('GameInitMessage', (message) => {
            this.handleGameInit(message);
        });
        this.#socket.onMessage('GameUpdateMessage', (message) => {
            this.handleGameUpdate(message);
        });

        this.#socket.onMessage('NewFoodMessage',(message)=>{
            this.handleNewFood(message);
        });

        this.#socket.onMessage('DeleteFoodMessage',(message)=>{
            this.handleRemoveFood(message);
        });

        this.#socket.onMessage('QuitPlayerMessage', (message) => {
            this.handleQuitPlayer(message);
        });
            
    }

    handleQuitPlayer(message) {
        const playerId = message.data;
        if (this.#players.has(playerId)) {
            this.#renderer.deletePlayer(playerId);
            this.#players.delete(playerId);
        }
    }

    handleNewFood(message){
        let food = message.data;
        this.#foods.set(food.id,food);
        this.#renderer.addFood(food);
    }
    
    handleRemoveFood(message){
        this.#foods.delete(message.data);
        this.#renderer.deleteFood(message.data);
    }

    handleGameInit(message) {
        this.#worldSize = message.getWorldSize();
        for (let playerData of message.getPlayers()){
            this.#players.set(playerData.id, playerData);
            this.#renderer.addPlayer(this.#players.get(playerData.id));
        }

        this.#playerId = message.getPlayerId();
        this.#renderer.setCurrentPlayerId(this.#playerId);
        // Initialize foods
        for (let food of message.getFoods()) {
            this.#foods.set(food.id, food);  
            this.#renderer.addFood(food);
        }

        this.#renderer.initialize(this.#worldSize);
        this.centerViewOnPlayer();
        this.#gameStarted = true;
    }


    handleGameUpdate(message) {
        if (!this.#gameStarted) return;
        // Update players
        for (let playerData of message.getPlayers()){
            this.#players.set(playerData.id, playerData);
        }
        this.#renderer.update(this.#players);
    }

    centerViewOnPlayer() {
        if(this.#playerId != undefined)
            this.#renderer.centerView(this.#players.get(this.#playerId).position)
    }

    initControls() {
        const mouseDirection = new PIXI.Point(0, 0);

        this.#app.stage.interactive = true;
        this.#app.stage.hitArea = new PIXI.Rectangle(0, 0, this.#app.screen.width, this.#app.screen.height);
            
        this.#app.stage.on('mousemove', (event) => {
            const mousePos = event.global;  
            const center = new PIXI.Point(this.#app.screen.width / 2, this.#app.screen.height / 2);

            mouseDirection.set(mousePos.x - center.x, mousePos.y - center.y);
            const length = Math.sqrt(mouseDirection.x ** 2 + mouseDirection.y ** 2);
            if (length > 0) {
                mouseDirection.x /= length;
                mouseDirection.y /= length;
            }
        });
        // Game loop
        this.#app.ticker.add((delta) => {
            if (mouseDirection.x !== 0 || mouseDirection.y !== 0) {
                this.#socket.sendMove(mouseDirection);
            }
            this.centerViewOnPlayer();
        });
    }
}