export default function interestingTitle(title) {
  let originTitle = document.title;
  let interesting = title || '※18♥禁★电影【在线观看】☆...';
  let hidden, visibilityChange;
  ['', 'o', 'ms', 'moz', 'webkit'].forEach(prefix => {
    let supportHidden = prefix + (prefix ? 'Hidden' : 'hidden');
    if (typeof document[supportHidden] === 'undefined') return;
    hidden = supportHidden;
    visibilityChange = prefix + 'visibilitychange';
  });

  if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') return;

  document.addEventListener(visibilityChange, horseRaceLamp, false);

  let timer;
  function horseRaceLamp() {
    if (document[hidden]) {
      document.title = interesting;
      timer = setInterval(() => {
        let title = document.title;
        document.title = title.substr(1, title.length - 1) + title[0];
      }, 50);
    } else {
      document.title = originTitle;
      clearInterval(timer);
    }
  }
}
