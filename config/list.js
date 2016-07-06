const fs = require('fs');
const walk = require('./walk.js');
const fileFilter = ['.DS_Store', 'list.json'];

console.time('Sync');
let fileList = walk('./articles', fileFilter, read);

fileList.sort((a, b) => {
  return b.birthtime - a.birthtime;
});

fs.writeFile('./articles/list.json', JSON.stringify(fileList), (err) => {
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
