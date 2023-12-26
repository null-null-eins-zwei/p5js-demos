const frate = 3;
const noiseScale = 0.02;

let wong;

let nz = 0;

const side = 15;
const side60 = side * Math.sin(Math.PI / 3); // 60 degree, equilateral triangle

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);

  noiseSeed(69);
  noiseDetail(3, 0.3);

  pixelDensity(1);
  smooth();

  setWong();

  let d = pixelDensity();
}

function draw() {
  background(wong.background);

  nz++;
  const nPixels = getNoizes(nz, noiseScale);

  noStroke();

  let txx;
  let tyy;

  for (let xx = 0; xx < width; xx += side60 * 2) {
    beginShape(TRIANGLE_STRIP);

    for (let yy = 0; yy < height; yy += side60) {
      txx = xx;
      tyy = yy;

      placeFilledVertex(nPixels, txx, tyy);

      txx = xx + side60;
      tyy = yy + side60 / 2;

      placeFilledVertex(nPixels, txx, tyy);
    }

    endShape();
    beginShape(TRIANGLE_STRIP);

    for (let yy = 0; yy < height; yy += side60) {
      txx = xx + side60 * 2;
      tyy = yy;

      placeFilledVertex(nPixels, txx, tyy);

      txx = xx + side60;
      tyy = yy - side60 / 2;
      //tyy = yy + side60 / 2;

      placeFilledVertex(nPixels, txx, tyy);
    }
    endShape();
  }

  if (nz > 100) {
    noLoop();
  }

  noLoop();
}

function placeFilledVertex(nPixels, xx, yy) {
  const c = getColor(nPixels, xx, yy);
  fill(c);
  stroke(c);
  vertex(xx, yy);
}

function getColor(nPixels, xx, yy) {
  const fixxx = floor(constrain(xx, 0, width - 1));
  const fixyy = floor(constrain(yy, 0, height - 1));

  const ns = nPixels[fixxx][fixyy];

  const cl = chooseColor(ns);

  return cl;
}

function getNoizes(zz, scale) {
  const result = [];
  let min = 1;
  let max = 0;

  for (let xx = 0; xx < width; xx++) {
    const xxrow = [];
    for (let yy = 0; yy < height; yy++) {
      const n = noise(xx * scale, yy * scale, zz * scale);

      min = Math.min(min, n);
      max = Math.max(max, n);

      xxrow.push(n);
    }
    result.push(xxrow);
  }

  for (let xx = 0; xx < width; xx++) {
    for (let yy = 0; yy < height; yy++) {
      result[xx][yy] = map(result[xx][yy], min, max, 0, 1);
    }
  }

  return result;
}

function chooseColor(n) {
  const clrs = [wong.blk, wong.orng, wong.background, wong.drblu, wong.drblu];

  const fn = constrain(n, 0, 1);
  const index = Math.floor(map(fn, 0, 1, 0, clrs.length - 1));

  return clrs[index];
}

function setWong() {
  wong = {
    blk: color("#000000"),
    orng: color("#e69f00"),
    blu: color("#56b4e9"),
    grn: color("#009e73"),
    ylw: color("#f0e442"),
    drblu: color("#0072b2"),
    drorng: color("#d55e00"),
    pnk: color("#cc79a7"),
    background: color("#eeeeee"),
    // https://davidmathlogic.com/colorblind
  };
}
