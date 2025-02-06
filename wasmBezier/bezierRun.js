function curveBezier(vertices, chunk, detail, mode) {
  console.log(vertices.length, chunk, detail, mode);
  let input_ptr = Module._wasmmalloc(
    (vertices.length + 2) * Module.HEAPF32.BYTES_PER_ELEMENT
  );
  var inputBufferMemory = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i++) {
    inputBufferMemory[i] = vertices[i];
  }

  Module.HEAPF32.set(
    inputBufferMemory,
    input_ptr / Module.HEAPF32.BYTES_PER_ELEMENT
  );

  let output_ptr = Module._curveBezier(
    input_ptr,
    vertices.length,
    chunk,
    detail,
    mode
  );
  let output = [
    ...Module.HEAPF32.subarray(
      output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT + 1,
      output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT +
        Module.HEAPF32[output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT]
    ),
  ];

  return output;
}

// var exports;
// var memory;

// memory = new WebAssembly.Memory({
//     initial: 256,
//     maximum: 512
// })

// WebAssembly.instantiateStreaming(fetch("./wasmBezier/bezier.wasm"), {
//     js: {
//         mem: memory
//     },
//     env: {
//         emscripten_resize_heap: memory.grow
//     }
// }).then(result => {
//     exports = result.instance.exports;
//     memory = result.instance.exports.memory;

// })

// function curveBezier(arr, detail) {
//
//     var input_array = new Float32Array(arr);
//     var len = input_array.length;
//     var bytes_per_element = input_array.BYTES_PER_ELEMENT;

//     var currntArr = exports.wasmmalloc(len * bytes_per_element);
//     var input_ptr = exports.wasmmalloc(len * bytes_per_element);
//     var output_ptr = exports.wasmmalloc(len * bytes_per_element);

//     let summands = new Float32Array(memory.buffer, input_ptr);
//     for (let i = 0; i < len; i++) { summands[i] = input_array[i]; }

//     exports.curveBezier(input_ptr, output_ptr, currntArr, len, detail)
//     var output_array = new Float32Array(memory.buffer, output_ptr, detail * 2);

//     return output_array;
// }
