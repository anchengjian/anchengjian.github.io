const fs = require('fs');
const util = require('util');

/**
 * walk 遍历目录所有文件
 * @author anchengjian@gmail.com
 * @param {String} path 开始遍历的目录
 * @param {Array} filter 遍历过程中忽略的文件、文件夹
 * @param {Function} callback 自定义遍历过程中针对某一个具体文件的辅助方法
 * @returns {Array}
 */

function walk(path, filter, callback) {
  let dirList = fs.readdirSync(path);
  let res = [];
  dirList.forEach((fileName) => {
    if (filter && util.isArray(filter) && filter.indexOf(fileName) >= 0) return;
    let curPath = path + (path.substr(-1) === '/' ? '' : '/') + fileName;
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
