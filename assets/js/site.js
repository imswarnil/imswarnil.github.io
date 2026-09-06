/* Everything the page does after it has already rendered.
 *
 * Nothing here is load-bearing: the boot animation is pure CSS, the cards are
 * real links, the numbers are already printed in the HTML, and every section is
 * visible without a single line of this file running. What follows only makes
 * a working page nicer. */
(function () {
	'use strict';

	var root = document.documentElement;
	var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ── Boot ───────────────────────────────────────────────────────────────
	   The animation ends on its own. This only lets someone cut it short. */
	if (root.hasAttribute('data-boot')) {
		var skip = function () { root.removeAttribute('data-boot'); };
		addEventListener('keydown', skip, { once: true });
		addEventListener('pointerdown', skip, { once: true });
		setTimeout(skip, 2600);
	}

	/* ── Theme ──────────────────────────────────────────────────────────── */
	var themeBtn = document.querySelector('[data-theme-toggle]');
	if (themeBtn) {
		themeBtn.addEventListener('click', function () {
			var dark = root.getAttribute('data-theme') === 'dark'
				|| (!root.hasAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
			var next = dark ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			try { localStorage.setItem('theme', next); } catch (e) {}
		});
	}

	/* ── The topbar takes over when the hero leaves ─────────────────────── */
	var topbar = document.querySelector('.topbar');
	var sentinel = document.querySelector('[data-hero-end]');
	if (topbar && sentinel && 'IntersectionObserver' in window) {
		new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				topbar.toggleAttribute('data-stuck', !en.isIntersecting);
			});
		}, { rootMargin: '-' + topbar.offsetHeight + 'px 0px 0px 0px' }).observe(sentinel);
	}

	/* ── Timecode — the one honest camcorder flourish ───────────────────── */
	var clock = document.querySelector('[data-clock]');
	if (clock) {
		var pad = function (n) { return String(n).padStart(2, '0'); };
		var tick = function () {
			var d = new Date();
			clock.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
		};
		tick();
		setInterval(tick, 1000);
	}

	/* "Updated 3h ago" is computed here, so it stays true however long the page
	   sits open between deploys. */
	document.querySelectorAll('[data-ago]').forEach(function (el) {
		var s = Math.max(0, (Date.now() - new Date(el.getAttribute('data-ago'))) / 1000);
		el.textContent = s < 60 ? 'just now'
			: s < 3600 ? Math.floor(s / 60) + 'm ago'
			: s < 86400 ? Math.floor(s / 3600) + 'h ago'
			: s < 604800 ? Math.floor(s / 86400) + 'd ago'
			: Math.floor(s / 604800) + 'w ago';
	});

	/* ── Reveal on scroll ───────────────────────────────────────────────── */
	var reveals = document.querySelectorAll('[data-reveal]');
	if (!reduced && 'IntersectionObserver' in window) {
		var revealer = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) return;
				en.target.setAttribute('data-in', '');
				revealer.unobserve(en.target);
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
		reveals.forEach(function (el) { revealer.observe(el); });
	} else {
		reveals.forEach(function (el) { el.setAttribute('data-in', ''); });
	}

	/* ── Counters ───────────────────────────────────────────────────────── */
	function fmt(n) {
		n = Number(n) || 0;
		if (n < 1000) return String(n);
		if (n < 1e6) return (n / 1e3).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, '') + 'K';
		return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
	}

	function countUp(el, to) {
		var from = Number(el.getAttribute('data-from') || 0);
		if (reduced || to < 10) { el.textContent = fmt(to); return; }
		var start = performance.now(), dur = 900;
		(function tick(t) {
			var p = Math.min(1, (t - start) / dur);
			el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
			if (p < 1) requestAnimationFrame(tick);
		})(performance.now());
	}

	var counters = document.querySelectorAll('[data-count]');
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) return;
				countUp(en.target, Number(en.target.getAttribute('data-count')));
				io.unobserve(en.target);
			});
		}, { threshold: 0.4 });
		counters.forEach(function (el) { io.observe(el); });
	}

	/* ── The overview sheets ────────────────────────────────────────────────
	   The card stays a real link. A plain left click opens the overview; every
	   other click — middle, cmd, ctrl, shift — is left alone so it does what
	   the browser promised it would. */
	document.querySelectorAll('[data-sheet]').forEach(function (card) {
		card.addEventListener('click', function (e) {
			if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			var sheet = document.getElementById(card.getAttribute('data-sheet'));
			if (!sheet || typeof sheet.showModal !== 'function') return;
			e.preventDefault();
			sheet.showModal();
		});
	});

	document.querySelectorAll('dialog.sheet').forEach(function (sheet) {
		// Clicking the backdrop means clicking the dialog itself — its own
		// content sits in a child, so a hit on <dialog> is a hit on the outside.
		sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
	});

	/* ── Search and filter ──────────────────────────────────────────────── */
	var input = document.querySelector('[data-find-input]');
	var count = document.querySelector('[data-find-count]');
	var note = document.querySelector('[data-find-empty]');
	var filters = document.querySelectorAll('[data-filter]');
	var items = document.querySelectorAll('[data-find]');

	if (input && items.length) {
		var kind = 'all';

		var apply = function () {
			var q = input.value.trim().toLowerCase();
			var shown = 0;
			items.forEach(function (el) {
				var matchesText = !q || el.getAttribute('data-find').indexOf(q) !== -1;
				var elKind = el.getAttribute('data-kind');
				// Repo rows carry no kind, so they answer to the search only.
				var matchesKind = kind === 'all' || elKind === kind || !elKind;
				var on = matchesText && matchesKind;
				el.hidden = !on;
				if (on && elKind) shown += 1;
			});
			if (count) count.textContent = shown;
			if (note) note.hidden = shown > 0;
		};

		input.addEventListener('input', apply);
		input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; apply(); } });

		filters.forEach(function (btn) {
			btn.addEventListener('click', function () {
				kind = btn.getAttribute('data-filter');
				filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
				apply();
			});
		});

		// "/" focuses the search, the way every list of things should.
		addEventListener('keydown', function (e) {
			if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
			var t = e.target;
			if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
			e.preventDefault();
			input.focus();
			input.select();
		});
	}

	/* ── Live subscriber count ──────────────────────────────────────────────
	   Only when a referrer-restricted public key is configured; otherwise the
	   number stays the one fetched at the last deploy, which is still true. */
	var key = document.body.getAttribute('data-yt-key');
	var channel = document.body.getAttribute('data-yt-channel');
	var subs = document.querySelector('[data-live="yt-subs"]');
	if (key && channel && subs) {
		var refresh = function () {
			fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + channel + '&key=' + key)
				.then(function (r) { return r.ok ? r.json() : null; })
				.then(function (j) {
					var n = j && j.items && j.items[0] && Number(j.items[0].statistics.subscriberCount);
					if (!n) return;
					var cur = Number(subs.getAttribute('data-count')) || 0;
					if (n === cur) return;
					subs.setAttribute('data-from', cur);
					subs.setAttribute('data-count', n);
					countUp(subs, n);
					var stat = subs.closest('.stat');
					if (stat) stat.setAttribute('data-live-on', '');
				})
				.catch(function () {});
		};
		refresh();
		setInterval(refresh, 60000);
	}
})();
