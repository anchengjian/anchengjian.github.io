# 最近的demo，以及技术总结

上周，我们团队接了个外包~帮他们公司做官网和手机端的微网站。

起初他们想的是在原来的网站基础上做修改，后台这个方案太麻烦了，而且原来的网站的框架是asp的很早之前的建站框架。自然这种方案被我们都抛弃了。现在我们用新的框架来做这个网站，前端以及网站设计我们全新的来。

我主要负责的是前端。然后因为是模仿另外几个网站，所以，美工也是由我暂代了~~天华又清闲了不少。。

下面给出demo地址：

[http://demo.anchengjian.com/yuanpin/index.html](http://demo.anchengjian.com/yuanpin/index.html)

[http://demo.anchengjian.com/yuanpin/news.html](http://demo.anchengjian.com/yuanpin/news.html)

[http://demo.anchengjian.com/yuanpin/news-list.html](http://demo.anchengjian.com/yuanpin/news-list.html)

[http://demo.anchengjian.com/yuanpin/picture.html](http://demo.anchengjian.com/yuanpin/picture.html)

[http://demo.anchengjian.com/yuanpin/picture-list.html](http://demo.anchengjian.com/yuanpin/picture-list.html)

请自动忽略的我买的便宜烂主机。。貌似我可以把我的demo传到github里面去啊~~好吧，等我主机到期了再去搞github。

下面是相关技术总结：

1、不要滥用id，我就有个习惯是滥用id。一整个页面看下来几乎全部是id，class属性都很少，虽然id的效率很高，但是id用多了，最明显的一个问题就是在很多个页面都用同一个main.css的时候，不知不觉的就重复了。后患无穷啊。这也侧面说明了取名字是个很讲究的事情。

2、让css3的部分属性兼容ie6、7、8、9有个好东西，这就是pie啦~

> 1.  Include the PIE.js script in your page, surrounded by a conditional comment to prevent it from being downloaded in other browsers:

```html
<!--[if IE]>
    <script type="text/javascript" src="path/to/PIE.js"></script>
<![endif]-->
```

> Note: The code above is for PIE.js 1.0; if you are using a PIE 2.0 beta build, then you will need to include the appropriate JS file for the current IE version:

```html
<!--[if lt IE 9]>
    <script type="text/javascript" src="path/to/PIE_IE678.js"></script>
<![endif]-->
<!--[if IE 9]>
    <script type="text/javascript" src="path/to/PIE_IE9.js"></script>
<![endif]-->
```

> 2.  Invoke the PIE.attach(el) function for each element that needs CSS3 styling. Make sure you do this after the page's DOM has been fully loaded. For example, using jQuery:

```html
$(function() {
    if (window.PIE) {
        $('.rounded').each(function() {
            PIE.attach(this);
        });
    }});
```

官网是这么用的，主要介绍了jQ的用法，可我还没看过jQ呢，这些还不懂怎么用。不过有个东西是PIE.htc这么个好东西，这个的加载又需要服务器的支持。。哎哎，各种麻烦啊~~~

3、在IE中overflow:hidden莫名其妙的失效，在chrome看的好好的，该隐藏的都隐藏了，轮播看起来也不错，怎么就到IE就出问题了呢。。看了半天，又找了半天的相关资料。

> overflow:hidden失效 
> 当父元素的直接子元素或者下级子元素的样式拥有position:relative属性时，父元素的overflow:hidden属性就会失效。 
> 我们在IE 6内发现子元素会超出父元素设定的高度，即使父元素设置了overflow:hidden。 
> 解决这个bug很简单，在父元素中使用position:relative;即可解决该bug 
> 我的办法：子元素设置绝对定位，父元素相对定位，这样overflow:hidden就不会失效了。 

4、让IE兼容background-size。。虽然这个属性非常的棒，但是万恶的IE确实让人头疼，主要是在做新闻的列表模版（news-list.html）等有图片为背景标题的时候，例如推荐新闻的背景图片。这个背景图的拉伸可是个大问题，因为甲方已有的图是小图，就只有700多像素，然而这个要拉伸到全屏幕的100%。这可怎么办？最开始想的是用img然后z-index来解决这个问题。。最后才发现这其中的兼容性问题更复杂，翻转特效也异常多bug。于是就用了background-size这个属性。

下面说这个属性的兼容IE的方法，在css里面直接加上这个：

```css
background:url(upload/5.jpg);
background-size:100% auto;
filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='upload/5.jpg',sizingMethod='scale'); 
```

5、关于IE和Chrome的padding问题，这个盒模型直接导致了我做了一个���索框特效错乱。而且可气的是同一个header就只在我们开发同学加了程序代码后的首页出bug，而且更可气的在其他页面用同一个header又没有问题。。。这个暂时不表了

解决方法当然是小小的CSS Hack了。

> IE8、IE6都可识别*，但Chrome、FF不能识别。所以拿*来做IE8的Hack，而_在Chrome、FF和IE8中都不识别，只有IE6能识别，所以用_做IE6的Hack。 

--------------------------------------------我是华丽的分割线--------------------------------

此demo到此结束。在不断修改的过程中还会碰到新的情况和新的bug，到时候再分享。。

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_3f598a9](http://anchengjian.lofter.com/post/3217ba_3f598a9)