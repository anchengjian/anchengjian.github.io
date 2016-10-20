const fs = require('fs');
const path = require('path');
const util = require('util');

const config = require('./blog.config.js');
let rootPath = config.rootPath || './posts';
let listPath = config.listPath || './posts/list.json';

const fileFilter = ['.DS_Store', 'list.json', 'assets'];
const summaryLen = 128;

let originMap = {};
require(path.resolve(listPath)).forEach((item) => originMap[item.path] = item);

console.time('Sync');
let fileList = walk(rootPath, fileFilter, formatFile)
  .map((item) => {
    let old = originMap[item.path];
    if (old) item.birthtime = old.birthtime;
    return item;
  })
  .sort((a, b) => {
    return new Date(b.birthtime) - new Date(a.birthtime);
  });

// save list.json
fs.writeFile(listPath, JSON.stringify(fileList), (err) => {
  if (err) return console.error(err);
  console.log("list.json 数据写入成功！");
  console.timeEnd('Sync');
});

/**
 * 整理文章的数据
 * @method   formatFile
 * @author   anchengjian
 * @dateTime 2016-10-15T17:29:56+0800
 * @param    {[type]}                 curPath [description]
 * @param    {[type]}                 path    [description]
 * @param    {[type]}                 name    [description]
 * @return   {[type]}                         [description]
 */
function formatFile(curPath, filePath, fileName) {
  let data = fs.statSync(curPath);
  let content = fs.readFileSync(curPath, 'utf-8').toString().substr(0, summaryLen) + '...';
  return {
    birthtime: data.mtime,
    name: path.parse(fileName).name,
    path: curPath,
    summary: content
  };
}

/**
 * walk 遍历目录所有文件
 * @author anchengjian@gmail.com
 * @param {String} filePath 开始遍历的目录
 * @param {Array} filter 遍历过程中忽略的文件、文件夹
 * @param {Function} callback 自定义遍历过程中针对某一个具体文件的辅助方法
 * @returns {Array}
 */

function walk(filePath, filter, callback) {
  let dirList = fs.readdirSync(filePath);
  let res = [];
  dirList.forEach((fileName) => {
    if (filter && util.isArray(filter) && filter.indexOf(fileName) >= 0) return;
    let curPath = filePath + (filePath.substr(-1) === '/' ? '' : '/') + fileName;
    let file = fs.statSync(curPath);
    if (file.isFile()) {
      let data = callback && util.isFunction(callback) && callback(curPath, filePath, fileName);
      res.push(data || { path: curPath, name: fileName });
    } else if (file.isDirectory()) {
      res = res.concat(walk(curPath, filter, callback));
    }
  });
  return res;
}
