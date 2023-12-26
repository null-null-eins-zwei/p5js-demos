class Buggy{
  constructor(graph, startNode, speed){
    this.graph = graph;
    this.path = [];
    
    this.node = startNode;
    this.coordinates = graph.convertCoordinates(this.node.x, this.node.y);
    
    this.speed = constrain(speed, 0, 1);
    this.position = 0;
  }
  
  setPath(path){
    this.path = path;
    this.position = 0;
    if(path.length == 0){
      return;
    }
    this.node = path[0];
  }
  
  setTarget(targetNode){
    const path = this.graph.getPath(this.node, targetNode);
    this.setPath(path);
  }
  
  step(){
    if(this.path.length == 0){
      return false;
    }
    
    const next = this.path[0];
    if(next == this.node){
      this.path.shift();
      return true;
    }
    
    const nx = map(this.position, 0, 100, this.node.x, next.x);
    const ny = map(this.position, 0, 100, this.node.y, next.y);
    this.coordinates = this.graph.convertCoordinates(nx, ny);
    
    this.position += 100 * this.speed;
    
    if(this.position > 100){
      this.node = this.path.shift();
      this.position = 0;
      this.coordinates = this.graph.convertCoordinates(this.node.x, this.node.y);
    }
    
    return true;
  }
  
  setLoop(loopNodes){
    this.loopNodes = loopNodes;
    this.loopPosition = 0;
  }
  
  stepLoop(){
    const continuePath = this.step();
    if(!continuePath){
      const newTarget = this.loopNodes[this.loopPosition];
      this.setTarget(newTarget);
      
      this.loopPosition++;
      this.loopPosition %= this.loopNodes.length;
    }
  }
  
  show(){
    push();
      fill(wong.drorng);
      stroke(wong.drblu);
      strokeWeight(3);
      circle(this.coordinates.x, this.coordinates.y, 20);
    pop();
  }
}