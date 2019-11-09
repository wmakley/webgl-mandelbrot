export default class Shader {
  private readonly source: string;
  private readonly shaderType: number;
  public handle?: WebGLShader;
  isCompiled: boolean;

  constructor(source: string, shaderType: number) {
    this.source = source;
    this.shaderType = shaderType;
    this.isCompiled = false;
  }

  compile(gl: WebGLRenderingContext): boolean {
    if (this.isCompiled) {
      return true;
    }

    this.handle = gl.createShader(this.shaderType);
    gl.shaderSource(this.handle, this.source);
    gl.compileShader(this.handle);
    const success = gl.getShaderParameter(this.handle, gl.COMPILE_STATUS);
    if (success) {
      this.isCompiled = true;
    } else {
      console.log("Shader compilation failed:", gl.getShaderInfoLog(this.handle));
      gl.deleteShader(this.handle);
      this.handle = undefined;
    }
    return success;
  }
}
