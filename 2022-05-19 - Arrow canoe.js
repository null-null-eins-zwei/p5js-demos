const wong = {};

const frate = 60;
const maxSeconds = 5;
const maxFrames = maxSeconds * frate;

const w = 1080;
const h = 1080;

const segLen = 10;
const segCount = 12;
const rowCount = 18;

let theta = 0;
const data = [];

let graphic;

function setup() {
  createCanvas(w, h);
  frameRate(frate);
  smooth();

  setWong();
  let fill = shuffle(generateFill(segCount));

  const offset = width / rowCount / 2;
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      const index = j * rowCount + i;

      data.push({
        x: map(i, 0, rowCount, 0, width) + offset,
        y: map(j, 0, rowCount, 0, height) + offset,
        rot: choose(fill, index),
      });
    }
  }

  graphic = getGraphic();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  background(wong.background);
}

function draw() {
  background(wong.background);

  const k = kaleidoscope(graphic, { startAngle: theta, count: 11 });
  graphic.remove();

  imageMode(CENTER);
  translate(w / 2, w / 2);
  image(k, 0, 0);
  k.remove();

  theta += TWO_PI / maxFrames;
  theta %= TWO_PI;

  const loopStart = maxFrames;
  if (frameCount > loopStart && frameCount <= maxFrames * 2) {
    //frameRate(2);
    //saveCanvas(`p5_${addNulls(frameCount-loopStart, 4)}`, 'jpg');
  } else {
    frameRate(frate);
  }

  //noLoop();
}

function getGraphic() {
  const pg = createGraphics(w * 1.5, h * 1.5);
  pg.background(wong.background);

  let arr;

  for (let k = 0; k < data.length; k++) {
    const x = data[k].x;
    const y = data[k].y;
    const rot = data[k].rot;

    pg.strokeWeight(3);
    pg.push();
    pg.translate(x, y);

    pg.stroke(chooseColor(k));
    for (let i = 0; i < rot.length; i++) {
      let angle = 0;
      switch (rot[i]) {
        case 0:
          angle = -HALF_PI;
          break;
        case 1:
          angle = +HALF_PI;
          break;
      }

      pg.rotate(angle);
      pg.line(0, 0, segLen, 0);
      pg.translate(segLen, 0);
    }
    pg.pop();
  }

  return pg;
}

function kaleidoscope(graphics, { startAngle = 0, count = 3 } = {}) {
  const rotateAngle = TWO_PI / count;
  const endAngle = startAngle + rotateAngle;

  const mask = createGraphics(graphics.width, graphics.height);
  mask.background(wong.blk);
  mask.translate(mask.width / 2, mask.height / 2);
  mask.stroke(wong.background);
  mask.fill(wong.background);
  mask.arc(0, 0, w * 2, h * 2, startAngle, endAngle, PIE);

  const maskedGraphics = applyMask(graphics, mask);
  mask.remove();

  const result = createGraphics(w, h);
  result.translate(result.width / 2, result.height / 2);
  result.imageMode(CENTER);

  result.push();
  for (let i = 0; i < count; i++) {
    result.image(maskedGraphics, 0, 0);
    result.rotate(rotateAngle);
  }
  result.pop();

  maskedGraphics.remove();

  return result;
}

function applyMask(source, mask) {
  mask.loadPixels();
  source.loadPixels();

  const result = createGraphics(source.width, source.height);

  result.loadPixels();
  for (let i = 0; i < source.pixels.length; i += 4) {
    const show = mask.pixels[i] > 125;
    if (!show) {
      result.pixels[i + 3] = 0;
      continue;
    }

    result.pixels[i + 0] = source.pixels[i + 0];
    result.pixels[i + 1] = source.pixels[i + 1];
    result.pixels[i + 2] = source.pixels[i + 2];
    result.pixels[i + 3] = source.pixels[i + 3];
  }
  result.updatePixels();

  return result;
}

function generateFill(n) {
  const result = [];

  result.push([0]);
  result.push([1]);

  do {
    const prevLen = result.length;

    for (let i = 0; i < prevLen; i++) {
      result.push([...result[i], 0], [...result[i], 1]);
    }

    for (let i = 0; i < prevLen; i++) {
      result.shift();
    }
  } while (result[0].length < n);

  return result;
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
