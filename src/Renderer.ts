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

  private graphSizeUniform?: WebGLUniformLocation | null;
  private screenSizeUniform?: WebGLUniformLocation | null;
  private translateUniform?: WebGLUniformLocation | null;
  private scaleUniform?: WebGLUniformLocation | null;
  private iterUniform?: WebGLUniformLocation | null;

  public readonly initialTranslateX = -0.75;
  public readonly initialTranslateY = 0.0;
  public readonly initialScale = 1.0;
  public readonly initialIterations = 50;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;

    this._translateX = this.initialTranslateX;
    this._translateY = this.initialTranslateY;
    this._scale = this.initialScale;
    this._iterations = this.initialIterations;
  }

  public get translateX() { return this._translateX; }
  public set translateX(input: number) { this._translateX = input; }

  public get translateY() { return this._translateY; }
  public set translateY(input: number) { this._translateY = input; }

  public get scale() { return this._scale; }
  public set scale(input: number) {
    if (input > 1000) {
      input = 1000;
    } else if (input < 0) {
      input = this.initialScale;
    }
    this._scale = input;
  }

  public get iterations() { return this._iterations; }
  public set iterations(input: number) {
    if (input <= 0) {
      input = 1;
    } else if (input > 10000) {
      input = 10000;
    }
    this._iterations = input;
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
    // Make the type system happy
    if (!(this.screenSizeUniform && this.translateUniform && this.scaleUniform && this.iterUniform)) {
      throw new Error("WebGL context not initialized!");
    }

    const gl = this.gl;

    gl.uniform2f(this.screenSizeUniform, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(this.translateUniform, this._translateX, this._translateY);
    gl.uniform1f(this.scaleUniform, this._scale);
    gl.uniform1i(this.iterUniform, this._iterations);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public reset(): void {
    this._translateX = this.initialTranslateX;
    this._translateY = this.initialTranslateY;
    this._scale = this.initialScale;
    this._iterations = this.initialIterations;
  }
}
