const path = require("path");

module.exports = {
  entry: {
    main: "./index.ts",
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
    clean: true,
  },
  mode: "production",
  target: "node",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
};
