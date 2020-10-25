var context;
// set height and width
const x = 10
const y = 200

const dx = 5
const dy =5

// Shape functions
class point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}
function distance(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) )
}
function edge(a,b,context){
  context.beginPath();
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.stroke();
}
function compass(origin,context,r=20){
  context.beginPath();
  context.arc(origin.x, origin.y,r, 0, 2 * Math.PI);
  context.stroke();
}
function triangle(points,context){
  a = points[0];
  b = points[1];
  c = points[2];

  edge(a,b,context)
  edge(b,c,context)
  edge(c,a,context)

  // now draw compass ruler
  compass(a,context,r=distance(a,b))
  compass(a,context,r=distance(a,c))
  compass(b,context,r=distance(b,c))
}

// Initialize context
function init() {
  context= myCanvas.getContext('2d');
  setInterval(draw, 10)
}


function draw()
{
  a = new point(248,263)
  b = new point(528,396)
  c= new point(x,y)
  triangle([a,b,c],context);


  // Boundary Logic
if( x<0 || x>1000) dx=-dx;
if( y<0 || y>1000) dy=-dy;
x+=dx;
y+=dy;
}





// context.clearRect(0,0, 300,300);
// context.beginPath();
// context.fillStyle="#0000ff";
// // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
// context.arc(x,y,20,0,Math.PI*2,true);
// context.closePath();
// context.fill();
