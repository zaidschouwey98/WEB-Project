
/**
 * Parent class for all messages used to communicate between server and client.
 */
export class Message {
  constructor(data) {
    this.data = data;
  }
}
// Classes de données de base
export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class CellData {
  constructor(id, position, radius, color) {
    this.id = id;
    this.position = position;
    this.radius = radius;
    this.color = color;
  }
}

export class PlayerData {
  constructor(id, name, cells, score) {
    this.id = id;
    this.name = name;
    this.cells = cells;
    this.score = score;
  }
}

// Messages du client vers le serveur
export class JoinGameMessage extends Message {
  constructor(name) {
    super({ name });
  }

  getPlayerName() {
    return this.data.name;
  }
}

export class MoveMessage extends Message {
  constructor(direction) {
    super({ direction });
  }

  getDirection() {
    return new Vector2(this.data.direction.x, this.data.direction.y);
  }
}

// Messages du serveur vers le client
export class GameInitMessage extends Message {
  constructor(playerId, worldSize, players, foods) {
    super({ playerId, worldSize, players, foods });
  }

  getPlayerId() {
    return this.data.playerId;
  }

  getWorldSize() {
    return this.data.worldSize;
  }

  getPlayers() {
    return this.data.players.map(p => new PlayerData(p.id, p.name, p.cells, p.score));
  }

  getFoods() {
    return this.data.foods.map(f => new CellData(f.id, f.position, f.radius, f.color));
  }
}

export class GameUpdateMessage extends Message {
  constructor(players, foods) {
    super({ players, foods });
  }

  getPlayers() {
    return this.data.players;
  }

  getFoods() {
    return this.data.foods;
  }
}

export class LeaderboardUpdateMessage extends Message {
  constructor(leaderboard) {
    super({ leaderboard });
  }

  getLeaderboard() {
    return this.data.leaderboard;
  }
}

export class PlayerDiedMessage extends Message {
  constructor() {
    super(null);
  }
}

export class MessageCodec {
  static types = {
    JoinGameMessage,
    MoveMessage,
    GameInitMessage,
    GameUpdateMessage,
    LeaderboardUpdateMessage,
    PlayerDiedMessage
  };

  /**
   * Encodes a message into a string in JSON format.
   */
  static encode(message) {
    const messageObj = {
      type: message.constructor.name,
      data: message.data
    };
    return messageObj;
  }

  /**
   * Decodes a message from a string in JSON format into an instance of the corresponding message class.
   * @param {String} string The string to be decoded.
   * @returns {Message} An instance of the corresponding message class.
   */
  static decode(parsed) {
    console.log(parsed)
    const messageType = MessageCodec.types[parsed.type];
    
    if (parsed.data === undefined || parsed.data === null) {
      return new messageType();
    }
    return new messageType(parsed.data);
  }
}