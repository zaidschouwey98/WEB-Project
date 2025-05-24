const socket = io();

(async () =>
{
    // Create a new application
    const app = new PIXI.Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Create and add a container to the stage
    const container = new PIXI.Container();

    app.stage.addChild(container);

    const player = new PIXI.Graphics();
    player.beginFill(0x00ff00);
    player.drawCircle(0, 0, 30);
    player.endFill();
    player.x = app.screen.width / 2;
    player.y = app.screen.height / 2;
    
    container.addChild(player);
    
    app.ticker.add(() => {
        container.x += container.x +1;
    });
})();
