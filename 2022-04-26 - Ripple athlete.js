const frate = 3;
const noiseScale = 0.02;

class pxl {
  constructor(x, y) {
    this.x = x;
    this.y = x;
  }
}

let wong;

let nz = 0;
let d;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);

  noiseSeed(69);
  noiseDetail(3, 0.3);

  pixelDensity(1);
  smooth();

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

  let d = pixelDensity();
}

function draw() {
  background(wong.background);

  nz++;

  loadPixels();

  const nPixels = getNoizes(nz, noiseScale);

  for (let xx = 0; xx < width; xx++) {
    for (let yy = 0; yy < height; yy++) {
      const c = chooseColor(nPixels[xx][yy]);

      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          const wd = width * d;
          const xxd = xx * d;
          const yyd = yy * d;

          index = 4 * ((yyd + j) * wd + (xxd + i));

          pixels[index] = red(c);
          pixels[index + 1] = green(c);
          pixels[index + 2] = blue(c);
          pixels[index + 3] = 255;
        }
      }
    }
  }

  updatePixels();

  noLoop();
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

  const index = Math.floor(map(n, 0, 1, 0, clrs.length - 1));

  return clrs[index];
}
