const fs = require('fs');
const walk = require('./walk.js');
const fileFilter = ['.DS_Store', 'list.json'];

console.time('Promise + Sync');
let fileList = walk('./articles', fileFilter).map((file) => {
  let data = fs.statSync(file.path);
  let content = fs.readFileSync(file.path, 'utf-8').toString().substr(0, 128) + '...';
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
