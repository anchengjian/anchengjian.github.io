今天又在看文档的时候，猛然发现了一个东西，就是calc() ,这个是css3的一个用法，无需引用什么库啊插件的，可直接用。

兼容性方面：

IE这次牛逼了一回，IE9起可以直接用标准写法，当然IE6-8肯定不支持的，其他FF4.0+、Chrome19+、Safari6+都有较好支持，同时一样需要加各厂识别符。

> 不过可惜的是，移动端的浏览器还没仅有“firefox for android 14.0”支持，其他的全军覆没。 

用法，比较简单：

**简单举例，效果脑补：**
```css
.div1 {
    width: calc(100 % -100px)
}
/* 稍微点的复杂运算，效果见图，又一种响应式的实现方式：*/
.container {
    width: 100 % ;
    height: 100px;
    background - color: #f5f5f5
}.item {
    width: calc((100 % -100px) / 3);
    margin - left: 25px;
    height: 100px;
    background - color: #999;
    display: inline - block
}
```

![](/posts/assets/imgs/6630742310257147002.png)

其中**需要注意**的是calc() 中的运算符号最好隔开一空格，不然会报错，习惯性紧挨着写代码的需要注意啦。

**详细请看这有篇文章：** [http://www.w3cplus.com/css3/how-to-use-css3-calc-function.html](http://www.w3cplus.com/css3/how-to-use-css3-calc-function.html)

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_65465fc](http://anchengjian.lofter.com/post/3217ba_65465fc)