const fs = require('fs');

var fileList = [];

function walk(path) {
  var dirList = fs.readdirSync(path);

  dirList.forEach(function (item) {

    if (item === '.DS_Store' || item === 'list.json') return;
    var curPath = path + '/' + item,
      file = fs.statSync(curPath);

    if (file.isFile()) {

      var data = fs.statSync(curPath);
      data.name = item;
      data.path = path + '/';
      delete data.dev;
      delete data.mode;
      delete data.nlink;
      delete data.uid;
      delete data.gid;
      delete data.rdev;
      delete data.blksize;
      delete data.ino;
      delete data.size;
      delete data.blocks;
      fileList.push(data);

    } else if (file.isDirectory()) {
      walk(curPath);
    }

  });
}

walk('./articles');

fileList.sort(function (a, b) {
  return b.birthtime - a.birthtime; });

fs.writeFile('./articles/list.json', JSON.stringify(fileList), function (err) {
  if (err) return console.error(err);
  console.log("list.json 数据写入成功！");
});
