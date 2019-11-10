precision mediump float;

uniform vec2 graphSize;
uniform vec2 screenSize;
uniform vec2 translate;
uniform float scale;
uniform int iter;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  // gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple

  // apply scaling factor to the original graph size
  vec2 scaledGraphSize = vec2(
    graphSize.x * scale,
    graphSize.y * scale
  );

  vec2 z, c;
  // convert our pixel to complex coordinates, given the current graph size and translation
  c.x = (gl_FragCoord.x / screenSize.x) * scaledGraphSize.x - (scaledGraphSize.x / 2.0) + translate.x;
  c.y = (gl_FragCoord.y / screenSize.y) * scaledGraphSize.y - (scaledGraphSize.y / 2.0) + translate.y;

  // mandelbrot algorithm
  int count;
  z = c;
  for (int i=0; i < 10000; i++) {
    count = i;
    if (i == iter) {
      break;
    }

    float x = (z.x * z.x - z.y * z.y) + c.x;
    float y = (z.y * z.x + z.x * z.y) + c.y;

    if ((x * x + y * y) > 4.0) {
      break;
    }

    z.x = x;
    z.y = y;
  }

  if (count == iter) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    float escapeTime = float(count) / float(iter - 1);

    float red = escapeTime;

    // create a cycle of green
    float green = escapeTime * 2.0;
    if (green > 1.0) {
        green -= 1.0;
    }

    float blue = 1.0 - escapeTime;

    gl_FragColor = vec4(
      red,
      green,
      blue,
      1.0
    );
  }
}
