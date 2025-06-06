import { GameClient } from "./GameClient.js";
import { SocketManager } from "./SocketManager.js";



async function initGame() {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    antialias: true,
    autoStart: false,
    resizeTo:window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  });

  await app.init();

  document.body.appendChild(app.view);
  resizeApp(app);
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

document.addEventListener('DOMContentLoaded', initGame);