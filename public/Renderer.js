import { Vector2 } from "./Message.js";

export class Renderer {

    constructor(app) {
        this.app = app;
        this.camera = {
            position: new Vector2(0, 0),
            zoom: 1,
        };

        this.particleTexture = this.createFoodTexture('#FFFFFF');

        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);

        this.playerGraphics = new PIXI.Container();
        this.foodGraphics = new PIXI.Container();

        this.worldContainer.addChild(this.foodGraphics);
        this.worldContainer.addChild(this.playerGraphics);

        this.foodMap = new Map();
        this.playerMap = new Map();
    }

    initialize(worldSize) {
        this.worldSize = worldSize;
        this.updateView();
    }

    setCurrentPlayerId(playerId){
        this.playerId = playerId;
    }

    centerView(position) {
        this.camera.position.set(position.x, position.y);
        const margin = 1.5;
        const baseArea = 0.5;
        const minViewportDimension = Math.min(window.innerWidth,window.innerHeight);
        const requiredZoom = this.player ? baseArea + margin * this.player.radius * 2 / minViewportDimension : 1;
        this.camera.zoom = 1 / requiredZoom;
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

    createFoodTexture(color){
        const gfx = new PIXI.Graphics();
        gfx.beginFill(color);
        gfx.drawCircle(0, 0, 5);
        gfx.endFill();
        return this.app.renderer.generateTexture(gfx);
    }

    update(players) {
        this.updatePlayers(players);
        this.updateView();
        this.player = players.get(this.playerId);
    }

    addFood(food) {
        const foodSprite = new PIXI.Sprite(this.particleTexture);
        foodSprite.anchor.set(0.5);
        foodSprite.tint = food.color;
        this.foodGraphics.addChild(foodSprite);
        this.foodMap.set(food.id, foodSprite);
        foodSprite.position.set(food.position.x, food.position.y);
    }

    addPlayer(player) {
        const circle = new PIXI.Graphics();
        const nameText = new PIXI.Text(player.name, {
            fill: '#ffffff',
            fontSize: Math.min(20, player.radius),
            align: 'center',
            stroke: '#000000',
            strokeThickness: 1,
            resolution: 1
        });
        nameText.anchor.set(0.5)
        this.playerGraphics.addChild(circle);
        this.playerGraphics.addChild(nameText);
        this.playerMap.set(player.id, { circle, nameText });
        circle.beginFill(player.color);
        circle.drawCircle(0, 0, player.radius);
        circle.endFill();
        circle.position.set(player.position.x, player.position.y);
        nameText.position.set(
            player.position.x,
            player.position.y
        );
        nameText.style.fontSize = Math.min(20, player.radius);
    }

    deletePlayer(playerId) {
        const entry = this.playerMap.get(playerId);
        if (entry) {
            this.playerGraphics.removeChild(entry.circle);
            this.playerGraphics.removeChild(entry.nameText);
            entry.circle.destroy(); 
            entry.nameText.destroy();
            this.playerMap.delete(playerId);
        }
    }

    deleteFood(foodId) {
        const sprite = this.foodMap.get(foodId);
        if (sprite) {
            this.foodGraphics.removeChild(sprite);
            sprite.destroy();
            this.foodMap.delete(foodId);
        }
    }

    updatePlayers(players) {
        players.forEach(player => {
            const entry = this.playerMap.get(player.id);
            if (!entry) {
                this.addPlayer(player);
                return;
            }
            entry.circle.clear();
            entry.circle.beginFill(player.color);
            entry.circle.drawCircle(0, 0, player.radius);
            entry.circle.endFill();
            entry.circle.position.set(player.position.x, player.position.y);
            entry.nameText.position.set(
                player.position.x,
                player.position.y
            );

            entry.nameText.style.fontSize = Math.max(20, player.radius/5);
        });
    }

}