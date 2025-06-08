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
    await createChart();
})();

async function setup()
{
    const canvas = document.getElementById('gameCanvas')
    await app.init({view: canvas, background: '#000000', resizeTo: window });
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

async function createChart() {
    const ctx = document.getElementById('myChart');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Live Data',
          data: [],
          borderColor: 'blue',
          tension: 0.3
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false, // ⬅️ Allows full use of canvas size
        animation: false,
        scales: {
          x: { title: { display: true, text: 'Time' }},
          y: { title: { display: true, text: 'Value' }}
        },
        plugins: {
        customCanvasBackgroundColor: {
          color: 'transparent',
        }
      }
      }
    });

    setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const value = Math.random() * 100;

      // Limit to last 20 points
      if (chart.data.labels.length >= 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.data.labels.push(now);
      chart.data.datasets[0].data.push(value);
      chart.update();
  }, 1000);
}

