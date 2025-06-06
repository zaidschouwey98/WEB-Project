import { Vector2 } from "./Message.js";

export class Renderer {
    constructor(app) {
        this.app = app;
        this.camera = {
            position: new Vector2(0, 0),
            zoom: 2,
            targetZoom: 1
        };
        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);

        this.playerGraphics = new PIXI.Container();
        this.foodGraphics = new PIXI.Container();

        this.worldContainer.addChild(this.foodGraphics);
        this.worldContainer.addChild(this.playerGraphics);

        this.nameTexts = new Map();
    }

    initialize(worldSize) {
        this.worldSize = worldSize;
        this.updateView();
    }

    centerView(position) {
        this.camera.position.set(position.x, position.y);
        this.camera.targetZoom = 0.1; 
        this.updateView();
    }

    updateView() {
        // Update container position and scale
        this.worldContainer.x = this.app.screen.width / 2;
        this.worldContainer.y = this.app.screen.height / 2;

        this.worldContainer.scale.set(this.camera.zoom);
        this.worldContainer.pivot.set(
            this.camera.position.x,
            this.camera.position.y
        );
    }

    update(players, foods) {
        this.clearAll();
        this.renderFoods(foods);
        this.renderPlayers(players);

  
        this.updateView();
    }

    clearAll() {
        this.playerGraphics.removeChildren();
        this.foodGraphics.removeChildren();
        this.nameTexts.clear();
    }

    renderPlayers(players) {
        players.forEach(player => {
            const circle = new PIXI.Graphics();
            circle.beginFill(parseInt(player.color.substring(1), 16));
            circle.drawCircle(0, 0, player.radius);
            circle.endFill();
            circle.position.set(player.position.x, player.position.y);
            this.playerGraphics.addChild(circle);

            const nameText = new PIXI.Text(player.name, {
                fill: '#ffffff',
                fontSize: Math.min(20, player.radius),
                align: 'center',
                stroke: '#000000',
                strokeThickness: 1,
                resolution: 1
            });
            nameText.anchor.set(0.5);
            nameText.position.set(
                player.position.x,
                player.position.y + player.radius + 10
            );
            this.playerGraphics.addChild(nameText);
        });
    }

    renderFoods(foods) {
        foods.forEach((food, id) => {
            if (!food.position || !food.radius || !food.color) {
                console.warn('Food data malformed:', food);
                return;
            }
            const circle = new PIXI.Graphics();
            circle.beginFill(parseInt(food.color.substring(1), 16));
            circle.drawCircle(0, 0, food.radius);
            circle.endFill();
            circle.position.set(food.position.x, food.position.y);
            this.foodGraphics.addChild(circle);
        });
    }
}