
export class Player {
  constructor(id,name,position, direction) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.score = 0;
  }


  getTotalMass() {
    return this.score;
  }
}