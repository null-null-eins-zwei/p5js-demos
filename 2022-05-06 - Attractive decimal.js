const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

const maxSteps = 50;

let step = 0;
const bzal = [];
const bzWidth = 100;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  randomSeed(69);

  background(wong.background);

  for (let i = 0; i < 10; i++) {
    bzal.push(new bezLooper(5));
  }

  noFill();
  stroke(wong.background);
  strokeWeight(2);
}

function draw() {
  for (let k = 0; k < bzal.length; k++) {
    const looper = bzal[k];
    looper.show(step);
    looper.show(step + 1);
    looper.show(step + 2);
  }

  if (step % bzal[0].length == 0) {
    //saveCanvas(`Attractive_decimal${addNulls(frameCount, 8)}`, 'jpg');
  }

  step += 3;

  if (frameCount >= 201 && frameCount <= 701) {
    frameRate(3);
    //saveCanvas(`Attractive_decimal${addNulls(frameCount-201, 4)}`, 'jpg');
  } else {
    frameRate(frate);
  }

  //noLoop();
}

class bezLooper {
  constructor(n) {
    this.arr = [bez.random];
    for (let i = 1; i < n + 1; i++) {
      this.arr.push(bez.getConnected(this.arr[i - 1]));
    }

    const first = this.arr[0];
    const last = this.arr[n - 1];

    first.connectTo(last);
  }

  get length() {
    return this.arr.length * maxSteps;
  }

  show(frm) {
    const n = floor(frm / maxSteps);
    const step = frm % maxSteps;

    let bz = this.getBez(n);

    const dStep1 = step / maxSteps;
    const d1 = bz.dot(dStep1);
    const d2 = bz.angledDot(dStep1);

    if (step > maxSteps) {
      bz = this.getBez(n + 1);
    }

    const dStep2 = (step + 1) / maxSteps;
    const d3 = bz.dot(dStep2);
    const d4 = bz.angledDot(dStep2);

    fill(chooseColor(step));
    beginShape(TRIANGLE_STRIP);
    vertex(d1.x, d1.y);
    vertex(d2.x, d2.y);
    vertex(d3.x, d3.y);
    vertex(d4.x, d4.y);
    endShape();
  }

  getBez(n) {
    const index = floor(n) % (this.arr.length - 1);
    return this.arr[index];
  }
}

class bez {
  constructor(dotA1, dotA2, dotC1, dotC2) {
    this.dotA1 = dotA1;
    this.dotA2 = dotA2;

    this.dotC1 = dotC1;
    this.dotC2 = dotC2;
  }

  dot(t) {
    const tf = constrain(t, 0, 1);
    const cx = bezierPoint(
      this.dotA1.x,
      this.dotC1.x,
      this.dotC2.x,
      this.dotA2.x,
      tf
    );
    const cy = bezierPoint(
      this.dotA1.y,
      this.dotC1.y,
      this.dotC2.y,
      this.dotA2.y,
      tf
    );

    return new dot(cx, cy);
  }

  angle(t) {
    const tf = constrain(t, 0, 1);
    const bx = bezierTangent(
      this.dotA1.x,
      this.dotC1.x,
      this.dotC2.x,
      this.dotA2.x,
      t
    );
    const by = bezierTangent(
      this.dotA1.y,
      this.dotC1.y,
      this.dotC2.y,
      this.dotA2.y,
      t
    );

    return atan2(bx, by);
  }

  angledDot(t) {
    const ad = getAngledDot(this.dot(t), this.angle(t), bzWidth);
    return ad;
  }

  show() {
    push();
    stroke(wong.orng);
    line(this.dotA1.x, this.dotA1.y, this.dotC1.x, this.dotC1.y);

    stroke(wong.blk);
    bezier(
      this.dotA1.x,
      this.dotA1.y,
      this.dotC1.x,
      this.dotC1.y,
      this.dotC2.x,
      this.dotC2.y,
      this.dotA2.x,
      this.dotA2.y
    );

    stroke(wong.blu);
    line(this.dotC2.x, this.dotC2.y, this.dotA2.x, this.dotA2.y);

    pop();
  }

  connectTo(prevBez) {
    this.dotA1 = prevBez.dotA2;

    this.dotC1 = new dot(
      prevBez.dotA2.x + (prevBez.dotA2.x - prevBez.dotC2.x),
      prevBez.dotA2.y + (prevBez.dotA2.y - prevBez.dotC2.y)
    );
  }

  static get random() {
    return new bez(dot.random, dot.random, dot.random, dot.random);
  }

  static getConnected(prevBez) {
    const result = bez.random;
    result.connectTo(prevBez);
    return result;
  }
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

function showAngle(d, angle) {
  const angledPoint = getAngledDot(d, angle, 30);
  line(d.x, d.y, angledPoint.x, angledPoint.y);
}

function getAngledDot(d, angle, lenght) {
  const x = lenght * cos(angle);
  const y = lenght * sin(angle);

  return new dot(d.x + x, d.y + y);
}

function chooseColor(n) {
  const clrs = [wong.orng, wong.blu, wong.grn, wong.drblu, wong.drorng];

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
