export default function (date) {
  var time = new Date(date);
  if (new Date().toDateString() === time.toDateString()) {
    time = format(time, 'hh:mm');
  } else {
    time = format(time, 'yyyy-MM-dd');
  }
  return time || '';
}

// 时间格式化 补丁
// format(date, 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
// format(date, 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
function format(date, fmt) {
  var time;
  if (!date || date === 0) return '';
  if (toString.call(date) === '[object Date]') {
    time = date;
  } else {
    time = new Date(date);
  }
  var o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'h+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    'S': time.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}
