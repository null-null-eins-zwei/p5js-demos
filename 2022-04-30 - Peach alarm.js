const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

let off = 0;
let offMax = Math.PI * 2;
let offDelta = offMax / (frate * maxSeconds);

let grd;

let nz = 0;
let myTimer;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  grd = new grid(5, 5, 80);

  noLoop();

  myTimer = setInterval(drawFrame, 150);
}

function draw() {
  background(wong.background);

  grd.reset();
  off += offDelta;
  if (off > TWO_PI * 2) {
    off = 0;
  }

  for (let i = 0; i < 1500; i++) {
    grd.step(off);
  }

  const s = saveCanvas(`Peach_alarm_${addNulls(nz++, 4)}`, "jpg");
}

function drawFrame() {
  redraw();
  console.log(nz);
  if (off > TWO_PI) {
    clearTimeout(myTimer);
  }
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

class grid {
  constructor(countX, countY, size) {
    this.ls = [];

    const stepX = floor(width / (countX + 1));
    const stepY = floor(height / (countY + 1));

    for (let i = 0; i < countX; i++) {
      for (let j = 0; j < countY; j++) {
        const x = stepX + i * stepX;
        const y = stepY + j * stepY;
        this.ls.push(new Lissajous(x, y, i + 1, j + 1, size));
      }
    }
  }

  reset() {
    this.ls.forEach((l) => l.reset());
  }

  step(offset) {
    this.ls.forEach((l) => l.step(offset));
  }
}

class Lissajous {
  constructor(x, y, frx, fry, size) {
    this.centerX = x;
    this.centerY = y;

    this.frx = frx;
    this.fry = fry;

    this.size = size;

    this.t = 0;
    this.delta = 0.01;
  }

  reset() {
    this.t = 0;
  }

  step(offset) {
    const prevX =
      this.size * sin(this.frx * (this.t - this.delta * 50) + offset);
    const prevY = this.size * cos(this.fry * (this.t - this.delta * 50));

    const x = this.size * sin(this.frx * this.t + offset);
    const y = this.size * cos(this.fry * this.t);

    this.t += this.delta;
    this.t = this.t % TAU;
    push();
    translate(this.centerX, this.centerY);
    stroke(chooseColor(this.t));
    line(x, y, prevX, prevY);
    pop();
  }
}

function chooseColor(n) {
  const clrs = [wong.drblu, wong.ylw, wong.orng, wong.pnk, wong.blk, wong.grn];

  const index = floor(n) % clrs.length;

  return clrs[index];
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
