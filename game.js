let player, obstacle, gameInterval;
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let gameRunning = false;

// Atualiza pontuação na tela
function updateScore() {
  document.getElementById("score").textContent = score;
  document.getElementById("bestScore").textContent = bestScore;
}

// Inicia o jogo
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("game").style.display = "block";

  player = document.getElementById("player");
  obstacle = document.getElementById("obstacle");

  score = 0;
  gameRunning = true;
  updateScore();
  moveObstacle();
}

// Movimento do obstáculo
function moveObstacle() {
  obstacle.style.right = "-80px";
  let pos = -80;

  gameInterval = setInterval(() => {
    if (!gameRunning) return;

    pos += 5;
    obstacle.style.right = pos + "px";

    if (pos > 880) {
      pos = -80;
      score++;
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
      }
      updateScore();
    }

    checkCollision();
  }, 20);
}

// Pular
let jumping = false;
function jump() {
  if (jumping) return;
  jumping = true;
  let jumpHeight = 0;
  let goingUp = true;

  const jumpInterval = setInterval(() => {
    if (goingUp) {
      jumpHeight += 5;
      if (jumpHeight >= 100) goingUp = false;
    } else {
      jumpHeight -= 5;
      if (jumpHeight <= 0) {
        jumpHeight = 0;
        jumping = false;
        clearInterval(jumpInterval);
      }
    }
    player.style.bottom = jumpHeight + "px";
  }, 20);
}

// Detecta colisão
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.left < obstacleRect.right - 20 &&
    playerRect.right > obstacleRect.left + 20 &&
    playerRect.bottom > obstacleRect.top + 20
  ) {
    gameOver();
  }
}

// Fim de jogo
function gameOver() {
  clearInterval(gameInterval);
  gameRunning = false;
  alert("Você perdeu! Pontuação: " + score);
  document.getElementById("game").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
}

// ================== CONTROLES ==================

// Setas (desktop)
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowUp") jump();
});

// Botões (mobile)
document.getElementById("jumpBtn").addEventListener("click", jump);