import { Food } from "./Food.js";

export class GameWorld {
    constructor(width, height, maxFood) {
        this.width = width;
        this.height = height;
        this.maxFood = maxFood;
        this.foods = new Map();
        this.initializeWorld();
    }

    initializeWorld() {
        for (let i = 0; i < this.maxFood; i++) {
            this.spawnFood();
        }
    }
    getRandomPosition() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height
        };
    }

    getClosestFood(player) {
        let target;
        let distance = Number.MAX_SAFE_INTEGER;
        this.foods.forEach((food) => {
            const distanceX = player.position.x - food.position.x;
            const distanceY = player.position.y - food.position.y;
            const tmpdistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            if (tmpdistance < distance) {
                distance = tmpdistance;
                target = food;
            }
        })

        return {
            food: target,
            foodDistance: distance
        }
    }

    spawnFood() {
        let newFood = new Food(this.getRandomPosition(), 2);
        this.foods.set(newFood.id, newFood);
    }

    removeFood(foodId) {
        this.foods.delete(foodId);
        this.spawnFood();
    }
}