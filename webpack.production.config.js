var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'app/main.js'),
  output: {
    path: path.resolve(__dirname, './assets/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.less$/,
        loader: 'style!css!autoprefixer?{browsers:["> 0.01%", "last 2 version"]}!less'
      },
      {
        test: /\.(jpg|png|gif|mp3|mp4|json)$/,
        loader: "url?limit=8192"
      }
    ]
  }
};

module.exports = config;