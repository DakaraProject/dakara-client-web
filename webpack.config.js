const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
  entry: [
    './src/jsx/index.js',
    './src/less/main.less'
  ],
  module: {
    loaders: [
      {
          loader: "babel-loader",
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/jsx')
      },
      {
          test: /\.less$/,
          include: path.resolve(__dirname, 'src/less'),
          use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                  {
                      loader: 'css-loader'
                  },
                  {
                      loader: 'less-loader'
                  }
              ]
          })
      }
    ]
  },
  output: {
    filename: "dakara.js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
      new ExtractTextPlugin("dakara.css")
  ]
};
