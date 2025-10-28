---
layout: default
title: Search
permalink: /search/
---

<main class="main">
  <section class="section" aria-label="Site Search">
    <header style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem">
      <h1 style="margin:0;line-height:1.2"><i class="ph ph-magnifying-glass"></i> Search</h1>
      <p class="small" style="margin-left:auto">
        <kbd>↑/↓</kbd> navigate • <kbd>Enter</kbd> open • <kbd>Esc</kbd> clear
      </p>
    </header>
    <div class="form form--search" role="search" aria-label="Site search">
      <form id="search-form" action="." onsubmit="return false;">
        <label class="label visually-hidden" for="search">Search term</label>
        <div style="display:grid;grid-template-columns:auto 1fr auto;gap:.5rem;align-items:center">
          <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
          <input class="input" id="search" type="search" name="search" placeholder="e.g. About us"
                 autocomplete="off" spellcheck="false" autocapitalize="off" />
          <button type="button" class="button-transparent button-sm" id="clear" aria-label="Clear">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <p id="status" class="small" role="status" aria-live="polite" style="min-height:1.2em;margin-top:.5rem"></p>
        <ul class="list list--results" id="list" role="list" style="margin-top:1rem">
          <!-- results go here -->
        </ul>
        <!-- Empty state -->
        <div id="empty" hidden style="margin-top:1rem">
          <div class="section" style="padding:1rem;margin:0">
            <p style="margin:0"><i class="ph ph-binoculars"></i> No results yet. Try a broader term.</p>
          </div>
        </div>
        <!-- Skeleton loader -->
        <div id="skeleton" hidden style="display:grid;gap:.75rem;margin-top:1rem">
          <div style="height:84px;border-radius:12px;opacity:.4" class="section"></div>
          <div style="height:84px;border-radius:12px;opacity:.4" class="section"></div>
          <div style="height:84px;border-radius:12px;opacity:.4" class="section"></div>
        </div>
      </form>
    </div>
  </section>
</main>

<script>
  (function () {
    const endpoint = '{{ "/assets/search.json" | relative_url }}';

    const field   = document.querySelector('#search');
    const list    = document.querySelector('#list');
    const status  = document.querySelector('#status');
    const empty   = document.querySelector('#empty');
    const clearBt = document.querySelector('#clear');
    const skeleton= document.querySelector('#skeleton');

    const pages = [];
    let idxReady = false;
    let results = [];
    let activeIndex = -1;

    // Debounce
    const debounce = (fn, ms = 160) => {
      let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
    };

    // Fetch index
    skeleton.hidden = false;
    fetch(endpoint)
      .then(r => r.json())
      .then(data => { pages.push(...data); idxReady = true; })
      .catch(() => { status.textContent = 'Search index failed to load.'; })
      .finally(() => { skeleton.hidden = true; });

    // Escape HTML helper
    function esc(s = '') {
      return String(s).replace(/[&<>"']/g, m =>
        ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])
      );
    }

    // Highlight helper
    function hi(text, term) {
      if (!term) return esc(text);
      try {
        const rx = new RegExp('(' + term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + ')', 'ig');
        return esc(text).replace(rx, '<mark>$1</mark>');
      } catch { return esc(text); }
    }

    // Find results
    function find(term) {
      if (!term || !idxReady) return [];
      const rx = new RegExp(term, 'i');
      return pages.filter(i => rx.test(i.title) || rx.test(i.content)).slice(0, 50);
    }

    // Render results
    function render(items, term) {
      list.innerHTML = '';
      activeIndex = -1;

      if (!items.length) {
        empty.hidden = field.value.trim() === '' ? true : false;
        status.textContent = field.value.trim() === '' ? '' : 'No results found.';
        return;
      }
      empty.hidden = true;
      status.textContent = `${items.length} result${items.length>1?'s':''}`;

      const frag = document.createDocumentFragment();
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item item--result result';
        li.setAttribute('tabindex', '0'); // keyboard focusable

        const title = hi(item.title || '', term);
        const excerpt = hi(item.excerpt || '', term);
        const date = item.date ? `<div class="small" style="opacity:.75"><i class="ph ph-calendar"></i> ${esc(item.date)}</div>` : '';

        li.innerHTML = `
          <article class="article typeset" style="padding: .875rem 1rem;">
            <h4 style="margin:0 0 .25rem 0"><a href="${esc(item.url)}">${title}</a></h4>
            ${date}
            <p style="margin:.25rem 0 0 0">${excerpt}</p>
          </article>
        `;
        // Keyboard open on Enter
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { li.querySelector('a')?.click(); }
        });
        frag.appendChild(li);
      });
      list.appendChild(frag);
    }

    // Input handler (debounced)
    const onInput = debounce(() => {
      const term = field.value.trim();
      results = term ? find(term) : [];
      render(results, term);
    }, 150);

    field.addEventListener('input', onInput);

    // Prevent form submit on Enter in field
    field.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') event.preventDefault();

      const items = Array.from(list.querySelectorAll('.result'));
      if (!items.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items[activeIndex].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items[activeIndex].focus();
      } else if (event.key === 'Escape') {
        field.value = '';
        list.innerHTML = '';
        status.textContent = '';
        empty.hidden = true;
      }
    });

    // Click to clear
    clearBt.addEventListener('click', () => {
      field.value = '';
      list.innerHTML = '';
      status.textContent = '';
      empty.hidden = true;
      field.focus();
    });
  })();
</script>

<noscript>Please enable JavaScript to use the search form.</noscript>
