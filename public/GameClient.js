import { Renderer } from "./Renderer.js";

export class GameClient{
    constructor(socketManager){
        this.socket = socketManager;
        this.players = new Map();
        this.foods = new Map();
        this.initNetwork();
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xf0f0f0,
            antialias: true
        });
        this.renderer = new Renderer(this.app);

        this.initControls();
    }

    initNetwork() {
        this.socket.onConnect(() => {
            this.socket.sendJoinGame(prompt('Enter your name:') || 'No-name');
        });

        this.socket.onMessage('GameInitMessage', (message) => {
            this.handleGameInit(message);
        });

        this.socket.onMessage('GameUpdateMessage', (message) => {
            this.handleGameUpdate(message);
        });
    }

    handleGameInit(message) {
        this.myPlayerId = message.getPlayerId();
        this.worldSize = message.getWorldSize();
        
        message.getPlayers().forEach(playerData => {
            this.players.set(playerData.id, new Player(playerData));
        });
        
        // Initialize foods
        message.getFoods().forEach(food => {
            this.foods.set(food.id, food);
        });
        
        this.renderer.initialize(this.worldSize);
        this.centerViewOnPlayer();
    }


    initControls(){
    
        this.renderer.update(
            Array.from(this.players.values()),
            Array.from(this.foods.values()),
        );
       
    }
}