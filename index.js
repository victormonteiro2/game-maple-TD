const skell = new Image();
skell.src = './images/skell.png';

// const projectile = new Image();
// projectile.src = '';

let skellX = 0;
let skellY = 57;
// var canvas = document.getElementById('example');
// var ctx = canvas.getContext('2d');

// ctx.fillStyle = 'purple';
// ctx.fillRect(260, 260, 50, 50);
const theCanvas = document.getElementById('canvas');
const ctx = theCanvas.getContext('2d');
let player;
const enemiesList = [];

const myGameArea = {
  canvasWidth: theCanvas.width,
  canvasHeight: theCanvas.height,
  canvas: theCanvas,
  frames: 0,
  start: function () {
    this.interval = setInterval(updateGameArea, 20);
    player = new Character(50, 50, 25, 25, './images/skell.png');
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
  // score: function () {
  //   const points = Math.floor(this.frames / 5);

  // ctx.font = '18px serif';
  // ctx.fillStyle = 'black';
  // ctx.fillText(`Score: ${points}`, 350, 50);
  // }
};

function updateGameArea() {
  myGameArea.clear();
  updateEnemies();
  player.update();
  // checkGameOver();
  // myGameArea.score();
}

class Character {
  // <== genereic character
  constructor(x, y, width, height, imageSrc) {
    this.img = new Image();

    this.img.src = imageSrc;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img.onload = this.update;
    this.id = Math.round(Math.random() * 10000);
  }
  update() {
    // console.log(this);
    ctx.drawImage(this.img, this.x, this.y, 50, 50);
  }
}

function updateEnemies() {
  myGameArea.frames += 1;
  if (myGameArea.frames % 120 === 0) {
    let x = 0;

    enemiesList.push(new Character(0, 100, 50, 50, './images/skell.png'));
  }

  for (i = 0; i < enemiesList.length; i++) {
    enemiesList[i].x += 0.3;
    enemiesList[i].update();
  }
}

myGameArea.start();

// const player = new Character(0, 0, 20, 20, './images/skell.png');

// console.log(player.img);
// function draw(x, y) {
//   const theCanvas = document.getElementById('canvas');
//   const ctx = theCanvas.getContext('2d');

//   ctx.clearRect(0, 0, 300, 300);
//   ctx.drawImage(skell, skellX, skellY, 100, 100);

//   // skellX += 3;

//   setTimeOut(`draw(${x}, ${y})`, 30);
// }
