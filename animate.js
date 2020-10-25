var context;
// set height and width
var x = 10
var y = 200
var dx = 5
var dy =5

// Shape functions
class Point {
  constructor(x,y,theta=Math.random()*2*Math.PI) {
    this.x = x;
    this.y = y;
    this.theta = theta
    this.dx = Math.cos(theta)
    this.dy = Math.sin(theta)
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


class PointController{
  constructor(width,height,n) {
    this.width = width;
    this.height = height;
    this.n = n
  }

  initPoints() {
    var points = []
    for (var i =0;i<this.n;i++){
      x = Math.floor(Math.random() * this.width)
      y = Math.floor(Math.random() * this.height)
      points.push(new Point(x,y))
    }
    this.points = points
  }

  updatePoints() {
    for (p of this.points){
      if( p.x<0 || p.x>this.width) p.dx=-p.dx;
      if( p.y<0 || p.y>this.height) p.dy=-p.dy;
      p.x += p.dx
      p.y += p.dy
    }
  }



}


// Initialize context
function init() {
  context= myCanvas.getContext('2d');
  pc = new PointController(1000,1000,3)
  pc.initPoints()

  for (p of pc.points){
    console.log(p)
  }
  pc.updatePoints()
  for (p of pc.points){
    console.log(p)
  }
  setInterval(draw, 10)
}



function draw()
{

  context.clearRect(0, 0, 1000, 1000);
  a = new Point(248,263)
  b = new Point(528,396)
  c= new Point(x,y)
  pc.updatePoints()
  triangle(pc.points,context);


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
