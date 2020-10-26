var context;
// set height and width
var x = 10
var y = 200
var dx = 5
var dy =5

// Shape functions
class Point {
  constructor(x,y,theta=Math.random()*2*Math.PI,speed = Math.random()*1.5 + 0.5) {
    this.x = x;
    this.y = y;
    this.theta = theta
    this.speed = speed;
    this.dx = speed*Math.cos(theta)
    this.dy = speed*Math.sin(theta)
    this.cluster = -1

  }
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
    var p
    for (p of this.points){
      if( p.x<0 || p.x>this.width) p.dx=-p.dx;
      if( p.y<0 || p.y>this.height) p.dy=-p.dy;
      p.x += p.dx
      p.y += p.dy
    }
  }
}

// Accessories
function distance(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) )
}
function hull(points) {
      points.sort(function (a, b) {
          return a.x != b.x ? a.x - b.x : a.y - b.y;
      });

      var n = points.length;
      var hull = [];

      for (var i = 0; i < 2 * n; i++) {
          var j = i < n ? i : 2 * n - 1 - i;
          while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], points[j]))
              hull.pop();
          hull.push(points[j]);
      }

      hull.pop();
      return hull;
  }

  function removeMiddle(a, b, c) {
      var cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
      var dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
      return cross < 0 || cross == 0 && dot <= 0;
  }
function colorOf(cluster_num){
  if (cluster_num == -1){return "#000000"}
  else if (cluster_num == 0){return "#BF14C7"}
  else if (cluster_num == 1){return  "#2193FF"}
  else if (cluster_num == 2){return "#0AB93F"}
}
function plotpoints(points,context,size = 8){
  for (p of points){
    context.fillStyle = colorOf(p.cluster)
    context.beginPath()
    context.arc(p.x, p.y, size, 0, Math.PI * 2, true);
    context.fill()
  }

}
function edge(a,b,context,cluster = -1){
  context.beginPath();
  context.strokeStyle = colorOf(cluster)
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.stroke();
}
function compass(origin,context,r=20,cluster = -1){
  context.beginPath();
  context.strokeStyle = colorOf(cluster)
  context.arc(origin.x, origin.y,r, 0, 2 * Math.PI);
  context.stroke();
}
function getCenters(points){
  pointsSeen = [0,0,0]
  centers = [new Point(0,0),new Point(0,0),new Point(0,0)]

  for (p of points){
    i = p.cluster
    pointsSeen[i] += 1
    centers[i].x += (p.x - centers[i].x)/pointsSeen[i]
    centers[i].y += (p.y - centers[i].y)/pointsSeen[i]
  }
  return centers


}
function getClusters(points){
  clusters = [[],[],[]]
  for (p of points){clusters[p.cluster].push(p)}
  return clusters
}
function getHulls(points){
  clusters = getClusters(points)
  hulls = clusters.map(hull)
  return hulls
}
// Shapes
function triangle(points,context,cluster=-1){
  a = points[0];
  b = points[1];
  c = points[2];

  edge(a,b,context,cluster)
  edge(b,c,context,cluster)
  edge(c,a,context,cluster)

  // now draw compass ruler
  compass(a,context,r=distance(a,b),cluster)
  compass(a,context,r=distance(a,c),cluster)
  compass(b,context,r=distance(b,c),cluster)
}
function quadrilateral(points,context,cluster = -1){
  a = points[0]
  b = points[1]
  c = points[2]
  d = points[3]

  ab = distance(a,b)
  bc = distance(b,c)
  cd = distance(c,d)
  da = distance(d,a)
  diag = distance(a,c)

  // construct the quadrilateral
  edge(a,b,context,cluster)
  edge(b,c,context,cluster)
  edge(c,d,context,cluster)
  edge(d,a,context,cluster)

  compass(a,context,diag,cluster)
  compass(a,context,da,cluster)
  compass(c,context,cd,cluster)
  compass(a,context,ab,cluster)
  compass(c,context,bc,cluster)

}
function pentagon(points,context,cluster=-1){
  a = points[0]
  b = points[1]
  c = points[2]
  d = points[3]
  e = points[4]

  ab = distance(a,b)
  bc = distance(b,c)
  cd = distance(c,d)
  de = distance(d,e)
  ea = distance(e,a)

  // Diagonals
  ad = distance(a,d)
  ac = distance(a,c)
  be = distance(b,e)
  bd  = distance(b,d)

  // Draw the polygon
  edge(a,b,context,cluster)
  edge(b,c,context,cluster)
  edge(c,d,context,cluster)
  edge(d,e,context,cluster)
  edge(e,a,context,cluster)

  compass(a,context,ea,cluster)
  compass(a,context,ad,cluster)
  compass(a,context,ac,cluster)

  compass(b,context,be,cluster)
  compass(b,context,bd,cluster)
  compass(b,context,bc,cluster)



}

// clustering
function kmeans(points,k=3,iters = 5){
    var centers =[]
    init()

    for (var j=0;j<iters;j++){
        centers = getCenters(points)
        assignClusters()
    }

  function init(){
    for (p of points){
      if (p.cluster == -1){
      idx = Math.floor(Math.random() * k)
      p.cluster = idx
    }

  }}
  function assignClusters(){
      for (p of points){
        dist = centers.map(c => Math.sqrt( Math.pow(c.x-p.x,2) + Math.pow(c.y-p.y,2)))
        p.cluster = dist.indexOf(Math.min(...dist))

      }

  }
}
function drawClusters(points,context){
  hulls = getHulls(points)
  for (h of hulls){
      cluster = h[0].cluster
      if (h.length == 3){triangle(h,context,cluster)}
      else if (h.length == 4){quadrilateral(h,context,cluster)}
      else if (h.length == 5){pentagon(h,context,cluster)}
  }


}



// Initialize context
function init() {
  ease_scale = 1
  context= myCanvas.getContext('2d');
  pc = new PointController(1400/ease_scale,756/ease_scale,8)
  pc.initPoints()

  // myCanvas.addEventListener("mousemove", function(e) {
  //   var cRect = myCanvas.getBoundingClientRect();
  //   var canvasX = Math.round(e.clientX - cRect.left);
  //   var canvasY = Math.round(e.clientY - cRect.top);
  // })
  setInterval(draw, 10)
}


function draw()
{
  context.clearRect(0, 0, 1400, 765);
  plotpoints(pc.points,context)
  drawClusters(pc.points,context)
  kmeans(pc.points)
  pc.updatePoints()
}
