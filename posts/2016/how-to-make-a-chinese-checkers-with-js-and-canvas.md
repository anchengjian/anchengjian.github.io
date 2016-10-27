# 如何用 javascript 和 canvas 做一个跳棋

引言，没有，免得虐待动物。（大雾）   
先上实战项目地址，求star
[Chinese Checkers by React.js & Socket.io. ](https://github.com/anchengjian/chinese_checkers)

## 跳棋
>跳棋的游戏规则很简单，棋子的移动可以一步步在有直线连接的相邻六个方向进行，如果相邻位置上有任何方的一个棋子，该位置直线方向下一个位置是空的，则可以直接“跳”到该空位上，“跳”的过程中，只要相同条件满足就可以连续进行。谁最先把正对面的阵地全部占领，谁就取得胜利。一玩就懂，所以几乎每个人都下过跳棋。在香港跳棋被称为“波子棋”。

大概就是张这样子。
![跳棋长相](http://www.csgglass.com/news/pic/2010050414321520173.jpg)
哈哈，不要被迷倒，你下棋的样子最认真。

好，我们接下来开始实现她。

## 基本实现思路
1. 先创建一个canvas元素。
2. 先得出棋盘所有的坐标，用空心圆渲染。
3. 再找到所有玩家的坐标，然后用不同颜色的实心圆渲染玩家的棋子。
4. 监听canvas的点击事件，判断出是否在操作棋子，并做出相应的响应：
    如果是移动棋子，先在目标位置画上实心圆，再清理圆形区域，再画上空心圆。

是不是非常的easy，下面我们一步一步的来。

## 我们先温习一下 canvas 中的绘图
比如，先画一个**空心圆**，用来表示没有被压上棋子的空棋盘格子，好奇怪，为什么是压上。。。
```javascript
function strokeArc(x, x, borderColor, radius) {
  ctx.beginPath();
  ctx.arc(x, x, radius, 0, 2 * Math.PI, true);
  ctx.strokeStyle = borderColor;
  ctx.stroke();
}
```

再来画个**实心圆**，当然这个是用来表示棋子的
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

## 接着定义一下棋盘坐标
显然，不能直接使用canvas的坐标体系。棋盘是个六边形，所以，那就歪啦，这个歪坐标系，我称之为跳棋坐标系。横着的是X轴（自左向右自增），竖着的是Y轴（由上向下自增）。
![棋盘坐标](/posts/assets/imgs/chinese-checkers-1.jpg)
缓存一个变量`pos`，用来缓存所有的坐标，用来关联跳棋坐标系和canvas中真实位置。其数据结构如下：
```javascript
  // 棋盘的坐标
  let pos = {
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

  // 全局统一的跳棋坐标系中的ID样式
  function getID(x, y) {
    if (Object.prototype.toString.call(x) === '[object Object]') return `${x.x}-${x.y}`;
    return `${x}-${y}`;
  }
```

这好几百个位置，一个一个算太麻烦了，我们仔细看一下，发现还是有点规律。比如：   
x坐标的为1，y的坐标只能是5，   
x坐标的为2，y的坐标的上限是5，下限是6   
...
这只需要找到所有的可能的x坐标就搞定了啊。哈哈，写段脚本跑起来。
```javascript
  // 初始化棋盘，一个巨大的六角形东西
  function drawBoard(canvasWidth, radius) {
    const spaceWidth = canvasWidth / 14;
    const lineHeight = canvasWidth / 15;
    const sapceX = spaceWidth / 2;
    const padding = 2 * radius;

    // 坐标系区域的限制
    // x坐标为1，y的上限是5，下限是5
    // x坐标为2，y的上限是5，下限是6
    const posRegions = [[5, 5], [5, 6], [5, 7], [5, 8],  [1, 13], [2, 13], [3, 13], [4, 13], [5, 13], [5, 14], [5, 15], [5, 16], [5, 17], [10, 13], [11, 13], [12, 13], [13, 13]];

    posRegions.forEach((regions, i) => {
      let x = i + 1;
      let min = regions[0];
      let max = regions[1];
      for (let y = min; y <= max; y++) {
        // 需要修正一下 x 轴的实际坐标
        let correct = 0;
        if (y < 5) correct = (5 - y) * sapceX;
        if (y > 5) correct = -(y - 5) * sapceX;
        let _x = i * spaceWidth + correct + padding;
        let _y = y * lineHeight;

        // 画棋盘
        strokeArc(_x, _y);
        // 记录位置
        let ID = this.getID(x, y);
        pos[ID] = { x, y, _x, _y, ID };
      }
    });
  }
```

棋盘都搞定了，棋子还远么。

## 渲染玩家棋子
准备一个`players`变量来缓存所有跟玩家棋子相关的东西，包括玩家棋子所在区域的开始位置，玩家颜色等什么的。
```javascript
  // 初始化的棋盘的6个区域内的坐标限制
  let players = {
    A: {
      color: 'rgba(255, 165, 0, 1)',
      area: { x: 5, y: 1 }  // 起始坐标x,y
    },
    B: {
      color: 'rgba(0, 255, 0, 0.25)',
      area: { x: 10, y: 5, special: 1 }  // 特殊的角
    },
    C: {
      color: '#f44336',
      area: { x: 14, y: 10 }
    },
    D: {
      color: '#5badf0',
      area: { x: 10, y: 14, special: 1 }
    },
    E: {
      color: '#e91e63',
      area: { x: 5, y: 10 }
    },
    F: {
      color: '#ff9800',
      area: { x: 1, y: 5, special: 1 }
    }
  };

  // 根据角色初始化玩家的棋子
  // playerID --> 'ABCDEF'.substr(0, 1);
  function initPlayer(playerID) {
    if (!players.hasOwnProperty(playerID)) return;
    let palyer = players[playerID];

    for (let i = 0; i < 4; i++) {
      let j = palyer.area.special ? 0 : i;
      let maxY = palyer.area.special ? i + 1 : 4;
      for (; j < maxY; j++) {
        let x = palyer.area.x + i;
        let y = palyer.area.y + j;
        let ID = getID(x, y);
        let newPos = pos[ID];
        if (!newPos) continue;

        pos[ID].playerID = playerID;
        fillArc(newPos._x, newPos._y, players[playerID].color);
      }
    }
  }
```

如果您有耐心看到这里，几乎就成功了一大半了。

## canvas中的点击事件
众所周知 canvas 不同于 svg 没有 DOM ，添加事件只能添加给整个 canvas ，这个时候就非常尴尬了，那么多棋子，咋弄！    
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

点击事件都搞定了，这后面的就太容易了。
## 棋子的移动
还记得前面说的什么吗？一个棋子从一个位置移动到另一个位置，只需要在新位置画上带颜色的实心圆，然后把原位置清空，画上空心的棋盘就大功告成。   
需要注意的，移动棋子要怎么操作。   

当然是先拎起来，在选个位子，松手，吧唧一下，棋子就移动过去了。   
用js事件解释就是，点击一个棋子，选中；鼠标挪动，点击一个棋盘的空格，落子。   

这么梳理后就简单了。
来来来，整起走。
```javascript
  // 缓存选中的棋子
  let currentPiece;
  // 描绘棋子移动
  function renderMove(newPos) {
    let oldPos = currentPiece;
    newPos.playerID = oldPos.playerID;  // 传递下去，好赋颜色
    fillArc(newPos._x, newPos._y, players[oldPos.playerID].color);
    cleanArc(oldPos._x, oldPos._y);
    strokeArc(oldPos._x, oldPos._y);
    delete this.pos[oldPos.ID].playerID;
  }
```

是不是格外的简单，清晰。。。   

可能有的朋友会问，如果我乱走棋子咋办，都没检测一下落子合法性什么的，别慌，来再给你们放一次我的项目地址: [Chinese Checkers by React.js & Socket.io. ](https://github.com/anchengjian/chinese_checkers)

在这个项目中实现了，自定义用户名、可选人数、系统判定玩家走步次序、检查玩家落子的合法性、玩家的走位落子历史记录、多端同步通讯等等......基本达到了可玩的状态。   
当然，这只是个开始，如果有时间和精力会继续写下去的，我想要整个漂亮的界面、下棋的时候聊天、倒计时、人机对战等等好多。

感谢您的阅读，希望能参与我的小游戏，或者给我的这个跳棋一点点意见，或者去给我点个赞鼓舞一下我吧。
谢谢！