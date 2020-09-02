const skell = new Image();
skell.src = './images/skell.png';

let archer = new Image();
archer.src = './images/elfo0.png';

let archerShooting = new Image();
archerShooting.src = './images/elfo1.png';

// const projectile = new Image();
// projectile.src = '';

// var canvas = document.getElementById('example');
// var ctx = canvas.getContext('2d');

// ctx.fillStyle = 'purple';
// ctx.fillRect(260, 260, 50, 50);

const theCanvas = document.getElementById('canvas');
const ctx = theCanvas.getContext('2d');
let player;
let shotsArcher = [];
const enemiesList = [];

const myGameArea = {
  canvasWidth: theCanvas.width,
  canvasHeight: theCanvas.height,
  canvas: theCanvas,
  frames: 0,
  start: function () {
    this.interval = setInterval(updateGameArea, 20);
    player = new Character(880, 450, 60, 100, './images/elfo0.png');
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
    this.isShooting = false;
    this.img.onload = this.update;
    this.id = Math.round(Math.random() * 10000);
  }
  update() {
    // console.log(this);
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  // COMEÇA O TESTE DE PROJETIL **************

  shoot(shooter) {
    shotsArcher.unshift(
      new Shot(
        shooter,
        this.attackDamage,
        this.x,
        this.y + 20 + 40 * Math.floor(Math.random() * 2)
      )
    );
  }

  // drawBoss() {
  //   context.drawImage(archer, wily.x, wily.y, 65, 75);
  // }

  drawBossPower(shot) {
    context.lineWidth = 2;
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(shot.x, shot.y, 4, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'white';
    context.stroke();
  }

  shotUpdate() {
    shotsWily.forEach((shot, i) => {
      if (
        shot.x > megaman.x + 20 ||
        (shot.x < megaman.x && shot.x > 1) ||
        shot.y > megaman.y + 24 ||
        shot.y < megaman.y
      ) {
        this.drawBossPower(shot);
        shot.x -= 2;
      } else if (
        shot.x < megaman.x + 40 &&
        shot.x > megaman.x - 10 &&
        shot.y < megaman.y + 30 &&
        shot.y > megaman.y - 20
      ) {
        shotsWily.splice(i, 1);
        megaman.receiveDamage(this.attackDamage);
      } else {
        shotsWily.splice(i, 1);
      }
    });
  }
}

class Shot {
  constructor(shooter, damage, x, y) {
    this.shooter = shooter;
    this.damage = damage;
    this.x = x;
    this.y = y;
  }

  // TERMINA O TESTE DE PROJETIL ****************
}

function updateEnemies() {
  myGameArea.frames += 1;
  if (myGameArea.frames % 360 === 0) {
    let x = 0;

    enemiesList.push(new Character(0, 462, 60, 80, './images/skell.png'));
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

// document.onkeydown = function (e) {
//   switch (
//     e.keyCode
// case 38: // <== up arrow
// case 87:
//   if (megaman.y === 100) {
//     megaman.isJumping = true;
//     if (!gameArea.checkGameOver() && !gameArea.checkWin()) jumpAudio.play();
//   }
//   break;
// case 37: // <== left arrow
// case 65:
//   megaman.speedX = -1;
//   megaman.isWalking = true;
//   megaman.direction = 'left';
//   break;
// case 39: // <== right arrow
// case 68:
//   megaman.speedX = 1;
//   megaman.isWalking = true;
//   megaman.direction = 'right';
//   break;
// case 32: // <== space bar
//   if (shotsMegaman.length < 3) {
//     if (!gameArea.checkGameOver() && !gameArea.checkWin()) shotAudio.play();
//     megaman.shoot('megaman');
//     megaman.isShooting = true;
//   }
//   break;
// case 13: // <== enter
//   if (!startedGame) gameArea.start();
//   break;
//   ) {
//   }
// };
