const fs = require('fs');
const util = require('util');

// walk 方法

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

module.exports = walk;
