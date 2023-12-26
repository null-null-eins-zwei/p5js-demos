const wong = {};

const frate = 60;
const maxSeconds = 2;
const maxFrames = maxSeconds * frate;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  background(wong.background);
  grd = new grid(8, 1);
}

function draw() {
  grd.step();

  if (frameCount % maxFrames == 0) {
    grd = new grid(8, grd.initRotator * -1);
    //noLoop();
  }
}

class grid {
  constructor(count, initRotator = 1) {
    this.initRotator = initRotator;
    this.ls = [];

    const minConvasSide = min(width, height);
    const squareSide = floor(minConvasSide / (count + 2));
    const squareHalfSide = floor(squareSide / 2);

    const centerX = floor(width / 2);
    const centerY = floor(height / 2);

    let leftStart = centerX - count * squareHalfSide;
    let topStart = centerY - count * squareHalfSide;

    let rotatorI = this.initRotator;

    for (let i = 0; i < count; i++) {
      rotatorI *= -1;
      let rotatorJ = rotatorI;

      for (let j = 0; j < count; j++) {
        const xi = leftStart + squareHalfSide + i * squareSide;
        const yj = topStart + squareHalfSide + j * squareSide;

        this.ls.push(new sq(xi, yj, squareSide, rotatorJ));
        rotatorJ *= -1;
      }
    }
  }

  step() {
    for (let i = 0; i < this.ls.length; i++) {
      this.ls[i].step();
    }
  }
}

class sq {
  #x = 0;
  #y = 0;

  #sizeInit = 0;
  #s = 0;

  #r = 0;
  #i = 0;
  #deltaAngle = PI / 50;

  constructor(x, y, size, rotation = 0) {
    this.#x = x;
    this.#y = y;

    this.#sizeInit = size;
    this.#s = size;

    this.#r = constrain(rotation, -1, 1);
    this.#i = 0;
  }

  step() {
    const halfSize = floor(this.#s / 2);

    const c = lerpColor(wong.blk, wong.drblu, this.#s / this.#sizeInit);

    push();
    translate(this.#x, this.#y);

    const newAngle = this.#i * this.#r * this.#deltaAngle;
    rotate(newAngle);

    stroke(c);
    fill(wong.background);
    square(-halfSize, -halfSize, this.#s);
    pop();

    this.#i++;

    this.#s = (this.#s * sin(PI / 4)) / sin(PI / 4 + PI / 2 - this.#deltaAngle);
  }
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
