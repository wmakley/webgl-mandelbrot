const path = require("path");

module.exports = {
  entry: "./src/Main.ts",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  resolve: {
    // Add '.ts' as resolvable extension.
    extensions: [".webpack.js", ".web.js", ".ts", ".glsl", ".js"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { test: /\.glsl$/, loader: "webpack-glsl-loader" }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 9000,
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
