const fs = require('fs');
const walk = require('../libs/walk.js');
const config = require('./blog.config.js');

let rootPath = config.rootPath || './posts';
let listPath = config.listPath || './posts/list.json';

const fileFilter = ['.DS_Store', 'list.json', 'assets'];
const summaryLen = 128;

console.time('Promise + Async');
let fileList = walk(rootPath, fileFilter).map((file) => {
  let summaryFn = new Promise(function (resolve, reject) {
    fs.readFile(file.path, 'utf-8', (err, content) => {
      if (err) return reject(error);
      resolve(content);
    });
  });
  let statFn = new Promise(function (resolve, reject) {
    fs.stat(file.path, (err, stats) => {
      if (err) return reject(error);
      resolve(stats);
    });
  });
  return Promise
    .all([summaryFn, statFn])
    .then((arr) => {
      return {
        birthtime: arr[1].birthtime,
        name: file.name,
        path: file.path,
        summary: arr[0].substr(0, summaryLen) + '...'
      };
    });
});

Promise.all(fileList)
  .then((posts) => {
    return posts.sort((a, b) => {
      return b.birthtime - a.birthtime;
    });
  })
  .then((json) => {
    fs.writeFile(listPath, JSON.stringify(json), (err) => {
      if (err) return console.error(err);
      console.log("list.json 数据写入成功！");
      console.timeEnd('Promise + Async');
    });
  })
  .catch((err) => {
    console.error(err);
  });
