const wong = {};

let fr = 0;
const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

function setup() {
  createCanvas(800, 800);

  frameRate(frate);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(2, 0.3);

  setWong();
}

function draw() {
  background(wong.background);
  translate(width / 2, height / 2);

  const step = maxFrames * sin((TWO_PI * fr) / maxFrames);

  const bgImg = getBackgroundGraphics(step);

  /*
  imageMode(CENTER);
  image(bgImg, 0, 0);
  */

  drawSpiral(bgImg);

  bgImg.remove();

  //noLoop();
  fr++;

  const loopStart = 0;
  if (frameCount >= loopStart && frameCount <= maxFrames + loopStart) {
    frameRate(1);

    const fileName = `p5_${addNulls(frameCount - loopStart, 4)}`;
    saveCanvas(fileName, "jpg");
    console.log(`saved ${fileName}`);
  } else {
    frameRate(frate);
    console.log("DONE");
    noLoop();
  }
}

function getBackgroundGraphics(step) {
  const result = createGraphics(width, height);

  for (let x = 0; x < result.width; x++) {
    for (let y = 0; y < result.height; y++) {
      const rd = noise(x / 50, y / 50, step / 50);

      const clr = color(rd * 255, 0, 0);
      result.set(x, y, clr);
    }
  }
  result.updatePixels();

  return result;

  const count = 6;

  const stepDelta = step * (TWO_PI / maxFrames);

  result.push();
  result.translate(width / 2, height / 2);
  result.background(255);
  result.fill(0);
  for (let i = 0; i < count; i++) {
    const theta = map(i, 0, count, 0, TWO_PI) + stepDelta;
    pos = toCartesian(width / 3, theta);

    result.circle(pos.x, pos.y, 200);
  }
  result.pop();
  return result;
}

function drawSpiral(bgImg) {
  const dotsTotal = 100 * 100;
  const dotsPerSegment = 10; //dotsTotal / 100;
  const maxR = width / sqrt(2);

  let theta = 3 * TWO_PI * ((fr % maxFrames) / maxFrames);
  let needStep = false;
  push();
  //noStroke();
  stroke(wong.blu);
  fill(wong.blu);

  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < dotsTotal; i++) {
    needStep = !needStep;

    let r = map(i, 0, dotsTotal, 15, maxR);
    if (needStep) {
      const bgc = toCartesian(r, theta);
      const bgColor = bgImg.get(bgc.x + width / 2, bgc.y + height / 2);
      r += r * 0.03 * norm(red(bgColor), 0, 255);
    }

    const vc = toCartesian(r, theta);
    vertex(vc.x, vc.y);

    const circleLength = TWO_PI * r;
    const segmentLength = circleLength / dotsPerSegment;
    const thetaDiff = TWO_PI / segmentLength;
    theta += thetaDiff;
    theta %= TWO_PI;
  }
  endShape();
  pop();
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
    wong.drblu,

    wong.pnk,

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
