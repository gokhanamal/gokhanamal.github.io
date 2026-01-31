---
layout: page
title: Search
permalink: /search/
---

<input id="q" class="search-input" type="search" placeholder="Search posts…" autocomplete="off" />

<ul id="results" class="search-results"></ul>

<script>
(async function () {
  const input = document.getElementById('q');
  const results = document.getElementById('results');

  const res = await fetch('/search.json', { cache: 'no-store' });
  const posts = await res.json();

  function render(items) {
    results.innerHTML = '';
    for (const p of items.slice(0, 25)) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${p.url}">${p.title}</a><div class="muted">${p.date}${p.excerpt ? ' · ' + p.excerpt : ''}</div>`;
      results.appendChild(li);
    }
  }

  function search(q) {
    const s = q.trim().toLowerCase();
    if (!s) return render(posts);
    const items = posts.filter(p => (
      (p.title && p.title.toLowerCase().includes(s)) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(s))
    ));
    render(items);
  }

  input.addEventListener('input', (e) => search(e.target.value));

  // initial
  render(posts);
})();
</script>
