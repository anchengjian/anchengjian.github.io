const defaultFavicon = 'data:image/vnd.microsoft.icon;base64,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';

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
  favicon = favicon || defaultFavicon;

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
