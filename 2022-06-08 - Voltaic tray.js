const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

let angle = 0;
let nz;

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(3, 0.5);

  setWong();
}

function draw() {
  background(wong.background);

  nz = getNoise(20, 20, angle, 0.0005);
  angle += TWO_PI / maxFrames;
  angle %= TWO_PI;

  const xStep = width / nz.length;
  const yStep = height / nz[0].length;

  for (let ix = 0; ix < nz.length; ix++) {
    for (let iy = 0; iy < nz[ix].length; iy++) {
      const tx = ix * xStep + xStep / 2;
      const ty = iy * yStep + yStep / 2;
      const coils = map(nz[ix][iy], 0, 255, 1.5, 5);

      const andleDelta = -angle + map(nz[ix][iy], 0, 255, 0, TWO_PI);
      spiral(tx, ty, xStep / 2 - 2, coils, andleDelta);
    }
  }

  //noLoop();

  const loopStart = 0;
  if (frameCount >= loopStart && frameCount <= maxFrames + loopStart) {
    frameRate(10);

    const fileName = `p5_${addNulls(frameCount - loopStart, 4)}`;
    //saveCanvas(fileName, 'jpg');
    console.log(`saved ${fileName}`);
  } else {
    frameRate(frate);
    console.log("DONE");
    noLoop();
  }
}

function spiral(x, y, r, coils, thetaDelta) {
  const segments = 100;
  push();
  translate(x, y);
  noFill();
  stroke(wong.drblu);
  beginShape();
  for (let i = 0; i < segments; i++) {
    const ri = map(i, 0, segments, 1, r);
    const thi = (thetaDelta + map(i, 0, segments, 0, TWO_PI * coils)) % TWO_PI;

    const coord = toCartesian(ri, thi);
    curveVertex(coord.x, coord.y);
  }
  endShape();
  pop();
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
