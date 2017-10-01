var Graph = require("graphtastic").Graph;
//var draw = require("./draw-rrt");

var distance = function(p1, p2){
  var sum = 0;
  for(var i in p1){
    sum += (p1[i] - p2[i]) * (p1[i] - p2[i])
  }
  return Math.sqrt(sum);
}

class RRT {
  constructor(dims, origin, incrementalDist){
    this.dims = dims;
    this.origin = origin;
    this.incrementalDist = incrementalDist;
    this.connectionGraph = Graph.CreateGraph();
    this.connectionGraph.AddVertex(origin,origin);
  }

  run(k){
    for(var i = 0; i < k; i++){
      var randPoint = this.createRandomPoint();
      var nearest = this.findNearest(randPoint);
      var pointToAdd = this.createIncrementedRandomPoint(this.incrementalDist, randPoint, nearest);
      if(pointToAdd === null){
        continue;
      }
      this.connectionGraph.tryAddVertex(pointToAdd, pointToAdd);
      this.connectionGraph.AddEdge(nearest.toString(), pointToAdd.toString());
    }
    return this;
  }

  createIncrementedRandomPoint(dist, randPoint, nearPoint){
    var d = distance(randPoint, nearPoint);
    if(d < dist){
      /*if(randPoint[0] < 100 && randPoint[0] > 10 && randPoint[1] < 100 && randPoint[1] > 10 ){
        return null;
      }*/
      return randPoint;
    }
    var r = dist / d;
    var newPoint = [];

    for(var i in nearPoint){
      newPoint.push((randPoint[i] - nearPoint[i]) * r + nearPoint[i])
    }
    /*if(newPoint[0] < 100 && newPoint[0] > 10 && newPoint[1] < 100 && newPoint[1] > 10 ){
      return null;
    }*/
    return newPoint;
  }

  createRandomPoint(){
    var point = [];

    for(var i in this.dims){
      var rand = Math.random();
      var p = rand * (this.dims[i][1] - this.dims[i][0]) + this.dims[i][0];
      point.push(p);
    }

    return point;
  }

  findNearest(point){
    var closest = this.origin;
    var minDist = distance(this.origin, point);
    for(var i in this.connectionGraph.vertexCollection){
      var candidate = this.connectionGraph.vertexCollection[i].data;
      if(distance(point, candidate) < minDist){
        minDist = distance(point, candidate);
        closest = candidate;
      }
    }

    return closest;
  }

  findClosestPath(point){
    var nearest = this.findNearest(point);
    var edges = this.connectionGraph.GetPath(this.origin.toString(), nearest.toString());
    var verts = [this.origin];

    for(var e in edges){
      var edge = edges[e];
      var nextPoint = edge.to.data;
      verts.push(nextPoint);
    }

    return verts;
  }

}

module.exports = RRT;

//draw(new RRT([[-200,200], [-200,200]], [0,0],5).run(2000), null, 1, [150,150])
