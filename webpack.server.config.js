const path = require("path");
const webpack = require("webpack");
const buildDirectory = "dist";

module.exports = {
  mode: "development",
  entry: ["webpack-hot-middleware/"],
  output: {
    path: path.join(__dirname, buildDirectory),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts(x?))$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: "url-loader?limit=100000",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
