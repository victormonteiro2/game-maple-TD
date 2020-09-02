const skell = new Image();
skell.src = './images/skell.png';

let archer = new Image();
archer.src = './images/elfo0.png';

let archerShooting = new Image();
archerShooting.src = './images/elfo1.png';

let flecha = new Image();
flecha.src = './images/flecha.png';

// const projectile = new Image();
// projectile.src = '';

// var canvas = document.getElementById('example');
// var ctx = canvas.getContext('2d');

// ctx.fillStyle = 'purple';
// ctx.fillRect(260, 260, 50, 50);

const theCanvas = document.getElementById('canvas');
const ctx = theCanvas.getContext('2d');
let player;
let torre;
let shots = [];
const arrow = [];
const enemiesList = [];

const myGameArea = {
  canvasWidth: theCanvas.width,
  canvasHeight: theCanvas.height,
  canvas: theCanvas,
  frames: 0,
  start: function () {
    this.interval = setInterval(updateGameArea, 20);
    player = new Character(880, 537, 70, 130, './images/elfo0.png');
    torre = new Tower(850, 235, 215, 300, './ImagesOnProgress/towerPlace.png');
    arrow = new Projectile(500, 500, 50, 20, './images/flecha.png');
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
  torre.update();
  // arrow.update();
  updateProjectile();
  // checkGameOver();
  // myGameArea.score();
}

class Character {
  // <== genereic character
  constructor(x, y, width, height, imageSrc, health, attackDamage) {
    this.img = new Image();
    this.img.src = imageSrc;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.attackDamage = attackDamage;
    this.img.onload = this.update;
    this.id = Math.round(Math.random() * 10000);
  }

  receiveDamage(damage) {
    this.health -= damage;
  }

  shoot(shooter) {
    shots.unshift(new Shot(shooter, this.attackDamage, this.x, this.y + 11));
  }

  update() {
    // console.log(this);
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  // COMEÇA O TESTE DE PROJETIL **************
}

class Projectile {
  constructor(x, y, width, height, imageSrc) {
    this.img = new Image();

    this.img.src = imageSrc;
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;
    this.img.onload = this.update;
  }

  crashWith(arrow) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > arrow.right()
    );
  }

  update() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

function updateProjectile() {
  myGameArea.frames += 1;
  if (myGameArea.frames % 120 === 0) {
    let x = 0;

    arrow.push(new Projectile(865, 585, 60, 30, './images/flecha.png'));
  }

  for (i = 0; i < arrow.length; i++) {
    arrow[i].x += -20;
    arrow[i].update();
  }
  if (myObstacles[i].x <= 0) {
    // COORD. MENOR Q ZERO => SPLICE (REMOVER DO ARRAY)
    arrow.splice();
  }
}

// TERMINA O TESTE DE PROJETIL ****************

// TESTE PARA CRIAR OBJETO (PREDIO) ************

class Tower {
  // <== genereic character
  constructor(x, y, width, height, imageSrc) {
    this.img = new Image();

    this.img.src = imageSrc;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img.onload = this.update;
  }
  update() {
    // console.log(this);
    // ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

// FIM DO TESTE

function updateEnemies() {
  myGameArea.frames += 1;
  if (myGameArea.frames % 360 === 0) {
    let x = 0;

    // enemiesList.push(new Character(0, 462, 60, 80, './images/skell.png'));
  }

  for (i = 0; i < enemiesList.length; i++) {
    enemiesList[i].x += 0.5;
    enemiesList[i].update();
  }
  // if (enemiesList[i].x === player.x) {
  //   enemiesList[i].x - 1;
  //   enemiesList[i].update();
  // }
  // if (enemiesList[i].x === player.x) {
  //   enemiesList[i].remove[i];
  // }
}

myGameArea.start();

// console.log(player.img);
// function draw(x, y) {
//   const theCanvas = document.getElementById('canvas');
//   const ctx = theCanvas.getContext('2d');

//   ctx.clearRect(0, 0, 300, 300);
//   ctx.drawImage(skell, skellX, skellY, 100, 100);

//   // skellX += 3;

//   setTimeOut(`draw(${x}, ${y})`, 30);
// }
