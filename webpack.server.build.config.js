const path = require("path");
var nodeExternals = require("webpack-node-externals");
const buildDirectory = "dist/server";
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: ["./src/index.ts"],

  output: {
    path: path.join(__dirname, buildDirectory),
    filename: "bundle.js",
    publicPath: "/server",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts(x?))$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-typescript",
              "@babel/plugin-transform-async-to-generator",
            ],
          },
        },
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: true,
    }),
  ],
};
