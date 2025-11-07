const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const container = document.getElementById('container');
const game = document.getElementById('game');
const player = document.getElementById('player');
const gameOver = document.getElementById('gameOver');
const scoreValue = document.getElementById('scoreValue');
const highScoreValue = document.getElementById('highScoreValue');
const highScoresList = document.getElementById('highScoresList');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let playerX = 150;
let gameRunning = false;
let paused = false;
let intervals = [];

let highScore = localStorage.getItem('highScore') || 0;
highScoreValue.textContent = highScore;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
updateRanking();

startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  container.classList.remove('hidden');
  startGame();
});

function startGame() {
  gameRunning = true;
  score = 0;
  scoreValue.textContent = score;
  gameOver.classList.add('hidden');

  intervals.push(setInterval(spawnMoeda, 2000));
  intervals.push(setInterval(spawnObstaculo, 2500));
}

function spawnMoeda() {
  if (!gameRunning || paused) return;
  const moeda = document.createElement('div');
  moeda.classList.add('moeda');
  moeda.style.left = Math.random() * 320 + 'px';
  moeda.style.top = '0px';
  game.appendChild(moeda);

  const moveInterval = setInterval(() => {
    if (!gameRunning || paused) return;
    const top = parseInt(moeda.style.top);
    if (top > 550) {
      moeda.remove();
      clearInterval(moveInterval);
    } else {
      moeda.style.top = (top + 5) + 'px';
    }

    if (checkCollision(player, moeda)) {
      score++;
      scoreValue.textContent = score;
      moeda.remove();
      clearInterval(moveInterval);
    }
  }, 30);
}

function spawnObstaculo() {
  if (!gameRunning || paused) return;
  const obstaculo = document.createElement('div');
  obstaculo.classList.add('obstaculo');
  obstaculo.style.left = Math.random() * 320 + 'px';
  obstaculo.style.top = '0px';
  game.appendChild(obstaculo);

  const moveInterval = setInterval(() => {
    if (!gameRunning || paused) return;
    const top = parseInt(obstaculo.style.top);
    if (top > 550) {
      obstaculo.remove();
      clearInterval(moveInterval);
    } else {
      obstaculo.style.top = (top + 6) + 'px';
    }

    if (checkCollision(player, obstaculo)) {
      endGame();
      clearInterval(moveInterval);
    }
  }, 30);
}

function checkCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom - 10 < bRect.top + 5 ||
    aRect.top + 10 > bRect.bottom - 5 ||
    aRect.right - 10 < bRect.left + 5 ||
    aRect.left + 10 > bRect.right - 5
  );
}

function endGame() {
  gameRunning = false;
  gameOver.classList.remove('hidden');

  // Salva pontuações
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreValue.textContent = highScore;
  }

  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  updateRanking();
}

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? '▶️ Retomar' : '⏸️ Pausar';
});

restartBtn.addEventListener('click', () => {
  location.reload();
});

function updateRanking() {
  highScoresList.innerHTML = '';
  highScores.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}º — ${s}`;
    highScoresList.appendChild(li);
  });
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning || paused) return;
  if (e.key === 'ArrowLeft') playerX -= 20;
  if (e.key === 'ArrowRight') playerX += 20;
  if (playerX < 0) playerX = 0;
  if (playerX > 320) playerX = 320;
  player.style.left = playerX + 'px';
});

document.getElementById('leftBtn').addEventListener('touchstart', () => {
  if (!paused) {
    playerX -= 20;
    if (playerX < 0) playerX = 0;
    player.style.left = playerX + 'px';
  }
});

document.getElementById('rightBtn').addEventListener('touchstart', () => {
  if (!paused) {
    playerX += 20;
    if (playerX > 320) playerX = 320;
    player.style.left = playerX + 'px';
  }
});