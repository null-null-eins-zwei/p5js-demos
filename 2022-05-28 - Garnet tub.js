const wong = {};

let fr = 0;
const frate = 60;
const maxSeconds = 2;
const maxFrames = maxSeconds * frate;

const w = 1080;
const h = 1080;

const allColors = [];

function setup() {
  createCanvas(w, h);

  frameRate(1 / 30);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  setWong();

  const ds = new dickinsonia();
  dsGraph = ds.getImg();
  dsGraph.loadPixels();

  for (let x = 0; x < dsGraph.width; x++) {
    allColors[x] = [];
    for (let y = 0; y < dsGraph.height; y++) {
      let d = dsGraph.pixelDensity();
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          index = 4 * ((y * d + j) * width * d + (x * d + i));
          const r = dsGraph.pixels[index];
          const g = dsGraph.pixels[index + 1];
          const b = dsGraph.pixels[index + 2];
          const a = dsGraph.pixels[index + 3];

          allColors[x][y] = color(r, g, b, a);
        }
      }
    }
  }
  //ds.show();
  dsGraph.remove();
}

function draw() {
  background(wong.background);

  const loopFrame = fr % maxFrames;
  const theta = map(loopFrame, 0, maxFrames - 1, 0, HALF_PI / 6);

  const d1 = new dots(17, +PI / 3 + theta);
  const d2 = new dots(16, -PI / 3 - theta);
  const d3 = new dots(15, 0 + theta * 2);

  d3.showOverlap(wong.grn);
  d2.showOverlap(wong.orng);
  d1.showOverlap(wong.blu);

  const loopStart = 0;
  if (fr <= maxFrames) {
    frameRate(1 / 30);
    //saveCanvas(`p5_${addNulls(fr-loopStart, 4)}`, 'jpg');
    console.log(fr);
  } else {
    noLoop();
    console.log("done");
  }

  fr++;

  noLoop();
}

class dots {
  constructor(r, angle) {
    this.r = r;
    this.angle = angle;
    this.sinA = sin(angle);
    this.cosA = cos(angle);
  }

  calculate() {
    const result = [];

    for (let x = -width; x < width * 2; x += this.r) {
      for (let y = -width; y < width * 2; y += this.r) {
        const x1 = x * this.cosA - y * this.sinA;
        if (-100 > x1 || x1 > width + 100) {
          continue;
        }

        const y1 = y * this.cosA + x * this.sinA;
        if (-100 > y1 || y1 > height + 100) {
          continue;
        }

        result.push(createVector(x1, y1));
      }
    }

    return result;
  }

  showOverlap(c) {
    const dts = this.calculate();

    let ix, iy, slice;

    const hueC = hue(c);
    const brC = brightness(c);

    push();

    for (let i = 0; i < dts.length; i++) {
      ix = dts[i].x;
      iy = dts[i].y;

      if (0 > ix || ix > width) {
        continue;
      }

      if (0 > iy || iy > height) {
        continue;
      }

      const clrs = readColorsInRadius(ix, iy, this.r);

      let hueAvg = 0;
      let brAvg = 0;

      for (let j = 0; j < clrs.length; j++) {
        hueAvg += hue(clrs[j]);
        brAvg += brightness(clrs[j]);
      }

      hueAvg /= clrs.length;
      brAvg /= clrs.length;

      const hueDiff = abs(hueC - hueAvg);
      const size = map(hueDiff, 255, 0, 1, this.r * 0.75);

      let alpha = 230 * (brAvg / (brC + 1));
      alpha = constrain(alpha, 15, 230);

      stroke(setAlpha(c, alpha));
      strokeWeight(size);
      point(ix, iy);
    }
    pop();
  }

  show(size, c) {
    const dts = this.calculate();

    push();
    strokeWeight(size);
    stroke(c);
    for (let i = 0; i < dts.length; i++) {
      point(dts[i].x, dts[i].y);
    }
    pop();
  }
}

function readColorsInRadius(x, y, r) {
  const result = [];

  for (let xi = x - r / 2; xi < x + r / 2; xi++) {
    for (let yi = y - r / 2; yi < y + r / 2; yi++) {
      const xic = floor(constrain(xi, 0, width - 1));
      const yic = floor(constrain(yi, 0, height - 1));

      const col = allColors[xic][yic];
      result.push(col);
    }
  }

  return result;
}

function getHueAvg(img) {
  img.loadPixels();

  let hueAvg = 0;
  for (let sx = 0; sx < img.width; sx++) {
    for (let sy = 0; sy < img.height; sy++) {
      hueAvg += hue(img.get(sx, sy));
    }
  }
  hueAvg /= img.width * img.height;

  return hueAvg;
}

function getImage() {}

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
