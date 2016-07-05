var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isDev = process.env.NODE_ENV === 'dev';

var config = {
  entry: isDev ? ['webpack/hot/dev-server', './app/app.js'] : ['./app/app.js'],
  resolve: {
    extensions: ['', '.js', '.json', 'scss', 'html'],
    modulesDirectories: ['node_modules'],
    vendor: ['vue', 'vue-touter']
  },
  output: {
    publicPath: '/build/',
    path: './build/',
    filename: 'js/bundle.js',
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
      // load all <script> without "lang" attribute with coffee-loader
      js: 'babel?presets[]=es2015',
      css: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}'),
      sass: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}!sass-loader'),
      // load <template> directly as HTML string, without piping it
      // through vue-html-loader first
      html: 'raw'
    }
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './app/layouts/index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: !isDev,
        collapseWhitespace: !isDev
      }
    }),
    new webpack.ProvidePlugin({
      Vue: 'vue',
      VueRouter: 'vue-router'
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js')
  ]
};

module.exports = config;
