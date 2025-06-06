import { GameClient } from "./GameClient.js";
import { SocketManager } from "./SocketManager.js";

// Create a PixiJS application.
const app = new PIXI.Application();

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();
    await initGame();
})();

async function setup()
{
    await app.init({ background: '#000000', resizeTo: window });
    document.body.appendChild(app.view);
}

async function preload() {
  // Load assets here if needed
  // For example: await app.loader.add('path/to/asset.png').load();
  console.log("Assets preloaded");
}


async function initGame() {
  window.addEventListener('resize', () => resizeApp(app));
  let sm = new SocketManager();
  const gameClient = new GameClient(sm,app);
  app.ticker.start(); // Game loop
}

function resizeApp(app) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const resolution = window.devicePixelRatio || 1;

  app.renderer.resolution = resolution;
  app.renderer.resize(width, height);
}