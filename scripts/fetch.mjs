/*
 * Pulls every live number and every piece of real copy the page shows into
 * _data/live/*.json.
 *
 * Runs in the deploy workflow every six hours, and locally with `npm run fetch`.
 * Nothing here is committed: the JSON is gitignored and rebuilt each run, so
 * the page never shows a number older than the last deploy.
 *
 * Every source degrades on its own. No Ghost key → the public site endpoint
 * still gives title, description and cover. No YouTube channel → the file says
 * so and the section stays off. Nothing is invented to fill a gap.
 *
 *   GH_TOKEN             optional — raises the GitHub rate limit; `gh auth token` is tried
 *   GHOST_URL            optional — defaults to https://www.imswarnil.com
 *   GHOST_CONTENT_KEY    optional — posts, the /now/ page, #now updates, tiers
 *   GHOST_ADMIN_KEY      optional — member counts (id:secret, never shipped to the browser)
 *   YOUTUBE_API_KEY      optional — channel stats and latest uploads
 *   YOUTUBE_CHANNEL      optional — a channel id (UC…) or a handle (@name)
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { createHmac } from 'node:crypto';

try { process.loadEnvFile('.env'); } catch {}

const OUT = new URL('../_data/live/', import.meta.url);
const GITHUB_USER = 'imswarnil';
const GHOST_URL = (process.env.GHOST_URL || 'https://www.imswarnil.com').replace(/\/$/, '');
const now = new Date();

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => {
	n = Number(n) || 0;
	if (n < 1000) return String(n);
	if (n < 1e6) return `${(n / 1e3).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, '')}K`;
	return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
};

const ago = (iso) => {
	if (!iso) return '';
	const s = Math.max(0, (now - new Date(iso)) / 1000);
	if (s < 60) return 'just now';
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
	if (s < 2629800) return `${Math.floor(s / 604800)}w ago`;
	if (s < 31557600) return `${Math.floor(s / 2629800)}mo ago`;
	return `${Math.floor(s / 31557600)}y ago`;
};

const dateLabel = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

async function getJSON(url, headers = {}) {
	const r = await fetch(url, { headers: { 'User-Agent': 'links.imswarnil.com', ...headers } });
	if (!r.ok) throw new Error(`${r.status} ${url.replace(/key=[^&]+/, 'key=…')}`);
	return r.json();
}

async function attempt(label, fn) {
	try {
		const v = await fn();
		console.log(`  ✓ ${label}`);
		return v;
	} catch (e) {
		console.log(`  – ${label}: ${e.message}`);
		return null;
	}
}

// ── GitHub ───────────────────────────────────────────────────────────────────

function githubToken() {
	if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
	if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
	try { return execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; }
}

/* What a README actually tells a reader, minus the furniture. The lead is the
   first real sentence — badge rows, HTML wrappers and the title are skipped —
   and the headings are the table of contents a person would skim. Both feed the
   card's overview sheet, so the page describes each project in its own words
   rather than in words invented here. */
const SKIP_HEADINGS = /^(licen[cs]e|contributing|code of conduct|changelog|acknowledge?ments|credits|contents|table of contents)\b/i;

/* Markdown hard-wraps, so a paragraph is a RUN of lines, not one line — an
   earlier version took the first line and produced "The theme behind Namaste
   Salesforce: a". Lines are collected until a blank one, then joined.
   Nesting is deliberately not tracked: counting <div> against </div> breaks on
   the void tags (<img>, <br>) inside the centred header most of these READMEs
   open with, and once the count never returns to zero the whole file is
   skipped. Skipping any line that STARTS with < is cruder and correct, because
   a prose sentence never does. */
