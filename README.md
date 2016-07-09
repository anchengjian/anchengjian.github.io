# anchengjian.github.io
这可能是最简单的博客系统。 ———— 方徳恩德.道格拉斯

## 目录信息简介
```bash
.
├── app                // 静态博客主题的开发目录
├── config             // 配置信息
├── dist               // 代码打包后的静态资源
│   ├── app.webpack.config.js
│   ├── list.js        // 建构最新的文章信息到 list.json
│   └── userinfo.js    // 自定义的博客几本信息
├── libs               // 自制的一些方法
├── node_modules
├── posts              // 文章存放目录
│   └── assets         // 文章里面需要用到的静态资源，如：文章配图等
├── test
├── CNAME              // 博客的cname,自定义域名
├── favicon.ico
├── index.html         // 静态文件的入口,打包而来
├── package.json
└── README.md
```

## 使用方法

生成最新的目录（每次写了新文章后使用）
```bash
npm run list
```

开发调试
```bash
npm run dev
```

部署生成静态文件（只需要在修改过 js 或 css 等静态资源才使用）
``` bash
npm run deploy
```

