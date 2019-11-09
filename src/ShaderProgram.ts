import Shader from './Shader';

export default class ShaderProgram {
  private shaders: Array<Shader>;
  public program: WebGLProgram;
  public isLinked: boolean;

  constructor(readonly gl: WebGLRenderingContext) {
    this.shaders = [];
    this.isLinked = false;
  }

  addShader(source: string, shaderType: number): void {
    const shader = new Shader(source, shaderType);
    if (!shader.compile(this.gl)) {
      throw 'unable to compile shader';
    }
    this.shaders.push(shader);
  }

  link(): boolean {
    if (this.isLinked) { return true; }

    this.program = this.gl.createProgram();
    for (let i = 0; i < this.shaders.length; i += 1) {
      const shader = this.shaders[i];
      this.gl.attachShader(this.program, shader.handle);
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
    return this.gl.getAttribLocation(this.program, name);
  }
}
