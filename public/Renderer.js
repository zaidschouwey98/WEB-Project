import { Vector2 } from "./Message.js";

export class Renderer {
  constructor(app) {
    this.app = app;
    this.camera = {
      position: new Vector2(0, 0),
      zoom: 1,
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
    
    // Calculate zoom based on player size (if available)
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
    
    // Smooth zoom
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.1;
    this.updateView();
  }

  clearAll() {
    this.playerGraphics.removeChildren();
    this.foodGraphics.removeChildren();
    this.nameTexts.clear();
  }

  renderPlayers(players) {
    players.forEach(player => {
      player.cells.forEach(cell => {
        const circle = new PIXI.Graphics();
        circle.beginFill(parseInt(cell.color.substring(1), 16));
        circle.drawCircle(0, 0, cell.radius);
        circle.endFill();
        circle.position.set(cell.position.x, cell.position.y);
        
        this.playerGraphics.addChild(circle);
        
        // Add player name to the largest cell
        if (player.cells[0].id === cell.id) {
          const nameText = new PIXI.Text(player.name, {
            fill: '#ffffff',
            fontSize: Math.min(20, cell.radius / 2),
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
          });
          nameText.anchor.set(0.5);
          nameText.position.set(cell.position.x, cell.position.y + cell.radius + 10);
          this.playerGraphics.addChild(nameText);
        }
      });
    });
  }

  renderFoods(foods) {
    foods.forEach(food => {
      const circle = new PIXI.Graphics();
      circle.beginFill(parseInt(food.color.substring(1), 16));
      circle.drawCircle(0, 0, food.radius);
      circle.endFill();
      circle.position.set(food.position.x, food.position.y);
      this.foodGraphics.addChild(circle);
    });
  }

  onResize() {
    this.updateView();
  }
}