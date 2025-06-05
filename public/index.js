import { GameClient } from "./GameClient.js";
import { SocketManager } from "./SocketManager.js";



async function initGame() {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xFFFFFF,
    antialias: true,
    autoStart: false // On démarre manuellement
  });

  // Attendre que le renderer soit prêt
  await app.init();

  document.body.appendChild(app.view);
  let sm = new SocketManager();
  const gameClient = new GameClient(sm,app);
  app.ticker.start(); // Démarrer la boucle de rendu

  // Gestion du redimensionnement
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    gameClient.onResize();
  });
}

document.addEventListener('DOMContentLoaded', initGame);