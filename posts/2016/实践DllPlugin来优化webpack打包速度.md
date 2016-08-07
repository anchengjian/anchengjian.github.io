## 大体思路和原因分析
最近碰到一个小问题，项目过大后的加载和编译相当的慢。在这个过程中发现npm的一些引用包大大小小的若干个 module 也会经过 loader 的编译。

webpack 的最新版本中 DllPlugin 插件刚好来解决这个问题的，把不常更新的 module 进行编译打包，然后每次开发和上线就只剩下开发过程中的那部分文件了。这样子就能省下来公共资源、不常更新的 module 的编译时间。

##下面以我这个博客为例子，进行实际操作吧。
### 1、首先创建dll的配置文件
>dll.webpack.config.js

下面关键点会用`必填项`来表明，除此之外，还利用 `HtmlWebpackPlugin` 插件将 vendor 打包进 html ，以期待被加载。单页应用，所以只用在index.html中进行插入就行啦。

```javascript
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
    library: '[name]'               // 必填项，将此dll包暴露到window上，给app.js调用
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,                // 必填项，用来标志manifest中的路径
      path: './config/manifest.json',    // 必填项，存放manifest的路径
      name: '[name]'                     // 必填项，manifest的name
    }),
    new HtmlWebpackPlugin({              // 利用该插件实现vendor被插入到html中
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

```

执行了 webpack 后会在配置的相应目录生成对应好的 js ，和 manifest.json 。

这个 manifest.json 是用来记录缓存的 module 的路径和对应的 id 的，例如我这个例子中：
```json
{
  "name": "vendor",
  "content": {
    "../../node_modules/vue-router/dist/vue-router.js": 1,
    "../../node_modules/vue/dist/vue.common.js": 2,
    "../../node_modules/whatwg-fetch/fetch.js": 3,
    "../../../../../../usr/local/lib/node_modules/webpack/node_modules/process/browser.js": 4
  }
}
```

*小提示，我修改过node_modules的位置，在项目的上一级而不在当前级*

### 2、配置加入 DLLReferencePlugin 的 webpack 文件
举个例子，只列出关键部分的配置信息，其他的略掉。
>app.webpack.config.js

```javascript
const webpack = require('webpack');

let config = {
  // more ...
  plugins: [
    new webpack.DllReferencePlugin({       // 敲黑板，这里是重点
      context: __dirname,                  // 同那个dll配置的路径保持一致
      manifest: require('./manifest.json') // manifest的缓存信息
    }),
    new HtmlWebpackPlugin({                // 将已经插入过vendor.js的html再插入app.js，卧槽，感觉哪里不对
      filename: '../index.html',
      template: './app/layouts/index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: !isDev,
        collapseWhitespace: !isDev
      }
    }),
    new webpack.ProvidePlugin({           // webpack的全局注入，在项目中少写点require
      Vue: 'vue',
      VueRouter: 'vue-router',
      fetch: 'whatwg-fetch'
    })
  ]
};

module.exports = config;

```

然后执行之，会发现 deploy 的速度大大提升啊，我没有删除原来的 webpack 配置，有兴趣的大家伙可以 clone 下来试一下。仅仅这三个 module ，直观的编译速度提高3-4s！

## one more thing...
配置babel，让它排除一些文件，当 loader 这些文件时不进行转换，自动跳过，来个例子
>.babelrc

```json
{
  "presets": ["es2015", "stage-2"],
  "plugins": ["transform-runtime"],
  "comments": false,
  "ignore":[           // 这里是重点
    "vue.common.js",
    "vue-router.js",
    "fetch.js"
  ]
}
```

就这么多了，有兴趣的请看我这个blog的config部分的配置源码。点击顶部的 `view on github` 可到。

参考资料：
1. [彻底解决Webpack打包慢的问题](https://segmentfault.com/a/1190000006087638#articleHeader4)
2. [开发工具心得：如何 10 倍提高你的 Webpack 构建效率](https://segmentfault.com/a/1190000005770042#articleHeader11)
