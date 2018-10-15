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

  let heightPadding = window.innerHeight * .1;
  let widthPadding = window.innerWidth * .1;

  let heightDiff = (window.innerHeight - heightPadding * 2) / 2.5 / numRows;
  let widthDiff = (window.innerWidth - widthPadding * 2) * .7 / invadersPerRow;

  invaders = invaders.map((row, r) => {
    return row.map((i, idx) => {
      let leftLimit = widthDiff * i + widthPadding;
      let rightLimit = window.innerWidth - widthPadding - (widthDiff * (invadersPerRow - i - 1));
      let top = heightDiff * r + heightPadding;

      let invader = Invader(`invader${r}-${idx}`, leftLimit, rightLimit, top);
      createInvaderElement(invader.id);
      return invader;
    });
  });
  drawInvaders();
}

let main = document.getElementById('main');

function createInvaderElement(invaderId) {
  let canvas = document.createElement('div');
  canvas.className = 'invader-canvas';
  canvas.id = invaderId;

  for (let row = 0; row < 8; row++) {
    for (let p = 0; p < 11; p++) {
      let pixel = document.createElement('div');
      pixel.className = 'invader-pixel';
      canvas.appendChild(pixel);
    }
  }
  main.appendChild(canvas);
}

function drawInvaders() {
  invaders.forEach((row, r) => {
    row.forEach((invader, i) => {
      if (invader.isAlive) {
        let div = document.getElementById(`invader${r}-${i}`);
        div.style.left = `${invader.left}px`;
        div.style.top = `${invader.top}px`;
      }
    });
  });
}

function updateInvadersWidth() {
  let flatInvaders = invaders.flat();

  if (flatInvaders.length) {
    let velocity = Math.random() < 0.5 ? 50 : -50;

    let firstInvader = flatInvaders[0];
    if (Math.floor(firstInvader.left + velocity) > firstInvader.rightLimit
      || Math.ceil(firstInvader.left + velocity) < firstInvader.leftLimit) {
      velocity = velocity * -1;
    }

    flatInvaders.forEach(invader => {
      invader.left += velocity;
    });
  }
}

function updateInvadersHeight() {
  let velocity = 50;
  let hasInvaded = false;

  invaders.flat().forEach(invader => {
    invader.top += velocity;
    if (invader.top >= window.innerHeight * 0.9 && !hasInvaded) hasInvaded = true;
  });

  if (hasInvaded) gameOver();
}

// Shooter
let shooterPosition = 0;

document.addEventListener('keydown', event => {
  let shooterVelocity = 15;
  if (event.key === 'ArrowRight') {
    updateShooter(shooterVelocity);
  } else if (event.key === 'ArrowLeft') {
    updateShooter(-shooterVelocity);
  }
});

function updateShooter(velocity) {
  if (shooterPosition + velocity < (window.innerWidth * .91) && shooterPosition + velocity > 0) {
    shooterPosition += velocity;
  }

  let shooter = document.getElementById('shooter');
  shooter.style.left = shooterPosition + 'px';
}

// Game Loop
let isGameOver = false;

function start() {
  createInvaders();
  mainLoop();
}

let frameCount = 1;

function mainLoop() {
  let invaderWidthFrameCount = 40;
  let invaderHeightFrameCount = 480;

  if (frameCount % invaderWidthFrameCount === 0) updateInvadersWidth();
  if (frameCount % invaderHeightFrameCount === 0) updateInvadersHeight();
  drawInvaders();

  if (!isGameOver) {
    frameCount++;
    requestAnimationFrame(mainLoop);
  }
}

function gameOver() {
  isGameOver = true;
  let gameOverSign = document.createElement('div');
  gameOverSign.id = 'game-over';
  gameOverSign.innerHTML = 'GAME OVER';
  main.appendChild(gameOverSign);
}

start();
