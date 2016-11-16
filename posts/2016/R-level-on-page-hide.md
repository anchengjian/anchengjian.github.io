# 用`visibilitychange`事件实现吸睛的十八禁

![18禁](http://i2.sinaimg.cn/gm/cr/2014/1225/505787017.jpg)
我知道你们都是看这图进来的，但是这个图跟下面的内容没有必然联系。

前不久在网上找资料的时候突然发现某个页面的 title 是啥`※18♥禁★电影【在线观看】☆...`，突然就心头一紧，是哪个页面咋还自动弹广告页，还是新标签页面打开的。当时我的表情就是这样。

![屌爆了](/posts/assets/emoji/dbl.jpg)

怀着就像你们看我题图就点进来的心情点开了那个页面，耶，正常的内容啊！刚刚那个18禁呢？！

![吃](/posts/assets/emoji/cs.jpg)

冷静了一下，就想这是个trick啊，然后我就自己动手实现了一个。
效果就像这个样子。
![效果图](/posts/assets/imgs/R-level-on-page-hide-1.gif)

实际上，这部分代码我已经作为一个模块开源在我的博客里了，没单独分离出来。 [interesting-title.js](https://github.com/anchengjian/anchengjian.github.io/blob/master/src/utils/interesting-title.js)
这个文件的历史commits信息中暴露了一些奇奇怪怪的链接，老司机开车就是开的这么触不及防。不要问我要邀请码，我也没种子。

![至尊卡](/posts/assets/emoji/zzk.jpg)

---

## 下面，我就来教你手把手实现这个trick。

### 首先，我们先分析需求。
基本功能是在页面被隐藏的时候显示一些劲爆的title，开个小玩笑；
当用户点击进来的时候（也就是页面正常显示的时候）显示正常的title。

### 接着，分析下技术要点。
* document.title 修改标题
* visibilitychange 事件来监听页面是否隐藏

挺简单的嘛，咱们开干！
### 动态的修改title
``` JavaScript
  function interesting(title) {
    // origin info
    let originTitle = document.title;

    // interesting info
    title = title || '※18♥禁★电影【在线观看】☆...';

    // get prefix support for ...
    let hidden, visibilityChange;
    ['', 'o', 'ms', 'moz', 'webkit'].forEach(prefix => {
      let supportHidden = prefix + (prefix ? 'Hidden' : 'hidden');
      if (typeof document[supportHidden] === 'undefined') return;
      hidden = supportHidden;
      visibilityChange = prefix + 'visibilitychange';
    });

    // not support for return
    if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') return;

    // start interesting
    document.addEventListener(visibilityChange, function() {
      document.title = document[hidden] ? title : originTitle;
    }, false);
  }
```
很完美啊，根本拦不到我们这种老司机。

看我这结构，多优雅，还支持自定义 title 呢。

![黑人问号](/posts/assets/emoji/hrwh.jpg)

### “哟，小安啊，这能干咋不上天呢”
好吧，上天咱是不行的，但咱还得继续优化用户体验，要给用户那种突然发现这个页面的心头一震！然后又*会心一笑*的美妙落差啊。

既然是18禁，当然要装的像的一点。那哪儿不像呢？

隔壁桌的小草同志看了看说：“一般这种网站的标题不总是动来动去的么”

很有经验啊，我的小草。

![厉害了我的哥](/posts/assets/emoji/lhlwdg.jpg)

来，给标题加个跑马灯。
``` JavaScript
  // start interesting
  document.addEventListener(visibilityChange, horseRaceLamp, false);

  let timer;
  function horseRaceLamp() {
    if (document[hidden]) {
      document.title = title;
      if (!noRunTitle) timer = setInterval(() => {
        let str = document.title;
        document.title = str.substr(1, str.length - 1) + str[0];
      }, 50);
    } else {
      document.title = originTitle;
      if (timer || timer === 0) clearInterval(timer);
    }
  }
```

### “这么[屏蔽字]真！”
咳咳，请注意措辞，不要讲脏话！

本着用户体验的角度，总感觉哪儿不对啊，还有哪儿可以改改呢？

隔壁桌的小林同学听到小草同志的惊叹也凑过来瞅瞅。好家伙，才一过来，就说，这不错啊，就是那个 favicon 看着太不像了啊。

厉害了，我的小林同学，你是怎么一眼就发现这个核心问题的！

来来来，我们聊聊。

在小林的帮助下，我顺利的找到了某榴社区的 favicon ，还不小心把那社区的地址也给提到版本里了 = =、

撸起袖子就是一顿写。
``` JavaScript
  const originFavicon = getFaviconEle();
  const originFaviconHref = originFavicon.href;

  const defaultFavicon = 'http://****.****.com/favicon.ico';
  favicon = favicon || defaultFavicon;

  function getFaviconEle(href) {
    let ele = document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[type*=image]');
    if (ele) return ele;
    href = href || '/favicon.ico';
    ele = document.createElement('link');
    ele.setAttribute('rel', 'shortcut icon');
    ele.setAttribute('href', href);
    document.querySelector('head').appendChild(ele);
    return ele;
  }

  // 更新跑马灯方法
  function horseRaceLamp() {
    if (document[hidden]) {
      document.title = title;
      if (originFavicon) originFavicon.href = favicon;
      if (!noRunTitle) timer = setInterval(() => {
        let str = document.title;
        document.title = str.substr(1, str.length - 1) + str[0];
      }, 50);
    } else {
      document.title = originTitle;
      if (originFavicon) originFavicon.href = originFaviconHref;
      if (timer || timer === 0) clearInterval(timer);
    }
  }
```

这下子就看起来万事大吉了啊。
最后用 base64 转一下 favico 再合并一下前面的所有代码，大概有50多行，再优化一下默认传参，再加个是否启动替换 favico 的开关，就齐活了啊，来看一下最终的代码。
``` JavaScript
  const defaultFavicon = 'data:image/vnd.microsoft.icon;base64,AAABAAIAEBAAAAAAAABoBQAAJgAAACAgAAAAAAAAqAgAAI4FAAAoAAAAEAAAACAAAAABAAgAAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAAw/cASro5AIzLtQAhw5wAc+P/ANbfxgB703MAWrqcAELT9wBCumsAzvP/ACGuIQCc3+cAMcvGACG2SgCc35QAY8NaAK3fxgAhx+cAhL6UAGvXvQDn894Aa7JzAFLLhACl060AQsNSAM7r3gBSrnsAANv/ADG6rQA5sikAxte1AIzThAB7z6UAnMecAFLT5wAYw9YA9/fvADG6OQBr2+8AELqcAHPHlACU29YAnNe9AHu6hACM16UAGMf3AFrDSgC957UAxufOAK3PvQBasmsAa89rAGvLrQDW784AreOtAFrLlABKvnsASrZaAITj/wBrsoQA5/PvADG2SgBSvowApdOcAFLHcwAIz/cAjNe9AHPLewApshgAOb5CAL3bvQB7upwAWstaAFK+awCE03sA7+/nACmyKQBCtjEAztu9ALXjzgCl284AY8tjAK3XpQCU27UAlNuMAJTPrQCMy6UAhM+tAO/39wAAz/8AMbIhAOfr1gDe584A1ufWAELb/wBSw0IAKcPGAK3XtQBzx2sAnM+1AIzDrQBavloAOboxAJzXrQCcy6UAY8eUAHvLnAA5w0oA//v3ADG2KQAptjEA1vPWACHL7wDW484AKcvnALXfvQBSz4wAlNOlAITTtQB7tpQAhLqcAITTpQBzvpwA9/v3AADH/wApsiEA7/fvACGyKQAIx/cA5/PnADG2MQDn694AQro5ANbn3gBC0/8AzufWAM7jzgDG59YAxt/OAMbnxgBKvloAWsNSAGPDUgC138YAtde9AKXbxgCl17UApdOlAJzXtQCU160AjL6UAIzPrQBzy5wA//v/APf39wAA1/8AANP/AADL/wAAx/cA7/PvAO/z5wDn9+8AQroxAELX/wDW684A1ufOAGPHWgBjx2MAvd+9AGu2hACc070AjNeEAJTXtQCM06UAhM+lAHvLpQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJt3GRs7bHFVLUJHOQdfAQGxOkhlI0NwdpR0YlcBIaMBRUyAlnluA5MTb5GQASdRfrCFQFhagpGTEwEiUKhvowdGDQuyGk8SZBMBjmmnXqNOVGhBN1ldjxpSAYGHMgGGhq6VY4MmEDxtkgEBqa4BAaIXDqB/fyo1K5d+AVcxAQEBASxEf6AFGFl8YAE4pRcBAQGvHxQPQC5nVnidAaoWPQakmh2vVyAVSlJqqwx1XFweHGY+mAiRJHqthHlzoKGhXIyNSi9LTYuZfYEpnwICoVyEinuwSBFbSaxTiaACAqFcfoh6aig5nJ1rCTCeXFyfHgE/NDM2cgEBgQQlpgoKiWEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACAAAABAAAAAAQAIAAAAAACABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8ACL69ACGyEAClvoQAe+P/AEKeawDG68YAY8u1ADHP9wBrz2sARr45ABC6awCU18YAAMPvAM7z/wAxsqUAWraMAKXr9wAYtjkAtdelAIbOmgAIupAA6u7eAFrT7wA5x8YAOceEADm6WgBrtlIAe7qEABTD1gAxuCkAnN6XAFLDdwCMz3sAqePOAJnIpQBSz9YAbcmWAFqqcwDn9/MAWsdaABjL8wB708YA2+PJANLr3gA5z94AnN+tAMbbtQCt170AtefnAHe6nAC15bUASracACm6vQBFs3MAQr61AGO8awC1y5gASrZSAGuyhAB70a0AMbZKAGvb9wB5x3MASr6EAJTn/wAhvnMAkMOUAGPJewCP1rUAu97GAFq+SgCMwaUAEMbqADm2OQC959IAnNvWAPf37wAhsikAEL6tAJzTtQB3y4wAWr6cAE66YwBKw8YAb8elAELDlAAxw6UAWrV4AFrHjABrupQA0+7OAKXj5wBr1+cAnOO9AKXPnABrunsAjNOlAGvPhADS38YA3OjUAKXdxgBKqnsArdGtAJTXjADe8+cAQsN7AITDhAB7w6UADMPeAITf9wCl2bUAY6p7AIjThACHvpcA3vf7AEK+QgDW370AIcPSAGPDYwBCxb0ApdWlACm0GADv9ecAK7UvAEK6NQAYtmMAvem9ALrTqgBzuloAtde1AEe5awCx460AUq5zAHPLYwB70XMAa8NzAJTTrABwtYwAZsicAHHNmgDT5M4AUr5CAMblzgBKvkoAxt+9AEa+WgC148YApePWAEqmawCt15wArcWUAJzZvQBayXMApdeUAJTHewBSxYQAY7aEAJTJrQBzx3sAa8O1AI/GnABvz60Ae9GUABiwEAAptCEAObwxADm6YwCly6UAnNOlAGPEhwCG0KsAY8mMAIfIpQBKw0IAUsFKAEK+cwDn6dYA3u/eAMbrvQC63r0AWr5aAGPFWgCl0bUASr57AJzTnAB7w4QAc82lAP/99wD3/f8A7/n3ACGwIQAAxfcAMbYhAOfx5wAhsDEACMXvABDJ9wDW7+cAObQxADG4OQDW79YAGMfeAJzr/wAIvpwAzOjUAMbp3gA5uU0AhOP/AEq8QgBv3/8AQrpKAM7dvQBCslIAtePWALXnzgDG060AWsVSAL3jtQC92bUAMbatAE6icwC12b0Ard/GAEq4cwBSpnsArdW1AGvJYwCt36UApdm9AFqsewCl0a0ApducAGO+cwBVu4QAlNm9AGOshABjtnsAUsOMAHO6ewCE03sAY7aMAGO4lAB7uIwAc8eEAGPFlABztpQAa8mMAGu+nAB7vJQAe82cAPf59wAhshgA7/nvAO/z7wBaNzdr4VqT0Dc8vFrAfmXcrOaSggOnXBcEZQEBAQEBAZ03N52dhEuT4RGjk8C2s4OKcCwcpguAvdWYfAEBAQEBnTfrWiF9sFK59ibJpYmztT0x1ZzCHwcBToE6/AEBAQG564ydfaZAcO+Mq8D9oLMxrMplgcj9IAEBfJgsAQEBAe+MJtD9yHpHjPZUpchAzuOsx04Uj/3k/gEBZTplvQEBjPZSwP073DG8WsmlfrqOiqy/AY5IpbBcAQH8jjp8AQHvJnilfSeD5qPrT6XItbWKUSgB/kD9fjD/AQG91dn/Abn1fsA+huNGRoR9pdLO46zs/AH8m/0flyx8vQH8ZIFON7amfaiGYj3o6k+lt45orGb8AQHbyHtpZSwX/AH8ZDCEH/3WsVm8Rt/w/aV4kuOuZr4BAXxI/Wl8F3Zl/wH8LND90lmxq41Rgbul/ZPctfsjvgEBASKl5PwBfCwsfPz8fady7kGMVq7oQKXAG6qDFSO+AQG96f0LygEB/LIssk6mCrWeV3kZOKGawMBUUmis4L4BAQEHyKeAAQEBAU4sLHuFLTV3xcHBSlgTwFmdFYqZ/gEBAfyPe4X8AQEBAfwX5LPPNsXBwcHBbgzE5yb4rIrDAQEB/IgDt/wBAQEBAQGA/DIewcHBwcHBFhuWrq2NUY78AQEB5cILXAEBAQEBAf78TcvBwcHBwcHNIYaLio1itf8BAQFcCx80AQEBAQEBAQENd8HBwcHBDhZF7XExrCaDZfwBAfza/XL8AQEBAQEBKOx5bsHBwcECfzmiJzFmvBXc/wEB/IV7j/4Bvr6+AQEoilPdHkoqLkPEOSRxM0xG+HqQ/AEBXJHUlcwF09NCAUxGM2dXCF1fff1hRHPtZiNw+IOzAQF0GlBKwcHBwcG/mVH63iakzjQDH/D0uO2fI8f7FUf+dNFKwcHBwcHBwceZMfoGFfjOIAPabB0k91tmKM4mitc/xsHBwcHBwcHBz5nfM96Kq5DxpodgRHMk7UbH/IONJcbBwcHBwcHBwcEj5spJ4rirlIj95I4kc6KLbS0BwytKwcHBwcHBwcHBwey1/p/n360viKbxw7XjRHPzZvwoGMXBwcHBwcHBwcHB2GX8n+e1rWIp/SD/zmQk+vJWag8JwcHBwcHBwcHBwcEtZfxJ7eONYqcDtP5lF5Bz+vnOEirBwcHBwcHBwcHBwcfD/p886Iqkp6Zc/C3/w+P0W65vKsHBwcHBwcHBwcHB/3z+UTypR0V1rwcBw/78s6Ly817GwcHBwcHBwcHBwcFO/78x52jKmqfaygH+/AH8jovzVcbBwcHBwcHBwcHBwU78/Efegyhj/a/8Afz8AQH8R/IQSsHBwcHBwcHBwcHBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

  export default function({ title, favicon, noRunTitle, noRunFavicon } = { noRunTitle: false, noRunFavicon: false }) {
    // origin info
    let originTitle = document.title;
    let originFavicon, originFaviconHref;
    if (!noRunFavicon) {
      originFavicon = getFaviconEle();
      originFaviconHref = originFavicon.href;
    }

    // interesting info
    title = title || '※18♥禁★电影【在线观看】☆...';
    favicon = favicon || defaultFavicon;

    // get prefix support for ...
    let hidden, visibilityChange;
    ['', 'o', 'ms', 'moz', 'webkit'].forEach(prefix => {
      let supportHidden = prefix + (prefix ? 'Hidden' : 'hidden');
      if (typeof document[supportHidden] === 'undefined') return;
      hidden = supportHidden;
      visibilityChange = prefix + 'visibilitychange';
    });

    // not support for return
    if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') return;

    // start interesting
    document.addEventListener(visibilityChange, horseRaceLamp, false);

    let timer;

    function horseRaceLamp() {
      if (document[hidden]) {
        document.title = title;
        if (originFavicon) originFavicon.href = favicon;
        if (!noRunTitle) timer = setInterval(() => {
          let str = document.title;
          document.title = str.substr(1, str.length - 1) + str[0];
        }, 50);
      } else {
        document.title = originTitle;
        if (originFavicon) originFavicon.href = originFaviconHref;
        if (timer || timer === 0) clearInterval(timer);
      }
    }
  }

  function getFaviconEle(href) {
    let ele = document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[type*=image]');
    if (ele) return ele;
    href = href || '/favicon.ico';
    ele = document.createElement('link');
    ele.setAttribute('rel', 'shortcut icon');
    ele.setAttribute('href', href);
    document.querySelector('head').appendChild(ele);
    return ele;
  }
```

如果觉得这篇文章不错，就给我点个`star`吧，如果想持续关注我的博客，就点个`watch`。

谢谢！ [我的博客](https://github.com/anchengjian/anchengjian.github.io)

说了这么多废话！
![不要再说了](/posts/assets/emoji/byzsl.jpg)