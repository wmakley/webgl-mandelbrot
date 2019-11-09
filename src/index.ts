import Main from './Main'

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
