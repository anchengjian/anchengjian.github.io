// import { Notification } from 'element-ui'
import { serverHost, xhrConfig } from 'config/app'

export default function xhr(path, options, otherOption = {}) {
  let config = Object.assign({}, xhrConfig, options)

  // format url
  let requestUrl = (serverHost || window.location.origin) + formatUri(path, config)

  return window.fetch(requestUrl, config)
    .then(resp => {
      if (!resp.ok) return tipsHandle(resp)
      if (resp.headers.get('content-type').indexOf('json') >= 0) return resp.json()
      return resp.text()
    })
    .catch(tipsHandle)
    .then(json => {
      if (json && json.hasOwnProperty('success') && !json.success) return tipsHandle(json)
      return json
    })

  function tipsHandle(err, message, type = 'error') {
    if (otherOption.noAlert) return Promise.reject(err)

    if (typeof err.data === 'string') message = err.data
    else message = err && (err.message === 'Failed to fetch' ? null : err.message)

    message = (message && message.trim()) || '加载异常,请稍后重试'

    // Notification({ type, message })
    return Promise.reject(err)
  }
}

function formatUri(uri, config) {
  let str = (uri + ' ').replace(/:(.*?)(\/|\?| )/g, function(a, b, c) {
    let tmp = config.body[b]

    // It's a trick
    delete config.body[b]
    if (c === '?') return !tmp && tmp !== 0 ? '' : tmp
    return tmp + c
  }).trim()

  if (!config.body) return str

  if (config.method.toUpperCase() === 'GET') {
    let paramBody = param(config.body)
    if (paramBody) return str + (str.indexOf('?') >= 0 ? '&' : '?') + paramBody
  } else if (config.body) {
    config.body = config.headers['Content-Type'].toUpperCase().indexOf('JSON') >= 0 ? JSON.stringify(config.body) : param(config.body)
  }

  return str
}

function param(obj) {
  let name, value, fullSubName, subName, innerObj, i
  let query = ''

  if (!obj) return query

  for (name in obj) {
    value = obj[name]
    if (value instanceof Array) {
      for (i = 0; i < value.length; ++i) run(i, value[i])
    } else if (value instanceof Object) {
      for (subName in value) run(subName, value[subName])
    } else if (value !== undefined && value !== null) {
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&'
    }
  }

  return query.length ? query.substr(0, query.length - 1) : query

  function run(key, val) {
    fullSubName = name + '[' + key + ']'
    innerObj = {}
    innerObj[fullSubName] = val
    query += param(innerObj) + '&'
  }
}
