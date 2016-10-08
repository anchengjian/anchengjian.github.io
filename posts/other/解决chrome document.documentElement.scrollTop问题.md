今天数据平台提出一个问题，在页面显示浮动层时，IE、Firefox下都能显示正常，但Chrome下出现了浮动层永远显示在上面，经过仔细分析，发现Chrome对document.documentElement.scrollTop的识别会出现误差。不过加上document.body.scrollTop后，则显示正常。
　　由于document.documentElement.scrollTop和document.body.scrollTop在标准模式或者是奇怪模式下都只有一个会返回有效的值，所以都加上也不会有问题（看来上面的问题是Chrome可能把文档当作非标准文档来解析了）。
　　即获取高度时使用document.documentElement.scrollTop+document.body.scrollTop，经测试，代码在IE、Firefox、Chrome下都能显示正常了。

//原文地址：http://blog.csdn.net/spring21st/article/details/6338416

亲测是实用的，为了解决这个弹出bug，最好是document.documentElement.scrollTop+document.body.scrollTop一起用，然后浏览器又只会解析一个。

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)&nbsp;&nbsp;&nbsp;[http://anchengjian.lofter.com/post/3217ba_2917aaf](http://anchengjian.lofter.com/post/3217ba_2917aaf)