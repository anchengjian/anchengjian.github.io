最近想上lofter写一篇关于ngTinyEditor的文章，但是一直不能访问到lofter。最开始我以为是我们校园网出问题屏蔽了她，刚刚想看看恢复了没有，结果还是打不开，于是我就想为什么要屏蔽她呢？不对啊，这个没有屏蔽的必要啊。

然后就ping了一下，发现完全能通，然后一查ip是杭州电信，这感觉不会有什么问题啊，可为什么���不开呢？然后一想，肯定是dns出问题了。

于是我立马测试了8.8.8.8 ，然后神奇的效果出现啦。。。首先，8.8.8.8 竟然还能用，其次，lofter竟然打开了。此处按下不表，明天工作时间，我一定要去投诉网管中心！

接下来进入正题  》》》》》》》》》》》》》》》

在最近的项目中需要一款简洁又好用的富文本编辑器，本来想用百度UM的，但是其功能太多，引用之后导致整个项目极其庞大，遂弃之。 然后偶然发现了tinyEditor这个富文本编辑器，代码量很小，满足了我们项目的基本全部需求，然后又看到有开发者直接编写好了angurla 版本的tinyEditor ，命名为ngWYSIWYG 。我不知道这个WYSIWYG 和tinyEditor 什么关系。所以直接以ngTinyEditor命名。

如侵删。

先来预览图：

![](/posts/assets/imgs/6630214544677231967.png)

下面将我改的部分：

0. 最主要的是修改全部样式和布局，更加合理，抛弃原来的float布局，更改边框的布局，原编辑器的一个group组是通过一个div来实现的，修改交互，增加阴影特效等等，使其更加的现代化，更加的美观，这个也是我分享的主要原因。其中用到了开源的图标库fortawesome， 当然这个也是提升美观度的很大因素。

1. 我在原有功能的基础上增加了一个功能模块，全屏功能。功能意义是当你嵌入到页面中，当需要潜心编写内容的时候一点击全屏就把整个富文本编辑器全屏。正如我们正在使用的lofter的编辑器一样。

2. 修改了若干bug，不成熟的，比如插入图片的时候，什么都不写或者空白的链接，她也会解析成图片，还有字体颜色和文字背静颜色和特殊字符的选框会同时存在等，全部被我修改了，更符合人性化的交互啦。

3. 调整了切换到查看源码模式顶部的控制条隐藏的奇怪交互。

还有很多细节，已经记不大清了，因为当时改完没有写博客，被校园网坑爹的dns耽误了。。。现在已经忘了很多了

当然，最后来一个demo：

国内普通用户：[http://demo.anchengjian.com/ngTinyEditor/](http://demo.anchengjian.com/ngTinyEditor/)

github：[https://github.com/anchengjian/ngTinyEditor](https://github.com/anchengjian/ngTinyEditor)

最后的最后，这个也只是我在项目中使用的版本，因为我的项目使用了fortawesome，所以觉得这个富文本编辑器未压缩仅仅23kb，简单压缩后仅16kb，未使用jq等库，优势劣势大家都明白了吧。

最后希望有帮助到您的朋友能一起讨论进步，欢迎发现bug联系我，及时调整，同时也希望大家能[star](https://github.com/anchengjian/ngTinyEditor)一下。

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_848f43d](http://anchengjian.lofter.com/post/3217ba_848f43d)