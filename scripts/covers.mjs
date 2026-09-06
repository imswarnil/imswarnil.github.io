/*
 * Decides what each project's cover art should DRAW, and what its overview
 * sheet should SAY — both from the project's own words.
 *
 * This script computes; it never fetches. It reads _data/live/github.json
 * (written by fetch.mjs, including each README's lead line and headings) plus
 * _data/sites.yml, and writes _data/live/detail.json keyed by card slug.
 *
 * The motif matters: a cover that draws a token ladder for a design system and
 * a page skeleton for a theme is telling you what the thing IS before you read
 * the title. A random abstract pattern is decoration, and decoration on twelve
 * cards at once is the clutter it was supposed to prevent.
 *
 * The art itself lives in _includes/cover.html so it paints in the page's own
 * tokens and flips with the theme. This file only chooses which one, so a
 * missing detail.json costs a nuance, never a card.
 *
 *   npm run covers
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const LIVE = new URL('_data/live/', ROOT);

const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function readSites(yaml) {
	const sites = [];
	let cur = null;
	for (const raw of yaml.split('\n')) {
		const line = raw.replace(/\s+#.*$/, '');
		if (/^\s*#/.test(line) || !line.trim()) continue;
		const m = /^\s*(-\s+)?([a-z_]+):\s*(.*)$/.exec(line);
		if (!m) continue;
		if (m[1]) { cur = {}; sites.push(cur); }
		if (cur) cur[m[2]] = m[3].trim();
	}
	return sites;
}

/* Eight motifs. Each is a different answer to "what kind of thing is this",
   ordered most-specific first — the first rule that matches wins, so a design
   system is never mistaken for a generic project because both say "CSS". */
const MOTIFS = [
	['glyphs',     /\bicons?\b|icon set|sprite|glyph/],
	['system',     /design system|token|palette|swatch|style guide/],
	['theme',      /\btheme\b|jekyll|ghost theme|handlebars|template/],
	['curriculum', /curriculum|academy|course|lesson|guide|tutorial|learn|teaching/],
	['broadcast',  /\bblog\b|writing|newsletter|video|creator|personal site|publish/],
	['platform',   /platform|lms|portal|saas|next\.js|supabase|dashboard|app\b/],
	['tool',       /\btool\b|cli|badge|generator|utility|automation|script/],
];

/* An authored `kind` beats any keyword: the hub's blurb mentions courses but
   the hub is a blog, and a Jekyll theme whose README happens to say "tokens"
   is still a theme. Only `project` — the kind that means "something else" — is
   left to the text to classify. */
const BY_KIND = { site: 'broadcast', theme: 'theme', tool: 'tool' };

function motifFor(card, repo) {
	if (BY_KIND[card.kind]) return BY_KIND[card.kind];

	const hay = [
		card.title, card.blurb, card.kind, card.icon,
		repo?.description, repo?.readme?.lead,
		...(repo?.topics || []), ...(repo?.readme?.headings || []),
	].filter(Boolean).join(' ').toLowerCase();

	for (const [motif, re] of MOTIFS) if (re.test(hay)) return motif;
	return 'archive';
}

const github = JSON.parse(await readFile(new URL('github.json', LIVE), 'utf8').catch(() => '{"repos":[]}'));
const sites = readSites(await readFile(new URL('_data/sites.yml', ROOT), 'utf8'));
const byName = Object.fromEntries((github.repos || []).map((r) => [r.name, r]));

const detail = {};
for (const card of sites) {
	if (!card.title) continue;
	const repo = card.repo ? byName[card.repo] : null;
	detail[slugify(card.title)] = {
		motif: motifFor(card, repo),
		/* The card's own blurb is the headline; the README lead is the second
		   voice in the sheet. Repeating one as the other would say nothing twice. */
		lead: repo?.readme?.lead && repo.readme.lead !== card.blurb ? repo.readme.lead : '',
		/* Emoji belong to the README's own voice, not to a row of chips where
		   they land as mismatched colour against an almost-monochrome page. */
		headings: (repo?.readme?.headings || [])
			.map((h) => h.replace(/[\p{Extended_Pictographic}️]/gu, '').trim())
			.filter(Boolean),
		description: repo?.description || '',
	};
}

await mkdir(LIVE, { recursive: true });
await writeFile(new URL('detail.json', LIVE), JSON.stringify(detail, null, '\t'));

const counts = Object.values(detail).reduce((a, d) => ({ ...a, [d.motif]: (a[d.motif] || 0) + 1 }), {});
console.log(`_data/live/detail.json — ${Object.keys(detail).length} cards ·`,
	Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', '));
