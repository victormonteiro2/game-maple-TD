const skellNormal = new Image();
skellNormal.src = './images/skell.png';
let skellDead = new Image();
skellDead.src = './images/elfo3.png'; // COLOCAR DEPOIS
let archerNormal = new Image();
archerNormal.src = './images/elfo0.png';
let archerShooting = new Image();
archerShooting.src = './images/elfo1.png';
let flecha = new Image();
flecha.src = './images/flecha.png';
let stage = new Image();
stage.src = './images/background-game-short.png';
let backgroundCanvas = new Image();
backgroundCanvas.src = './images/megaman_title.jpg';
let backgroundWin = new Image();
backgroundWin.src = './images/background.jpg';
let towerNormal = new Image();
towerNormal.src = './images/towerNormal.png';
let towerDown = new Image(); // ADICIONAR TORRE
towerDown.src = './imagesOnProgress/towerPlace.png'; //ADICIONAR TORRE DOWN

/* canvas and global variables*/
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let shotsArcher = [];
let shotsSkell = [];
let requestId = null;
let startedGame = false;

window.onload = () => {
  context.font = '50px Arial';
  context.fillStyle = 'white';
  context.fillText('Press Enter to Start', 320, 400);
  context.drawImage(backgroundCanvas, 1080, 768);
};

/* game functions */

let gameArea = {
  ground: 500,
  frame: 0,
  start: function () {
    startedGame = true;
    update();
  },

  clear: function () {
    gameArea.frame += 1;
    context.drawImage(stage, 0, 0, 1080, 768); // <== print stage

    //   for (let i = 1; i <= megaman.health; i += 1) {
    //     if (i % 25 === 0) {
    //       context.lineWidth = 4;
    //       context.fillStyle = 'blue';
    //       context.strokeStyle = 'white';
    //       context.strokeRect(5 + 1 * i, 10, 22, 4);
    //       context.fillRect(5 + 1 * i, 10, 22, 4);
    //     }
    //   }

    //   for (let i = 1; i < wily.health; i += 25) {
    //     context.lineWidth = 4;
    //     context.fillStyle = 'red';
    //     context.strokeStyle = 'white';
    //     context.strokeRect(250 - 1 * i, 10, 22, 4);
    //     context.fillRect(250 + -1 * i, 10, 22, 4);
    //   }
  },
  checkGameOver: function () {
    if (archer.health <= 0) {
      return true;
    } else {
      return false;
    }
  },
  checkWin: function () {
    if (skell.health <= 0) {
      return true;
    } else {
      return false;
    }
  }
};

/* classes */

class Character {
  // <== generic character
  constructor(x, y, width, height, imageSrc, health, attackDamage) {
    this.img = new Image();
    this.img.src = imageSrc;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.isShooting = false;
    this.attackDamage = attackDamage;
    this.speedX = 0;
  }
  receiveDamage(damage) {
    this.health -= damage;
  }
  shoot(shooter) {
    shotsArcher.unshift(
      new Shot(shooter, this.attackDamage, this.x + 50, this.y + 50)
    );
  }
  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }
}

class Player extends Character {
  constructor(x, y, width, height, imageSrc, health, attackDamage) {
    super(x, y, width, height, imageSrc, health, attackDamage);
  }

  newPos() {}

  drawArcher() {
    if (this.isShooting) {
      context.drawImage(archerShooting, this.x, this.y);
    } else {
      // print this shooting
      context.drawImage(archerNormal, this.x, this.y);
    }
  }

  drawArcherPower(shot) {
    context.lineWidth = 1;
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(shot.x, shot.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
  }

  shotUpdate() {
    shotsArcher.forEach((shot) => {
      if (shot.x >= 0) {
        this.drawArcherPower(shot);
        shot.x += -20;
        // set time to reset normal position image
        if (shotsArcher.length > 0 && shotsArcher[0].x > archer.x + 60) {
          archer.isShooting = false;
        }
      }
      if (shot.x === skell.x - 1 || shot.x === skell.x - 2) {
        shotsArcher.pop();
        skell.receiveDamage(this.attackDamage);
      }
    });
  }
}

// NPC --------------------------

class Boss extends Character {
  constructor(x, y, width, height, imageSrc, health, attackDamage) {
    super(x, y, width, height, imageSrc, health, attackDamage);
    this.isShooting = false;
  }
  shoot(shooter) {
    shotsSkell.unshift(
      new Shot(
        shooter,
        this.attackDamage,
        this.x,
        this.y + 50 + 0 * Math.floor(Math.random() * 2)
      )
    );
  }

  drawBoss(sprite) {
    context.drawImage(sprite, this.x, this.y); // trocar por parametro (nome)
  }

