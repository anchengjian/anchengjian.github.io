const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const manifest = require('./manifest.json');
// const isDev = process.env.NODE_ENV === 'dev';

// 这个用法有点233
const isDev = process.argv[2] === '--hot';
// process.env.NODE_ENV = isDev ? 'development' : 'production';

let appEntry = ['whatwg-fetch', './src/app.js'];
if (isDev) appEntry.unshift('webpack/hot/dev-server');

let config = {
  entry: { app: appEntry },
  resolve: {
    extensions: ['', '.js', '.json', 'scss', 'html'],
    modulesDirectories: ['node_modules']
  },
  output: {
    publicPath: '/dist/',
    path: './dist/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    noParse: [],
    preLoaders: [],
    loaders: [{
      test: /\.vue?$/,
      exclude: /node_modules/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-2']
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}')
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}!sass-loader')
    }, {
      test: /\.(jpe?g|png|gif|svg|webp)$/,
      loader: 'url?limit=8192&name=imgs/[name].[ext]'
    }, {
      test: /\.json$/,
      loader: 'file?name=data/[name].[ext]'
    }, {
      test: /\.(svg|ttf|eot|woff|woff2)/,
      loader: 'file?name=fonts/[name].[ext]'
    }]
  },
  vue: {
    loaders: {
      js: 'babel?presets[]=es2015&presets[]=stage-2',
      css: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}'),
      sass: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}!sass-loader'),
      html: 'raw'
    }
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    // }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: manifest
    }),
    // new webpack.ProvidePlugin({
    //   Vue: 'vue',
    //   VueRouter: 'vue-router',
    //   fetch: 'whatwg-fetch'
    // }),
    new ExtractTextPlugin('css/[name].css')
  ]
};

// HtmlWebpackPlugin
const appInfo = require('./blog.config.js');
let htmlOptions = Object.assign({}, appInfo, {
  filename: '../index.html',
  template: './src/layouts/index.html',
  inject: 'body',
  hash: true,
  minify: {
    removeComments: !isDev,
    collapseWhitespace: !isDev
  }
});
config.plugins.push(new HtmlWebpackPlugin(htmlOptions));

// 非开发调试模式
if (!isDev) {
  // eslint
  config.module.preLoaders.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint'
  });
  config.eslint = {
    emitError: true,
    emitWarning: true,
    failOnWarning: true,
    failOnError: true,
    configFile: '.eslintrc'
  };

  // uglify
  let uglify = new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  });
  config.plugins.push(uglify);
}

module.exports = config;
