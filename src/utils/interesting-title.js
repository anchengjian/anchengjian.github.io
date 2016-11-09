export default function (interestingTitle, interestingFavicon) {
  // origin info
  let originTitle = document.title;
  let originFavicon = getFaviconEle();
  let originFaviconHref = originFavicon.href;

  // interesting info
  interestingTitle = interestingTitle || '※18♥禁★电影【在线观看】☆...';
  interestingFavicon = interestingFavicon || 'http://cl.hotcool.info/favicon.ico';

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
      document.title = interestingTitle;
      originFavicon.href = interestingFavicon;
      timer = setInterval(() => {
        let title = document.title;
        document.title = title.substr(1, title.length - 1) + title[0];
      }, 50);
    } else {
      document.title = originTitle;
      originFavicon.href = originFaviconHref;
      clearInterval(timer);
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
