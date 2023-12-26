const wong = {};

const frate = 60;
const maxSeconds = 10;
const maxFrames = maxSeconds * frate;

let button;

let grd;

function setup() {
  createCanvas(1080, 1080);
  frameRate(frate);
  smooth();
  
  setWong();
  
  button = createButton('pause');
  button.mousePressed(pause);
  
  background(wong.background);
  g = new grid(10, 10, 90);
  
  //noLoop();
}

function draw() {
  //background(wong.background);
  g.step();
}

class grid{
  constructor(countX, countY, size){
    this.ls = [];
    
    const stepX = floor(width / (countX + 1));
    const stepY = floor(height / (countY + 1));
    
    for(let i = 1; i < countX + 1; i++){
      for(let j = 1; j < countY + 1; j++){
        
        const partsCount = i + j;
        const part = size / partsCount;
        
        const size1 = part * (i);
        const size2 = part * (j);
        
        const x = stepX + (i - 1) * stepX;
        const y = stepY + (j - 1) * stepY;
        
        if(i == j ){
          this.ls.push(new spirograph(x, y, 10, 0));
          continue;
        }
        
        this.ls.push(new spirograph(x, y, size1 / 2, size2 / 2));
      }
    }
  }
  
  step(){
    for(let i = 0; i < this.ls.length; i++){
      stroke(chooseColor(i));
      this.ls[i].step();
    }
  }
}

class spirograph{
  
  #theta1 = 0;
  #theta2 = 0;
  
  constructor(x, y, r1, r2){
    this.x = x;
    this.y = y;
    this.r1 = r1;
    this.r2 = r2;
    
    this.thetaDelta1 = r1 / 1000;
    this.thetaDelta2 = r2 / 1000;
  }
  
  step(){
    push();
      translate(this.x, this.y);
    
      rotate(this.#theta1);
      translate(this.r1, 0);
    
      rotate(this.#theta2);
      translate(this.r2, 0);
    
      point(0, 0);
    pop();
    
    this.#theta1 += this.thetaDelta1;
    this.#theta1 = this.#theta1 % (TWO_PI * 10);
    
    this.#theta2 += this.thetaDelta2;
    this.#theta2 = this.#theta2 % (TWO_PI * 10);
  }
}

function ToCartesian(r, theta)
{
  return {
    x: r * cos(theta),
    y: r * sin(theta),
  };
}

function chooseColor(n){
  
  const clrs = [
    wong.blk,
    wong.orng,
    
    wong.blu,
    wong.grn,
    
    wong.drblu,
    wong.drorng,
  ];
  
  const index = floor(n) % (clrs.length);
  
  return clrs[index];
}

function setWong(){
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

function pause(e){
  if(isLooping()){
    noLoop();
  }
  else{
    loop();
  }
}