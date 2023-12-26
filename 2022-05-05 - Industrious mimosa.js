const wong = {};

const frate = 10;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  setWong();

  randomSeed(69);

  background(wong.background);

  //noLoop();
}

function draw() {
  if (frameCount % 30 == 0) {
    noLoop();
    //background(wong.background);
  }

  const halfH = height / 2;
  const halfW = width / 2;

  const curveStartX = random(width);
  const curveFinishX = random(width);

  const anchor1 = { x: curveStartX, y: 0 };
  const anchor2 = { x: curveFinishX, y: width };
  const control1 = { x: random(halfW), y: random(halfH) };
  const control2 = { x: halfW + random(halfW), y: halfH + random(halfH) };

  noFill();
  stroke(wong.orng);

  /*
  bezier(
    anchor1.x, anchor1.y,
    control1.x, control1.y,
    control2.x, control2.y,
    anchor2.x, anchor2.y);
  */

  const sectorLength = 60;

  beginShape(TRIANGLE_STRIP);

  fill(chooseColor(frameCount));
  strokeWeight(3);
  stroke(wong.background);

  const steps = 20;

  for (let i = 0; i < steps; i++) {
    const t = i / steps;

    const bx = calcBezier(anchor1.x, control1.x, control2.x, anchor2.x, t);

    const by = calcBezier(anchor1.y, control1.y, control2.y, anchor2.y, t);

    const x = bx.coord;
    const y = by.coord;

    const angle = atan2(bx.tang, by.tang);
    const angledPoint = getAngledPoint(angle, sectorLength);

    vertex(x, y);
    vertex(x + angledPoint.x, y + angledPoint.y);
  }
  vertex(anchor2.x, anchor2.y);
  //vertex(anchor2.x + sectorLength, anchor2.y);
  endShape();

  //noLoop();
}

function showAngle(x, y, angle) {
  const angledPoint = getAngledPoint(angle, 30);
  line(x, y, x + angledPoint.x, y + angledPoint.y);
}

function getAngledPoint(angle, lenght) {
  const x = lenght * cos(angle);
  const y = lenght * sin(angle);

  return { x, y };
}

function calcBezier(a1, c1, c2, a2, t) {
  const coord = bezierPoint(a1, c1, c2, a2, t);
  const tang = bezierTangent(a1, c1, c2, a2, t);

  return { coord, tang };
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
