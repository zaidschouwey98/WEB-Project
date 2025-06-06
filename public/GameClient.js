import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";

export class GameClient {
    constructor(socketManager, app) {
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
            // this.socket.sendJoinGame(prompt('Enter your name:') || 'No-name');
            this.socket.sendJoinGame("player1");

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

        for (let key of Object.keys(message.data.players)) {
            let playerData = message.data.players[key];
            if (this.players.has(playerData.id)) {
                this.players.get(playerData.id).update(playerData);
            } else {
                this.players.set(playerData.id, new Player(playerData.id,
                    playerData.name,
                    playerData.position,
                    playerData.direction,
                    playerData.color
                ));
            }
        }


        // Initialize foods
        const foodsData = message.data.foods;
        for (let foodId in foodsData) {
            if (foodsData.hasOwnProperty(foodId)) {
                this.foods.set(foodId, foodsData[foodId]);
            }
        }

        this.renderer.initialize(this.worldSize);
        this.centerViewOnPlayer();
        this.gameStarted = true;
    }


    handleGameUpdate(message) {
        if (!this.gameStarted)
            return;
        // Update players
        for (let key of Object.keys(message.data.players)) {
            let playerData = message.data.players[key];
            if (this.players.has(playerData.id)) {
                this.players.get(playerData.id).update(playerData);
            } else {
                this.players.set(playerData.id, new Player(playerData.id,
                    playerData.name,
                    playerData.position,
                    playerData.direction,
                    playerData.color
                ));
            }
        }
        const serverFoods = message.data.foods;
        Array.from(this.foods.keys()).forEach(id => {
            if (!serverFoods[id]) this.foods.delete(id);
        });
        const foodsData = message.data.foods;
        for (let foodId in foodsData) {
            if (foodsData.hasOwnProperty(foodId)) {
                this.foods.set(foodId, foodsData[foodId]);
            }
        }
    }
    centerViewOnPlayer() {
        if (this.myPlayerId && this.players.has(this.myPlayerId)) {
            const myPlayer = this.players.get(this.myPlayerId);
            console.log("Position joueur:", myPlayer.position.x, myPlayer.position.y); // Debug

            this.renderer.centerView(myPlayer.getCenterPosition());
        }
    }
    initControls() {
        const mouseDirection = new PIXI.Point(0, 0);

        this.app.stage.interactive = true;
        this.app.stage.hitArea = new PIXI.Rectangle(0, 0, this.app.screen.width, this.app.screen.height);

        this.app.stage.on('pointermove', (event) => {

            const mousePos = event.global;
            const center = new PIXI.Point(this.app.screen.width / 2, this.app.screen.height / 2);

            // Calcule la direction souris (vecteur normalisé)
            mouseDirection.set(mousePos.x - center.x, mousePos.y - center.y);

            // Normalisation manuelle (car PIXI.Point n'a pas .normalize())
            const length = Math.sqrt(mouseDirection.x ** 2 + mouseDirection.y ** 2);
            if (length > 0) {
                mouseDirection.x /= length;
                mouseDirection.y /= length;
            }
        });

        // Game loop (envoi de la direction souris)
        this.app.ticker.add((delta) => {
            if (mouseDirection.x !== 0 || mouseDirection.y !== 0) {
                this.socket.sendMove(mouseDirection);
            }
            this.centerViewOnPlayer();
            this.renderer.update(
                Array.from(this.players.values()),
                Array.from(this.foods.values())
            );
        });
    }
}