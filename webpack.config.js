const path = require("path");

module.exports = {
  entry: "./src/Main.ts",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' as resolvable extension.
    extensions: [".webpack.js", ".web.js", ".ts", ".glsl", ".js"]
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { test: /\.glsl$/, loader: "webpack-glsl-loader" }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, "static"),
    port: 9000,
    publicPath: "/dist/",
    overlay: {
      warnings: true,
      errors: true
    },
    watchContentBase: true
  }
};
