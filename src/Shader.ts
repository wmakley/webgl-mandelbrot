export default class Shader {
  public handle: WebGLShader;
  isCompiled: boolean;

  constructor(readonly source: string, readonly shaderType: number) {
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
      return true;
    }

    console.log(gl.getShaderInfoLog(this.handle));
    gl.deleteShader(this.handle);
    this.handle = undefined;
    return false;
  }
}
