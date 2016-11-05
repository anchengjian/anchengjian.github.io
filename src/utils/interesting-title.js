export default function interestingTitle() {
  let titles = document.title;
  let hidden, visibilityChange;
  ['', 'o', 'ms', 'moz', 'webkit'].forEach(prefix => {
    let supportHidden = prefix + (prefix ? 'Hidden' : 'hidden');
    if (typeof document[supportHidden] === 'undefined') return;
    hidden = supportHidden;
    visibilityChange = prefix + 'visibilitychange';
  });

  if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') return;

  document.addEventListener(visibilityChange, function() {
    document.title = document[hidden] ? '※18♥禁★电影【在线观看】☆' : titles;
  }, false);
}
