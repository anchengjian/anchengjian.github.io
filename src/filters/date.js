export default function(tm, format) {
  let Time = tm ? new Date(tm) : new Date()

  let o = {
    'M+': Time.getMonth() + 1,
    'd+': Time.getDate(),
    'H+': Time.getHours(),
    'm+': Time.getMinutes(),
    's+': Time.getSeconds(),
    'q+': Math.floor((Time.getMonth() + 3) / 3),
    'S': Time.getMilliseconds()
  }

  format = format || 'yyyy-MM-dd HH:mm'

  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (Time.getFullYear() + '').substr(4 - RegExp.$1.length))

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
