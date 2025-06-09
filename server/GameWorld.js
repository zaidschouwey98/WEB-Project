import { Food } from "../public/Food.js";

export class GameWorld {
    #width;
    #height;
    #maxFood;
    #foods;

    constructor(width, height, maxFood) {
        this.#width = width;
        this.#height = height;
        this.#maxFood = maxFood;
        this.#foods = new Map();
        this.initializeWorld();
    }

    get width(){
        return this.#width;
    }

    get height(){
        return this.#height;
    }

    get maxFood(){
        return this.#maxFood;
    }

    get foods(){
        return this.#foods;
    }

    initializeWorld() {
        for (let i = 0; i < this.#maxFood; i++) {
            this.spawnFood();
        }
    }
    getRandomPosition() {
        return {
            x: Math.random() * this.#width,
            y: Math.random() * this.#height
        };
    }

    getClosestFood(player) {
        let target;
        let distance = Number.MAX_SAFE_INTEGER;
        this.#foods.forEach((food) => {
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
        let newFood = new Food(this.getRandomPosition());
        this.#foods.set(newFood.id, newFood);
        return newFood;
    }

    removeFood(foodId) {
        this.#foods.delete(foodId);
    }
}