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
const filterReg = /(^\.)|list\.json$|assets/

// summary content
const summaryLen = 128

// walk 遍历目录所有文件
class Walk extends EventEmitter {
  constructor(filePath = __dirname, filterReg) {
    super()
    this._filterReg = filterReg
    this.stepHandle(filePath)
  }
  stepHandle(filePath) {
    if (!filePath || !util.isString(filePath)) return this.walkComplete()

    fs.readdir(filePath, (err, files) => {
      if (err) return console.error(err, files)
      if (!files || !util.isArray(files) || files.length === 0) return

      files.forEach(fileName => {
        if (this._filterReg.test(fileName)) return

        const curPath = path.resolve(filePath, fileName)
        fs.stat(curPath, (err, stats) => {
          if (err) return console.error(err)

          if (stats.isFile()) {
            this.emit('data', curPath, stats)
            this.walkComplete()
          } else if (stats.isDirectory()) {
            this.stepHandle(curPath)
          }
        })
      })
    })
  }
  walkComplete() {
    clearTimeout(this.isWalkComplete)
    this.isWalkComplete = setTimeout(() => {
      this.emit('end')
    }, 0)
  }
}

// origin data
const originMap = {}

// start
try {
  require(listPath).forEach(item => originMap[item.path] = item)
} catch (e) {}

// console.time('async')
const postsList = []
const countFiles = new Walk(startPath, filterReg)

countFiles.on('data', (curPath, stats) => {
  fs.readFile(curPath, 'utf-8', (err, article) => {
    if (err) throw err

    let res = {
      path: curPath.substr(rootPath.length + 1).replace(/\\/g, '/')
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

    res.summary = article.substr(startPos, summaryLen) + (article.length > summaryLen ? '...' : '')

    postsList.push(res)
  })
})

// walk success
countFiles.on('end', () => {
  const jsonStr = JSON.stringify(postsList.sort((a, b) => {
    return new Date(b.birthtime) - new Date(a.birthtime)
  }))
  // console.timeEnd('async')

  // save list.json
  fs.writeFileSync(listPath, jsonStr)
  console.log('list.json 数据写入成功！\n ', listPath, '\n')
})
