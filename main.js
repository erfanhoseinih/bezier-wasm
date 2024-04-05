

let ctx;
main();
function main() {

    let canvas = document.getElementById("canvas");
    ctx = canvas.createCanvasContext(500, 500);
    ctx.background(200, 200, 100)

    randomSeed(1000)
}





function wasmtest() {


    let curvelinesNum = document.getElementById("inputnum").value;
    let detail = 1000;
    let pointsNum = 80;

    let timeStr = `wasm ${curvelinesNum} curves done in`;

    const start = performance.now();
    let result0 = [];




    for (let km = 0; km < curvelinesNum; km++) {


        let num1 = 100;
        let arr = [];
        for (let i = 0; i < pointsNum; i++) {
            x = (random(-num1, 500 + num1));
            y = (random(-num1, 500 + num1));
            arr.push(x, y);

        }


        let result = curveBezier(arr, detail);
        result0.push(new Array(...result));
    }


    ctx.globalCompositeOperation = "source-over";
    ctx.background(200, 200, 100)
    ctx.globalCompositeOperation = "multiply";
    for (let i = 0; i < result0.length; i += 1) {
        ctx.strokeStyle = `rgb(${random(200, 255)} , ${random(0, 255)}, ${random(200, 255)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let j = 0; j < result0[i].length; j += 2) {
            ctx.lineTo(result0[i][j], result0[i][j + 1])
        }
        ctx.stroke();
    }


    const end = performance.now();
    console.log(`${timeStr} ${end - start} ms = ${(end - start) / 1000} s`);
    let par = document.getElementById("wasmtime");
    par.innerHTML =`${timeStr} ${end - start} ms = ${(end - start) / 1000} s` ;

}


function jstest() {

    function vector(x, y) {
        this.x = x;
        this.y = y;
    }

    let curvelinesNum = document.getElementById("inputnum").value;
    let detail = 1000;
    let pointsNum = 80;


    let timeStr = `javascript ${curvelinesNum} curves done in`;
    const start = performance.now();

    let result1 = [];
    for (let km = 0; km < curvelinesNum; km++) {


        let verts = [];
        let x = 100;
        let y = 100;
        let num1 = 100;
        for (let i = 0; i < pointsNum; i++) {
            x = random(-num1, 500 + num1);
            y = random(-num1, 500 + num1);
            verts.push(new vector(x, y))
        }

        let result = curveBeziertest(verts, detail)
        result1.push(new Array(...result));

    }


    ctx.globalCompositeOperation = "source-over";
    ctx.background(200, 200, 100)
    ctx.globalCompositeOperation = "multiply";
    for (let i = 0; i < result1.length; i += 1) {
        ctx.strokeStyle = `rgb(${random(200, 255)} , ${random(0, 255)}, ${random(200, 255)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let j = 0; j < result1[i].length; j += 2) {
            ctx.lineTo(result1[i][j].x, result1[i][j].y)
        }
        ctx.stroke();
    }

    const end = performance.now();
    console.log(`${timeStr} ${end - start} ms = ${(end - start) / 1000} s`);
    let par = document.getElementById("jstime");
    par.innerHTML =`${timeStr} ${end - start} ms = ${(end - start) / 1000} s` ;
}