const wong = {};

let fr = 0;
const frate = 60;
const maxSeconds = 2;
const maxFrames = maxSeconds * frate;

const w = 1080;
const h = 1080;

let sys;

function setup() {
  createCanvas(w, h);

  frameRate(frate);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  setWong();

  const k = 5;
  sys = new System(k, 3 * w * k);
}

function draw() {
  background(wong.background);

  sys.move();
  sys.show();

  noLoop();
}

class System {
  constructor(count, r) {
    this.balls = [];
    for (let i = 0; i < count; i++) {
      const mb = new Metaball(random(width), random(height));
      this.balls.push(mb);
    }

    this.r = r;
  }

  move() {
    this.balls.forEach((b) => b.move());
  }

  show() {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let sumDist = 0;

        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i];
          sumDist += dist(x, y, ball.x, ball.y);
        }

        const k = this.r / sumDist;
        const kPoint = k % 1;
        let baseClr = chooseColor(floor(k)); // wong.pnk

        const clr = lerpColor(baseClr, wong.blk, kPoint);

        set(x, y, clr);
      }
    }

    updatePixels();

    push();
    noFill();
    stroke(wong.blk);
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      circle(ball.x, ball.y, this.r);
    }
    pop();
  }
}

class Metaball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.setSpeed(random(10), random(10));
  }

  placeTo(x, y) {
    this.x = x;
    this.y = y;
  }

  setSpeed(speedX, speedY) {
    this.speedX = speedX;
    this.speedY = speedY;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.x %= width;
    this.y %= height;
  }
}

function toCartesian(r, theta) {
  const x = r * cos(theta);
  const y = r * sin(theta);

  return createVector(x, y);
}

function setAlpha(c, a) {
  return color(red(c), green(c), blue(c), constrain(a, 0, 255));
}

function chooseColor(n) {
  const clrs = [
    wong.blu,

    wong.orng,

    wong.grn,

    wong.drblu,

    wong.drorng,
    wong.pnk,
    wong.blk,
    wong.ylw,
  ];

  return choose(clrs, n);
}

function choose(arr, n) {
  const index = floor(n) % arr.length;

  return arr[index];
}

function setWong() {
  wong.blk = color("#000000");
  wong.orng = color("#e69f00");
  wong.blu = color("#56b4e9");
  wong.grn = color("#009e73");
  wong.ylw = color("#f0e442");
  wong.drblu = color("#0072b2");
  wong.drorng = color("#d55e00");
  wong.pnk = color("#cc79a7");
  wong.background = color("#eeeeee");
  // https://davidmathlogic.com/colorblind
}

function addNulls(n, length) {
  let result = "";
  for (i = 0; i < length + 1; i++) {
    result += "0";
  }

  result += n;

  reverseResult = result.split("").reverse().join("");

  reverseResult = reverseResult.substring(0, length);

  result = reverseResult.split("").reverse().join("");

  return result;
}
