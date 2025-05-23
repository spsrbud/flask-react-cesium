const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/firefly/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "node_modules/cesium/Source/Assets"),
          to: "cesium/Assets",
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "node_modules/cesium/Source/ThirdParty"),
          to: "cesium/ThirdParty",
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "node_modules/cesium/Source/Workers"),
          to: "cesium/Workers",
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "node_modules/cesium/Source/Widgets"),
          to: "cesium/Widgets",
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify("/firefly/cesium/"),
    }),
  ],
  devServer: {
    historyApiFallback: {
      index: "/firefly/",
    },
    port: 3000,
  },
};
