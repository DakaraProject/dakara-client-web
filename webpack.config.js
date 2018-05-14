const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
  entry: [
    './src/jsx/index.jsx',
    './src/less/main.less'
  ],
  module: {
    rules: [
      {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
              loader: "babel-loader",
          }
      },
      {
          test: /\.less$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                  {
                      loader: 'css-loader',
                      options: {
                          importLoaders: 1,
                      }
                  },
                  {
                      loader: 'postcss-loader'
                  },
                  {
                      loader: 'less-loader'
                  }
              ]
          })
      },
    ]
  },
  resolve: {
    modules: [
      path.resolve('.'),
      path.resolve('./src/jsx'),
      path.resolve('./node_modules')
    ],
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: "dakara.js",
    path: path.resolve('dist')
  },
  plugins: [
      new ExtractTextPlugin("dakara.css")
  ]
};
