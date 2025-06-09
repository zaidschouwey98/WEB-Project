export class Food {

  static nextFoodId = 1;
  static foodRadius = 5;
  static eatingGain = 75;

  constructor(position, color = Food.getRandomColor(), radius = this.foodRadius,id = undefined) {
    this.id = id ? id :`food_${Food.nextFoodId++}`;
    this.position = position;
    this.color = color;
    this.radius = radius;
  }

  static getRandomColor() {
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
      '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}