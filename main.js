

let ctx;
main();
function main() {

    let canvas = document.getElementById("canvas");
    ctx = canvas.createCanvasContext(500, 500);
    ctx.background(200, 200, 100)

    randomSeed(1000)
}





async function wasmtest() {


    let curvelinesNum = document.getElementById("inputnum").value;
    let detail = 1000;
    let pointsNum = 80;

    let timeStr = `wasm ${curvelinesNum} curves done in`;

    const start = performance.now();
    let result0 = [];


    var exports;
    var memory;

    memory = new WebAssembly.Memory({
        initial: 256,
        maximum: 512
    })

    await WebAssembly.instantiateStreaming(fetch("./wasmBezier/bezier.wasm"), {
        js: {
            mem: memory
        },
        env: {
            emscripten_resize_heap: memory.grow
        }
    }).then(result => {
        exports = result.instance.exports;
        memory = result.instance.exports.memory;
    })


    function curveBezier(arr, detail) {
        var input_array = new Float32Array(arr);
        var len = input_array.length;
        var bytes_per_element = input_array.BYTES_PER_ELEMENT;

        var currntArr = exports.wasmmalloc(len * bytes_per_element);
        var input_ptr = exports.wasmmalloc(len * bytes_per_element);
        var output_ptr = exports.wasmmalloc(len * bytes_per_element);

        let summands = new Float32Array(memory.buffer, input_ptr);
        for (let i = 0; i < len; i++) { summands[i] = input_array[i]; }


        exports.curveBezier(input_ptr, output_ptr, currntArr, len, detail);

        var output_array = new Float32Array(memory.buffer, output_ptr, detail * 2);

        return output_array;
    }


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