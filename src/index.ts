import Renderer from './Renderer';
// @ts-ignore
import Vue from 'vue';
import AppController from './AppController';

document.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');

  // Try to get the rendering context
  const gl = canvas.getContext("webgl");
  if (!gl) {
    const msg = "Sorry, WebGL is not available in your browser!";
    alert(msg);
    throw new Error(msg);
  }

  // Shrink renderer to match screen width on mobile devices
  const screenWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // const screenHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

  // console.log("screenWidth", screenWidth, "canvasWidth", canvas.width);
  if ( canvas.width > screenWidth ) {
    canvas.width = screenWidth;
    canvas.height = Math.round((screenWidth / 4) * 3);
  }

  // Enable retina support
  if (typeof window.devicePixelRatio === 'number') {
    canvas.style.width = canvas.width.toString() + 'px';
    canvas.style.height = canvas.height.toString() + 'px';
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
  }

  const renderer = new Renderer(gl);
  const controller = new AppController(renderer, window);

  canvas.addEventListener('click', controller.onCanvasClicked.bind(controller));

  (window as any).VueApp = new Vue({
    el: '#controls',
    data: {
      controller: controller
    }
  });
});
