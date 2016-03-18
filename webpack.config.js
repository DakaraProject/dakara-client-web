module.exports = {
  entry: [
    './app/main.js'
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: __dirname + '/app', loader: "babel-loader"}
    ]
  },
  output: {
    filename: "dakara.js",
    path: __dirname + '/dist'
  },
}
