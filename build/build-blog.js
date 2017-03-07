const fs = require('fs')
const path = require('path')
const util = require('util')
const EventEmitter = require('events')

// common path
const config = require('../config/app.js').appInfo
const rootPath = path.resolve(__dirname, '../')
const startPath = path.resolve(rootPath, config.rootPath || './posts')
const listPath = path.resolve(rootPath, config.listPath || './posts/list.json')

// ignore files
const fileFilter = ['.DS_Store', 'list.json', 'assets']

// summary content
const summaryLen = 128

/**
 * walk 遍历目录所有文件
 * @author anchengjian@gmail.com
 * @param {String} filePath 开始遍历的目录
 * @param {Array} filters 遍历过程中忽略的文件、文件夹
 * @returns {Events}
 */
class Walk extends EventEmitter {
  constructor(filePath = __dirname, filters) {
    super()

    this._filters = filters || []
    this.stepHandle(filePath)
  }
  stepHandle(filePath) {
    if (!filePath || !util.isString(filePath)) return this.emit('end')

    fs.readdir(filePath, (err, files) => {
      if (err) return console.error(err, files)
      if (!files || !util.isArray(files) || files.length === 0) return

      files.forEach(fileName => {
        if (this._filters.indexOf(fileName) >= 0) return

        const curPath = path.resolve(filePath, fileName)
        fs.stat(curPath, (err, stats) => {
          if (err) return console.error(err)
          if (stats.isFile()) this.emit('data', curPath, stats)
          else if (stats.isDirectory()) return this.stepHandle(curPath)
        })
      })
    })
  }
}

// origin data
const originMap = {}

// start
try {
  require(listPath).forEach(item => originMap[item.path] = item)
} catch (e) {}

const postsList = []
const countFiles = new Walk(startPath, fileFilter)

countFiles.on('data', (curPath, stats) => {
  fs.readFile(curPath, 'utf-8', (err, article) => {
    if (err) throw err

    let res = {
      path: curPath.substr(rootPath.length + 1)
    }

    const old = originMap[res.path]
    res.birthtime = old ? old.birthtime : stats.mtime

    let startPos = 0
    const matchTitle = article.match(/\#(.+)/)
    if (matchTitle && matchTitle.length > 1) {
      res.name = matchTitle[1].trim()
      startPos = matchTitle[0].length
    } else {
      res.name = path.parse(res.path).name
    }

    res.summary = article.substr(startPos, summaryLen) + '...'

    postsList.push(res)
  })
})

// countFiles.on('end', err => {
process.on('exit', (code) => {
  let jsonStr = JSON.stringify(postsList.sort((a, b) => {
    return new Date(b.birthtime) - new Date(a.birthtime)
  }))

  // save list.json
  fs.writeFileSync(listPath, jsonStr)
  console.log('list.json 数据写入成功！\n ', listPath, '\n')

})
