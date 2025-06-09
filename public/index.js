import { GameClient } from "./GameClient.js";
import { SocketManager } from "./SocketManager.js";

// Create a PixiJS application.
const app = new PIXI.Application();


const form = document.getElementById('pseudoForm');
const formContainer = document.getElementById('formContainer');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêche le rechargement
  const pseudo = document.getElementById('pseudoInput').value.trim().slice(0, 16);
  if (pseudo) {
    formContainer.style.display = 'none'; // Cache le formulaire
    document.getElementById('gameCanvas').style.visibility = 'visible';
    document.getElementById('myChart').style.visibility = 'visible';
    main(pseudo); // Appel de la fonction avec le pseudo
  }
});

async function main(pseudo)
{
    await setup();
    var chart = createChart();
    await initGame(pseudo,chart);
    
};

async function setup()
{
    const canvas = document.getElementById('gameCanvas')
    await app.init({view: canvas, background: '#000000', resizeTo: window });
}

async function initGame(pseudo,chart) {
  window.addEventListener('resize', () => resizeApp(app));
  let sm = new SocketManager();
  const gameClient = new GameClient(sm,app,pseudo,chart);
  app.ticker.start(); // Game loop
}

function resizeApp(app) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const resolution = window.devicePixelRatio || 1;

  app.renderer.resolution = resolution;
  app.renderer.resize(width, height);
}
function createChart() {
    const ctx = document.getElementById('myChart');
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Player Performance',
          data: [],
          borderColor: 'blue',
          tension: 0.3
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
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
}

