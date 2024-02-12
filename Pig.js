// basic environment setup
const introsound = new Audio("./music/introSong.mp3");
const shootingsound = new Audio("./music/shoooting.mp3");
const killenemysound = new Audio("./music/killEnemy.mp3");
const gameoversound = new Audio("./music/gameOver.mp3");
const heavysound = new Audio("./music/heavyWeapon.mp3");
const hugesound = new Audio("./music/hugeWeapon.mp3");

introsound.play();
let canvas = document.createElement("canvas");
document.querySelector(".my-game").appendChild(canvas);
let scoretag = document.querySelector(".score");
canvas.width = innerWidth;
canvas.height = innerHeight;
let context = canvas.getContext("2d");
// damages weapons
const lightweapondamage = 20;
const heavyweapondamage = 35;
const hugeweapondamage = 50;

let totalscore = 0;
console.log(totalscore);
var diffcult = 2;
let form = document.querySelector("form");
let score = document.querySelector(".score");
// ---------------------------------------- onClick change easy,hard,very hard mode code most important change diffcult ------------
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();
  form.style.display = "none";
  score.style.display = "block";
  let allvalue = document.querySelector("#value").value;

  if (allvalue === "Easy") {
    setInterval(spawnenemy, 2000);
    return (diffcult = 5);
  }
  if (allvalue === "Medium") {
    setInterval(spawnenemy, 1400);
    return (diffcult = 8);
  }
  if (allvalue === "Hard") {
    setInterval(spawnenemy, 1000);
    return (diffcult = 10);
  }
  if (allvalue === "Insane") {
    setInterval(spawnenemy, 700);
    return (diffcult = 12);
  }
});

let gameoverload = () => {
  let gameoverbanner = document.createElement("div");
  let gameoverbtn = document.createElement("button");
  let highscore = document.createElement("div");
  let yourscore = document.createElement("div");
  highscore.innerHTML = `High Score :${
    localStorage.getItem("highscore")
      ? localStorage.getItem("highscore")
      : totalscore
  }`;
  let highsc =
    localStorage.getItem("highscore") && localStorage.getItem("highscore");
  if (highsc < totalscore) {
    localStorage.setItem("highscore", totalscore);
    highscore.innerHTML = `score:${totalscore}`;
  }
  gameoverbtn.innerText = "Play Again";
  gameoverbanner.appendChild(highscore);
  gameoverbanner.appendChild(gameoverbtn);
  gameoverbanner.appendChild(yourscore);
  yourscore.innerText = `Your Score:${totalscore}`;
  gameoverbtn.onclick = () => {
    window.location.reload();
  };
  gameoverbanner.classList.add("gameover");
  document.querySelector("body").appendChild(gameoverbanner);
};

// --------------------  middle player white create-----
let position = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
class player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();

    context.stroke();
  }
}

// ----------------------- weapons realted size and click on window click weapons goes to clickable positions

class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();

    context.stroke();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//  ---  Enimies -------------.-----------.-------------.-

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();

    context.stroke();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
// particle class-----------------------------------------
let friction = 0.98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();

    context.stroke();
    context.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}
// Huge weapon for kill enemy
class Hugeweapon {
  constructor(x, y, color, damage) {
    this.x = x;
    this.y = y;

    this.color = color;

    this.damage = damage;
  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;

    context.fillRect(this.x, this.y, 200, canvas.height);

    context.fill();

    context.stroke();
  }
  update() {
    this.draw();
    this.x += 20;
  }
}
// ---first player create object
let firstarc = new player(position.x, position.y, 12, "white");
// ---------------
let weapons = [];
let enemys = [];
let particles = [];
let hugeweapons = [];

// ----very important function create enemies size position,whers is come all create here----------------
// random position
let spawnenemy = () => {
  const enemysize = Math.random() * (35 - 5) * 3;
  let enemycolor = `hsl(${Math.floor(Math.random() * 360)},100% ,50%)`;
  let random;
  // enemy location outside of screen
  if (Math.random() < 0.5) {
    // making x equal to right off of screen or left of screen setting y vertically
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemysize : 0 - enemysize,
      y: Math.random() * canvas.height,
    };
  } else {
    // making y equal to right off of screen or left of screen setting x horizontally
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemysize : 0 - enemysize,
    };
  }
  // angle bnetwewn player (centre player)
  let myangle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );
  // velocity and spedd choose to diffcult
  let velo = {
    x: Math.cos(myangle) * diffcult,
    y: Math.sin(myangle) * diffcult,
  };
  enemys.push(new Enemy(random.x, random.y, enemysize, enemycolor, velo));
};
// recursive function call itsekf again again ---------------------------------------------------
let animationid;

