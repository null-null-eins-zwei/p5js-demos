class dickinsonia
{
  constructor(){
  }
  
  getImg(){
    const result = createGraphics(width, height);
    
    const dotA1 = createVector(100, 100);
    const dotA2 = createVector(width-100, height-100);
    const dotC1 = createVector(200, 400);
    const dotC2 = createVector(600, 300);
    
    const bez1 = new bez(
                  dotA1,
                  dotA2,
                  dotC1,
                  dotC2);
    
    
    //bez1.show();
    
    const segments = 40;
    
    result.stroke(wong.blk);
    result.strokeWeight(2);
    
    for(let i = 0; i < segments; i+=2)
    {
      const mc = abs(map(i, 0, segments-1, -150, 180));
      const m = 180-mc;
      
      const t1 = map(i-1, 0, segments-1, 0, 1);
      const t2 = map(i, 0, segments-1, 0, 1);
      const t3 = map(i+1, 0, segments-1, 0, 1);
      
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
      
      const cfll = lerpColor(wong.orng, wong.blu, t3);
      result.fill(cfll);

      result.beginShape();
        result.curveVertex(d1.x, d1.y);
        result.curveVertex(d1.x, d1.y);
        result.curveVertex(d1.x+vect1.x, d1.y+vect1.y);
        result.curveVertex(d2.x+vect1.x, d2.y+vect1.y);
        result.curveVertex(d2.x, d2.y);
        result.curveVertex(d2.x, d2.y);
      result.endShape();
      
      result.beginShape();
        result.curveVertex(d2.x, d2.y);
        result.curveVertex(d2.x, d2.y);
        result.curveVertex(d2.x+vect2.x, d2.y+vect2.y);
        result.curveVertex(d3.x+vect2.x, d3.y+vect2.y);
        result.curveVertex(d3.x, d3.y);
        result.curveVertex(d3.x, d3.y);
      result.endShape();
    }
    
    return result;
  }
  
  show(){
    const img = this.getImg();
    translate(width/2, height/2);
    imageMode(CENTER);
    image(img, 0, 0);
    img.remove();
  }
}

class bez
{
  constructor(dotA1, dotA2, dotC1, dotC2){
    this.dotA1 = dotA1;
    this.dotA2 = dotA2;
    
    this.dotC1 = dotC1;
    this.dotC2 = dotC2;
  }
  
  dot(t){
    const tf = constrain(t, 0, 1);
    const cx = bezierPoint(this.dotA1.x, this.dotC1.x, this.dotC2.x, this.dotA2.x, tf);
    const cy = bezierPoint(this.dotA1.y, this.dotC1.y, this.dotC2.y, this.dotA2.y, tf);
    
    return createVector(cx, cy);
  }
  
  angle(t){
    const tf = constrain(t, 0, 1);
    const bx = bezierTangent(this.dotA1.x, this.dotC1.x, this.dotC2.x, this.dotA2.x, t);
    const by = bezierTangent(this.dotA1.y, this.dotC1.y, this.dotC2.y, this.dotA2.y, t);
    
    return atan2(bx, by);
  }
  
  angledDot(t, lenght){
    
    const d = this.dot(t);
    const angle = this.angle(t);
    
    const x = lenght * cos(angle);
    const y = lenght * sin(angle);

    return createVector(d.x+x, d.y+y);
  }
  
  show(){
    push();
      stroke(wong.orng);
      line(this.dotA1.x, this.dotA1.y, this.dotC1.x, this.dotC1.y);
    
      stroke(wong.grn);
      bezier(
        this.dotA1.x, this.dotA1.y,
        this.dotC1.x, this.dotC1.y,
        this.dotC2.x, this.dotC2.y,
        this.dotA2.x, this.dotA2.y);
    
      stroke(wong.blu);
      line(this.dotC2.x, this.dotC2.y, this.dotA2.x, this.dotA2.y);
    
    pop();
  }
  
  connectTo(prevBez){
    this.dotA1 = prevBez.dotA2;
    
    this.dotC1 = createVector(
                       prevBez.dotA2.x + (prevBez.dotA2.x - prevBez.dotC2.x),
                       prevBez.dotA2.y + (prevBez.dotA2.y - prevBez.dotC2.y));
  }
  
  static get random(){
    return new bez(dot.random, dot.random, dot.random, dot.random);
  }
  
  static getConnected(prevBez){
    const result = bez.random;
    result.connectTo(prevBez);
    return result;
  }
}