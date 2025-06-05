import { GameInitMessage, GameUpdateMessage, MessageCodec } from "../public/Message.js";
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
                let player = this.gameEngine.addPlayer(socket.id, message.data);
                console.log(new GameInitMessage(player.id,{width:this.gameEngine.world.width,height:this.gameEngine.world.height} ,this.gameEngine.playerManager.getAllPlayers(), this.gameEngine.world.foods))
                socket.emit('message', MessageCodec.encode(new GameInitMessage(
                    {
                        playerId:player.id,
                        worldSize:{width:this.gameEngine.world.width,height:this.gameEngine.world.height},
                        players:Object.fromEntries(this.gameEngine.playerManager.getAllPlayers()),
                        foods:Object.fromEntries(this.gameEngine.world.foods)
                    })
                ))
                break;
            case 'MoveMessage':
                this.gameEngine.updatePlayerDirection(socket.id, message.getDirection());
                break;
        }
    }

    broadcastGameState(state) {
        this.io.emit('message', MessageCodec.encode(
            new GameUpdateMessage({players:Object.fromEntries(state.players), foods:Object.fromEntries(state.foods)})
        ));
    }
}