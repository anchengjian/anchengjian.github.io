const fs = require('fs');

let fileList = walk('./articles', read);

fileList.sort((a, b) => {
  return b.birthtime - a.birthtime;
});

fs.writeFile('./articles/list.json', JSON.stringify(fileList), (err) => {
  if (err) return console.error(err);
  console.log("list.json 数据写入成功！");
});

function read(curPath, path, item) {
  let data = fs.statSync(curPath);
  return {
    birthtime: data.birthtime,
    name: item,
    path: path + '/'
  };
}

function walk(path, callback) {
  let dirList = fs.readdirSync(path);
  let res = [];
  dirList.forEach((item) => {
    if (item === '.DS_Store' || item === 'list.json') return;
    let curPath = path + '/' + item;
    let file = fs.statSync(curPath);
    if (file.isFile()) {
      res.push(callback(curPath, path, item));
    } else if (file.isDirectory()) {
      res = res.concat(walk(curPath, callback));
    }
  });
  return res;
}
