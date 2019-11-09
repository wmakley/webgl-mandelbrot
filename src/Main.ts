import * as ShaderSource from './Shaders';
import ShaderProgram from './ShaderProgram';


export default function Main(gl: WebGLRenderingContext) : void {
  SetupGL(gl);
  RenderScene(gl);
}


function SetupGL(gl: WebGLRenderingContext) {
  const program = new ShaderProgram(gl);
  console.log("Vertex Shader", ShaderSource.VertexPassthrough);
  program.addShader(ShaderSource.VertexPassthrough, gl.VERTEX_SHADER);
  program.addShader(ShaderSource.FragmentTest, gl.FRAGMENT_SHADER);
  if (!program.link()) {
    throw new Error("Unable to link shader program!");
  }
  program.use();

  const positionAttributeLocation = program.getAttribLocation("position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // three 2d points
  const positions = [
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
  const size = 2;          // 2 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
}


function RenderScene(gl: WebGLRenderingContext) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}
