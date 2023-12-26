const wong = {};

const frate = 60;
const maxSeconds = 5;
const maxFrames = maxSeconds * frate;

const segLen = 6;
const segCount = 12;
const rowCount = 21;

const data = [];

let angle0 = 0; // -HALF_PI;

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);
  noSmooth();

  setWong();

  randomSeed(69);

  background(wong.background);
  noFill();
  strokeWeight(2);

  let fill = shuffle(generateFill(segCount));
  console.log(fill.length);

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

function draw() {
  background(wong.background);

  let arr;

  angle0 += TWO_PI / maxFrames;
  angle0 %= TWO_PI;

  for (let k = 0; k < data.length; k++) {
    const x = data[k].x;
    const y = data[k].y;
    const rot = data[k].rot;

    push();
    translate(x, y);

    stroke(chooseColor(k));
    for (let i = 0; i < rot.length; i++) {
      let angle = 0;
      switch (rot[i]) {
        case 0:
          angle = angle0;
          break;
        case 1:
          angle = -angle0 * 2;
          break;
      }

      if (angle % 2 == 0) {
        angle += i / 10;
      } else {
        angle -= i / 10;
      }

      rotate(angle);
      line(0, 0, segLen, 0);
      translate(segLen, 0);
    }
    pop();
  }

  const loopStart = maxFrames;
  if (frameCount > loopStart && frameCount <= maxFrames * 2) {
    frameRate(3);
    //saveCanvas(`p5_${addNulls(frameCount-loopStart, 4)}`, 'jpg');
  } else {
    frameRate(frate);
  }
  //noLoop();
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
