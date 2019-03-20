import * as ShaderSource from './Shaders.js';
import { ShaderProgram } from './ShaderProgram';

document.addEventListener('DOMContentLoaded', function (event) {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');

  // Try to get the rendering context
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Sorry, WebGL is not available in your browser!");
    return;
  }

  // Enable retina support
  // if (typeof window.devicePixelRatio === 'number') {
  //   canvas.style.width = canvas.width.toString() + 'px';
  //   canvas.style.height = canvas.height.toString() + 'px';
  //   canvas.width = canvas.width * window.devicePixelRatio;
  //   canvas.height = canvas.height * window.devicePixelRatio;

  //   // this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  // }

  Main(gl);
});


function Main(gl: WebGLRenderingContext) : void {
  SetupGL(gl);
  RenderScene(gl);
}


function SetupGL(gl: WebGLRenderingContext) {
  // const vertexShader = CreateShader(gl, gl.VERTEX_SHADER, ShaderSource.VertexPassthrough);
  // const fragmentShader = CreateShader(gl, gl.FRAGMENT_SHADER, ShaderSource.FragmentTest);
  const program = new ShaderProgram(gl);
  program.addShader(ShaderSource.VertexPassthrough, gl.VERTEX_SHADER);
  program.addShader(ShaderSource.FragmentTest, gl.FRAGMENT_SHADER);
  program.link();
  program.use();

  const positionAttributeLocation = program.getAttribLocation("position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // three 2d points
  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
}


function RenderScene(gl: WebGLRenderingContext) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}


// function CreateShader(gl: WebGLRenderingContext, type: number, source: string) : WebGLShader {
//   const shader = gl.createShader(type);
//   gl.shaderSource(shader, source);
//   gl.compileShader(shader);
//   const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
//   if (success) {
//     return shader;
//   }

//   console.log(gl.getShaderInfoLog(shader));
//   gl.deleteShader(shader);
//   throw 'shader compile error';
// }

// function CreateProgram(
//   gl: WebGLRenderingContext,
//   vertexShader: WebGLShader,
//   fragmentShader: WebGLShader)
//   : WebGLProgram
// {
//   const program = gl.createProgram();
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);
//   const success = gl.getProgramParameter(program, gl.LINK_STATUS);
//   if (success) {
//     return program;
//   }

//   console.log(gl.getProgramInfoLog(program));
//   gl.deleteProgram(program);
//   throw 'program link error';
// }
