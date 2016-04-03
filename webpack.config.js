var path = require('path'),
    node_modules_dir = path.join(__dirname, 'node_modules'),
    deps = [
      'react/dist/react.min.js'
    ],
    config = {
      entry: ['webpack/hot/dev-server', path.resolve(__dirname, './app/main.js')],
      resolve: {
        alias: {}
      },
      output: {
        publicPath: "http://127.0.0.1:8080/assets/",
        path: path.resolve(__dirname, './assets/'),
        filename: 'bundle.js'
      },
      module: {
        noParse: [],
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

deps.forEach(function (dep) {
  var depPath = path.resolve(node_modules_dir, dep);
  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});

module.exports = config;