function animation() {
  animationid = requestAnimationFrame(animation);
  scoretag.innerHTML = `score:${totalscore}`;
  context.fillStyle = "rgba(49,49,49,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // clerReact delete before position to show
  // context.clearRect();
  // createa player
  firstarc.draw();

  // generting particles
  particles.forEach((part, partindex) => {
    if (Particle.alpha <= 0) {
      particles.splice(partindex, 1);
    } else {
      part.update();
    }
  });
  // generte hugeweapon
  hugeweapons.forEach((huge, hugeindex) => {
    // removing to go outside screen array
    if (huge.x > canvas.width) {
      hugeweapons.splice(hugeindex, 1);
    } else {
      huge.update();
    }
  });
  //generating bullet
  weapons.forEach((weapon, weaponindex) => {
    weapon.update();
    // deleting extra weapons in array
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      return weapons.splice(weaponindex, 1);
    }
  });

  //genertaing enemies
  enemys.forEach((enemy, enemyindex) => {
    enemy.update();
    let distancecalculateplayerandenemy = Math.hypot(
      // firstarc is player
      firstarc.x - enemy.x,
      firstarc.y - enemy.y
    );
    if (distancecalculateplayerandenemy - firstarc.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationid);
      gameoversound.play();
      gameoverload();
    }
    // hugeweapon
    hugeweapons.forEach((hugeweapon) => {
      // disatnce bwtween hugeweapon and enemy
      let distancebetweenhugeweaponandenemy = hugeweapon.x - enemy.x;
      if (
        distancebetweenhugeweaponandenemy <= 200 &&
        distancebetweenhugeweaponandenemy >= -200
      ) {
        // adding score player
        totalscore += 10;
        setTimeout(() => {
          // kill enimes
          killenemysound.play();
          enemys.splice(enemyindex, 1);
        }, 0);
      }
    });
    console.log(totalscore);

    weapons.forEach((weapon, weaponindex) => {
      // distance calculate betwwen player and enemy

      // distance calculate betwwen weapon and enemy

      let distancecalculateweaponandenemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );
      // if condition for kill touch of weapon
      if (distancecalculateweaponandenemy - weapon.radius - enemy.radius < 1) {
        // decrease the radius of weapon
        if (enemy.radius > weapon.damage + 8) {
          // gsap add to smooth animation
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });
          setTimeout(() => {
            weapons.splice(weaponindex, 1);
          }, 0);
        } else {
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 7),
                y: (Math.random() - 0.5) * (Math.random() * 7),
              })
            );
          }
          // adding score player

          totalscore += 10;
          scoretag.innerHTML = `Score:${totalscore}`;
          killenemysound.play();
          setTimeout(() => {
            // kill enimes
            enemys.splice(enemyindex, 1);
            // kill weapon to kill enimes
            weapons.splice(weaponindex, 1);
          }, 0);
        }
      }
    });
  });
}
// weapon onClick function and call here weapons
canvas.addEventListener("click", (e) => {
  // finding player to clcick emiames angke
  shootingsound.play();
  let myangle = Math.atan2(
    e.clientY - canvas.height / 2,

    e.clientX - canvas.width / 2
  );
  // speed
  let velo = {
    x: Math.cos(myangle) * 6,
    y: Math.sin(myangle) * 6,
  };
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      5,
      "white",
      velo,
      lightweapondamage
    )
  );
});

// right click eventlistner to hevy weapon acesss
canvas.addEventListener("contextmenu", (e) => {
  // finding player to clcick emiames angke
  // e.preventdafult se right click se inspect ka popup nahi chalta
  e.preventDefault();
  if (totalscore <= 0) return;
  // use this weapon score minus 2
  heavysound.play();

  totalscore -= 2;
  scoretag.innerHTML = `Score:${totalscore}`;

  let myangle = Math.atan2(
    e.clientY - canvas.height / 2,

    e.clientX - canvas.width / 2
  );
  // speed
  let velo = {
    x: Math.cos(myangle) * 4,
    y: Math.sin(myangle) * 4,
  };
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      15,
      "cyan",
      velo,
      heavyweapondamage
    )
  );
});
// animate function call here to call itself
addEventListener("keypress", (e) => {
  if (e.key == " ") {
    if (totalscore < 20) return;
    totalscore -= 20;
    scoretag.innerHTML = `Score:${totalscore}`;
    hugesound.play();
    hugeweapons.push(
      new Hugeweapon(0, 0, "rgba(81,55,194,1)", hugeweapondamage)
    );
  }
});
addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
addEventListener("resize", () => {
  window.location.reload();
});
animation();
