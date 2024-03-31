



async function main() {

    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    let ctx = canvas.createCanvasContext(500, 500);

    ctx.background(200, 200, 100)

    randomSeed(1000)


    // for (let km = 0; km < 100; km++) {

    //     let verts = [];
    //     verts.push(new vector(100, 100))
    //     verts.push(new vector(100, 150))
    //     verts.push(new vector(150, 150))
    //     verts.push(new vector(200, 150))
    //     verts.push(new vector(200, 200))
    //     verts.push(new vector(300, 300))
    //     verts.push(new vector(400, 300))
    //     verts.push(new vector(400, 200))
    //     verts.push(new vector(400, 100))
    //     verts.push(new vector(300, 100))
    //     verts.push(new vector(200, 200))
    //     verts.push(new vector(150, 250))
    //     verts.push(new vector(180, 350))
    //     verts.push(new vector(280, 250))
    //     verts.push(new vector(380, 350))
    //     verts.push(new vector(350, 370))
    //     verts.push(new vector(150, 270))
    //     verts.push(new vector(100, 270))
    //     verts.push(new vector(240, 390))
    //     verts.push(new vector(340, 390))
    //     verts.push(new vector(340, 100))



    //     ctx.strokeStyle = "rgb(100, 0, 0)";
    //     ctx.beginPath();
    //     verts.forEach(e => ctx.lineTo(e.x, e.y))
    //     ctx.stroke();

    //     verts = curveBeziertest(verts, 20000)
    //     console.log(verts)

    //     ctx.beginPath();
    //     verts.forEach(e => ctx.lineTo(e.x+20, e.y))
    //     ctx.stroke();



    // }

    ctx.globalCompositeOperation = "multiply";


    for (let km = 0; km < 300; km++) {

        let verts = [];
        
        let x = 100;
        let y = 100;
        let num1=100;
        for (let i = 0; i < 100; i++) {
            x = random( -num1,500+num1)   ;
            y =  random( -num1,500+num1);
            verts.push(new vector(x, y))
        }

        // ctx.strokeStyle = "rgb(100,  0, 100)";
        // ctx.beginPath();
        // verts.forEach(e => ctx.lineTo(e.x + 2, e.y))
        // ctx.stroke();

 
        // console.log(verts)
        var memory = new WebAssembly.Memory({
            initial: 256,
            maximum: 512
        })

        var exports;
        await WebAssembly.instantiateStreaming(fetch("bezier.wasm"), {
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

 

        let idx = 0;
        let arr = new Float32Array(memory.buffer)
 
        for (let i = 0; i < verts.length; i++) {
            arr[idx] = verts[i].x;
            idx++;
            arr[idx] = verts[i].y;
            idx++;
        }

 
        let bezierStep=500;
        var ptr = exports.curveBezier(0, verts.length * 2, bezierStep)
        var bytes = new Float32Array(memory.buffer, ptr);
        let resultt = bytes.slice(0,bezierStep*2);
 
   
        ctx.strokeStyle = `rgb(${random(200,255)} , ${random( 0,255)}, ${random(200,255)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < resultt.length; i += 2) {
            ctx.lineTo(resultt[i], resultt[i + 1])
        }
        ctx.stroke();

 

    }






}


main();

function vector(x, y) {
    this.x = x;
    this.y = y;
}
