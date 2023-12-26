const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

const dotCount = 100;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  background(wong.background);

  noLoop();
}

function draw() {
  const minR = (width * 0.05) / 2;
  const maxR = (width * 0.9) / 2;

  //let offsetTheta = -PI / 2;
  const minTheta = 0;
  const maxTheta = TWO_PI;

  let spiralLength = 0;
  let prevX = 0;
  let prevY = 0;

  noFill();
  translate(width / 2, height / 2);

  stroke(wong.blu);
  for (let i = 0; i < dotCount; i++) {
    const r = map(i, 0, dotCount - 1, minR, maxR);
    circle(0, 0, r * 2);
  }

  stroke(wong.drblu);
  strokeWeight(3);

  const spiralsCount = 5;
  for (let s = 0; s < spiralsCount; s++) {
    const offsetTheta = map(s, 0, spiralsCount, 0, TWO_PI);

    for (let i = 0; i < dotCount; i++) {
      const r = map(i, 0, dotCount - 1, minR, maxR);
      const theta = map(i, 0, dotCount - 1, minTheta, maxTheta);

      ({ x, y } = toCartesian(r, theta + offsetTheta));

      if (prevX != 0) {
        spiralLength += dist(x, y, prevX, prevY);
      }

      push();
      point(x, y);
      pop();

      prevX = x;
      prevY = y;
    }
  }
}

function toCartesian(r, theta) {
  return {
    x: r * cos(theta),
    y: r * sin(theta),
  };
}

function chooseColor(n) {
  const clrs = [wong.orng, wong.blu, wong.drorng];

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
