const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const manifest = require('./manifest.json');
const isDev = process.env.NODE_ENV === 'dev';

let config = {
  entry: {
    app: isDev ? ['webpack/hot/dev-server', './app/app.js'] : ['./app/app.js']
  },
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
    preLoaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [{
      test: /\.vue?$/,
      exclude: /node_modules/,
      loader: 'vue'
    }, {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel?presets[]=es2015'
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
      test: /\.html$/,
      loader: 'raw'
    }, {
      test: /\.json$/,
      loader: 'file?name=data/[name].[ext]'
    }, {
      test: /\.(svg|ttf|eot|woff|woff2)/,
      loader: 'file?name=fonts/[name].[ext]'
    }]
  },
  eslint: {
    emitError: true,
    emitWarning: true,
    failOnWarning: true,
    failOnError: true,
    configFile: '.eslintrc'
  },
  vue: {
    loaders: {
      js: 'babel?presets[]=es2015',
      css: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}'),
      sass: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}!sass-loader'),
      html: 'raw'
    }
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: manifest
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'html-withimg-loader?exclude=/dist/!./app/layouts/index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: !isDev,
        collapseWhitespace: !isDev
      }
    }),
    new webpack.ProvidePlugin({
      Vue: 'vue',
      VueRouter: 'vue-router',
      fetch: 'whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('css/[name].css')
  ]
};

module.exports = config;
