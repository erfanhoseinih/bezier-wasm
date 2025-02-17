let ctx0;
let ctx1;

Module.onRuntimeInitialized = function () {

  randomSeed(1000);


  let canvas0 = document.getElementById("canvas0");
  ctx0 = canvas0.createCanvasContext(500, 500);
  ctx0.background(200, 200, 100);


  let canvas1 = document.getElementById("canvas1");
  ctx1 = canvas1.createCanvasContext(500, 500);
  drawCtx1(ctx1);

  let canvas2 = document.getElementById("canvas2");
  ctx2 = canvas2.createCanvasContext(500, 500);
  drawCtx2(ctx2);


  let canvas3 = document.getElementById("canvas3");
  ctx3 = canvas3.createCanvasContext(500, 500);
  drawCtx3(ctx3);

  let canvas4 = document.getElementById("canvas4");
  ctx4 = canvas4.createCanvasContext(500, 500);
  drawCtx4(ctx4);

};




function drawCtx4(ctx) {
  ctx.background(200, 200, 100);
  let detail = 10;
  let verts = drawRect(
    ctx.canvas.width / 2 - 100,
    ctx.canvas.height / 2 - 100,
    200,
    200
  );
 
  verts.splice(4,0,400,250)

  verts.splice(8,0,250,450)

  verts.splice(12,0,110,450)

  verts.splice(14,0,110,170)

 
 
  ctx.beginPath();
  for (let j = 0; j < verts.length; j += 2) {
    ctx.lineTo(verts[j], verts[j + 1]);
  }
  ctx.stroke();
 
  let result = curveBezier(verts, 1 , detail, 2);

  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let j = 0; j < result.length; j += 2) {
    ctx.lineTo(result[j], result[j + 1]);
  }
  ctx.stroke();
}


function drawCtx3(ctx) {
  ctx.background(200, 200, 100);
  let detail = 5;
  let verts = drawRect(
    ctx.canvas.width / 2 - 100,
    ctx.canvas.height / 2 - 100,
    200,
    200
  );
 
 
  ctx.beginPath();
  for (let j = 0; j < verts.length; j += 2) {
    ctx.lineTo(verts[j], verts[j + 1]);
  }
  ctx.stroke();
 
  let result = curveBezier(verts, 1 , detail, 1);
 
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let j = 0; j < result.length; j += 2) {
    ctx.lineTo(result[j], result[j + 1]);
  }
  ctx.stroke();
}

function drawCtx2(ctx) {
  ctx.background(200, 200, 100);
  let detail = 10;
  let verts = drawRect(
    ctx.canvas.width / 2 - 100,
    ctx.canvas.height / 2 - 100,
    200,
    200
  );
 
  verts.splice(8,2)
 
  ctx.beginPath();
  for (let j = 0; j < verts.length; j += 2) {
    ctx.lineTo(verts[j], verts[j + 1]);
  }
  ctx.stroke();
 
  let result = curveBezier(verts, 2 , detail, 1);

  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let j = 0; j < result.length; j += 2) {
    ctx.lineTo(result[j], result[j + 1]);
  }
  ctx.stroke();
}


function drawCtx1(ctx) {
  ctx.background(200, 200, 100);
  let detail = 10;
  let verts = drawRect(
    ctx.canvas.width / 2 - 100,
    ctx.canvas.height / 2 - 100,
    200,
    200
  );

  ctx.beginPath();
  for (let j = 0; j < verts.length; j += 2) {
    ctx.lineTo(verts[j], verts[j + 1]);
  }
  ctx.stroke();
 
  let result = curveBezier(verts,5, detail, 2);

  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let j = 0; j < result.length; j += 2) {
    ctx.lineTo(result[j], result[j + 1]);
  }
  ctx.stroke();
}

function drawRect(x, y, w, h) {
  rectVerts = [];
  rectVerts.push(x, y);
  rectVerts.push(x + w, y);
  rectVerts.push(x + w, y + h);
  rectVerts.push(x, y + h);
  rectVerts.push(x, y);
  return rectVerts;
}

function wasmtest() {
  randomSeed(1000);

  let curvelinesNum = document.getElementById("inputnum").value;
  let detail = 500;
  let pointsNum = 80;

  let timeStr = `wasm ${curvelinesNum} curves done in`;

  const start = performance.now();
  let result0 = [];

  for (let km = 0; km < curvelinesNum; km++) {
    let num1 = 100;
    let arr = [];
    for (let i = 0; i < pointsNum; i++) {
      x = random(-num1, 500 + num1);
      y = random(-num1, 500 + num1);
      arr.push(x, y);
    }

    let result = curveBezier(arr, 1, detail, 1);
    result0.push(new Array(...result));
  }

  ctx0.globalCompositeOperation = "source-over";
  ctx0.background(200, 200, 100);
  ctx0.globalCompositeOperation = "multiply";
  for (let i = 0; i < result0.length; i += 1) {
    ctx0.strokeStyle = `rgb(${random(200, 255)} , ${random(0, 255)}, ${random(
      200,
      255
    )})`;
    ctx0.lineWidth = 1;
    ctx0.beginPath();
    for (let j = 0; j < result0[i].length; j += 2) {
      ctx0.lineTo(result0[i][j], result0[i][j + 1]);
    }
    ctx0.stroke();
  }

  const end = performance.now();
  console.log(`${timeStr} ${end - start} ms = ${(end - start) / 1000} s`);
  let par = document.getElementById("wasmtime");
  par.innerHTML = `${timeStr} ${end - start} ms = ${(end - start) / 1000} s`;
}
