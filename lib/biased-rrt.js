var RRT = require("./rrt");
//var draw = require("./draw-rrt");

var distance = function(p1, p2){
  var sum = 0;
  for(var i in p1){
    sum += (p1[i] - p2[i]) * (p1[i] - p2[i])
  }
  return Math.sqrt(sum);
}

class BiasedRRT extends RRT {
  constructor(dims, origin, incrementalDist, bias, gotoBiasRate){
    super(dims, origin, incrementalDist)
    this.bias = bias
    this.gotoBiasRate = gotoBiasRate || .25;
  }

  createRandomPoint(){
    var point = [];
    var biasDist = distance(this.origin, this.bias);
    if(Math.random() > this.gotoBiasRate){
      return super.createRandomPoint();
    } else {
      return this.bias;
    }

    return point;
  }

}

module.exports = BiasedRRT;

//draw(new BiasedRRT([[-200,200], [-200,200]], [0,0],10, [100,100], .35).run(500), null, 1, [150,150])
