// Invaders
let invaders = [];

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
  let invadersPerRow = 11;

  let heightPadding = window.innerHeight * .05;
  let widthPadding = window.innerWidth * .1;

  let heightDiff = (window.innerHeight - heightPadding * 2) / 3 / numRows;
  let widthDiff = (window.innerWidth - widthPadding * 2) / 2 / invadersPerRow;

  for (let r = 0; r < numRows; r++) {
    let row = [];

    for (let i = 0; i < invadersPerRow; i++) {
      let leftLimit = widthDiff * i + widthPadding;
      let rightLimit = window.innerWidth - widthPadding - (widthDiff * (invadersPerRow - i - 1));
      let top = heightDiff * r + heightPadding;

      let invader = Invader(`invader${r}-${i}`, leftLimit, rightLimit, top);
      row.push(invader);
      createInvaderElement(invader.id);
    }
    invaders.push(row);
  }
  drawInvaders();
}

let main = document.getElementById('main');
function createInvaderElement(invaderId) {
  let div = document.createElement('div');
  div.id = invaderId;
  div.className = 'invader';
  div.innerHTML = '+_+';
  main.appendChild(div);
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

let velocity = 50;
function updateInvaders() {
  let flatInvaders = invaders.flat();

  if (flatInvaders.length) {
    let firstInvader = flatInvaders[0];
    if (firstInvader.left + velocity > firstInvader.rightLimit
      || firstInvader.left + velocity < firstInvader.leftLimit) {
      velocity = velocity * -1;
    }

    flatInvaders.forEach(invader => {
      invader.left += velocity;
    });
  }
}

// Game Loop
function start() {
  createInvaders();
  mainLoop();
}

let frameCount = 1;
function mainLoop() {
  let invaderAnimationFrameCount = 30;
  if (frameCount % invaderAnimationFrameCount === 0) {
    updateInvaders();
    drawInvaders();
  }

  frameCount++;
  requestAnimationFrame(mainLoop);
}

start();
