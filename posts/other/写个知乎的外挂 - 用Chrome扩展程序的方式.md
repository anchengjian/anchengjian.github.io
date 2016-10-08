最近泡在知乎上发现了很多水军，没有办法见到这么多的水军横行于这个本来良好的社区，然后，实在是看不惯某族的那几个人神叨叨的无下限打脸。于是乎顺便给自己涨几个粉和涨几个赞的出发点下（我承认我的这出发点是极其的恶劣和无下限），我给知乎写了个外挂。

最开始本想用我去年自学的VB做，不过很多东西都忘记了，而且，VB里面自带的是IE核的浏览器，于是，刚好最近学了JAVASCRIPT，然后，我就想用JS做。因为这个东西操作web页面上的DOM都比较的方便。遂开始摸索Chrome的插件开发，其实Chrome开发还是很简单的。

附上Chrome插件开发的学习地址：[http://www.ituring.com.cn/book/1421](http://www.ituring.com.cn/book/1421)

总结下来就是Chorome的开发，特别是插件的开发，我感觉目前用到的东西主要是js以及一些前端的基本东西，这是另一个前端的想像的天堂。

下面来给一些相关的东西：

1、json清单 `manifest.json`

```json
{
    "manifest_version": 2,
    "name": "知乎水军互关",
    "version": "1.0",
    "icons": {
        "16": "images/icon16.png",
        "48": "images/icon48.png",
        "128": "images/icon128.png"
    },
    "description": "知乎水军互关v1.0版本",
    "browser_action": {
        "default_icon": {
            "19": "images/icon19.png",
            "38": "images/icon38.png"
        }
    },
    "content_scripts": [
        {
            "matches": [
                "http://www.zhihu.com/*"
            ],
            "js": [
                "js/main.js"
            ]
        }
    ]
}
```

2、main.js  需要说明一下：由于才开始学习这个东西，所以做的比较原始，大牛勿喷。（初学是个很好的借口啊~）跨域传值我是用的winow.name简单的做个处理，本想用cookie什么的，感觉弄起来很麻烦，首要目的是实现我们的功能。

```JavaScript
var count = window.name;
if (!window.name) {
    window.name = 0
}
setTimeout("zhihu_run(count)", 2000);
function zhihu_run(count) {
    if (location.href == "http://www.zhihu.com/#signin") {
        zhihu_login(admintext[count], pwdtext[count]);
        window.name = Number(count) + Number(1)
    }
    if (location.href == "http://www.zhihu.com/") {
        location.href = "http://www.zhihu.com/people/*******/followers"
    }
    if (location.href == "http://www.zhihu.com/people/******/followers") {
        var zhihu_timer = setInterval("guanzhu()", 50)
    }
    if (location.href == "http://www.zhihu.com/?next=%2Fpeople%2F*******%2Ffollowers") {
        location.href = "http://www.zhihu.com/#signin"
    }
}
var admintext = ["***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com", "***@***.com"];
var pwdtext = ["********", "********", "********", "********", "********", "********", "********", "********", "********", "********", "********", "********", "********", "********", "********"];
function zhihu_login(admin1, password1) {
    document.getElementsByName("email")[0].value = admin1;
    document.getElementsByName("password")[0].value = password1;
    document.getElementsByClassName("sign-button")[0].click()
}
function zhihu_exit() {
    location.href = "http://www.zhihu.com/logout"
}
function guanzhu() {
    var testbtn = document.getElementsByClassName("zg-btn zm-rich-follow-btn with-icon zg-btn-follow")[0];
    if (testbtn) {
        testbtn.click()
    }
    var obtn = document.getElementsByClassName("zg-btn zg-btn-follow zm-rich-follow-btn small");
    if (obtn.length > 0) {
        for (var i = 0; i < obtn.length; i++) {
            obtn[i].click()
        }
    } else {
        clearInterval(zhihu_timer);
        location.href = "http://www.zhihu.com/logout"
    }
    location.href = "http://www.zhihu.com/people/*****/followers"
}
```

其中的部分账号和密码以及相关的水军的信息我已经加码处理。。

ps.我是研究技术，不存在恶意的刷帖什么的。大家可以给给意见啊，求不屏蔽，求不举报~跪谢

ps..附一张图，大家想搞歪门邪道请出门左转：

![](/posts/assets/imgs/1050464613101653777.png)

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_2af1846](http://anchengjian.lofter.com/post/3217ba_2af1846)