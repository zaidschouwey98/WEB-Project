
export class Player {
  constructor(id,name,position, direction, color, score = 10, radius = 10, speed = 2) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.color = color;
    this.score = score;
    this.speed = speed;
    this.radius = radius;
  }

  move(world){
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;

    this.position.x = Math.max(this.radius, Math.min(world.width - this.radius, this.position.x));
    this.position.y = Math.max(this.radius, Math.min(world.height - this.radius, this.position.y));
  }

  eat(otherMass){
    this.score += otherMass/75;
    this.radius = Math.abs(Math.sqrt((this.getMass() + otherMass) / Math.PI));
  }


  getMass(){
    return Math.pow(this.radius,2) * Math.PI;
  }

  update(playerData){
    this.position = playerData.position;
    this.direction = playerData.direction;
    this.score = playerData.score;
    this.speed = playerData.speed;
  }
  
  getTotalMass() {
    return this.score;
  }
}