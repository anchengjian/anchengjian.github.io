// 希望全部写字符串的相对路径，因为浏览器环境也要用
exports.appInfo = {
  name: '不爱吃西红柿的鱼',
  pageTitle: '不爱吃西红柿的鱼的博客',
  pageKeywords: '不爱吃西红柿的鱼,blog',
  pageDescription: '不爱吃西红柿的鱼的博客，主要记录在前端开发中的一些大大小小的坑和思考小总结，还偶尔携带着一些私货',
  pageAppTitle: '不爱吃西红柿的鱼',
  pageIcon: '/static/imgs/logo-square.png',
  appleTouchIcon: '/static/imgs/logo-square.png',
  appleTouchIcon2x: '/static/imgs/logo-square@2x.png',
  version: '3.0.0',
  slogan: '我是一个小前端呀小前端',
  job: 'Front-End Engineer',
  copyRight: '© Copyright 2017 不爱吃西红柿的鱼',
  headurl: '/static/imgs/logo-square.png',
  rootPath: 'posts/',
  listPath: 'posts/list.json'
}

// 全局的 ajax host 配置
exports.serverHost = ''

// 全局的 xhr config
// https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch
exports.xhrConfig = {
  method: 'GET',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=UTF-8'
  },
  mode: 'cors',
  credentials: 'include',
  // cache: 'default'
}
