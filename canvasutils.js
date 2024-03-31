HTMLCanvasElement.prototype.createCanvasContext = function (...args) {


  var context;


  
  var width_Context, height_Context;
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    width_Context = parseInt(args[0])
    height_Context = parseInt(args[1])
  } else {
    width_Context = height_Context = 500;
  }
  this.width = width_Context;
  this.height = height_Context;



  context = this.getContext("2d");



  return context;
}




 

const canvasutils = {

  background: function () {
    if (arguments[0] == String) {
      this.fillStyle = arguments[0];
    } else {
      this.fillStyle = "rgb( " + arguments[0] + ", " + arguments[1] + ", " + arguments[2] + ")";
    }
 
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

}

Object.keys(canvasutils).forEach(e => {
  CanvasRenderingContext2D.prototype[e] = canvasutils[e];
})
