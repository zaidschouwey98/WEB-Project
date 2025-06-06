export class Food {

  static nextFoodId = 1;
  static foodRadius = 5;

  constructor(position) {
    this.id = `food_${Food.nextFoodId++}`;
    this.position = position;
    this.color = Food.getRandomColor();
    this.radius = this.foodRadius;
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