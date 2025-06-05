import { Player } from "./Player.js";
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
        for(let key of Object.keys(message.data.players)){
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
   

        // Remove disconnected players
        // const currentPlayerIds = message.getPlayers().map(p => p.id);
        // Array.from(this.players.keys()).forEach(id => {
        //     if (!currentPlayerIds.includes(id) && id !== this.myPlayerId) {
        //         this.players.delete(id);
        //     }
        // });
        
        // Update foods
        this.foods.clear();
        for(let key of Object.keys(message.data.foods)){
            let food = message.data.foods[key]
            this.foods.set(food.id, food);
        }
        
        this.centerViewOnPlayer();
    }
    centerViewOnPlayer() {
        if (this.myPlayerId && this.players.has(this.myPlayerId)) {
            const myPlayer = this.players.get(this.myPlayerId);
            this.renderer.centerView(myPlayer.getCenterPosition());
        }
    }
    initControls(){
    
        const mouseDirection = new PIXI.Point(0, 0);
    const keyboardDirection = new PIXI.Point(0, 0);
    const targetDirection = new PIXI.Point(0, 0);
    
    // Mouse controls
    this.app.stage.interactive = true;
    this.app.stage.on('pointermove', (event) => {
      const mousePos = event.data.global;
      const center = new PIXI.Point(this.app.screen.width / 2, this.app.screen.height / 2);
      mouseDirection.set(mousePos.x - center.x, mousePos.y - center.y);
      mouseDirection.normalize();
    });
    
    // Keyboard controls
    const keys = {};
    window.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      updateKeyboardDirection();
    });
    
    window.addEventListener('keyup', (e) => {
      keys[e.key] = false;
      updateKeyboardDirection();
    });
    
    function updateKeyboardDirection() {
      keyboardDirection.set(0, 0);
      if (keys['ArrowUp'] || keys['w']) keyboardDirection.y -= 1;
      if (keys['ArrowDown'] || keys['s']) keyboardDirection.y += 1;
      if (keys['ArrowLeft'] || keys['a']) keyboardDirection.x -= 1;
      if (keys['ArrowRight'] || keys['d']) keyboardDirection.x += 1;
      keyboardDirection.normalize();
    }
    
    // Game loop
    this.app.ticker.add((delta) => {
      // Combine mouse and keyboard input
      targetDirection.set(
        mouseDirection.x + keyboardDirection.x,
        mouseDirection.y + keyboardDirection.y
      );
      
      if (targetDirection.x !== 0 || targetDirection.y !== 0) {
        targetDirection.normalize();
        this.socket.sendMove(targetDirection);
      }
      
      // Update renderer
      this.renderer.update(
        Array.from(this.players.values()),
        Array.from(this.foods.values()),
      );
    });
    
    // Split cell on space
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.socket.sendSplit();
      }
    });
       
    }
}