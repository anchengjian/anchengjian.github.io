demo主站在本博客的主导航中点击"demo"按钮也可进，附地址：[http://demo.anchengjian.com/](http://demo.anchengjian.com/)

昨天早上爬起来后晕乎乎的考了信息检索的期末，真是个另人愉快的体验，在第六周就期末了。哈哈。

从昨天下午开始就在思考着如何把自己的demo站给重做下，然后敲定后就开始重做自己的demo站，把它当成自己的简历来做算了，还是比较初级，相对于以前不能说自己有很大的进步，只是熟悉更多了，现在我要开始进阶的学习了。

我不知道以后究竟会不会入行前端，但是现在自己非常的喜欢，兴趣在于此，那就继续坚持！

更新相关的一点点的前端知识，html 就不说了，css在布局的时候有点新发现。子元素用inline-block来设置成内联块的时候，它的水平居中就成了个大问题，用margin:0 auto;是没有用的，解决的一个办法是在父或者祖父或者曾祖父元素上加个text-align:center; 就完美解决了。

在js方面，感觉进入了一个新的天地。

主要也同css一样，兼容性的问题！

比如scrollTop的问题，三大浏览器就三大标准，而且往常很多人忽略了safir浏览器（可能我们都是穷吊）。

```JavaScript
//scroll平滑移动效果
function scrollMove(iTarget, time) {
    clearInterval(timer);
    var timer = setInterval(function() {
        var cur = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var speed = (iTarget - cur) / 10;
        speed = speed & gt;
        0 ? Math.ceil(speed) : Math.floor(speed);
        if (iTarget == cur) {
            clearInterval(timer)
        } else {
            cur += speed;
            document.documentElement.scrollTop = cur;
            window.pageYOffset = cur;
            document.body.scrollTop = cur
        }
    },
    time)
}
```

这个是我今天写一点关于滚动条平滑移动的代码，其中关于滚动条当前的高度值是document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop 简直是折磨啊，不同的浏览器，要给不同的值，上次转载的那篇关于滚动条的文章也有些不详细和疏漏的地方，在此重新更正，现在这个方法才是完美的。

越来越明白前端存在是为兼容性而生的。以后浏览器都标准了，是不是前端就失业了哦？

想想ie6，我还是睡觉吧，明早要早起上课！

现在还没有做完，还差部分的js 特效和响应式特效。下周末做完。

文末附上demo地址：[http://demo.anchengjian.com/](http://demo.anchengjian.com/)

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_2a2611a](http://anchengjian.lofter.com/post/3217ba_2a2611a)