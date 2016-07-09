const fs = require('fs');
const walk = require('../libs/walk.js');
const fileFilter = ['.DS_Store', 'list.json', 'assets'];

const config = require('./blog.config.js');
if (!config.rootPath) config.rootPath = './posts';
if (!config.listPath) config.listPath = './posts/list.json'

console.time('Sync');
let fileList = walk(config.rootPath, fileFilter, read);

fileList.sort((a, b) => {
  return b.birthtime - a.birthtime;
});

fs.writeFile(config.listPath, JSON.stringify(fileList), (err) => {
  if (err) return console.error(err);
  console.log("list.json 数据写入成功！");
  console.timeEnd('Sync');
});

function read(curPath, path, name) {
  let data = fs.statSync(curPath);
  let content = fs.readFileSync(curPath, 'utf-8').toString().substr(0, 128) + '...';
  return {
    birthtime: data.birthtime,
    name: name,
    path: path + '/',
    summary: content
  };
}
