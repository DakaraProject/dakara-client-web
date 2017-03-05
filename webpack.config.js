var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
//    './app/main.js',
    './redux/index.js',
    './less/dakara.less'
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: __dirname + '/redux', loader: "babel-loader"},
      {test: /\.less$/, include: __dirname + '/less', loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")}
    ]
  },
  output: {
    filename: "dakara.js",
    path: __dirname + '/dist'
  },
  plugins: [
      new ExtractTextPlugin("../css/dakara.css")
  ]
}
