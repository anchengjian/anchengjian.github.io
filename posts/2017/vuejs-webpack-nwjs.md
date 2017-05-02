# 用 vue2 和 webpack 快速建构 NW.js 项目(1)

>经过实践和学习，发现本篇文章部分内容**已经过时**，请看我的关于 Vue 和 NW.js 的 ** [最新文章](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs-2.md) ** 和相关实践项目 [vue-nw-seed](https://github.com/anchengjian/vue-nw-seed) 。

---

## 使用到的技能点
* vue2
* webpack
* NW.js
* Node.js

## 一、前言
先讲一下这个项目的由来。我司要新上一个产品，是面向教育领域的一个东西，要求快速开发又必须要兼容 `XP` ，所以就选 NW.js 来做桌面客户端。同时，前端的轮子方面，开始尝试在面向用户的业务上应用 vuejs 。   
在这个过程中，也踩到了一些坑，也学到了一些新的小技巧，分享出来给大家参考一下。

有同学问，为啥不直接出一个完整项目？   
我想等 [webpack](https://github.com/vuejs-templates/webpack) 升级完 webpack2 的时候再来一个懒人 seed 项目包吧

## 二、vue&webpack 项目搭建
首先用 [vue-cli](https://github.com/vuejs/vue-cli) 快速的搭建一个 [webpack](https://github.com/vuejs-templates/webpack) 模板项目，省心又省事儿。
这部分不做过多介绍，很容易的。
方便新人理解和学习，给个参考链接 https://github.com/vuejs-templates/webpack

## 三、NW.js 的建构
整个 nw 建构是基于 vue&webpack 这个前置步骤的项目的。   
好了，我们开始。   

### 1、先用 npm 安装 NW.js
#### 1) 能顺利翻墙
NW.js 开发者们提供了 [nwjs/npm-installer](https://github.com/nwjs/npm-installer)   
如果您的网速较好，翻墙顺利的话，可以直接
``` bash
npm install nw --nwjs_build_type=sdk --save
```

#### 2) 网络不太好
当然我的网络情况就不是很好，233333   
这时候可以先下载好 nw 的 sdk 包到本地，墙外地址：[https://dl.nwjs.io/v0.20.1/nwjs-sdk-v0.20.1-win-x64.zip](https://dl.nwjs.io/v0.20.1/nwjs-sdk-v0.20.1-win-x64.zip) （截至目前现在最新的sdk版本是 `0.20.1` ，系统环境是 win10 x64）当然，我作为一个老司机，也有不可推卸的责任，我把我这个包也发到了百度云上了：链接: [http://pan.baidu.com/s/1i52ZO8l](http://pan.baidu.com/s/1i52ZO8l) 密码: 3tt2
做了点微小的贡献，谢谢大家。

~~我已经尝试过 `file://` 那个方法不能用了，换server模式吧~~
通过和作者沟通[load local file is error!!! #54](https://github.com/nwjs/npm-installer/issues/54)，`file://` 协议安装这个问题已经解决了。安装方式很简单
``` bash
npm i nw --nwjs_urlbase=file://C:\\Users\\anchengjian\\Downloads --save 
```

**server模式安装方法**
切换命令行目录到当前sdk包所在位置
```
C:\Users\anchengjian\Downloads> mkdir 0.20.1
C:\Users\anchengjian\Downloads> cp nwjs-sdk-v0.20.1-win-x64.zip ./0.20.1
```
再开启 server 服务，如果有python直接
```
C:\Users\anchengjian\Downloads> python -m SimpleHTTPServer 9999
```
或者换个姿势
```
C:\Users\anchengjian\Downloads> npm install http-server -g
C:\Users\anchengjian\Downloads> http-server -p 9999
```

服务开好就可以继续下一步了，切换目录到项目代码的目录下。

先创建一个 `.npmrc` 文件，内容如下：
```
nwjs_build_type=sdk
NWJS_URLBASE=http://localhost:9999/
```

再然后直接 npm 安装 nw
```
E:\code\vue-webpack-nw> npm i nw --save
```

这时，如无其他问题，已经装好了。

### 2、这时候开始增补nw相关的建构
下文直接以文件名为小标题
#### 1) package.json
``` javascript
{
  "name": "vue-webpack-nw",
  "version": "1.0.0",
  "description": "vue-webpack-nw",
  "author": "anchengjian <anchengjian@gmail.com>",
  "private": true,
  "scripts": {
    "dev": "node build/dev-server.js",
    "build": "node build/build.js",
    "lint": "eslint --ext .js,.vue src"
  },
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  },
  "engines": {
    "node": ">= 7.0.0",
    "npm": ">= 4.0.0"
  },
  // 以下为 nw 的配置新加内容
  "main": "./index.html",
  "window": {
    "title": "nw-vue-webpack2",
    "toolbar": true,
    "frame": true,
    "width": 1200,
    "height": 800,
    "min_width": 800,
    "min_height": 500
  },
  "webkit": {
    "plugin": true
  },
  "node-remote": "http://localhost:8080"
}
```

#### 2) build/webpack.base.conf.js
增加基础配置
``` javascript
module.exports = {
  // ...
  // 以下为新加内容
  target: 'node-webkit'
}
```

#### 3) build/dev-nw.js
新建一个名为 `dev-nw.js` 的文件
内容如下，直接copy吧。
原理我就不讲了，大致实现的功能是:   
先用 `Node.js` 修改当前项目 `index.html` 内容为打包出来的 `index.html`，然后再用 nw 打开当前项目目录，当关闭或者报错的时候再还原 `index.html` ，当前，你直接 kill 进程，这个还原就会出问题。自己看着改吧，233333

``` javascript
const path = require('path')
const url = require('url')
const fs = require('fs')
const http = require('http')
const exec = require('child_process').exec
const rootPath = path.resolve(__dirname, '../')
const nwPath = require('nw').findpath()

// 修改index.html文件中的css和js的地址
const indexHtmlPath = path.resolve(__dirname, '../index.html')
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8').toString()

// 退出时恢复原样子
process.on('exit', exitHandle)
process.on('uncaughtException', exitHandle)

function exitHandle(e) {
  fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf-8')
  console.log('233333,bye~~~')
}

// get uri
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var port = process.env.PORT || config.dev.port
var uri = `http://localhost:${port}/`

// start lauch NW.js
requestGet(uri, htmlText => {
  htmlText = htmlText.replace('src="/', `src="${uri}`).replace('href="/', `href="${uri}`)
  fs.writeFileSync(indexHtmlPath, htmlText, 'utf-8')

  let runNwDev = exec(`${nwPath} ./`, { cwd: rootPath }, (err, stdout, stderr) => {
    if (err) process.exit(0)
  })

  runNwDev.stdout.on('data', (data) => console.log(data))
})

function requestGet(path, callback) {
  console.log('start with request: ', path)
  const options = Object.assign({ method: 'GET' }, url.parse(path))
  const req = http.request(options, res => {
    let body = []
    res.on('data', chunk => body.push(chunk))
    res.on('end', () => callback(Buffer.concat(body).toString()))
  })
  req.on('error', e => console.log('problem with request: ' + e.message))
  req.write('')
  req.end()
}
```

#### 4) build/dev-server.js
在其最末尾修改一下，不需要打开浏览器，而是需要其代码驱动打开nw.exe
``` javascript
  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    // opn(uri)

    // modify by anchengjian
    // 这儿不需要打开浏览器，只用打开 nw 就行
    require('./dev-nw')
  }
```

#### 5) build/dev-client.js
这个时候直接在执行 `npm run dev` 正常的话是可以用 nw.exe 打开当前项目代码，但接着就可以看到有一个报错
``` javascript
GET chrome-extension://hbdgiajgpfdfalonjhdcdmbcmillcjed/__webpack_hmr net::ERR_FILE_NOT_FOUND
```
原因也就是webpack请求的时候根据当前页面地址来的，没想到还有 nw 这么个环境   
处理方法也简单，更改 `webpack-hot-middleware` 的配置，让其每次发请求的时候用`__webpack_public_path__` 或者全局变量。   
同时请注意`path=__webpack_hmr`

改`hotClient`这一行代码为这样子
``` javascript
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&dynamicPublicPath=true&path=__webpack_hmr')
```
这样配置的文档来源： [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware#documentation)

#### 6) config/index.js
同时需要更改开发者模式下 assetsPublicPath 的配置，不然`__webpack_public_path__`依然为`/`
``` javascript
module.exports = {
  // ...
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: 'http://localhost:8080/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
```

至此，一个完整的开发建构就出来，后面慢慢更新产品模式的打包建构。   

原文持续更新: [https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs.md](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs.md)

