# 如何用 javascript 和 canvas 做一个跳棋

引言，没有，免得虐待动物。（大雾）

## 跳棋游戏
![跳棋的长相](http://a.hiphotos.baidu.com/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=51c4fb918a13632701e0ca61f0e6cb89/fcfaaf51f3deb48fcc4fc693f01f3a292df5785c.jpg)
>跳棋的游戏规则很简单，棋子的移动可以一步步在有直线连接的相邻六个方向进行，如果相邻位置上有任何方的一个棋子，该位置直线方向下一个位置是空的，则可以直接“跳”到该空位上，“跳”的过程中，只要相同条件满足就可以连续进行。谁最先把正对面的阵地全部占领，谁就取得胜利。一玩就懂，所以几乎每个人都下过跳棋。在香港跳棋被称为“波子棋”。

好，我们接下来开始实现他。

## 我们先温习一下 canvas 中的绘图
比如，先画一个空心圆，用来表示没有被压上棋子的空棋盘格子，好奇怪，为什么是压上。。。
```javascript
function strokeArc(x, x, borderColor, radius) {
  ctx.beginPath();
  ctx.arc(x, x, radius, 0, 2 * Math.PI, true);
  ctx.strokeStyle = borderColor;
  ctx.stroke();
}
```

再来画个实心圆，当然这个是用来表示棋子的
```javascript
function fillArc(x, y, color, radius) {
  ctx.beginPath();
  ctx.arc(x, x, radius, 0, 2 * Math.PI, true);
  ctx.fillStyle = color;
  ctx.fill();
}
```

好像都很容易吧，哈哈。当棋子移动的时候，就需要把之前一坨实心圆给清理掉，再画上空心圆，基本思路， canvas 里面有`clearRect`方法，文档翻烂都没有找到`clearArc`，咋办，还好有 [globalCompositeOperation](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) 这个属性，来我们自己 DIY 一个出来。
```javascript
function cleanArc(x, y, radius) {
  ctx.globalCompositeOperation = 'destination-out';
  this.fillArc(x, y, radius * 1.1);
  ctx.globalCompositeOperation = 'source-over';
}
```

`clearArc`的问题终于解决了，可是点击事件呢？众所周知 canvas 不同于 svg 没有 DOM ，添加事件只能添加给整个 canvas ，这个时候就非常尴尬了，那么多棋子，咋弄！    
别慌，我们有办法。   
基本思路就是我们可以通过 event 获得鼠标或者手指的点击坐标，然后根据坐标相对于整个 canvas 左上角的偏移得出当前点击的相对位置，然后再遍历一下，看当前这个坐标是否是棋盘中的有效坐标，这样我们就得到了点击的这个位置是不是 棋子/空格/空白地区 的方法。
```javascript
// 通过event事件获得点击的坐标
function getPointByEvent(ev) {
  if (ev.layerX || ev.layerX === 0) return { x: ev.layerX, y: ev.layerY };
  // Opera
  if (ev.offsetX || ev.offsetX === 0) return { x: ev.offsetX, y: ev.offsetY };
}

// 通过某坐标找出其是否属于一个棋子／棋盘区域内
function getPieceByPoint(point) {
  for (let i in pos) {
    let piece = pos[i];
    // 勾股定理，求出这个点击的坐标点距离圆心的长度
    let a = ~~(point.x - piece._x);
    let b = ~~(point.y - piece._y);
    let len = Math.sqrt(a * a + b * b);
    if (len < radius) return piece;
  }
}
```

这里是不是就有点懵逼了，哈哈，稍等，这里引入了新的全局变量`pos`这个对象是专门用缓存所有的有效坐标的。   
**定义一下棋盘坐标**
由于是个六边形，不可能用标准的直角坐标系，所以，我就歪啦，这个歪坐标系，我称之为跳棋坐标系。
![棋盘坐标](/posts/assets/imgs/chinese-checkers-1.jpg)
`pos`的数据结构如下：
```javascript
// 棋盘的坐标
pos = {
  '1-5': {
    ID: '1-5',
    x: 1,  // 跳棋坐标系x
    y: 5,  // 跳棋坐标系y
    _x: 0,  // 实际上的垂直坐标系的x
    _y: 60,  // 实际上的垂直坐标系的y
    playerID: 'A'  // 可能不存在该属性。若存在则代表当前坐标上有一枚该角色的棋子
  },
  // ...
};
```

