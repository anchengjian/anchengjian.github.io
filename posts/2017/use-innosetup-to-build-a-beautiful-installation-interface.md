# 通过 InnoSetup 美化安装界面

InnoSetup 的美化相应的帖子也比较多，但是代码不是很全。。。所以我专门出了这篇文章来记录下这个美化过程。  
废话不多说，先上个成果：  
![安装界面](/posts/assets/imgs/nw/win-setup.gif)  

前端er们可以直接下载 [vue-nw-seed](https://github.com/anchengjian/vue-nw-seed/tree/win-beautiful-setup/) 这个分支，一键 build就出效果了。

## 一、InnoSetup 增强版
这个部分很重要，是实现自定义界面的绝对前置步骤。  
完成这个任务也很简单，可以自己下载安装就搞定。  
当然，找资源的过程比较麻烦，所以直接提供了一个，并用 [node-innosetup-compiler](https://github.com/felicienfrancois/node-innosetup-compiler) 包裹了一下，使之可以直接在 Node.js 下应用，最终的增强版在 [deps/innosetup](https://github.com/anchengjian/vue-nw-seed/tree/win-beautiful-setup/deps/innosetup) 这里可以看到。  
**注意**
InnoSetup 本身是开源免费的，希望大家在用的过程中注意一下作者的 **LICENSE** 。

## 二、iss 配置文件
这个部分无需赘述，对于新手来说比较复杂的一个事儿，给个文档 [What is Inno Setup?](http://www.jrsoftware.org/ishelp/) 先。  

### 1、Setup Script Sections
可以直接双击 `deps/innosetup/bin/Compil32.exe` 打开一个可视化的配置窗口，按照引导可以直接生成一个通用流程中简单的安装配置，会生成一个类似 [setup-simple.iss](https://github.com/anchengjian/vue-nw-seed/blob/win-beautiful-setup/config/setup-simple.iss) 这种的 iss 配置文件。  
当然，一个扁平漂亮的界面，肯定不是这种简单的配置能满足的。。。   
所以，看我提供的一个 [setup.iss](https://github.com/anchengjian/vue-nw-seed/blob/win-beautiful-setup/config/setup.iss) ，其包含完整的流程控制和界面的控制。   
这里的代码太长了，加上注释 455 行，就不贴过来了，戳链接进去看吧。

### 2、Pascal Script
在那 455 行代码中主要就是 `[code]` 块下面的 `Pascal Script` ，通过它来控制安装流程和界面的美化。  
* 控制安装流程的原理是 InnoSetup 通过 [Pascal Scripting: Event Functions](http://www.jrsoftware.org/ishelp/topic_scriptevents.htm) 这种事件机制，把流程节点的控制交给 `Pascal Script` ，使其可以控制`上一步`、`下一步`等等的操作。
* 界面的美化，主要是调用两个美化插件动态库：`botva2.dll` 和 `InnoCallback.dll`。用其来控制贴图的位置和样式，和给按钮绑定相应的事件等等的。

详细的控制方式参见 [setup.iss](https://github.com/anchengjian/vue-nw-seed/blob/win-beautiful-setup/config/setup.iss) 文件中的注释，此处不再详细解释啦。。。解释起来太多了。

### 3、setup resources
这个部分就是用来存放贴图资源和美化插件动态库的地方。 
我默认放在示例项目的 [/build/setup_resources](https://github.com/anchengjian/vue-nw-seed/tree/win-beautiful-setup/build/setup_resources) 这个位置。  
如果你去看过上文 [setup.iss](https://github.com/anchengjian/vue-nw-seed/blob/win-beautiful-setup/config/setup.iss) 这个文件的话，就会发现里面的资源文件路径的配置被搞成类似这个样子
```
#define LicenseFilePath "_resourcesPath_\license.txt"
#define SetupIconFilePath "_resourcesPath_\logo.ico"
#define ResourcesPath "_resourcesPath_\*"
```
这是因为各个项目要求的打包配置和路径可能不一致，**特意**做了一个处理，详见[build-win-setup.js](https://github.com/anchengjian/vue-nw-seed/blob/win-beautiful-setup/build/build-win-setup.js#L44-L70)
``` javascript
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
```

**如果仅仅想单纯的用  InnoSetup 打包安装美观的界面，可以自直接换一下相应的配路径置。**

## 三、Q & A
需要单独说一下几个踩到的坑。。。
1、iss 文件需要什么特定的编码格式吗？  
中文的话，需要 ansi 编码，不然用其他编码，打包出来在界面上的中文会乱码！  
这也是我直接用文字贴图来代替 label 以确保界面中的文字显示万无一失的原因。

2、这个 InnoSetup 增强版 和和普通的有啥区别？  
说实在的，我也没太搞明白，InnoSetup 本身就是开源和免费的，可以自己修改并编译。现在我用的这个版本应该是国内某前辈搜集的一些脚本等东西集合出来单独打包出来的一个增强版。

3、为啥不单独搞个 InnoSetup 美化的项目？  
一方面不确定 InnoSetup 增强版 这个版权协议，另一方面不确定大家的需求咋样，暂时这样，让大家可以通过 **源码 + 详细的注释** 习得这部分的技能。如果确实这部分需求很强大，请私信我，或者发 issue 讨论下这个项目该咋整吧。

## 四、参考资料
* [互联网软件的安装包界面设计-Inno setup](http://blog.csdn.net/oceanlucy/article/details/50033773)
* [INNOSETUP 仿有道云安装包界面](http://blog.csdn.net/HarounCloud/article/details/50613590)
* [Pascal 入门](http://www.yiibai.com/pascal)
* [InnoSetup docs: Event Functions](http://www.jrsoftware.org/ishelp/topic_scriptevents.htm)