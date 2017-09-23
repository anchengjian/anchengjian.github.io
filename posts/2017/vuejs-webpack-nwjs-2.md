# 用 vue2 和 webpack 快速建构 NW.js 项目(3)

阅读本文需要一点 JS 基础和阅读的耐心，我特么自己写完后发现这文章咋这么长啊。。。如果你认真看完算我输！  

另我专门做了个 [vue-nw-seed](https://github.com/anchengjian/vue-nw-seed) 项目，里面包含了我这篇文章里的所有的点和一些别的优化，方便大家快速开发。  

## 一、最小侵入性使用  `vuejs-templates` 建构 `NW.js` 应用
在 Vue 圈里，最方便的项目建构方式应该是 `vue-cli` ，这整个生态里面最便捷的又应该是 [webpack](https://github.com/vuejs-templates/webpack) 这个模板。再对这个模板比较熟悉了后，就开始想能不能根据这个模板快速构建我们需要的 NW.js 项目呢？

蛤蛤，答案当然是可以的。

最开始的思路比较笨重，如果你时间多，可以去看看我以前的思路 [用 vue2 和 webpack 快速建构 NW.js 项目(1)](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs.md) 2333。在我连续加班一个月后整出了我们 `豆豆数学` 第一版后，稍微有了点空闲时间，就重新翻看了一下 NW.js 的文档，有点小发现啊。

`Manifest Format` 清单文件中的小发现
>**main**
>{String} which HTML page should be opened or which JavaScript file should be executed when NW.js starts.
You can specify a URL here. You can also specify just a filename (such as index.html or script.js) or a path (relative to the directory where your package.json resides).

>**node-remote**
>{Array} or {String} Enable calling Node in remote pages. The value controls for which sites this feature should be turned on. Each item in the array follows the match patterns used in Chrome extension.

这个意思是说中说 `main` 字段可以写一个 `URL` ，也能写 `index.html` 或者 `script.js` 文件， `node-remote` 字段说允许哪些远程页面调用 Node 方法。

这组合起来就可以完全无侵入的使用 `vuejs-templates` 建构 `NW.js` 应用！

**整体思路**就是设置 `package.json` 的 main 字段为 vue 项目的起始地址，然后把 node-remote 设置为 `<all_urls>` 允许全部的 JS 调用 Node 。

先上个效果
![seed-npm-run-dev](/posts/assets/imgs/nw/seed-dev.gif)

### 1、先安装 NW 的开发依赖
依然推荐 [nwjs/npm-installer](https://github.com/nwjs/npm-installer)  
``` bash
npm install nw --save-dev
```

网络不要的情况下，请参考之前写的文章中关于 [用 npm 安装 NW.js](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs.md#2-网络不太好) 部分。

### 2、配置 webpack
相对于第一版，这次对于模板标配的建构配置改动相当小。  

把 build/webpack.base.conf.js 中新加个 `target` 字段就搞定。大概就是这样
``` javascript
module.exports = {
  entry: { ... },
  output: { ... },
  target: 'node-webkit',
  ...
}
```
简单吧。

### 3、修改 `package.json`
添加或者修改 `main` 字段为你的 vue 项目启动地址，再添加 `node-remote` 为 `<all_urls>` 在配置下 NW.js 的 window 或者其他配置就行，大概就是这样：
``` javascript
{
  "name": "vue-nw-seed",
  "version": "0.1.0",
  // ...
  "main": "http://localhost:8080",
  "window": {
    "title": "vue-nw-seed",
    "toolbar": true,
    "width": 800,
    "height": 500,
    "min_width": 800,
    "min_height": 500,
    "resizable": true,
    "frame": true,
    "kiosk": false,
    "icon": "/static/logo.png",
    "show_in_taskbar": true
  },
  "nodejs": true,
  "js-flags": "--harmony",
  "node-remote": "<all_urls>"
}
```
### 4、修改 `npm run dev` 打开浏览器为打开 NW.js
这一部应该是最复杂的一步，但实际上，相当简单。
增加 `build/dev-nw.js`
``` javascript
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var nwPath = require('nw').findpath()
var rootPath = path.resolve(__dirname, '../')
var packageJsonPath = path.resolve(rootPath, './package.json')

module.exports = runNwDev

function runNwDev(uri = '') {
  if (uri && (uri + '').trim()) {
    tmpJson = require(packageJsonPath)
    tmpJson.main = uri
    fs.writeFileSync(packageJsonPath, JSON.stringify(tmpJson, null, '  '), 'utf-8')
  }

  var closed
  var nwDev = exec(nwPath + ' ' + rootPath, { cwd: rootPath }, function(err, stdout, stderr) {
    process.exit(0)
    closed = true
  })

  nwDev.stdout.on('data', console.log)
  nwDev.stdout.on('error', console.error)

  // 退出时也关闭 NW 进程
  process.on('exit', exitHandle)
  process.on('uncaughtException', exitHandle)

  function exitHandle(e) {
    if (!closed) nwDev.kill()
    console.log(e || '233333, bye~~~')
  }
}
```

并修改 `build/dev-server.js` 文件中打开浏览器的那部分代码。
```
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    require('./dev-nw')(uri)
  }
```

至此，整个开发建构就完成了，是不是几乎无侵入性。

## 二、打包 NW.js 应用
推荐使用官方的包 [nw-builder](https://github.com/nwjs/nw-builder) ，虽然好久都没咋更新过了。。。

**整体思路** ：先打包 vue 项目，再用 Node.js 整理形成一个 `package.json` 文件到 dist 目录中去。再用 nw-builder 打包出 NW 应用。

先看效果，增加信心。
![seed-npm-run-build](/posts/assets/imgs/nw/seed-build.gif)

### 1、安装 nw-builder
``` bash
npm install nw-builder --save-dev
```
这个过程仅仅是安装了打包 NW 的包装器，其要用到的 runtime 要在使用的时候才下载。

**如果网络不好**。。。可以自己先想个办法直接复制一份 runtime 到 cacheDir 目录中。


### 2、增加 config
配置大于约定，2333。  
增加 manifest 要被整理的字段，最终从 `./package.json` 整理到 `./dist/package.json` 中。
增加 builder 字段，可以参照 [nw-builder](https://github.com/nwjs/nw-builder) 文档来配置。
``` javascript
// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  build: {
    // ...
    nw: {
      // manifest for nw
      // the fileds will merge with `./package.json` and build to `./dist/package.json` for NW.js
      // Manifest Format: http://docs.nwjs.io/en/latest/References/Manifest%20Format/
      manifest: ['name', 'appName', 'version', 'description', 'author', { main: './index.html' }, 'window', 'nodejs', 'js-flags', 'node-remote'],
      // see document: https://github.com/nwjs/nw-builder
      builder: {
        files: [resolve('./dist/**')],
        platforms: ['win32'],
        version: '0.14.7',
        flavor: 'normal',
        cacheDir: resolve('./node_modules/_nw-builder-cache/'),
        buildDir: resolve('./output'),
        zip: true,
        winIco: resolve('./static/favicon.ico'),
        buildType: 'versioned'
      }
    }
  },
  dev: {
    //...
  }
}
```

### 3、增加 `./build/build-nw.js` 文件
这个文件主要做的事情就是整理出 NW.js 用的 package.json，然后再调用 nw-builder 进行打包
``` javascript
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var util = require('util')

var rootPath = path.resolve(__dirname, '../')

// get config
var config = require(path.resolve(rootPath, 'config'))

// `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'))
var manifestPath = path.resolve(config.build.assetsRoot, './package.json')

// manifest for `./dist/package.json`
var manifest = {}
config.build.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) manifest[v] = tmpJson[v]
  else if (util.isObject(v)) manifest = util._extend(manifest, v)
})

fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', function(err, data) {
  if (err) throw err

  // start build app
  if (!config.build.nw.builder) return
  var NwBuilder = require('nw-builder')
  var nw = new NwBuilder(config.build.nw.builder)
  nw.build(function(err, data) {
    if (err) console.log(err)
    console.log('build nw done!')
  })
})
```

### 4、在 `./build/build.js` 中增加打包入口
增加下面这一行代码在 webpack 打包完成的回调中
``` javascript
    // start build nw.js app
    require('./build-nw.js')
```

简单 4 部就完成了打包，是不是异常清晰和简单。蛤

## 三、打包 windows 下的 setup.exe 文件
这个部分，我之前也写了一篇文章 [打包NW.js应用和制作windows安装文件](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/pack-your-nw-app-and-setup-files.md) 里面有比较详细的打包介绍。

但，在我们借助了 nw-builder 做了 NW 的打包后，仅仅打安装包就比较简单了，所以今天我就**简写**，节约大家的时间和生命。

**主要思路**：用 Node.js 操作 iss 文件，再借助官方推荐的 innosetup 进行打包。

继续录一个 打包 exe 文件的 demo
![seed-npm-run-build](/posts/assets/imgs/nw/seed-setup.gif)

### 1、安装相关依赖
``` bash
npm install iconv-lite innosetup-compiler --save-dev
```

### 2、创建 `./config/setup.iss` 打包配置文件
踩坑注意，不要用 utf8 存这个文件，**用 ansi 格式存这个配置文件**， 不然打出来的安装包是乱码。
``` iss
; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!
; This CWD is the directory where the `setup.iss`, pay attention to join the relative directory!
; 该执行目录为 `setup.iss` 所在的目录，请注意拼接相对目录

#define MyAppName "_name_"
#define MyAppAliasName "_appName_"
#define MyAppVersion "_version_"
#define MyAppPublisher "_appPublisher_"
#define MyAppURL "_appURL_"
#define MyAppExeName "_name_.exe"
#define OutputPath "_outputPath_"
#define OutputFileName "_outputFileName_"
#define SourceMain "_filesPath_\_name_.exe"
#define SourceFolder "_filesPath_\*"
#define LicenseFilePath "_resourcesPath_\license.txt"
#define SetupIconFilePath "_resourcesPath_\logo.ico"
#define MyAppId "_appId_"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={#MyAppId}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppAliasName}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
LicenseFile={#LicenseFilePath}
OutputDir={#OutputPath}
OutputBaseFilename={#OutputFileName}
SetupIconFile={#SetupIconFilePath}
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
Uninstallable=yes
UninstallDisplayName={#MyAppAliasName}
DefaultGroupName={#MyAppAliasName}

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce

[Files]
Source: {#SourceMain}; DestDir: "{app}"; Flags: ignoreversion
Source: {#SourceFolder}; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Messages]
SetupAppTitle={#MyAppAliasName} setup wizard
SetupWindowTitle={#MyAppAliasName} setup wizard

[Icons]
Name: "{commondesktop}\{#MyAppAliasName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{group}\{#MyAppAliasName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\uninstall {#MyAppAliasName}"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
```
细心的你可能已经发现了这里面好多 `_name_` 之类的东西，这玩意将要被 Node.js 替换成项目配置的信息，不需要每次手动改写这个复杂的 iss 文件。

### 2、继续加配置
那句话咋说的来着，配置大于约定。23333333
在 `./config/index.js` 文件中加上 `build.nw.setup` 字段，来配置要打包出来的应用的信息。
``` javascript
    nw: {
      // ...
      setup: {
        issPath: resolve('./config/setup.iss'),  // 就是上面那个 iss
        files: path.resolve('./output', tmpJson.name + ' - v' + tmpJson.version),  // 要打包的文件目录
        outputPath: resolve('./output/setup/'),
        outputFileName: '${name}-${version}-${platform}-setup',  // 提供 name、version、platform 三个字段进行自定义输出文件名配置
        resourcesPath: resolve('./build/setup_resources'),  // 上面没说的打包用的 license 和 logo。参见 https://github.com/anchengjian/vue-nw-seed/tree/master/build/setup_resources
        appPublisher: 'vue-nw-seed, Inc.',
        appURL: 'https://github.com/anchengjian/vue-nw-seed',
        appId: '{{A448363D-3A2F-4800-B62D-8A1C4D8F1115}}'  // 如果有就写上
      }
    }
```

### 3、新增 `./build/build-win-setup.js`
这个文件就是用来打包 windows 下安装包的。。。
``` javascript
var innosetupCompiler = require('innosetup-compiler')
var path = require('path')
var fs = require('fs')
var iconv = require('iconv-lite')

var rootPath = path.resolve(__dirname, '../')

// `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'))

// get config
var config = require(path.resolve(rootPath, 'config'))
var setupOptions = config.build.nw.setup

fs.readdir(setupOptions.files, function(err, files) {
  if (err) throw err

  files.forEach(function(fileName) {
    if (!~fileName.indexOf('win')) return

    const curPath = path.resolve(setupOptions.files, fileName)
    fs.stat(curPath, function(err, stats) {
      if (err || stats.isFile()) return
      if (stats.isDirectory()) {
        makeExeSetup(Object.assign({}, setupOptions, { files: curPath, platform: fileName }))
      }
    })
  })
})

function makeExeSetup(opt) {
  const { issPath, files, outputPath, outputFileName, resourcesPath, appPublisher, appURL, appId, platform } = opt
  const { name, appName, version } = tmpJson
  const tmpIssPath = path.resolve(path.parse(issPath).dir, '_tmp.iss')

  return new Promise(function(resolve, reject) {
    // rewrite name, version to iss
    fs.readFile(issPath, null, function(err, text) {
      if (err) return reject(err)

      let str = iconv.decode(text, 'gbk')
        .replace(/_name_/g, name)
        .replace(/_appName_/g, appName)
        .replace(/_version_/g, version)
        .replace(/_outputPath_/g, outputPath)
        .replace(/_outputFileName_/g, getOutputName(outputFileName, { name, version, platform }))
        .replace(/_filesPath_/g, files)
        .replace(/_resourcesPath_/g, resourcesPath)
        .replace(/_appPublisher_/g, appPublisher)
        .replace(/_appURL_/g, appURL)
        .replace(/_appId_/g, appId)


      fs.writeFile(tmpIssPath, iconv.encode(str, 'gbk'), null, function(err) {
        if (err) return reject(err)

        // inno setup start
        innosetupCompiler(tmpIssPath, { gui: false, verbose: true }, function(err) {
          fs.unlinkSync(tmpIssPath)
          if (err) return reject(err)
          resolve(opt)
        })
      })
    })
  })
}

function getOutputName(str, data) {
  return str.replace(/\$\{(.*?)\}/g, function(a, b) {
    return data[b] || b
  })
}
```

### 4、再配置这个打包的入口
在我们上文提到的打包 NW 应用的那个文件中 `./build/build-nw.js` 中的最后打包完成的回调里加个调用入口
``` javascript
    // build windows setup
    if (config.build.noSetup) return
    if (~config.build.nw.builder.platforms.toString().indexOf('win')) require('./build-win-setup.js')
```

这次简洁吧，4 部就完成了打包。
来看效果。

原文持续更新: [https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs-2.md](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs-2.md)，同时，如果对您有用，帮我点个 star 吧，写这玩意不容易啊。  

如果你真的看到这儿了，我也就输了。。。
那就顺便看看 [vue-nw-seed](https://github.com/anchengjian/vue-nw-seed) 这个项目吧，里面包含了我这篇文章里的所有的点和一些别的优化。  
希望还有其他需求的朋友可以提 issue 或者私信讨论   

谢谢！您的支持是我继续更新下去的动力。  
