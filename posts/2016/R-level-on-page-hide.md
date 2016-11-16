# 巧用`visibilitychange`事件和十八禁

我知道你们都是看这图进来的，但是这个图跟下面的内容没有必然联系。

前不久在网上找资料的时候突然发现某个页面的 title 是啥`※18♥禁★电影【在线观看】☆...`，突然就心头一紧，是哪个页面咋还自动弹广告页，还是新标签页面打开的。当时我的表情就是这样。

表情.jpg

怀着就像你们看我题图就点进来的心情点开了那个页面，耶，正常的内容啊！刚刚那个18禁呢？！

狐疑.jpg

冷静了一下，就想这是个trick啊，然后我就自己动手实现了一个。

实际上，这部分代码我已经作为一个模块开源在我的博客里了，没单独分离出来。
[interesting-title.js](https://github.com/anchengjian/anchengjian.github.io/blob/master/src/utils/interesting-title.js)
这个文件的历史commits信息中暴露了一些奇奇怪怪的链接，老司机开车就是开的这么触不及防。不要问我要邀请码，我也没种子。

尴尬的.jpg

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

黑人问号.jpg

### “哟，小安啊，这能干咋不上天呢”
好吧，上天咱是不行的，但咱还得继续优化用户体验，要给用户那种突然发现这个页面的心头一震！然后又*会心一笑*的美妙落差啊。

既然是18禁，当然要装的像的一点。那哪儿不像呢？

隔壁桌的小草同志看了看说：“一般这种网站的标题不总是动来动去的么”

黑人问号.jpg

很有经验啊，我的小草。

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

### “这逼真！”
咳咳，请注意措辞，不要讲脏话。

本着用户体验的角度，总感觉哪儿不对啊，还有哪儿可以改改呢？

隔壁桌的小林同学听到小草同志的惊叹也凑过来瞅瞅。好家伙，才一过来，就说，这不错啊，就是那个 favicon 看着太不像了啊。

