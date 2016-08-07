const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router', 'whatwg-fetch']
  },
  output: {
    publicPath: '/dist/',
    path: './dist/',
    filename: 'js/[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      path: './config/manifest.json',
      name: '[name]'
    }),
    new HtmlWebpackPlugin({
      filename: '../app/layouts/index.html',
      template: './app/layouts/index.original.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
};
