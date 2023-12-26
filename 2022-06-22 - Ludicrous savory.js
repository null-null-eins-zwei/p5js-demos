const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

const grph = new Graph(15, 15);
const initPos = grph.nodeAt(Math.floor(grph.w / 2), Math.floor(grph.h / 2));
const buggies = [];

function setup() {
  createCanvas(1080, 1080);

  frameRate(frate);
  smooth();

  randomSeed(69);
  noiseSeed(69);
  noiseDetail(3, 0.5);

  setWong();

  const last = grph.w - 1;
  const half = Math.floor(last / 2);

  for (let i = 0; i < 10; i++) {
    const bg1 = new Buggy(grph, initPos, 0.15);
    bg1.setTarget(grph.nodeAt(0, 0));
    buggies.push(bg1);

    const bg2 = new Buggy(grph, initPos, 0.15);
    bg2.setTarget(grph.nodeAt(0, last));
    buggies.push(bg2);

    const bg3 = new Buggy(grph, initPos, 0.15);
    bg3.setTarget(grph.nodeAt(last, 0));
    buggies.push(bg3);

    const bg4 = new Buggy(grph, initPos, 0.15);
    bg4.setTarget(grph.nodeAt(last, last));
    buggies.push(bg4);

    const bg5 = new Buggy(grph, initPos, 0.15);
    bg5.setTarget(grph.nodeAt(last, half));
    buggies.push(bg5);

    const bg6 = new Buggy(grph, initPos, 0.15);
    bg6.setTarget(grph.nodeAt(half, last));
    buggies.push(bg6);

    const bg7 = new Buggy(grph, initPos, 0.15);
    bg7.setTarget(grph.nodeAt(half, 0));
    buggies.push(bg7);

    const bg8 = new Buggy(grph, initPos, 0.15);
    bg8.setTarget(grph.nodeAt(0, half));
    buggies.push(bg8);
  }
}

function draw() {
  background(wong.background);

  grph.show();

  buggies.forEach((bg) => {
    const continuePath = bg.step();
    if (!continuePath) {
      let newTarget = grph.randomNode();
      if (frameCount > maxFrames * 0.7) {
        newTarget = initPos;
        bg.speed = 0.5;
      }
      bg.setTarget(newTarget);
    }

    //bg.stepLoop();
    bg.show();
  });

  const loopStart = 0;
  if (frameCount >= loopStart && frameCount <= maxFrames + loopStart) {
    frameRate(3);

    const fileName = `p5_${addNulls(frameCount - loopStart, 4)}`;
    saveCanvas(fileName, "jpg");
  }

  if (frameCount > maxFrames) {
    noLoop();
    console.log("ok");
  }

  //noLoop();
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
