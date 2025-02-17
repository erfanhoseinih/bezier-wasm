let curveBezier_output_ptr;
let curveBezier_output_ptr_size;
let curveBezier_currnetVerts_ptr;
let curveBezier_currnetVerts_ptr_size;
let curveBezier_chunkVerts_ptr;
let curveBezier_chunkVerts_ptr_size;
let curveBezier_input_ptr;
let curveBezier_input_ptr_size;
let curveBezier_outputLen_ptr;

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

function setChunck(chunk, vertices) {
  let chunkNum;

  if (chunk < 1) {
    chunk = 1;
  }

  chunkNum = parseInt((vertices.length / 2) / chunk);

  if (chunkNum < 3) {
    chunkNum = 3;
  }

  chunkNum *= 2;

  return chunkNum;
}

function curveBezier(vertices, chunk, detail, mode) {
  // check if vertices is more then 2 points
  if (vertices.length / 2 < 3) {
    return vertices;
  }
  // set chunckNum value
  let chunkNum = setChunck(chunk, vertices);
  detail *= 2;

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
      chunkNum * 2
    );

  [curveBezier_input_ptr, curveBezier_input_ptr_size] = setCurveBezierPointer(
    curveBezier_input_ptr,
    curveBezier_input_ptr_size,
    vertices.length
  );

  curveBezier_outputLen_ptr = Module._wasmmalloc(
    Module.HEAP32.BYTES_PER_ELEMENT
  );
  var inputBufferMemory = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i++) {
    inputBufferMemory[i] = vertices[i];
  }

  Module.HEAPF32.set(
    inputBufferMemory,
    curveBezier_input_ptr / Module.HEAPF32.BYTES_PER_ELEMENT
  );
  // console.log(vertices.length, chunkNum, detail, mode);
  Module._curveBezier(
    curveBezier_input_ptr,
    vertices.length,
    chunkNum,
    detail,
    mode,
    curveBezier_output_ptr,
    curveBezier_currnetVerts_ptr,
    curveBezier_chunkVerts_ptr,
    curveBezier_outputLen_ptr
  );

  let output = [
    ...Module.HEAPF32.subarray(
      curveBezier_output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT,
      curveBezier_output_ptr / Module.HEAPF32.BYTES_PER_ELEMENT +
        Module.HEAP32[
          curveBezier_outputLen_ptr / Module.HEAP32.BYTES_PER_ELEMENT
        ]
    ),
  ];

  return output;
}

function freeCurveBezier() {
  Module._wasmfree(curveBezier_output_ptr);
  Module._wasmfree(curveBezier_currnetVerts_ptr);
  Module._wasmfree(curveBezier_chunkVerts_ptr);
  Module._wasmfree(curveBezier_input_ptr);
  Module._wasmfree(curveBezier_outputLen_ptr);
}
