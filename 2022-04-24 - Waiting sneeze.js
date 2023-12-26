const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

let loopFrame = 0;
let j = 0;

let recorder;
const videoChunks = [];
let recordActive = false;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();

  /*
  createLoop(
    {
      duration: maxSeconds,
      framesPerSecond: frate,
      gif:true
    })
  */
}

function draw() {
  const secondHalf = loopFrame > maxFrames / 2;
  j += secondHalf ? 0.1 : -0.1;

  const thetaInit = map(loopFrame, 0, maxFrames, 0, 4 * PI);

  background(wong.background);
  translate(width / 2, height / 2);

  let theta = thetaInit;
  for (let i = 5; i > 0; i--) {
    theta += thetaInit / 2;
    let r = i * 2 * (50 + j * 2);
    PlaceTri(r, theta);
  }

  if (!recordActive && videoChunks.length == 0) {
    startRecord();
    console.log("startRecord", recorder);
  }

  loopFrame++;
  if (loopFrame > maxFrames + 1) {
    loopFrame = 0;
    j = 0;

    if (recordActive) {
      recorder.stop();
      console.log("record done");
    }
  }

  // noLoop();
}

function PlaceTri(r, thetaInit) {
  const count = 3;

  push();
  noFill();
  noStroke();

  const points = [];
  for (let i = 0; i < count; i++) {
    const theta = map(i, 0, count, 0, 2 * PI) + thetaInit;
    points.push(ToCartesian(r, theta));
  }

  points.forEach((point) => {
    ({ x, y } = point);
    PlaceNNEZ(x, y, r / 5);
  });

  fill(wong.background);
  beginShape();
  points.forEach((point) => {
    ({ x, y } = point);
    vertex(x, y);
  });
  endShape(CLOSE);
  pop();
}

function PlaceNNEZ(x, y, thick) {
  push();

  noFill();
  noStroke();
  translate(x, y);

  fill(wong.drblu);
  circle(0, 0, thick * 2 + thick * 3);

  fill(wong.orng);
  circle(0, 0, thick * 2 + thick);

  fill(wong.background);
  circle(0, 0, thick * 2);

  pop();
}

function ToCartesian(r, theta) {
  return {
    x: r * cos(theta),
    y: r * sin(theta),
  };
}

function startRecord() {
  videoChunks.length = 0;

  const canvas = document.querySelector("canvas");
  const stream = canvas.captureStream(frate);
  const options = { mimeType: "video/webm;codecs=h264" };
  recorder = new MediaRecorder(stream, options);

  recorder.onstop = exportVideo;

  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      videoChunks.push(e.data);
    }
  };

  recorder.start();
  recordActive = true;
}

function exportVideo(e) {
  recordActive = false;
  var blob = new Blob(videoChunks);

  var vid = document.createElement("video");
  vid.id = "recorded";
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  vid.play();
}

let wong = {
  blk: "#000000",
  orng: "#E69F00",
  blu: "#56B4E9",
  grn: "#009E73",
  ylw: "#F0E442",
  drblu: "#0072B2",
  drorng: "#D55E00",
  pnk: "#CC79A7",
  background: "#EEEEEE",
  // https://davidmathlogic.com/colorblind
};
