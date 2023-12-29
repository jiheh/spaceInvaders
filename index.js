// Invaders
// Storing indices needed to spell out a word with the invaders
let invaders = [
  [2, 4, 6, 8, 10, 11, 12, 14, 16],
  [2, 4, 6, 8, 10, 14, 16],
  [2, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16],
  [0, 2, 4, 6, 8, 10, 14, 16],
  [0, 1, 2, 4, 6, 8, 10, 11, 12, 14, 16]
];

function Invader(id, leftLimit, rightLimit, top) {
  return {
    id,
    left: leftLimit,
    leftLimit,
    rightLimit,
    top,
    isAlive: true
  };
}

function createInvaders() {
  let numRows = 5;
  let invadersPerRow = 17;

  let heightPadding = window.innerHeight * 0.1;
  let widthPadding = window.innerWidth * 0.1;

  let heightDiff = (window.innerHeight - heightPadding * 2) / 2.5 / numRows;
  let widthDiff = ((window.innerWidth - widthPadding * 2) * 0.7) / invadersPerRow;

  invaders = invaders.map((row, r) => {
    return row.map((i, idx) => {
      let leftLimit = widthDiff * i + widthPadding;
      let rightLimit = window.innerWidth - widthPadding - widthDiff * (invadersPerRow - i - 1);
      let top = heightDiff * r + heightPadding;

      let invader = Invader(`invader${r}-${idx}`, leftLimit, rightLimit, top);
      createInvaderElement(invader.id);
      return invader;
    });
  });

  drawInvaders();
}

let main = document.getElementById("main");

function createInvaderElement(invaderId) {
  let canvas = document.createElement("div");
  canvas.className = "invader-canvas";
  canvas.id = invaderId;

  for (let row = 0; row < 8; row++) {
    for (let p = 0; p < 11; p++) {
      let pixel = document.createElement("div");
      pixel.className = "invader-pixel";
      canvas.appendChild(pixel);
    }
  }

  main.appendChild(canvas);
}

function drawInvaders() {
  invaders.forEach((row, r) => {
    row.forEach((invader, i) => {
      let invaderElement = document.getElementById(`invader${r}-${i}`);
      if (invaderElement) {
        if (invader.isAlive) {
          invaderElement.style.left = `${invader.left}px`;
          invaderElement.style.top = `${invader.top}px`;
        } else {
          removeInvader(invader);
        }
      }
    });
  });
}

function updateInvadersWidth() {
  let flatInvaders = invaders.flat();

  if (flatInvaders.length) {
    let velocity = Math.random() < 0.5 ? 50 : -50;

    let firstInvader = flatInvaders[0];
    if (
      Math.floor(firstInvader.left + velocity) > firstInvader.rightLimit ||
      Math.ceil(firstInvader.left + velocity) < firstInvader.leftLimit
    ) {
      velocity = velocity * -1;
    }

    flatInvaders.forEach((invader) => {
      invader.left += velocity;
    });
  }
}

function updateInvadersHeight() {
  let velocity = 50;
  let hasInvaded = false;

  invaders.flat().forEach((invader) => {
    if (invader.isAlive) {
      invader.top += velocity;
      if (invader.top >= window.innerHeight * 0.9 && !hasInvaded) hasInvaded = true;
    }
  });

  if (hasInvaded) gameOver();
}

function removeInvader(invader) {
  const invaderElement = document.getElementById(invader.id);
  if (invaderElement) {
    main.removeChild(invaderElement);
  }
}

// Shooter
let shooterPosition = 0;
let bullets = {};

document.addEventListener("keydown", (event) => {
  let shooterVelocity = 15;
  if (event.key === "ArrowRight") {
    updateShooter(shooterVelocity);
  } else if (event.key === "ArrowLeft") {
    updateShooter(-shooterVelocity);
  } else if (event.key === " ") {
    createBullet();
  }
});

function updateShooter(velocity) {
  if (shooterPosition + velocity < window.innerWidth * 0.91 && shooterPosition + velocity > 0) {
    shooterPosition += velocity;
  }

  let shooter = document.getElementById("shooter");
  shooter.style.left = shooterPosition + "px";
}

let bulletCounter = 0;

function createBullet() {
  let shooterWidth = document.getElementById("shooter").offsetWidth;

  let bulletId = `bullet${bulletCounter}`;
  let bullet = {
    id: bulletId,
    left: shooterPosition + shooterWidth / 2,
    top: window.innerHeight
  };

  bullets[bulletId] = bullet;

  let bulletElement = document.createElement("div");
  bulletElement.className = "bullets";
  bulletElement.id = bulletId;
  main.appendChild(bulletElement);

  bulletCounter++;
}

function drawBullets() {
  Object.values(bullets).forEach((bullet) => {
    let bulletElement = document.getElementById(bullet.id);

    if (bullet.top >= 0) {
      bulletElement.style.left = `${bullet.left}px`;
      bulletElement.style.top = `${bullet.top}px`;
    } else {
      removeBullet(bullet);
    }
  });
}

function updateBullets() {
  Object.values(bullets).forEach((bullet) => {
    bullet.top -= 10;

    invaders.flat().forEach((invader) => {
      if (
        invader.isAlive &&
        bullet.top <= invader.top &&
        bullet.top >= invader.top - 36 &&
        bullet.left >= invader.left &&
        bullet.left <= invader.left + 33
      ) {
        invader.isAlive = false;
        removeInvader(invader);
        removeBullet(bullet);
      }
    });
  });
}

function removeBullet(bullet) {
  let bulletElement = document.getElementById(bullet.id);
  if (bulletElement) {
    main.removeChild(bulletElement);
  }
  delete bullets[bullet.id];
}

// Game Loop
let isGameOver = false;

function start() {
  main.removeChild(document.getElementById("click-to-start"));

  createInvaders();
  mainLoop();
}

let frameCount = 1;

function mainLoop() {
  if (!isGameOver) {
    let invaderWidthFrameCount = 40;
    let invaderHeightFrameCount = 320;

    if (frameCount % invaderWidthFrameCount === 0) updateInvadersWidth();
    if (frameCount % invaderHeightFrameCount === 0) updateInvadersHeight();
    drawInvaders();

    if (!invaders.flat().filter((i) => i.isAlive).length) gameWon();
  }

  if (Object.values(bullets).length) {
    updateBullets();
    drawBullets();
  }

  // if (!isGameOver) {
  frameCount++;
  requestAnimationFrame(mainLoop);
  // }
}

function gameOver() {
  isGameOver = true;
  let gameOverSign = document.createElement("div");
  gameOverSign.id = "game-over";
  gameOverSign.innerHTML = "GAME OVER";
  main.appendChild(gameOverSign);
}

function gameWon() {
  isGameOver = true;
  let gameWonSign = document.createElement("div");
  gameWonSign.id = "game-won";
  gameWonSign.innerHTML = "YOU WIN!";
  main.appendChild(gameWonSign);
}

function clickToStart() {
  let clickToStartSign = document.createElement("div");
  clickToStartSign.id = "click-to-start";
  clickToStartSign.innerHTML = "> Click to Start <";
  main.appendChild(clickToStartSign);

  document.addEventListener("click", start, {once: true});
}

clickToStart();

// TODO:
// Fix update function to kill invader if top and left/right within invader's area
// Fix update to add to score on kill
// Draw scoreboard on every frame
