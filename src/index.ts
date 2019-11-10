import Renderer from './Renderer';
// @ts-ignore
import Vue from 'vue';

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

  const renderer = new Renderer(gl);
  renderer.init();
  renderer.render();

  const controller = new AppController(renderer, window);
  canvas.addEventListener('click', (event: MouseEvent) => {
    controller.onCanvasClicked(event);
  });

  new Vue({
    el: '#controls',
    data: {
      controller: controller
    }
  });
});

/**
 * Mediates between raw input coming from Vue, the browser, and the renderer.
 */
class AppController {
  private readonly renderer: Renderer;
  private readonly window: Window;

  constructor(renderer: Renderer, window: Window) {
    this.renderer = renderer;
    this.window = window;
  }


  public get translateX(): string {
    return this.renderer.translateX.toString();
  }

  public get translateY(): string {
    return this.renderer.translateY.toString();
  }

  public get scale(): string {
    return this.renderer.scale.toString();
  }

  public get iterations(): string {
    return this.renderer.iterations.toString();
  }


  public set translateX(input: string) {
    this.renderer.translateX = this.parseUserFloat(input, this.renderer.initialTranslateX);
    this.renderer.render();
  }

  public set translateY(input: string) {
    this.renderer.translateY = this.parseUserFloat(input, this.renderer.initialTranslateY);
    this.renderer.render();
  }

  public set scale(input: string) {
    this.renderer.scale = this.parseUserFloat(input, this.renderer.initialScale);
    this.renderer.render();
  }

  public set iterations(input: string) {
    this.renderer.iterations = this.parseUserInt(input, this.renderer.initialIterations);
    this.renderer.render();
  }

  public get step() {
    return this.renderer.scale / 10;
  }


  public onCanvasClicked(event: MouseEvent) {
    console.log("canvas clicked");
  }


  private parseUserFloat(input: string, onError: number): number {
    let parsed = parseFloat(input);

    if (isNaN(parsed)) {
      parsed = onError;
    }

    return parsed;
  }

  private parseUserInt(input: string, onError: number): number {
    const parsed = this.parseUserFloat(input, onError);
    return Math.round(parsed);
  }
}