  drawBossPower(shot) {
    context.lineWidth = 1;
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(shot.x, shot.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'white';
    context.stroke();
  }

  shotUpdate() {
    shotsSkell.forEach((shot) => {
      if (shot.x >= 0) {
        this.drawBossPower(shot);
        shot.x += +20;
        // set time to reset normal position image
        if (shotsSkell.length > 0 && shotsSkell[0].x > skell.x + 60) {
          skell.isShooting = false;
        }
      }
      if (shot.x === archer.x + 1 || shot.x === archer.x + 2) {
        shotsSkell.pop();
        archer.receiveDamage(this.attackDamage);
      }
    });
  }
  // shotUpdate() {
  //   shotsSkell.forEach((shot, i) => {
  //     if (
  //       shot.x > torre.x + 20 ||
  //       (shot.x < torre.x && shot.x > 1) ||
  //       shot.y > torre.y + 24 ||
  //       shot.y < torre.y
  //     ) {
  //       this.drawBossPower(shot);
  //       shot.x += 1;
  //     } else if (
  //       shot.x < torre.x + 40 &&
  //       shot.x > torre.x - 10 &&
  //       shot.y < torre.y + 30 &&
  //       shot.y > torre.y - 20
  //     ) {
  //       shotsSkell.splice(i, 1);
  //       torre.receiveDamage(this.attackDamage);
  //     } else {
  //       shotsSkell.splice(i, 1);
  //     }
  //   });
  // }
}
class Shot {
  constructor(shooter, damage, x, y) {
    this.shooter = shooter;
    this.damage = damage;
    this.x = x;
    this.y = y;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}
// ------------------------------- classe da tower (renderizar antes do personagem)

class Tower extends Character {
  constructor(x, y, width, height, imageSrc, health, attackDamage) {
    super(x, y, width, height, imageSrc, health, attackDamage);
  }

  newPos() {}

