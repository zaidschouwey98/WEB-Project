export class GameClient{
    constructor(socketManager){
        this.socket = socketManager;
        this.players = new Map();
        this.foods = new Map();
        this.initNetwork();
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
}