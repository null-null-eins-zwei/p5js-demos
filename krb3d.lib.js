function getNoise(w, h, theta, noiseScale){
  
  const result = [];
  for(let ix = 0; ix < w; ix++){
    result[ix] = [h];
  }
  
  const startr = 1000;
  
  let minn = 255;
  let maxn = 0;
  
  for(let r = 0; r < w; r++){
    const cart = toCartesian(r + startr, theta);
    for(let iz = 0; iz < h; iz++){
      const n = noise(cart.x * noiseScale, cart.y * noiseScale, iz * noiseScale) * 255;
      minn = min(n, minn);
      maxn = max(n, maxn);
      
      result[r][iz] = n;
    }
  }
  
  for(let ix = 0; ix < w; ix++){
    for(let iy = 0; iy < h; iy++){
      result[ix][iy] = map(result[ix][iy], minn, maxn, 0, 255);
    }
  }
  
  return result;
}

function toCartesian(r, theta)
{
  const x = r * cos(theta);
  const y = r * sin(theta);
  
  return createVector(x, y);
}

function setAlpha(c, a){
  return color(red(c), green(c), blue(c), a);
}

function chooseColor(n){
  
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

function choose(arr, n){
  const index = floor(n) % (arr.length);
  
  return arr[index];
}

function addNulls(n, length){
  let result = "";
  for(i = 0; i < length + 1; i++){
    result +="0";
  }
  
  result += n;
  
  reverseResult = result.split("").reverse().join("");
  
  reverseResult = reverseResult.substring(0, length);
  
  result = reverseResult.split("").reverse().join("");
  
  return result;
}