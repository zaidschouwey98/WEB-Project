import { DeleteFoodMessage, GameInitMessage, GameUpdateMessage, MessageCodec, NewFoodMessage, QuitPlayerMessage } from "../public/Message.js";
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
                this.io.emit('message', MessageCodec.encode(
                    new QuitPlayerMessage(socket.id)
                ));
                this.gameEngine.removePlayer(socket.id);
                console.log(`Deconnexion: ${socket.id}`);
            });
        });
    }
    handleMessage(socket, message) {
        switch(message.constructor.name) {
            case 'JoinGameMessage':
                let player = this.gameEngine.addPlayer(socket.id, message.data);
                socket.emit('message', MessageCodec.encode(new GameInitMessage(
                    {
                        playerId:player.id,
                        worldSize:{width:100,height:100},
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

    broadcastDiedPlayer(id) {
        this.io.emit('message', MessageCodec.encode(
            new QuitPlayerMessage(id)
        ));
    }

    broadcastGameState(state) {
        this.io.emit('message', MessageCodec.encode(
            new GameUpdateMessage({players:state.players})
        ));
    }
    
    addFood(food){
        this.io.emit('message', MessageCodec.encode(
            new NewFoodMessage(food)
        ));
    }

    removeFood(id){
        this.io.emit('message',MessageCodec.encode(
            new DeleteFoodMessage(id)
        ));
    }
}