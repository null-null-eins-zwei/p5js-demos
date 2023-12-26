const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

const offset = 100;
let dieFarbeGraf = 5;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  randomSeed(69);

  background(wong.background);
  noFill();
  strokeWeight(2);
}

function draw() {
  const maxFy = height - offset;

  const loopStart = maxFy / dieFarbeGraf;
  const loopEnd = loopStart + 500;

  if (frameCount >= loopStart && frameCount <= loopEnd) {
    //frameRate(3);
    //saveCanvas(`p5_${addNulls(frameCount-loopStart, 4)}`, 'jpg');
  } else {
    //frameRate(frate);
  }

  for (let c = 0; c < dieFarbeGraf; c++) {
    stroke(chooseColor(c));

    const fy = (frameCount * 2 + c * (maxFy / dieFarbeGraf)) % maxFy;
    doBezier(fy);
  }

  //noLoop();
}

function doBezier(y) {
  const start = new dot(offset, offset);
  const finish = new dot(width - offset, height - offset);

  /*
  bezier(
    start.x, start.y,
    start.x, finish.y,
    finish.x, start.y,
    finish.x, finish.y);
  */

  bezier(
    start.x,
    start.y,
    start.x,
    finish.y - y,
    finish.x,
    start.y,
    finish.x,
    finish.y
  );

  bezier(
    start.x,
    start.y,
    start.x,
    finish.y,
    finish.x,
    start.y + y,
    finish.x,
    finish.y
  );
}

class dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    point(this.x, this.y);
  }

  static get random() {
    return new dot(random(width), random(height));
  }
}

function chooseColor(n) {
  const clrs = [
    wong.ylw,
    wong.drblu,

    wong.pnk,
    wong.blk,

    wong.drorng,
    wong.blu,
  ];

  const index = floor(n) % clrs.length;

  return clrs[index];
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
