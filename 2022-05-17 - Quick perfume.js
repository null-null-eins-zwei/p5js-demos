const wong = {};

const frate = 60;
const maxSeconds = 5;
const maxFrames = maxSeconds * frate;

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);
  smooth();

  setWong();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  background(wong.background);
}

function draw() {
  push();

  translate(width / 2, height / 2);
  stroke(wong.drblu);
  strokeWeight(2);
  noFill();

  const between = 10;
  let zNoise = 0;

  for (let r = 50; r < width * 0.4; r += 10) {
    const circleLength = TWO_PI * r;
    const dotsCount = floor(circleLength / between);

    const c1 = new noiseCircle(r, dotsCount, 30, zNoise);
    c1.show();

    zNoise += 0.3;
  }

  pop();

  noLoop();
}

class noiseCircle {
  constructor(r, n, kNoise, zNoise) {
    this.r = r;
    this.n = n;
    this.kNoise = kNoise;
    this.zNoise = zNoise;
  }

  show() {
    push();

    let cart = toCartesian(this.r, 0);

    beginShape();
    curveVertex(cart.x, cart.y);
    for (let i = 0; i < this.n; i++) {
      const theta = map(i, 0, this.n - 1, 0, TWO_PI);

      const rDelta = noise(theta, this.zNoise) * this.kNoise;

      cart = toCartesian(this.r + rDelta, theta);

      curveVertex(cart.x, cart.y);
    }

    endShape();
    pop();
  }
}

function toCartesian(r, theta) {
  const x = r * cos(theta);
  const y = r * sin(theta);

  return createVector(x, y);
}

function chooseColor(n) {
  const clrs = [
    wong.blu,
    wong.orng,

    wong.blk,
    wong.grn,

    wong.ylw,
    wong.drblu,

    wong.drorng,
    wong.pnk,
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