  drawTower() {
    if (this.health > 0) {
      context.drawImage(towerNormal, this.x, this.y);
    } else if (this.isShooting) {
      // print this shooting
      context.drawImage(towerDown, this.x, this.y);
    }
  }
}

const archer = new Player(860, 530, 60, 140, archerNormal, 100, 10);
const skell = new Boss(0, 520, 70, 110, skellNormal, 100, 10);
const torre = new Tower(780, 170, 100, 600, towerNormal, 100, 0);

// POR ULTIMO

function update() {
  // <== game engine
  if (gameArea.checkGameOver()) {
    // audio3.pause();
    cancelAnimationFrame(update);
    // audio2.play();
    context.fillStyle = 'black';
    context.fillRect(0, 0, 1080, 768);
    context.fillStyle = 'white';
    context.font = '50px Arial';
    // context.drawImage(backgroundLose, 30, 25, 100, 100);
    context.fillText('You Lose!', 1080, 768); // CORRIGIR IMAGENS WIN/LOSE
    setInterval(() => window.location.reload(), 6000);
  } else if (gameArea.checkWin()) {
    // audio3.pause();
    cancelAnimationFrame(update);
    // audio5.play();
    context.drawImage(backgroundWin, 0, 0, 1080, 768);
    context.fillStyle = 'white';
    context.font = '50px Arial';
    context.fillText('You Win!', 400, 420);
    setInterval(() => window.location.reload(), 6000);
  } else {
    // audio3.play();
    archer.newPos();
    gameArea.clear();
    torre.drawTower();
    archer.drawArcher();
    if (skell.health <= 0) {
      skell.drawBoss(skellDead);
    } else {
      skell.drawBoss(skellNormal);
    }
    archer.shotUpdate();
    skell.shotUpdate();
    shotsArcher.forEach((shot, i) => {
      if (shot.crashWith(skell)) {
        skell.receiveDamage(shot.damage);
        shotsArcher.splice(i, 1);
      }
    });
    if (skell.health > 75) {
      if (gameArea.frame % 90 === 0) skell.shoot('skell');
    } else if (skell.health > 50) {
      if (gameArea.frame % 75 === 0) skell.shoot('skell');
    } else if (skell.health > 25) {
      if (gameArea.frame % 60 === 0) skell.shoot('skell');
    } else {
      if (gameArea.frame % 45 === 0) skell.shoot('skell');
    }
    window.requestAnimationFrame(update);
  }
  gameArea.checkGameOver();
}

document.onkeydown = function (e) {
  e.preventDefault();
  switch (e.keyCode) {
    case 13: // <== enter
      if (!startedGame) gameArea.start();
      break;
    case 32: // <== space bar
      if (shotsArcher.length > -1) {
        if (!gameArea.checkGameOver() && !gameArea.checkWin());
        archer.shoot('archer');
        archer.isShooting = true;
      }
      break;
    case 40: // <== space bar
      if (shotsSkell.length > -1) {
        if (!gameArea.checkGameOver() && !gameArea.checkWin());
        skell.shoot('skell');
        skell.isShooting = true;
      }
      break;
  }
};

document.onkeyup = function (e) {
  archer.speedX = 0;
  archer.isWalking = false;
  archer.isShooting = false;
};
// -------------------------------------------

// let player;
// let torre;
// let shots = [];
// const arrow = [];
// const enemiesList = [];

// const myGameArea = {
//   canvasWidth: theCanvas.width,
//   canvasHeight: theCanvas.height,
//   canvas: theCanvas,
//   frames: 0,
//   start: function () {
//     this.interval = setInterval(updateGameArea, 20);
//     player = new Character(880, 537, 70, 130, './images/elfo0.png');
//     torre = new Tower(850, 235, 215, 300, './ImagesOnProgress/towerPlace.png');
//     arrow = new Projectile(500, 500, 50, 20, './images/flecha.png');
//   },
//   stop: function () {
//     clearInterval(this.interval);
//   },
//   clear: function () {
//     ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
//   }
//   // score: function () {
//   //   const points = Math.floor(this.frames / 5);

//   // ctx.font = '18px serif';
//   // ctx.fillStyle = 'black';
//   // ctx.fillText(`Score: ${points}`, 350, 50);
//   // }
// };

// function updateGameArea() {
//   myGameArea.clear();
//   updateEnemies();
//   player.update();
//   torre.update();
//   // arrow.update();
//   updateProjectile();
//   // checkGameOver();
//   // myGameArea.score();
// }

//     this.img.onload = this.update;
//     this.id = Math.round(Math.random() * 10000);
//   }

//   receiveDamage(damage) {
//     this.health -= damage;
//   }

//   shoot(shooter) {
//     shots.unshift(new Shot(shooter, this.attackDamage, this.x, this.y + 11));
//   }

//   update() {
//     // console.log(this);
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
//   }
//   // COMEÇA O TESTE DE PROJETIL **************
// }

// class Projectile {
//   constructor(x, y, width, height, imageSrc) {
//     this.img = new Image();

//     this.img.src = imageSrc;
//     this.x = x;
//     this.y = y;

//     this.width = width;
//     this.height = height;
//     this.img.onload = this.update;
//   }

//   // crashWith(arrow) {
//   //   return !(
//   //     this.bottom() < obstacle.top() ||
//   //     this.top() > obstacle.bottom() ||
//   //     this.right() < obstacle.left() ||
//   //     this.left() > arrow.right()
//   //   );
//   // }

//   update() {
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
//   }
// }

// function updateProjectile() {
//   myGameArea.frames += 1;
//   if (myGameArea.frames % 120 === 0) {
//     let x = 0;

//     arrow.push(new Projectile(865, 585, 60, 30, './images/flecha.png'));
//   }

//   for (i = 0; i < arrow.length; i++) {
//     arrow[i].x += -20;
//     arrow[i].update();
//   }
//   if (arrow[i].x <= 0) {
//     // COORD. MENOR Q ZERO => SPLICE (REMOVER DO ARRAY)
//     arrow.splice();
//     console.log(arrow);
//   }
// }

// // TERMINA O TESTE DE PROJETIL ****************

// // TESTE PARA CRIAR OBJETO (PREDIO) ************

// class Tower {
//   // <== genereic character
//   constructor(x, y, width, height, imageSrc) {
//     this.img = new Image();

//     this.img.src = imageSrc;
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//     this.img.onload = this.update;
//   }
//   update() {
//     // console.log(this);
//     // ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
//   }
// }

// // FIM DO TESTE

// function updateEnemies() {
//   myGameArea.frames += 1;
//   if (myGameArea.frames % 360 === 0) {
//     let x = 0;

//     enemiesList.push(new Character(0, 462, 60, 80, './images/skell.png'));
//   }

//   for (i = 0; i < enemiesList.length; i++) {
//     enemiesList[i].x += 0.5;
//     enemiesList[i].update();
//   }
//   // if (enemiesList[i].x === player.x) {
//   //   enemiesList[i].x - 1;
//   //   enemiesList[i].update();
//   // }
//   // if (enemiesList[i].x === player.x) {
//   //   enemiesList[i].remove[i];
//   // }
// }

// myGameArea.start();

// // console.log(player.img);
// // function draw(x, y) {
// //   const theCanvas = document.getElementById('canvas');
// //   const ctx = theCanvas.getContext('2d');

// //   ctx.clearRect(0, 0, 300, 300);
// //   ctx.drawImage(skell, skellX, skellY, 100, 100);

// //   // skellX += 3;

// //   setTimeOut(`draw(${x}, ${y})`, 30);
// // }
