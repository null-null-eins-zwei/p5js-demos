const wong = {};

let fr = 0;
const frate = 60;
const maxSeconds = 2;
const maxFrames = maxSeconds * frate;

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  setWong();
}

function draw() {
  background(wong.background);

  const count = 6 * 1.5;
  const r = width * 0.45;
  const alpha = 100;

  translate(width / 2, height / 2);
  noStroke();

  blendMode(MULTIPLY);

  for (let i = 0; i < count; i++) {
    const angle = map(i, 0, count, 0, PI);
    const point1 = toCartesian(r / 2, angle);

    fill(setAlpha(chooseColor(i), alpha));
    circle(point1.x, point1.y, r);

    const point2 = toCartesian(r / 2, angle + PI);
    fill(setAlpha(chooseColor(i), alpha));
    circle(point2.x, point2.y, r);
  }

  blendMode(OVERLAY);
  fill(setAlpha(wong.background, 255));
  circle(0, 0, r);

  noLoop();
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
