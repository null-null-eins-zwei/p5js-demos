const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

const count = 30;
const size = 100;

let r = 0;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  background(wong.background);

  noLoop();
}

function draw() {
  background(wong.background);
  strokeWeight(size / 5);

  const stepY = floor(height / (count + 1));
  const stepX = floor(width / (count + 1));

  r += 0.01;

  for (let x = 0; x < 3; x++) {
    stroke(chooseColor(x));

    translate(height / 2, width / 2);
    rotate(r);
    translate(-height / 2, -width / 2);

    for (let i = -count; i < 2 * count + 1; i++) {
      for (let j = -count; j < 2 * count + 1; j++) {
        const partsCount = i + j;
        const part = size / partsCount;

        const size1 = part * i;
        const size2 = part * j;

        const x = stepX + (i - 1) * stepX;
        const y = stepY + (j - 1) * stepY;

        point(x, y);
      }
    }
  }
}

function chooseColor(n) {
  const clrs = [wong.drorng, wong.orng, wong.blu];

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
