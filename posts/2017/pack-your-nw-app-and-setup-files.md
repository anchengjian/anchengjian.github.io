# 打包NW.js应用和制作windows安装文件

本文前两章为如何打包 NW.js ，如果仅仅是想折腾一下炫酷的安装效果请直接看文末最后一章。   

本文默认的环境 windows   

## 一、折腾能力强，直接上文档   
1. [How-to-package-and-distribute-your-apps](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps)
2. [setup-on-windows](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps#setup-on-windows)

这部分没啥好说的，都很简单。   

对新手友好。。。还有个 NW.js 的打包在 gayhub 上还专门有个 npm 包 [nw-builder](https://github.com/nwjs/nw-builder) ，这个用起来就更简单了，我连示例都不想写的那种简单。然后这儿需要下载 NW.js 的 SDK 或者 NORMAL 的包，方法同我上一篇文章 [用 vue2 和 webpack 快速建构 NW.js 项目](http://anchengjian.com/#/posts/2017/vuejs-webpack-nwjs.md) 中 `网络不太好` 部分   

## 二、制作安装包
NW.js 被打包出来后是一个文件夹，里面有整个 runtimes 和一个 exe 文件，这时候整个打包就成功了，差不多有 100MB 左右。

但是，我们的应用不再是给内部使用，给用户下载总不能直接给用户拷贝一个文件夹或者下载 zip 压缩包，那样忒不靠谱的样子，还以为是啥病毒呢。   

然后就开始折腾把打包好 NW.js 应用封装成一个 setup.exe 的安装包，用官方推荐的 innoSetup 来打包确实好使，配置文件也简单，速度也快。但是制作出来的安装包的安装界面默认是 windows2000 的界面，那个丑那个老旧哟。。。   

如果你的应用只要能用就行了，那这一步已经够了。   

下面，我们来搞炫酷的安装包的制作方法。   

## 三、应用的更新

