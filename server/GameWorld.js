import { Food } from "./Food.js";

export class GameWorld{
    constructor(width, height, maxFood) {
        this.width = width;
        this.height = height;
        this.maxFood = maxFood;
        this.foods = new Map();
    }

    initializeWorld() {
        for (let i = 0; i < this.spawnFood; i++) {
            this.spawnFood();
        }
    }
    getRandomPosition() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height
        };
    }

    spawnFood(){
        let newFood = new Food(this.getRandomPosition(),2);
        this.foods.set(newFood.id, newFood);
    }

    removeFood(foodId){
        this.foods.delete(foodId);
    }
}