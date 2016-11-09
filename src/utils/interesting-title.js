export default function({ title, favicon, noRunTitle, noRunFavicon } = { noRunTitle: false, noRunFavicon: false }) {
  // origin info
  let originTitle = document.title;
  let originFavicon, originFaviconHref;
  if (!noRunFavicon) {
    originFavicon = getFaviconEle();
    originFaviconHref = originFavicon.href;
  }

  // interesting info
  title = title || '※18♥禁★电影【在线观看】☆...';
  favicon = favicon || 'http://cl.hotcool.info/favicon.ico';

  // get prefix support for ...
  let hidden, visibilityChange;
  ['', 'o', 'ms', 'moz', 'webkit'].forEach(prefix => {
    let supportHidden = prefix + (prefix ? 'Hidden' : 'hidden');
    if (typeof document[supportHidden] === 'undefined') return;
    hidden = supportHidden;
    visibilityChange = prefix + 'visibilitychange';
  });

  // not support for return
  if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') return;

  // start interesting
  document.addEventListener(visibilityChange, horseRaceLamp, false);

  let timer;

  function horseRaceLamp() {
    if (document[hidden]) {
      document.title = title;
      if (originFavicon) originFavicon.href = favicon;
      if (!noRunTitle) timer = setInterval(() => {
        let str = document.title;
        document.title = str.substr(1, str.length - 1) + str[0];
      }, 50);
    } else {
      document.title = originTitle;
      if (originFavicon) originFavicon.href = originFaviconHref;
      if (timer || timer === 0) clearInterval(timer);
    }
  }
}

function getFaviconEle(href) {
  let ele = document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[type*=image]');
  if (ele) return ele;
  href = href || '/favicon.ico';
  ele = document.createElement('link');
  ele.setAttribute('rel', 'shortcut icon');
  ele.setAttribute('href', href);
  document.querySelector('head').appendChild(ele);
  return ele;
}
