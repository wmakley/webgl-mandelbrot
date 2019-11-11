export default class Shader {
  private readonly name: string
  private readonly source: string;
  private readonly shaderType: number;
  public handle: WebGLShader | null;
  isCompiled: boolean;

  constructor(name: string, source: string, shaderType: number) {
    this.name = name;
    this.source = source;
    this.shaderType = shaderType;
    this.isCompiled = false;
    this.handle = null;
  }

  compile(gl: WebGLRenderingContext): boolean {
    if (this.isCompiled) {
      return true;
    }

    this.handle = gl.createShader(this.shaderType);
    if (!this.handle) {
      console.log(`failed to create shader ${this.name}; couldn't get handle`);
      return false;
    }

    gl.shaderSource(this.handle, this.source);
    gl.compileShader(this.handle);
    const success = gl.getShaderParameter(this.handle, gl.COMPILE_STATUS);
    if (success) {
      this.isCompiled = true;
    } else {
      console.log(
        `Failed to compile shader '${this.name}':\n`,
        gl.getShaderInfoLog(this.handle)
      );
      gl.deleteShader(this.handle);
      this.handle = null;
    }
    return success;
  }
}
