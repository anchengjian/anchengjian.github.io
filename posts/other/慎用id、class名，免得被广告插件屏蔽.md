这事儿说来实在是偶然，因为做一个demo，刚好是其中的一个常见的轮播图片展示部分，内容是其网站的活动热点等等的一些东西，又根往常一样，随手取了一个语意化的名字“ad-carousel”，这个在本地显示效果还可以，没有问题。。因为纯前端也没有方本地的服务端里面跑出来看看效果。

但是就在这个时候，说时迟那时快，我信心满满的把demo放到了demo站里面去了，让大家看看效果，看看兼容啊什么的。。结果的结果啊，我直接用地址打开了我的demo后，怎么发现整个轮播部分都没了。用审查元素和查看源代码代码和css等等都正常，都在啊。

马上重点来了，因为我没有注意自己之前用了一个ad屏蔽插件。名字叫做“[广告终结者](http://www.adtchrome.com/)”（我不是广告，相关厂商看到后支付广告费给我~~），在浏览器的右上角默默的存在，一直忘记了它的存在。

![](/posts/assets/imgs/6608922502004392416.png)
 然后，猛然发现该不会是这个去广告插件把我的这块代码给直接屏蔽了吧。把插件一停用，果然如此~！轮播的图片又出来了。

**于是，各位苦逼前端们，你们注意啦，写代码的时候不仅要考虑用户可能用的是ie，还要考虑用户可能是chrome加了去广告插件。。写id、class名的时候要注意名字，写个&quot;ad&quot;那一定是会屏蔽&nbsp;的了。**

然后我又找到了“广告终结者”的过滤屏蔽规则，详细见于：[http://sub.adtchrome.com/adt-chinalist-easylist.txt](http://sub.adtchrome.com/adt-chinalist-easylist.txt)

我大致看了下，思路是把各个网站的广告模块用选择器的方式给记录了下来。这个保证了屏蔽的精准，然后又有通杀式的屏蔽包含&quot;ad&quot;等关键字的。以保证了大部分网站的去广告效果。

最后放出最后的demo地址，请大家批评~**有批评才能有提高**~

demo地址：http://demo.anchengjian.com/aotuschool.com/

ps.不要骂我标题党

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)&nbsp;&nbsp;&nbsp;[http://anchengjian.lofter.com/post/3217ba_5e91ab2](http://anchengjian.lofter.com/post/3217ba_5e91ab2)