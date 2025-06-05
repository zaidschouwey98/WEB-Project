import { Renderer } from "./Renderer.js";

export class GameClient{
    constructor(socketManager,app){
        this.socket = socketManager;
        this.players = new Map();
        this.foods = new Map();
        this.initNetwork();
        this.app = app;
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

    handleGameUpdate(message) {
        // Update players
        message.data.players.forEach(playerData => {
            if (this.players.has(playerData.id)) {
                this.players.get(playerData.id).update(playerData);
            } else {
                this.players.set(playerData.id, new Player(playerData));
            }
        });
        
        // Remove disconnected players
        const currentPlayerIds = message.getPlayers().map(p => p.id);
        Array.from(this.players.keys()).forEach(id => {
            if (!currentPlayerIds.includes(id) && id !== this.myPlayerId) {
                this.players.delete(id);
            }
        });
        
        // Update foods
        this.foods.clear();
        message.getFoods().forEach(food => {
        this.foods.set(food.id, food);
        });
        
        
        this.centerViewOnPlayer();
    }
    centerViewOnPlayer() {
        if (this.myPlayerId && this.players.has(this.myPlayerId)) {
            const myPlayer = this.players.get(this.myPlayerId);
            this.renderer.centerView(myPlayer.getCenterPosition());
        }
    }
    initControls(){
    
        this.renderer.update(
            Array.from(this.players.values()),
            Array.from(this.foods.values()),
        );
       
    }
}