import { Vector2 } from "./Message.js";

export class Renderer {
    constructor(app,player) {
        this.player = player;
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

        this.foodMap = new Map();
        this.playerMap = new Map();
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
        this.renderFoods(foods);
        this.renderPlayers(players);
        this.updateView();
    }

    renderPlayers(players) {
        const remainingIds = new Set();

        players.forEach(player => {
            remainingIds.add(player.id);

            let entry = this.playerMap.get(player.id);
            if (!entry) {
                const circle = new PIXI.Graphics();
                const nameText = new PIXI.Text(player.name, {
                    fill: '#ffffff',
                    fontSize: Math.min(20, player.radius),
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 1,
                    resolution: 1
                });
                nameText.anchor.set(0.5);

                this.playerGraphics.addChild(circle);
                this.playerGraphics.addChild(nameText);
                this.playerMap.set(player.id, { circle, nameText });
                entry = { circle, nameText };
            } else {
                entry.circle.clear();
                entry.nameText.text = player.name; // au cas où le nom change
            }

            entry.circle.beginFill(parseInt(player.color.substring(1), 16));
            entry.circle.drawCircle(0, 0, player.radius);
            entry.circle.endFill();
            entry.circle.position.set(player.position.x, player.position.y);

            entry.nameText.position.set(
                player.position.x,
                player.position.y + player.radius + 10
            );
            entry.nameText.style.fontSize = Math.min(20, player.radius);
        });

        // Supprimer les joueurs absents
        for (const [id, { circle, nameText }] of this.playerMap.entries()) {
            if (!remainingIds.has(id)) {
                circle.destroy();
                nameText.destroy();
                this.playerMap.delete(id);
            }
        }
    }

    renderFoods(foods) {
        const remainingIds = new Set();

        foods.forEach((food, id) => {
            remainingIds.add(id);

            let circle = this.foodMap.get(id);
            if (!circle) {
                circle = new PIXI.Graphics();
                this.foodGraphics.addChild(circle);
                this.foodMap.set(id, circle);
            } else {
                circle.clear();
            }

            circle.beginFill(parseInt(food.color.substring(1), 16));
            circle.drawCircle(0, 0, food.radius);
            circle.endFill();
            circle.position.set(food.position.x, food.position.y);
        });

        // Supprimer les foods obsolètes
        for (const [id, gfx] of this.foodMap.entries()) {
            if (!remainingIds.has(id)) {
                gfx.destroy();
                this.foodMap.delete(id);
            }
        }
    }
}