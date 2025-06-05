
export class Player {
  constructor(id,name,position, direction) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.score = 0;
    this.speed = 2;
  }

  move(world){
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;

    this.position.x = Math.max(this.radius, Math.min(world.width - this.radius, this.position.x));
    this.position.y = Math.max(this.radius, Math.min(world.height - this.radius, this.position.y));
  }

  update(playerData){
    this.position = playerData.position;
    this.direction = playerData.direction;
    this.score = playerData.score;
    this.speed = playerData.speed;
  }

  getCenterPosition(){
    return this.position;
  }

  getTotalMass() {
    return this.score;
  }
}