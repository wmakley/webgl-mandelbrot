import * as ShaderSource from './Shaders';
import ShaderProgram from './ShaderProgram';

const GRAPH_WIDTH = 2.6;
const GRAPH_HEIGHT = 2.3;

/**
 * Contains all the rendering code. Delegated to by event handlers in
 * index.js.
 */
export default class Renderer {
  private readonly gl: WebGLRenderingContext;

  private _translateX: number;
  private _translateY: number;
  private _scale: number;
  private _iterations: number;

  private graphSizeUniform: WebGLUniformLocation;
  private screenSizeUniform: WebGLUniformLocation;
  private translateUniform: WebGLUniformLocation;
  private scaleUniform: WebGLUniformLocation;
  private iterUniform: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this._translateX = -0.75;
    this._translateY = 0;
    this._scale = 1.0;
    this._iterations = 50;
  }

  public get translateX() { return this._translateX; }
  public set translateX(input: number | string) {
    this._translateX = this.parseUserInput(input);
    this.gl.uniform2f(this.translateUniform, this._translateX, this._translateY);
    this.render();
  }

  public get translateY() { return this._translateY; }
  public set translateY(input: number | string) {
    this._translateY = this.parseUserInput(input);
    this.gl.uniform2f(this.translateUniform, this._translateX, this._translateY);
    this.render();
  }

  public get scale() { return this._scale; }
  public set scale(input: string | number) {
    this._scale = this.parseUserInput(input);
    this.gl.uniform1f(this.scaleUniform, this._scale);
    this.render();
  }

  public get iterations() { return this._iterations; }
  public set iterations(input: string | number) {
    if (typeof input === "string") {
      input = parseInt(input, 10);
      if (isNaN(input)) {
        input = 1;
      }
    } else {
      input = Math.ceil(input);
    }
    this._iterations = input;

    this.gl.uniform1i(this.iterUniform, this._iterations);
    this.render();
  }

  private parseUserInput(input: number | string): number {
    if (typeof input === "string") {
      input = parseFloat(input);
      if (isNaN(input)) {
        input = 1;
      }
    }
    return input;
  }

  public init(): void {
    const gl = this.gl;
    const program = new ShaderProgram(gl);
    program.addShader("VertexPassThrough.glsl", ShaderSource.VertexPassThrough, gl.VERTEX_SHADER);
    program.addShader("Fragment.glsl", ShaderSource.Fragment, gl.FRAGMENT_SHADER);
    if (!program.link()) {
      throw new Error("Unable to link shader program!");
    }
    program.use();

    const positionAttributeLocation = program.getAttribLocation("position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // three 2d points
    const positions = [
      1, 1,
      -1, 1,
      -1, -1,

      1, 1,
      1, -1,
      -1, -1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

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
      positionAttributeLocation, size, type, normalize, stride, offset
    );

    this.graphSizeUniform = program.getUniformLocation("graphSize");
    this.screenSizeUniform = program.getUniformLocation("screenSize");
    this.translateUniform = program.getUniformLocation("translate");
    this.scaleUniform = program.getUniformLocation("scale");
    this.iterUniform = program.getUniformLocation("iter");

    gl.uniform2f(this.graphSizeUniform, GRAPH_WIDTH, GRAPH_HEIGHT);
    gl.uniform2f(this.screenSizeUniform, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(this.translateUniform, this._translateX, this._translateY);
    gl.uniform1f(this.scaleUniform, this._scale);
    gl.uniform1i(this.iterUniform, this._iterations);
  }

  public render(): void {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
