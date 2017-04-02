const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
  entry: [
    './redux/index.js',
    './less/dakara.less'
  ],
  module: {
    loaders: [
      {
          loader: "babel-loader",
          test: /\.js$/,
          include: path.resolve(__dirname, 'redux')
      },
      {
          test: /\.less$/,
          include: path.resolve(__dirname, 'less'),
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
      new ExtractTextPlugin("../css/dakara.css")
  ]
};
