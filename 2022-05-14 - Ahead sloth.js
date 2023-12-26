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

let z = 0;

function draw() {
  z += TWO_PI / maxFrames;

  background(wong.background);
  const f = new field(40, 40, calculateField(z));
  f.show();

  const loopStart = maxFrames;
  if (frameCount > loopStart && frameCount <= maxFrames * 2) {
    // frameRate(2);
    // saveCanvas(`p5_${addNulls(frameCount-loopStart, 4)}`, 'jpg');
  } else {
    frameRate(frate);
  }

  //noLoop();
}

function calculateField(z) {
  return (fx, fy, countX, countY) => {
    const offset = toCartesian(2, z % TWO_PI);
    const n = noise(
      offset.x / 2 + fx / 9,
      offset.y / 2 + fy / 9,
      (offset.x + offset.y) / 3
    );

    return createVector(10, 2 * n * TWO_PI);
  };
}

class field {
  constructor(countX, countY, funcInit) {
    this.countX = countX;
    this.countY = countY;

    this.arr = [];
    for (let fx = 0; fx < countX; fx++) {
      const arrY = [];
      for (let fy = 0; fy < countY; fy++) {
        arrY.push(funcInit(fx, fy, countX, countY));
      }

      this.arr.push(arrY);
    }
  }

  show() {
    for (let fx = 0; fx < this.countX; fx++) {
      for (let fy = 0; fy < this.countY; fy++) {
        this.showCell(fx, fy);
      }
    }
  }

  showCell(fx, fy) {
    const valVect = this.arr[fx][fy];

    const sizeX = width / this.countX;
    const sizeY = height / this.countY;

    const leftUp = createVector(fx * sizeX + 0, fy * sizeY + 0);

    const rightDown = createVector(leftUp.x + sizeX, leftUp.y + sizeY);

    const middle = createVector(leftUp.x + sizeX / 2, leftUp.y + sizeY / 2);

    push();
    rectMode(CORNERS);
    /*
      rect(
          leftUp.x, leftUp.y,
          rightDown.x, rightDown.y);
*/
    translate(middle.x, middle.y);

    const r = valVect.x;
    const theta = valVect.y;
    const cart = toCartesian(r, theta);

    stroke(wong.blk);
    line(-cart.x, -cart.y, cart.x, cart.y);

    strokeWeight(5);
    point(cart.x, cart.y);
    point(-cart.x, -cart.y);

    //strokeWeight(3);
    //point(0, 0);
    pop();
  }
}

class fieldCell {
  constructor(angle, force) {
    this.angle = angle;
    this.force = force;
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
