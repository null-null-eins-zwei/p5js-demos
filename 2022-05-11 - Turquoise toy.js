const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  randomSeed(69);

  background(wong.background);

  noFill();
  stroke(wong.background);
  strokeWeight(2);
}

function draw() {
  const d1 = new dickinsonia();
  d1.show();

  noLoop();
}

class dickinsonia {
  constructor() {}

  show() {
    const dotA1 = new dot(100, 100);
    const dotA2 = new dot(width - 100, height - 100);
    const dotC1 = new dot(200, 400);
    const dotC2 = new dot(600, 300);

    const bez1 = new bez(dotA1, dotA2, dotC1, dotC2);

    //bez1.show();

    const segments = 40;

    stroke(wong.blk);
    strokeWeight(2);

    for (let i = 0; i < segments; i += 2) {
      const mc = abs(map(i, 0, segments - 1, -150, 180));
      const m = 180 - mc;

      const t1 = map(i - 1, 0, segments - 1, 0, 1);
      const t2 = map(i, 0, segments - 1, 0, 1);
      const t3 = map(i + 1, 0, segments - 1, 0, 1);

      const d1 = bez1.dot(t1);
      const d2 = bez1.dot(t2);
      const d3 = bez1.dot(t3);

      //line(d1.x, d1.y, d2.x, d2.y);
      //line(d2.x, d2.y, d3.x, d3.y);
      let vect1 = createVector(d1.x - d2.x, d1.y - d2.y);
      vect1.normalize();
      vect1.rotate(HALF_PI);
      vect1.mult(m);

      let vect2 = createVector(d2.x - d3.x, d2.y - d3.y);
      vect2.normalize();
      vect2.rotate(-HALF_PI);
      vect2.mult(m);

      fill(wong.blu);

      beginShape();
      curveVertex(d1.x, d1.y);
      curveVertex(d1.x, d1.y);
      curveVertex(d1.x + vect1.x, d1.y + vect1.y);
      curveVertex(d2.x + vect1.x, d2.y + vect1.y);
      curveVertex(d2.x, d2.y);
      curveVertex(d2.x, d2.y);
      endShape();

      beginShape();
      curveVertex(d2.x, d2.y);
      curveVertex(d2.x, d2.y);
      curveVertex(d2.x + vect2.x, d2.y + vect2.y);
      curveVertex(d3.x + vect2.x, d3.y + vect2.y);
      curveVertex(d3.x, d3.y);
      curveVertex(d3.x, d3.y);
      endShape();

      //point(d1.x, d1.y);
    }
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

  angledDot(t, bzWidth) {
    const ad = getAngledDot(this.dot(t), this.angle(t), bzWidth);
    return ad;
  }

  show() {
    push();
    stroke(wong.orng);
    line(this.dotA1.x, this.dotA1.y, this.dotC1.x, this.dotC1.y);

    stroke(wong.grn);
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

function showAngle(d, angle) {
  const angledPoint = getAngledDot(d, angle, 30);
  line(d.x, d.y, angledPoint.x, angledPoint.y);
}

function getAngledDot(d, angle, lenght) {
  const x = lenght * cos(angle);
  const y = lenght * sin(angle);

  return new dot(d.x + x, d.y + y);
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

function chooseColor(n) {
  const clrs = [
    wong.blk,
    wong.orng,

    wong.blu,
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
