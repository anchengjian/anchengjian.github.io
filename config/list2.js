const fs = require('fs');
const util = require('util');
const fileFilter = ['.DS_Store', 'list.json'];

console.time('Promise + Sync');
let fileList = walk('./', fileFilter).map((file) => {
  let data = fs.statSync(file.path);
  let content = fs.readFileSync(file.path, 'utf-8').toString().substr(0, 100);
  return {
    birthtime: data.birthtime,
    name: file.name,
    path: file.path,
    summary: content
  };
});

Promise.all(fileList)
  .then((posts) => {
    return posts.sort((a, b) => {
      return b.birthtime - a.birthtime;
    });
  })
  .then((json) => {
    fs.writeFile('./articles/list.json', JSON.stringify(json), (err) => {
      if (err) return console.error(err);
      console.log("list.json 数据写入成功！");
      console.timeEnd('Promise + Sync');
    });
  })
  .catch((err) => {
    console.error(err);
  });

function walk(path, filter, callback) {
  let dirList = fs.readdirSync(path);
  let res = [];
  dirList.forEach((fileName) => {
    if (filter && util.isArray(filter) && filter.indexOf(fileName) >= 0) return;
    let curPath = path + '/' + fileName;
    let file = fs.statSync(curPath);
    if (file.isFile()) {
      let data = callback && util.isFunction(callback) && callback(curPath, path, fileName);
      res.push(data || { path: curPath, name: fileName });
    } else if (file.isDirectory()) {
      res = res.concat(walk(curPath, filter, callback));
    }
  });
  return res;
}
