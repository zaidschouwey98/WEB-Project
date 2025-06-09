import { DeleteFoodMessage, GameInitMessage, GameUpdateMessage, MessageCodec, NewFoodMessage, QuitPlayerMessage } from "../public/Message.js";
import { GameEngine } from "./GameEngine.js";

export class SocketManager{
    #io;
    #gameEngine;

    constructor(io) {
        this.#io = io;
        this.#gameEngine = new GameEngine(this);
        this.setupSocketHandlers();
    }

    get io(){
        return this.#io;
    }

    get gameEngine(){
        return this.#gameEngine;
    }

    setupSocketHandlers() {
        this.#io.on('connection', (socket) => {
            console.log(`Nouvelle connexion: ${socket.id}`);
            socket.on('message', (data) => {
                const message = MessageCodec.decode(data);
                this.handleMessage(socket, message);
            });

            socket.on('disconnect', () => {
                this.#io.emit('message', MessageCodec.encode(
                    new QuitPlayerMessage(socket.id)
                ));
                this.#gameEngine.removePlayer(socket.id);
                console.log(`Deconnexion: ${socket.id}`);
            });
        });
    }
    
    handleMessage(socket, message) {
        switch(message.constructor.name) {
            case 'JoinGameMessage':
                let playerId = this.#gameEngine.addPlayer(socket.id, message.data);
                socket.emit('message', MessageCodec.encode(new GameInitMessage(
                    {
                        playerId:playerId,
                        worldSize:{width:GameEngine.WIDTH,height:GameEngine.HEIGHT},
                        players: Array.from(this.#gameEngine.playerManager.players.values()),
                        foods: Array.from(this.#gameEngine.world.foods.values())
                    })
                ))
                break;
            case 'MoveMessage':
                this.#gameEngine.updatePlayerDirection(socket.id, message.getDirection());
                break;
        }
    }

    broadcastDiedPlayer(id) {
        this.#io.emit('message', MessageCodec.encode(
            new QuitPlayerMessage(id)
        ));
    }

    broadcastGameState(state) {
        this.#io.emit('message', MessageCodec.encode(
            new GameUpdateMessage({players:state.players})
        ));
    }
    
    addFood(food){
        this.#io.emit('message', MessageCodec.encode(
            new NewFoodMessage(food)
        ));
    }

    removeFood(id){
        this.#io.emit('message',MessageCodec.encode(
            new DeleteFoodMessage(id)
        ));
    }
}