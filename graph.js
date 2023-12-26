
class Graph{
  constructor(h, w){
    this.h = h;
    this.w = w;
    
    const g = new graphlib.Graph({ directed: true, multigraph: false });
    this.g = g;
    
    this.nodes = [];
    
    for(let y = 0; y < h; y++){
      for(let x = 0; x < w; x++){
        const newNode = new Node(x, y, this.labelFor(x, y));
        this.nodes.push(newNode);
        
        this.g.setNode(newNode.label);
      }
    }
    
    for(let i = 0; i < this.nodes.length; i++){
      const n = this.nodes[i];
      
      n.addEdgeTo(this.nodeAt(n.x + 1, n.y + 0));
      n.addEdgeTo(this.nodeAt(n.x + 0, n.y + 1));
      
      const l0 = this.labelFor(n.x, n.y);
      const l1 = this.labelFor(n.x + 1, n.y + 0);
      const l2 = this.labelFor(n.x + 0, n.y + 1);
      
      if(g.nodes().includes(l1)){
        g.setEdge(l0, l1);
        g.setEdge(l1, l0);
      }
      
      if(g.nodes().includes(l2)){
        g.setEdge(l0, l2);
        g.setEdge(l2, l0);
      }
    }
    
    this.paths = graphlib.alg.dijkstraAll(g, function(e) { return 1; });
    
    
  }
  
  getPath(node1, node2){
    if(node1 == node2){
      return [];
    }
    
    const path = [node2];
    
    const part = this.paths[node1.label];
    
    let current = part[node2.label];
    
    while(current.distance != 0 && isFinite(current.distance)){
      path.unshift(this.nodeByLabel(current.predecessor));
      current = part[current.predecessor];
    }
    
    return path;
  }
  
  nodeByLabel(label){
    return this.nodes.find(node => node.label == label);
  }
  
  randomNode(){
    return random(this.nodes);
  }
  
  nodeAt(x, y) { 
    return this.nodes.find(node => node.x == x && node.y == y);
  }
  
  show(){
    this.nodes.forEach(node => this.showEdges(node));
    this.nodes.forEach(node => this.showNode(node));
  }
  
  showEdges(node){
    for(let i = 0; i < node.edges.length; i++){
      const edge = node.edges[i];
      const node1 = edge.node1;
      const node2 = edge.node2;
      
      const rc1 = this.convertCoordinates(node1.x, node1.y);
      const rc2 = this.convertCoordinates(node2.x, node2.y);
    
      push();
        stroke(wong.pnk);
        strokeWeight(2);
        line(rc1.x, rc1.y, rc2.x, rc2.y);
      pop();
    }
  }
  
  showNode(node){
    const rc = this.convertCoordinates(node.x, node.y);
    
    push();
      stroke(wong.pnk);
      fill(wong.ylw);
      strokeWeight(2);
      circle(rc.x, rc.y, 25);
    pop();
  }
  
  labelFor(x, y) {
    return `x${x}y${y}`;
  }
  
  convertCoordinates(nx, ny){
    //const maxX = Math.max(...this.nodes.map(n => n.x));
    //const maxY = this.nodes.reduce(function (max, n) { return Math.max(max, n.y) }, -1);
    
    const gridSectionSize = { 
                            x: width / (this.w + 1),
                            y: height / (this.h + 1)
                          };
    
    const realX = map(nx, 0, this.w, gridSectionSize.x, width);
    const realY = map(ny, 0, this.h, gridSectionSize.y, height);
    
    return createVector(realX, realY);
  }
}

class Node{
  constructor(x, y, label){
    this.x = x;
    this.y = y;
    this.label = label;
    
    this.edges = [];
  }
  
  findEdgeTo(otherNode){
    if(otherNode == null || otherNode == undefined){
      return undefined;
    }
    /*
    for(let i = 0; i < this.edges.length; i++){
      const edge = this.edges[i];
      if(edge.containsNode(this) && edge.containsNode(otherNode)){
        return edge;
      }
    }
    */
    
    return this.edges.find(edge => edge.containsNode(this) && edge.containsNode(otherNode));
  }

  hasEdgeTo(otherNode){
    return this.findEdgeTo(otherNode) != undefined;
  }
  
  addEdgeTo(otherNode){
    if(otherNode == null || otherNode == undefined){
      return;
    }
    
    if(otherNode == this){
      return;
    }
    
    if(this.hasEdgeTo(otherNode)){
      return;
    }
    
    this.edges.push(new Edge(this, otherNode));
  }
  
  removeEdgeTo(otherNode){
    if(otherNode == null || otherNode == undefined){
      return undefined;
    }
    
    const edge = this.findEdgeTo(otherNode);
    if(edge == undefined){
      return undefined;
    }
    
    const index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);
    
    return edge;
  }
  
}

class Edge{
  constructor(node1, node2){
    this.node1 = node1;
    this.node2 = node2;
  }
  
  containsNode(node){
    return this.node1 == node || this.node2 == node;
  }
}
