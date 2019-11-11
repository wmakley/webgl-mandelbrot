// eslint-disable-next-line no-unused-vars
import Renderer from "./Renderer";

/**
 * Mediates between raw input coming from Vue, the browser, and the renderer.
 */
export default class AppController {
  private readonly renderer: Renderer;
  private readonly window: Window;

  // External / Internal
  private static PARAMS: {[param: string]: string} = {
    "x":      "translateX",
    "y":      "translateY",
    "scale":  "scale",
    "iter":   "iterations"
  };

  constructor(renderer: Renderer, window: Window) {
    this.renderer = renderer;
    this.window = window;

    // Parse query string and set renderer attributes
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair.length !== 2) {
        continue;
      }

      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1]);
      if (!(key && value)) {
        continue;
      }

      if (!(key in AppController.PARAMS)) {
        continue;
      }

      const internalKey = AppController.PARAMS[key];

      if (!internalKey) {
        continue;
      }

      const floatValue = parseFloat(value);

      if (isNaN(floatValue)) {
        continue;
      }

      (renderer as any)[internalKey] = floatValue;
    }

    renderer.init();
    renderer.render();
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
    this.updateQueryString();
    this.renderer.render();
  }

  public set translateY(input: string) {
    this.renderer.translateY = this.parseUserFloat(input, this.renderer.initialTranslateY);
    this.updateQueryString();
    this.renderer.render();
  }

  public set scale(input: string) {
    this.renderer.scale = this.parseUserFloat(input, this.renderer.initialScale);
    this.updateQueryString();
    this.renderer.render();
  }

  public set iterations(input: string) {
    this.renderer.iterations = this.parseUserInt(input, this.renderer.initialIterations);
    this.updateQueryString();
    this.renderer.render();
  }

  public get step() {
    return this.renderer.scale / 10;
  }

  public get iterationsStep() {
    return 10;
  }

  public decrement(name: string): void {
    if ( Object.values(AppController.PARAMS).includes(name) ) {
      const oldValue = (this.renderer as any)[name];
      (this as any)[name] = oldValue - this.step;
    }
  }

  public increment(name: string): void {
    if ( Object.values(AppController.PARAMS).includes(name) ) {
      const oldValue = (this.renderer as any)[name];
      (this as any)[name] = oldValue + this.step;
    }
  }

  public decrementIterations(): void {
    const oldValue = this.renderer.iterations;
    const newValue = oldValue - this.iterationsStep;
    this.renderer.iterations = newValue;
    this.updateQueryString();
    this.renderer.render();
  }

  public incrementIterations(): void {
    const oldValue = this.renderer.iterations;
    const newValue = oldValue + this.iterationsStep;
    this.renderer.iterations = newValue;
    this.updateQueryString();
    this.renderer.render();
  }

  public reset(): void {
    window.history.pushState({}, window.document.title, this.baseUrl);
    this.renderer.reset();
    this.renderer.render();
  }

  public onCanvasClicked(event: MouseEvent) {
    console.log(event.clientX, event.clientY);
  }


  /**
   * PRIVATE METHODS
   */

  private updateQueryString(): void {
    const queryString = Object.entries(AppController.PARAMS).map(([name, internalName]) => {
      return encodeURIComponent(name) + "=" + encodeURIComponent((this as any)[internalName]);
    }).join("&");

    const finalUrl = this.baseUrl + "?" + queryString;
    window.history.pushState({}, window.document.title, finalUrl);
  }

  private get baseUrl() {
    let baseUrl;
    if (window.location.href.includes("?")) {
      baseUrl = window.location.href.split("?")[0];
    } else {
      baseUrl = window.location.href;
    }
    return baseUrl;
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
