import Main from './Main';

document.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');

  // Try to get the rendering context
  const gl = canvas.getContext("webgl");
  if (!gl) {
    const msg = "Sorry, WebGL is not available in your browser!";
    alert(msg);
    throw new Error(msg);
  }
  // Enable retina support
  if (typeof window.devicePixelRatio === 'number') {
    canvas.style.width = canvas.width.toString() + 'px';
    canvas.style.height = canvas.height.toString() + 'px';
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
  }

  Main(gl);
});
