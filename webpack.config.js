module.exports = {
  entry: [
    './app/main.jsx'
  ],
  module: {
    loaders: [
      {test: /\.jsx$/, include: __dirname + '/app', loader: "babel-loader"}
    ]
  },
  output: {
    filename: "dakara.js",
    path: __dirname + '/dist'
  },
}
