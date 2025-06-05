import { MessageCodec } from "../public/Message.js";
import { GameEngine } from "./GameEngine.js";

export class SocketManager{
    constructor(io) {
        this.io = io;
        this.gameEngine = new GameEngine(this);
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`Nouvelle connexion: ${socket.id}`);

            socket.on('message', (data) => {
                const message = MessageCodec.decode(data);
                this.handleMessage(socket, message);
            });

            socket.on('disconnect', () => {
                this.gameEngine.removePlayer(socket.id);
                console.log(`Deconnexion: ${socket.id}`);
            });
        });
    }
    handleMessage(socket, message) {
        switch(message.constructor.name) {
            case 'JoinGameMessage':
                this.gameEngine.addPlayer(socket.id, message.getPlayerName());
                break;
            case 'MoveMessage':
                this.gameEngine.updatePlayerDirection(socket.id, message.getDirection());
                break;
        }
    }

    broadcastGameState(state) {
        this.io.emit('message', MessageCodec.encode(
            new GameUpdateMessage(state.players, state.foods, state.viruses)
        ));
    }
}