function readReadme(md) {
	const clean = (s) => s
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // links → their text
		.replace(/<[^>]*>/g, '')                    // stray inline tags
		.replace(/[*_`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	const lines = md.split('\n');
	const headings = [];
	let lead = '';
	let para = [];
	let inFence = false;

	const flush = () => {
		if (!lead && para.length) {
			const text = clean(para.join(' '));
			// A real sentence, not a badge row or a bare URL on its own line.
			if (text.length >= 40 && /\s/.test(text)) lead = text;
		}
		para = [];
	};

	for (const raw of lines) {
		const line = raw.trim();

		if (/^```/.test(line)) { inFence = !inFence; flush(); continue; }
		if (inFence) continue;

		const h = /^#{2,3}\s+(.+)$/.exec(line);
		if (h) {
			flush();
			const text = clean(h[1]).replace(/\s*[·—-]\s*$/, '');
			if (text && !SKIP_HEADINGS.test(text) && headings.length < 5) headings.push(text);
			continue;
		}

		// Anything that is not a plain prose line ends the paragraph.
		if (!line || /^[#<>|]/.test(line) || /^[-*+]\s/.test(line) || /^\d+\.\s/.test(line)
			|| /^!?\[/.test(line) || /^(-{3,}|={3,}|\*{3,})$/.test(line)) { flush(); continue; }

		para.push(line);
	}
	flush();

	return { lead: lead.slice(0, 300), headings };
}

async function github() {
	const token = githubToken();
	const h = token ? { Authorization: `Bearer ${token}` } : {};
	const user = await getJSON(`https://api.github.com/users/${GITHUB_USER}`, h);
	const raw = await getJSON(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, h);

	const repos = raw
		.filter((r) => !r.fork)
		.map((r) => ({
			name: r.name,
			description: r.description || '',
			url: r.html_url,
			homepage: r.homepage || '',
			stars: r.stargazers_count,
			forks: r.forks_count,
			issues: r.open_issues_count,
			language: r.language || '',
			licence: r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : '',
			topics: r.topics || [],
			archived: r.archived,
			size_kb: r.size,
			pushed_at: r.pushed_at,
			pushed_ago: ago(r.pushed_at),
			created_at: r.created_at,
			created: dateLabel(r.created_at),
			readme: { lead: '', headings: [] },
		}));

	// READMEs, in parallel — one failure never costs the others.
	await Promise.all(repos.map(async (r) => {
		try {
			const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${r.name}/readme`, {
				headers: { 'User-Agent': 'links.imswarnil.com', Accept: 'application/vnd.github.raw', ...h },
			});
			if (res.ok) r.readme = readReadme(await res.text());
		} catch {}
	}));

	const stars = repos.reduce((a, r) => a + r.stars, 0);

	return {
		fetched_at: now.toISOString(),
		user: {
			login: user.login, name: user.name, bio: user.bio, avatar: user.avatar_url,
			url: user.html_url, followers: user.followers, following: user.following,
			public_repos: user.public_repos,
		},
		stats: {
			repos: { value: repos.length, label: fmt(repos.length) },
			stars: { value: stars, label: fmt(stars) },
			followers: { value: user.followers, label: fmt(user.followers) },
		},
		languages: [...new Set(repos.map((r) => r.language).filter(Boolean))],
		repos,
	};
}

// ── Ghost ────────────────────────────────────────────────────────────────────

function ghostAdminJWT(key) {
	const [id, secret] = key.split(':');
	const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
	const iat = Math.floor(Date.now() / 1000);
	const head = b64({ alg: 'HS256', typ: 'JWT', kid: id });
	const body = b64({ iat, exp: iat + 300, aud: '/admin/' });
	const sig = createHmac('sha256', Buffer.from(secret, 'hex')).update(`${head}.${body}`).digest('base64url');
	return `${head}.${body}.${sig}`;
}

const asPost = (p) => ({
	title: p.title, url: p.url, slug: p.slug,
	excerpt: (p.custom_excerpt || p.excerpt || '').replace(/\s+/g, ' ').trim(),
	html: p.html || '',
	image: p.feature_image,
	tag: p.primary_tag?.name || '',
	reading_time: p.reading_time,
	published_at: p.published_at,
	date: dateLabel(p.published_at),
	ago: ago(p.published_at),
});

async function ghost() {
	const out = {
		fetched_at: now.toISOString(), url: GHOST_URL, site: null, posts: [],
		posts_total: null, now: null, now_updates: [], members: null, tiers: [], signup: `${GHOST_URL}/#/portal/signup`,
	};

	// Public, no key: title, description, cover, accent.
	const pub = await attempt('ghost · site', () => getJSON(`${GHOST_URL}/members/api/site/`));
	if (pub?.site) {
		const s = pub.site;
		out.site = { title: s.title, description: s.description, cover: s.cover_image, logo: s.logo, icon: s.icon, accent: s.accent_color, version: s.version };
	}

	const ckey = process.env.GHOST_CONTENT_KEY;
	if (ckey) {
		const api = (path, q = '') => getJSON(`${GHOST_URL}/ghost/api/content/${path}/?key=${ckey}${q}`, { 'Accept-Version': 'v6.0' });

		const settings = await attempt('ghost · settings', () => api('settings'));
		if (settings?.settings) {
			const s = settings.settings;
			out.site = { ...(out.site || {}), title: s.title, description: s.description, cover: s.cover_image, logo: s.logo, icon: s.icon, accent: s.accent_color, navigation: s.navigation };
		}

		const posts = await attempt('ghost · posts', () => api('posts', '&limit=6&include=tags&filter=visibility:public'));
		if (posts?.posts) {
			out.posts_total = posts.meta?.pagination?.total ?? null;
			out.posts = posts.posts.map(asPost);
		}

		/* The "now" line comes from Ghost so it can be changed without a deploy:
		   an internal #now tag on short update posts, and/or a /now/ page. */
		const updates = await attempt('ghost · #now updates', () => api('posts', '&limit=4&filter=tag:hash-now&formats=html'));
		if (updates?.posts) out.now_updates = updates.posts.map(asPost);

		const nowPage = await attempt('ghost · /now/ page', () => api('pages/slug/now', '&formats=html'));
		if (nowPage?.pages?.[0]) {
			const p = nowPage.pages[0];
			out.now = { title: p.title, url: p.url, html: p.html, excerpt: p.custom_excerpt || p.excerpt || '', updated_at: p.updated_at, updated_ago: ago(p.updated_at), date: dateLabel(p.updated_at) };
		}

		const tiers = await attempt('ghost · tiers', () => api('tiers', '&include=monthly_price,yearly_price&limit=all'));
		if (tiers?.tiers) {
			out.tiers = tiers.tiers.filter((t) => t.visibility === 'public').map((t) => ({
				name: t.name, description: t.description, type: t.type,
				currency: t.currency || '',
				monthly: t.monthly_price ? t.monthly_price / 100 : null,
				yearly: t.yearly_price ? t.yearly_price / 100 : null,
				benefits: t.benefits || [],
			}));
		}
	} else {
		console.log('  – ghost · posts, #now, tiers: set GHOST_CONTENT_KEY');
	}

	const akey = process.env.GHOST_ADMIN_KEY;
	if (akey) {
		const admin = (q) => getJSON(`${GHOST_URL}/ghost/api/admin/members/?${q}`, { Authorization: `Ghost ${ghostAdminJWT(akey)}`, 'Accept-Version': 'v6.0' });
		const all = await attempt('ghost · members', () => admin('limit=1&fields=id'));
		const paid = all ? await attempt('ghost · paid members', () => admin('limit=1&fields=id&filter=status:paid')) : null;
		if (all) {
			const total = all.meta?.pagination?.total ?? 0;
			const paidN = paid?.meta?.pagination?.total ?? 0;
			out.members = { total: { value: total, label: fmt(total) }, paid: { value: paidN, label: fmt(paidN) }, free: { value: total - paidN, label: fmt(total - paidN) } };
		}
	} else {
		console.log('  – ghost · members: set GHOST_ADMIN_KEY');
	}

	return out;
}

// ── YouTube ──────────────────────────────────────────────────────────────────

const isoDuration = (d) => {
	const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '') || [];
	const [h, mi, s] = [m[1], m[2], m[3]].map((x) => Number(x) || 0);
	const mm = h ? String(mi).padStart(2, '0') : String(mi);
	return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
};

async function youtube() {
	const key = process.env.YOUTUBE_API_KEY;
	const channel = process.env.YOUTUBE_CHANNEL;
	if (!key || !channel) {
		console.log('  – youtube: set YOUTUBE_API_KEY and YOUTUBE_CHANNEL (a UC… id or an @handle)');
		return { fetched_at: now.toISOString(), configured: false, channel: null, videos: [] };
	}
	const api = (path, q) => getJSON(`https://www.googleapis.com/youtube/v3/${path}?${q}&key=${key}`);
	const sel = channel.startsWith('@') ? `forHandle=${encodeURIComponent(channel)}` : `id=${channel}`;
	const ch = (await api('channels', `part=snippet,statistics,contentDetails&${sel}`)).items?.[0];
	if (!ch) throw new Error(`channel not found: ${channel}`);

	const st = ch.statistics;
	const uploads = ch.contentDetails?.relatedPlaylists?.uploads;
	let videos = [];
	if (uploads) {
		const items = (await api('playlistItems', `part=snippet,contentDetails&maxResults=6&playlistId=${uploads}`)).items || [];
		const ids = items.map((i) => i.contentDetails.videoId).join(',');
		const details = ids ? (await api('videos', `part=contentDetails,statistics&id=${ids}`)).items || [] : [];
		const byId = Object.fromEntries(details.map((d) => [d.id, d]));
		videos = items.map((i) => {
			const id = i.contentDetails.videoId;
			const d = byId[id] || {};
			const t = i.snippet.thumbnails || {};
			return {
				id, title: i.snippet.title, url: `https://www.youtube.com/watch?v=${id}`,
				thumbnail: (t.maxres || t.standard || t.high || t.medium || {}).url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
				published_at: i.snippet.publishedAt, ago: ago(i.snippet.publishedAt),
				duration: isoDuration(d.contentDetails?.duration),
				views: { value: Number(d.statistics?.viewCount || 0), label: fmt(d.statistics?.viewCount) },
			};
		});
	}

	return {
		fetched_at: now.toISOString(), configured: true,
		channel: {
			id: ch.id, title: ch.snippet.title, handle: ch.snippet.customUrl || '',
			url: `https://www.youtube.com/${ch.snippet.customUrl || `channel/${ch.id}`}`,
			thumbnail: ch.snippet.thumbnails?.medium?.url || '',
			subscribers: { value: Number(st.subscriberCount || 0), label: fmt(st.subscriberCount) },
			views: { value: Number(st.viewCount || 0), label: fmt(st.viewCount) },
			videos: { value: Number(st.videoCount || 0), label: fmt(st.videoCount) },
		},
		videos,
	};
}

// ── run ──────────────────────────────────────────────────────────────────────

await mkdir(OUT, { recursive: true });
console.log('_data/live');

for (const [name, fn] of [['github', github], ['ghost', ghost], ['youtube', youtube]]) {
	const data = await attempt(name, fn);
	if (data) await writeFile(new URL(`${name}.json`, OUT), JSON.stringify(data, null, '\t'));
}
