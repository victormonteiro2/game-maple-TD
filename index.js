const skellNormal = new Image();
skellNormal.src = './images/skell.png';
let skellDead = new Image();
skellDead.src = './images/skellDead.png';
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
backgroundWin.src = './images/background-win.jpg';
let backgroundLose = new Image();
backgroundLose.src = './images/background-lose.jpg';
let towerNormal = new Image();
towerNormal.src = './images/towerNormal.png';
let towerDown = new Image(); // ADICIONAR TORRE
towerDown.src = './imagesOnProgress/towerPlace.png'; //ADICIONAR TORRE DOWN
let arrow = new Image();
arrow.src = './images/arrow.png';

/* canvas and global variables*/
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let shotsArcher = [];
let shotsSkell = [];
let enemiesList = [];
let enemiesDead = [];
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
  },
  checkGameOver: function () {
    if (archer.health <= 0) {
      return true;
    } else {
      return false;
    }
  },
  checkWin: function () {
    if (gameArea.frame === 3100) {
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
      new Shot(shooter, this.attackDamage, this.x, this.y + 50)
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
    context.drawImage(arrow, shot.x, 572);
  }

  shotUpdate() {
    shotsArcher.forEach((shot, i) => {
      if (shot.x >= 0) {
        this.drawArcherPower(shot);
        shot.x += -20;
        // set time to reset normal position image
        if (shotsArcher.length > 0 && shotsArcher[0].x > archer.x + 60) {
          archer.isShooting = false;
        }
      }
    });
  }
}

// NPC --------------------------

class Boss extends Character {
  constructor(x, y, width, height, imageSrc, health, attackDamage) {
    super(x, y, width, height, imageSrc, health, attackDamage);
    this.isShooting = false;
    this.isWalking = false;
  }
  shoot(shooter) {
    shotsSkell.unshift(
      new Shot(shooter, this.attackDamage, this.x + 100, this.y + 50)
    );
  }

  newPos() {
    if (this.x <= 700 && this.health > 0) {
      this.isWalking = true;
      this.x += 1;
    } else {
      this.isWalking = false;
    }
  }

  drawBoss(sprite) {
    context.drawImage(sprite, this.x, this.y); // trocar por parametro (nome)
  }

  drawBossPower(shot) {
    context.lineWidth = 1;
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(shot.x, shot.y, 0.1, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'white';
    context.stroke();
    console.log(shotsSkell);
  }

  shotUpdate() {
    shotsSkell.forEach((shot, i) => {
      if (shot.x >= 0) {
        this.drawBossPower(shot);
        shot.x += +1;
        // set time to reset normal position image
        if (shotsSkell.length > 0 && shotsSkell[0].x > this.x + 60) {
          this.isShooting = false;
        }
      }
      if (shot.x === archer.x + 1 || shot.x === archer.x + 2) {
        shotsSkell.pop();
        archer.receiveDamage(this.attackDamage);
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
    if (obstacle.health <= 0) {
      return false;
    }

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
const torre = new Tower(780, 170, 100, 600, towerNormal, 100, 0);

// POR ULTIMO

function generateEnemies() {
  if (gameArea.frame % 120 === 0) {
    enemiesList.push(new Boss(0, 520, 70, 110, skellNormal, 100, 50));
  }
}

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
    context.drawImage(backgroundLose, 0, 0, 1080, 768);
    context.fillText('You Lose!', 1080, 768); // CORRIGIR IMAGENS WIN/LOSE
    setInterval(() => window.location.reload(), 6000);
  } else if (gameArea.checkWin()) {
    // audio3.pause();
    cancelAnimationFrame(update);
    // audio5.play();
    context.drawImage(backgroundWin, 0, 0, 1080, 768);
    context.fillStyle = 'black';
    context.font = '50px Arial';
    context.fillText('You Win!', 1080, 768);
    setInterval(() => window.location.reload(), 6000);
  } else {
    // audio3.play();
    archer.newPos();

    gameArea.clear();
    torre.drawTower();
    archer.drawArcher();
    archer.shotUpdate();
    shotsArcher.forEach((shot, i) => {
      enemiesList.forEach((skell) => {
        if (shot.crashWith(skell)) {
          skell.receiveDamage(shot.damage);
          shotsArcher.splice(i, 1);
        }
      });
    });
    generateEnemies();
    enemiesList.forEach((skell, i) => {
      skell.newPos();
      skell.shotUpdate();
      if (skell.health <= 0) {
        skell.drawBoss(skellDead);
        enemiesList.splice(i, 1);
      } else {
        skell.drawBoss(skellNormal);
      }
      shotsSkell.forEach((shot, i) => {
        if (shot.crashWith(skell)) {
          archer.receiveDamage(shot.damage);
          shotsSkell.splice(i, 1);
        }
      });
      if (skell.health > 0) {
        if (skell.health > 75) {
          if (!skell.isWalking && gameArea.frame % 90 === 0) {
            skell.shoot('skell');
          }
        } else if (skell.health > 50) {
          if (!skell.isWalking && gameArea.frame % 75 === 0) {
            skell.shoot('skell');
          }
        } else if (skell.health > 25) {
          if (!skell.isWalking && gameArea.frame % 60 === 0) {
            skell.shoot('skell');
          }
        } else {
          if (!skell.isWalking && gameArea.frame % 45 === 0) {
            skell.shoot('skell');
          }
        }
      }
    });
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
  }
};

document.onkeyup = function (e) {
  archer.isWalking = false;
  archer.isShooting = false;
};
