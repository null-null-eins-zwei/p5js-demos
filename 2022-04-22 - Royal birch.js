function setup() {
  createCanvas(512, 512);
}

function draw() {
  smooth();

  background(wong.background);

  noFill();
  noStroke();

  fill(wong.drblu);
  circle(width / 2, height / 2, 100 + 40 * 3);

  fill(wong.orng);
  circle(width / 2, height / 2, 100 + 40);
  a;
  fill(wong.background);
  circle(width / 2, height / 2, 100);

  noLoop();
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
