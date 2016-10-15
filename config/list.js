const fs = require('fs');
const path = require('path');
const walk = require('../libs/walk.js');
const config = require('./blog.config.js');

let rootPath = config.rootPath || './posts';
let listPath = config.listPath || './posts/list.json';

const fileFilter = ['.DS_Store', 'list.json', 'assets'];
const summaryLen = 128;

let originMap = {};
require(path.resolve(listPath)).forEach((item) => originMap[item.path] = item);

console.time('Sync');
let fileList = walk(rootPath, fileFilter, read)
  .map((item) => {
    let old = originMap[item.path];
    if (old) item.birthtime = old.birthtime;
    return item;
  })
  .sort((a, b) => {
    return new Date(b.birthtime) - new Date(a.birthtime);
  });

fs.writeFile(listPath, JSON.stringify(fileList), (err) => {
  if (err) return console.error(err);
  console.log("list.json 数据写入成功！");
  console.timeEnd('Sync');
});

function read(curPath, path, name) {
  let data = fs.statSync(curPath);
  let content = fs.readFileSync(curPath, 'utf-8').toString().substr(0, summaryLen) + '...';
  return {
    birthtime: data.mtime,
    name: name.replace(/(.*\/)*([^.]+).*/ig, '$2'),
    path: curPath,
    summary: content
  };
}
