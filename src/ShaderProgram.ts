import Shader from './Shader';

export default class ShaderProgram {
  public program: WebGLProgram | null;
  public isLinked: boolean;
  private readonly shaders: Array<Shader>;
  private readonly gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shaders = [];
    this.isLinked = false;
    this.program = null;
  }

  addShader(name: string, source: string, shaderType: number): void {
    const shader = new Shader(name, source, shaderType);
    if (!shader.compile(this.gl)) {
      throw new Error('Unable to compile shader!');
    }
    this.shaders.push(shader);
  }

  link(): boolean {
    if (this.isLinked) { return true; }

    this.program = this.gl.createProgram();
    if (this.program === null) {
      throw new Error("Failed to create shader program!");
    }

    for (let shader of this.shaders) {
      if (shader.handle) {
        this.gl.attachShader(this.program, shader.handle);
      }
    }

    this.gl.linkProgram(this.program);
    const success = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (success) {
      this.isLinked = true;
      return true;
    }

    this.isLinked = false;
    console.log(this.gl.getProgramInfoLog(this.program));
    this.gl.deleteProgram(this.program);
    return false;
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  getAttribLocation(name: string): number {
    if (!this.program || !this.isLinked) {
      throw new Error("Program has been compiled and linked");
    }
    const location = this.gl.getAttribLocation(this.program, name);
    if (location < 0) {
      throw new Error(`Could not find attribute '${name}'`);
    }
    return location;
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    if (!this.program || !this.isLinked) {
      throw new Error("Program has been compiled and linked");
    }
    const location = this.gl.getUniformLocation(this.program, name);
    if (!location) {
      throw new Error(`Could not find uniform '${name}'!`);
    }
    return location;
  }
}
