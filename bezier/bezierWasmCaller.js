let curveBezier_output_ptr;
let curveBezier_output_ptr_size;
let curveBezier_currnetVerts_ptr;
let curveBezier_currnetVerts_ptr_size;
let curveBezier_chunkVerts_ptr;
let curveBezier_chunkVerts_ptr_size;
let curveBezier_input_ptr;
let curveBezier_input_ptr_size;

function setCurveBezierPointer(ptr, ptr_size, size) {
  // initial pointer array
  if (ptr == null) {
    ptr = Module._wasmmalloc((size + 2) * Module.HEAPF32.BYTES_PER_ELEMENT);
    ptr_size = size;
  }
  // change array size realloc
  if (ptr_size < size) {
    ptr = Module._wasmrealloc(
      ptr,
      (size + 2) * Module.HEAPF32.BYTES_PER_ELEMENT
    );
    ptr_size = size;
  }

  return [ptr, ptr_size];
}

function curveBezier(vertices, chunk, detail, mode) {
  let chunkNum;
  if (vertices.length / 2 < 3) {
    return vertices;
  }
  chunk = parseInt(chunk / 2) * 2;
  if (chunk > vertices.length) {
    chunkNum = vertices.length;
  } else if (chunk < 4) {
    chunkNum = 4;
  } else {
    chunkNum = chunk;
  }

  [curveBezier_output_ptr, curveBezier_output_ptr_size] = setCurveBezierPointer(
    curveBezier_output_ptr,
    curveBezier_output_ptr_size,
    detail * vertices.length
  );

  [curveBezier_currnetVerts_ptr, curveBezier_currnetVerts_ptr_size] =
    setCurveBezierPointer(
      curveBezier_currnetVerts_ptr,
      curveBezier_currnetVerts_ptr_size,
      vertices.length
    );

  [curveBezier_chunkVerts_ptr, curveBezier_chunkVerts_ptr_size] =
    setCurveBezierPointer(
      curveBezier_chunkVerts_ptr,
      curveBezier_chunkVerts_ptr_size,
      chunkNum
    );

  [curveBezier_input_ptr, curveBezier_input_ptr_size] = setCurveBezierPointer(
    curveBezier_input_ptr,
    curveBezier_input_ptr_size,
    vertices.length
  );

  var inputBufferMemory = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i++) {
    inputBufferMemory[i] = vertices[i];
  }

  Module.HEAPF32.set(
    inputBufferMemory,
    curveBezier_input_ptr / Module.HEAPF32.BYTES_PER_ELEMENT
  );

  Module._curveBezier(
    curveBezier_input_ptr,
    vertices.length,
    chunkNum,
    detail,
    mode,
    curveBezier_output_ptr,
    curveBezier_currnetVerts_ptr,
    curveBezier_chunkVerts_ptr
  );

  let output = [
    ...Module.HEAPF32.subarray(
      curveBezier_output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT + 1,
      curveBezier_output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT +
        Module.HEAPF32[
          curveBezier_output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT
        ]
    ),
  ];

  // Module._wasmfree(input_ptr);
  // Module._wasmfree(output_ptr);
  // Module._wasmfree(currnetVerts_ptr);
  // Module._wasmfree(chunkVerts_ptr);

  return output;
}







// function initCurveBezier(){
//   let output_ptr = Module._wasmmalloc(
//     (1000 * vertices.length + 2) * Module.HEAPF32.BYTES_PER_ELEMENT
//   );

//   let currnetVerts_ptr = Module._wasmmalloc(
//     (vertices.length + 2) * Module.HEAPF32.BYTES_PER_ELEMENT
//   );

//   let chunkVerts_ptr = Module._wasmmalloc(
//     (chunkNum + 2) * Module.HEAPF32.BYTES_PER_ELEMENT
//   );

//   let input_ptr = Module._wasmmalloc(
//     (vertices.length + 2) * Module.HEAPF32.BYTES_PER_ELEMENT
//   );

// }

// function freeCurveBezier(){

// }

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
