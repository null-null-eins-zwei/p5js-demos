const wong = {};

const frate = 60;
const maxSeconds = 9;
const maxFrames = maxSeconds * frate;

let d = [];

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);
  smooth();
  randomSeed(69);

  setWong();
  const pathSegments = 6;

  const segmentsCount = 40;
  for (let i = 0; i < 3; i++) {
    const path = getPath(pathSegments, floor(maxFrames / pathSegments));
    d.push(
      new dickinsonia(
        chooseColor(i),
        path,
        segmentsCount,
        (segmentPosition) => {
          const maxWidth = 40;
          return (
            maxWidth -
            abs(map(segmentPosition, 0, segmentsCount, -maxWidth, maxWidth))
          );
        }
      )
    );
  }

  randomSeed(690);

  background(wong.background);
}

function draw() {
  background(wong.background);
  d.forEach((ds) => ds.show(frameCount));

  const loopStart = maxFrames;
  if (frameCount > loopStart && frameCount <= maxFrames * 2) {
    //frameRate(3);
    //saveCanvas(`p5_${addNulls(frameCount-loopStart, 4)}`, 'jpg');
  } else {
    frameRate(frate);
  }

  //noLoop();
}

function getPath(bezCount, segCount) {
  const result = [];
  const bezLoop = bez.randomLoop(bezCount);

  for (let i = 0; i < bezCount; i++) {
    const b = bezLoop[i];

    for (let j = 0; j < segCount; j++) {
      const t = map(j, 0, segCount - 1, 0, 1);

      result.push(createVector(b.dot(t).x, b.dot(t).y, b.angle(t)));
    }
  }

  return result;
}

class dickinsonia {
  constructor(color, pathToFollow, segmentsCount, widthFunc) {
    this.color = color;
    this.pathToFollow = pathToFollow;
    this.segmentsCount = segmentsCount;
    this.widthFunc = widthFunc;
  }

  show(step) {
    const pathPart = [];
    for (let i = 0; i < this.segmentsCount; i++) {
      pathPart.push(choose(this.pathToFollow, step + i));
    }

    //TODO: fix sides

    for (let i = 1; i < pathPart.length; i++) {
      this.showSegment(pathPart, i, step);
    }
  }

  showSegment(pathPart, index, step) {
    const sideAngle = (step + index) % 2 == 0 ? HALF_PI : -HALF_PI;

    const w = this.widthFunc(index);

    const angle = pathPart[index].z + sideAngle;
    const sideOffset = vectFromAngle(angle).mult(w);

    const v1 = pathPart[index];
    const v4 = pathPart[index - 1];

    const v2 = createVector(v1.x + sideOffset.x, v1.y + sideOffset.y);
    const v3 = createVector(v4.x + sideOffset.x, v4.y + sideOffset.y);

    push();
    fill(this.color);

    beginShape();
    curveVertex(v1.x, v1.y);
    curveVertex(v1.x, v1.y);
    curveVertex(v2.x, v2.y);
    curveVertex(v3.x, v3.y);
    curveVertex(v4.x, v4.y);
    curveVertex(v4.x, v4.y);
    endShape();
    pop();
  }
}

class bez {
  constructor(vectA1, vectA2, vectC1, vectC2) {
    this.vectA1 = vectA1;
    this.vectA2 = vectA2;

    this.vectC1 = vectC1;
    this.vectC2 = vectC2;
  }

  dot(t) {
    const tf = constrain(t, 0, 1);
    const cx = bezierPoint(
      this.vectA1.x,
      this.vectC1.x,
      this.vectC2.x,
      this.vectA2.x,
      tf
    );
    const cy = bezierPoint(
      this.vectA1.y,
      this.vectC1.y,
      this.vectC2.y,
      this.vectA2.y,
      tf
    );

    return createVector(cx, cy);
  }

  angle(t) {
    const tf = constrain(t, 0, 1);
    const bx = bezierTangent(
      this.vectA1.x,
      this.vectC1.x,
      this.vectC2.x,
      this.vectA2.x,
      t
    );
    const by = bezierTangent(
      this.vectA1.y,
      this.vectC1.y,
      this.vectC2.y,
      this.vectA2.y,
      t
    );

    return atan2(by, bx);
  }

  show() {
    push();
    stroke(wong.orng);
    line(this.vectA1.x, this.vectA1.y, this.vectC1.x, this.vectC1.y);

    stroke(wong.grn);
    bezier(
      this.vectA1.x,
      this.vectA1.y,
      this.vectC1.x,
      this.vectC1.y,
      this.vectC2.x,
      this.vectC2.y,
      this.vectA2.x,
      this.vectA2.y
    );

    stroke(wong.blu);
    line(this.vectC2.x, this.vectC2.y, this.vectA2.x, this.vectA2.y);

    pop();
  }

  connectTo(prevBez) {
    this.vectA1 = prevBez.vectA2;

    this.vectC1 = createVector(
      prevBez.vectA2.x + (prevBez.vectA2.x - prevBez.vectC2.x),
      prevBez.vectA2.y + (prevBez.vectA2.y - prevBez.vectC2.y)
    );
  }

  static get random() {
    return new bez(randXY(), randXY(), randXY(), randXY());
  }

  static randomLoop(n) {
    const arr = [bez.random];

    for (let i = 1; i < n; i++) {
      arr.push(bez.getConnected(arr[i - 1]));
    }

    const first = arr[0];
    const last = arr[arr.length - 1];

    first.connectTo(last);

    return arr;
  }

  static getConnected(prevBez) {
    const result = bez.random;
    result.connectTo(prevBez);
    return result;
  }
}

function vectFromAngle(angle) {
  return createVector(cos(angle), sin(angle)).normalize();
}

function randXY() {
  return createVector(random(width), random(height));
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
