var bitmapManipulation = require("bitmap-manipulation");
var Bitmap = bitmapManipulation.BMPBitmap

var distance = function(p1, p2){
  var sum = 0;
  for(var i in p1){
    sum += (p1[i] - p2[i]) * (p1[i] - p2[i])
  }
  return Math.sqrt(sum);
}

function drawLine(p1, p2, inc){
  var currP = p1;
  var curdist = 0;
  var maxDist = distance(p1, p2);
  var pts = [];
  while(maxDist > curdist){
    var newPoint = [];
    var r = curdist / maxDist;
    if(r < .05){
      curdist++;
      continue;
    }
    for(var i in p1){
      newPoint.push(Math.ceil((p2[i] - p1[i]) * r + p1[i]));
    }
    pts.push(newPoint);
    //pts.push(newPoint.map((x) => {return x + 1}))
    curdist++;
  }

  return pts;
}

module.exports = function drawBitmap(rrt, saveFile, scale, searchPoint){
  var x = rrt.dims[0][1] - rrt.dims[0][0];
  var y = rrt.dims[1][1] - rrt.dims[1][0]

  let bitmap = new bitmapManipulation.BMPBitmap(x * scale, y * scale);
  bitmap.drawFilledRect(0, 0, x * scale, y * scale, 0xffffff, 0xffffff)
  var verts = rrt.connectionGraph.vertexCollection;
  for(var i in verts){
    var vert = verts[i];
    var edges = rrt.connectionGraph.GetEdges(vert);

    for(var e in edges){
      var edge = edges[e];
      var pts = drawLine([(edge.from.data[0]+ x/2) * scale, (edge.from.data[1] + y/2) * scale], [(edge.to.data[0] + x/2) * scale, (edge.to.data[1] + y/2) * scale]);
      for(var i in pts){
        bitmap.setPixel(pts[i][0] , pts[i][1] , 0xffff00)
      }
    }

  }
  if(searchPoint){
    var nextPts = rrt.findClosestPath(searchPoint);
    for(var i = 1; i < nextPts.length; i++){
      var fromPt = nextPts[i - 1];
      var toPt = nextPts[i];
      var pts = drawLine([(fromPt[0]+ x/2) * scale, (fromPt[1] + y/2) * scale], [(toPt[0] + x/2) * scale, (toPt[1] + y/2) * scale]);
      for(var j in pts){
        bitmap.setPixel(pts[j][0] , pts[j][1] , 0xffff70)
      }
    }
  }
  bitmap.save("d.bmp");
}
