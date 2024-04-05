
var exports;
var memory;

memory = new WebAssembly.Memory({
    initial: 256,
    maximum: 512
})

WebAssembly.instantiateStreaming(fetch("./wasmBezier/bezier.wasm"), {
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