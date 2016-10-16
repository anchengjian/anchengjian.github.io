const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const fs = require('fs');
const indexPath = path.resolve(__dirname, '../src/layouts/index.html');
// 在自动生成libs的引用前先干掉旧的引用
// 同步是为了确保webpack在执行前得到的经过调整的文件
let indexFile = fs.readFileSync(indexPath, 'utf-8').toString().replace(/<script type="text\/javascript" src=".*?\/libs\.js.*?\><\/script>/g, '');
fs.writeFile(indexPath, indexFile, 'utf-8');

module.exports = {
  entry: {
    libs: ['vue', 'vue-router', 'whatwg-fetch', 'marked', 'highlight.js']
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
      filename: '../src/layouts/index.html',
      template: 'raw!./src/layouts/index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: false,
        collapseWhitespace: false
      }
    })
  ]
};
