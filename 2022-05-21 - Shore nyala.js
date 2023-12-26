// based on https://www.reddit.com/r/creativecoding/comments/awji8i/p5js_clifford_attractor/

const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

const w = 1080;
const h = 1080;

function setup() {
  createCanvas(w, h);

  frameRate(frate);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  setWong();
}

function draw() {
  let f = frameCount % maxFrames;
  let theta = map(f, 0, maxFrames, 0, TWO_PI);
  let parm = toCartesian(1, theta);

  //attractor = new clifford(-2, -2.4, 1.1, -0.9);
  let attractor = new clifford(-2 + parm.x, -2.4 + parm.y, 1.1, -0.9);

  background(wong.background);

  const dotCount = 100 * 1000;
  stroke(setAlpha(wong.blu, 10));
  noFill();

  beginShape();
  for (let i = 0; i < dotCount; i++) {
    const x0 = map(i, 0, dotCount - 1, -10, 10);
    const y0 = map(i, 0, dotCount - 1, -10, 10);

    const attrPoint = attractor.calculate(x0, y0, 9);
    curveVertex(attrPoint.x, attrPoint.y);

    //attractor.show(x0, y0, 10);
  }
  endShape();

  const loopStart = 0;
  if (frameCount > loopStart && frameCount <= maxFrames + loopStart) {
    frameRate(1);
    saveCanvas(`p5_${addNulls(frameCount - loopStart, 4)}`, "jpg");
  } else {
    frameRate(frate);
  }

  //noLoop();
}

class clifford {
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  calculate(x0, y0, iters) {
    let x = x0;
    let y = y0;

    for (let i = 0; i < iters; i++) {
      let xt = x;

      x = sin(this.a * y) + this.c * cos(this.a * x);
      y = sin(this.b * xt) + this.d * cos(this.b * y);
    }

    const pointX = map(x, -2.5, 2.5, 0, width);
    const pointY = map(y, -2.5, 2.5, height, 0);

    return createVector(pointX, pointY);
  }

  show(x0, y0, iters) {
    const p = this.calculate(x0, y0, iters);

    push();
    strokeWeight(1);
    stroke(setAlpha(wong.blu, 100));
    point(p.x, p.y);
    pop();
  }
}

function toCartesian(r, theta) {
  const x = r * cos(theta);
  const y = r * sin(theta);

  return createVector(x, y);
}

function setAlpha(c, a) {
  return color(red(c), green(c), blue(c), a);
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
