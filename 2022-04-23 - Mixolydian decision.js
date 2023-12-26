function setup() {
  createCanvas(1080, 1080);
}

function draw() {
  smooth();

  background(wong.background);

  noFill();
  noStroke();
  translate(width / 2, height / 2);

  const r = 200;
  const count = 3;

  const points = [];
  for (let i = 0; i < count; i++) {
    const theta = map(i, 0, count, 0, 2 * PI) - HALF_PI;
    points.push(ToCartesian(r, theta));
  }

  points.forEach((point) => {
    ({ x, y } = point);
    PlaceNNEZ(x, y, 40);
  });

  fill(wong.background);
  beginShape();
  points.forEach((point) => {
    ({ x, y } = point);
    vertex(x, y);
  });
  endShape(CLOSE);

  noLoop();
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
