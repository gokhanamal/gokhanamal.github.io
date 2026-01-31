(function () {
  function getPreferred() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    return null; // follow system
  }

  function getSystem() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function apply(theme) {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    var effective = theme || getSystem();
    var icon = document.querySelector('#theme-toggle .theme-toggle-icon');
    if (icon) icon.textContent = effective === 'dark' ? '🌙' : '☀️';
  }

  function toggle() {
    var current = getPreferred();
    var effective = current || getSystem();
    var next = effective === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply(next);
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(getPreferred());
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  });
})();
