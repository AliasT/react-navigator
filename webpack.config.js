var path = require("path");
module.exports = {
  entry: {
    app: ["./demo/main.js"]
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "[name].js"
  },
  reslove: {
    extensions: ['.scss', ".css"]
  },
  module: {
    loaders: [
      { test: /(\.js)|(\.jsx)$/, exclude: /node_modules/, loader: "babel"  },
      { test: /\.(scss|css)$/, loaders: ["style", "css", "sass"]}
    ]
  }
};
