

let ctx;
main();
function main() {

    let canvas = document.getElementById("canvas");
    ctx = canvas.createCanvasContext(500, 500);
    ctx.background(200, 200, 100)
    randomSeed(1000)
}

 
function wasmtest() {
    randomSeed(1000)

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
            x = (random(-num1, 500 + num1));
            y = (random(-num1, 500 + num1));
            arr.push(x, y);

        }


        let result = curveBezier(arr,arr.length/2 , detail,1);
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

 
 