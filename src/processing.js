let i = 0;
function setup() {
    createCanvas(300, 300);
}

function draw() {
  background(51);
  ellipse(100 * i, 100, 10, 10)
  if(i > 3.1){
    i = 0
  }
  i += 0.01
}