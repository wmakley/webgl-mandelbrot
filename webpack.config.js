const path = require("path");
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: "./src/index.ts",

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

  plugins: [
    new CheckerPlugin()
  ],

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 9000,
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
