import { compact, ago, dateLabel, isoDuration } from "./format";

/**
 * Every number and every piece of borrowed copy on the page, fetched at request
 * time.
 *
 * This used to be three scripts writing JSON into the repo before a build. It
 * is plain `fetch` now, cached by Next for fifteen minutes, which means adding
 * a Ghost key or publishing a #now post changes the live page without anybody
 * running anything.
 *
 * Every source fails alone. `settle` swallows one API's outage and returns
 * null, so a GitHub rate-limit cannot take the Ghost section down with it, and
 * a page with three empty sections still renders. Nothing is invented to fill
 * a gap — a section with no data says so.
 */

const REVALIDATE = 900; // 15 minutes
const GITHUB_USER = "imswarnil";

const env = (k: string) => process.env[k]?.trim() || "";
const ghostUrl = () => (env("GHOST_URL") || "https://www.imswarnil.com").replace(/\/$/, "");

async function getJSON<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
	const r = await fetch(url, {
		headers: { "User-Agent": "links.imswarnil.com", ...headers },
		next: { revalidate: REVALIDATE },
	});
	if (!r.ok) throw new Error(`${r.status} ${url.replace(/key=[^&]+/, "key=…")}`);
	return r.json() as Promise<T>;
}

async function settle<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
	try {
		return await fn();
	} catch (e) {
		console.warn(`[links] ${label}: ${(e as Error).message}`);
		return null;
	}
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Metric { value: number; label: string }
export interface Readme { lead: string; headings: string[] }

export interface Repo {
	name: string; description: string; url: string; homepage: string;
	stars: number; forks: number; language: string; licence: string;
	topics: string[]; archived: boolean;
	pushedAt: string; pushedAgo: string; created: string;
	readme: Readme;
}

export interface GitHubData {
	user: { login: string; name: string; bio: string; avatar: string; url: string; followers: number };
	stats: { repos: Metric; stars: Metric; followers: Metric };
	repos: Repo[];
}

export interface Post {
	title: string; url: string; slug: string; excerpt: string; html: string;
	image: string | null; tag: string; readingTime: number;
	publishedAt: string; date: string; ago: string;
}

export interface GhostData {
	url: string;
	site: { title: string; description: string; cover: string | null; accent: string; version: string } | null;
	posts: Post[];
	postsTotal: number | null;
	nowUpdates: Post[];
	nowPage: { title: string; url: string; html: string; date: string } | null;
	members: { total: Metric; paid: Metric } | null;
	tiers: { name: string; currency: string; monthly: number | null }[];
	signup: string;
}

export interface Video {
	id: string; title: string; url: string; thumbnail: string;
	ago: string; duration: string; views: Metric;
}

export interface YouTubeData {
	channel: { id: string; title: string; url: string; subscribers: Metric; views: Metric; videos: Metric } | null;
	videos: Video[];
}

export interface PageData {
	github: GitHubData | null;
	ghost: GhostData | null;
	youtube: YouTubeData | null;
	fetchedAt: string;
}

const metric = (n: number | string | undefined | null): Metric => ({
	value: Number(n) || 0,
	label: compact(n),
});

// ── GitHub ───────────────────────────────────────────────────────────────────

const SKIP_HEADINGS =
	/^(licen[cs]e|contributing|code of conduct|changelog|acknowledge?ments|credits|contents|table of contents)\b/i;

/**
 * What a README actually tells a reader, minus the furniture.
 *
 * Markdown hard-wraps, so a paragraph is a RUN of lines and not one line.
 * Nesting is deliberately not tracked: counting <div> against </div> breaks on
 * the void tags inside the centred header most of these READMEs open with, and
 * once the count never returns to zero the whole file is skipped. Skipping any
 * line that STARTS with < is cruder and correct — a prose sentence never does.
 */
export function readReadme(md: string): Readme {
	const clean = (s: string) =>
		s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
			.replace(/<[^>]*>/g, "")
			.replace(/[*_`]/g, "")
			.replace(/\s+/g, " ")
			.trim();

	const headings: string[] = [];
	let lead = "";
	let para: string[] = [];
	let inFence = false;

	const flush = () => {
		if (!lead && para.length) {
			const text = clean(para.join(" "));
			// A real sentence, not a badge row or a bare URL on its own line.
			if (text.length >= 40 && /\s/.test(text)) lead = text;
		}
		para = [];
	};

	for (const raw of md.split("\n")) {
		const line = raw.trim();

		if (/^```/.test(line)) { inFence = !inFence; flush(); continue; }
		if (inFence) continue;

		const h = /^#{2,3}\s+(.+)$/.exec(line);
		if (h) {
			flush();
			// Emoji belong to the README's own voice, not to a row of chips on
			// an almost-monochrome page.
			const text = clean(h[1]).replace(/[\p{Extended_Pictographic}️]/gu, "").replace(/\s*[·—-]\s*$/, "").trim();
			if (text && !SKIP_HEADINGS.test(text) && headings.length < 5) headings.push(text);
			continue;
		}

		if (!line || /^[#<>|]/.test(line) || /^[-*+]\s/.test(line) || /^\d+\.\s/.test(line)
			|| /^!?\[/.test(line) || /^(-{3,}|={3,}|\*{3,})$/.test(line)) { flush(); continue; }

		para.push(line);
	}
	flush();

	return { lead: lead.slice(0, 300), headings };
}

interface GhRepo {
	name: string; description: string | null; html_url: string; homepage: string | null;
	stargazers_count: number; forks_count: number; language: string | null;
	license: { spdx_id: string } | null; topics?: string[]; archived: boolean;
	fork: boolean; pushed_at: string; created_at: string;
}

async function github(): Promise<GitHubData> {
	const token = env("GH_TOKEN") || env("GITHUB_TOKEN");
	const auth: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

	const [user, raw] = await Promise.all([
		getJSON<{ login: string; name: string; bio: string; avatar_url: string; html_url: string; followers: number }>(
			`https://api.github.com/users/${GITHUB_USER}`, auth),
		getJSON<GhRepo[]>(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, auth),
	]);

	const repos: Repo[] = raw
		.filter((r) => !r.fork)
		.map((r) => ({
			name: r.name,
			description: r.description ?? "",
			url: r.html_url,
			homepage: r.homepage ?? "",
			stars: r.stargazers_count,
			forks: r.forks_count,
			language: r.language ?? "",
			licence: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : "",
			topics: r.topics ?? [],
			archived: r.archived,
			pushedAt: r.pushed_at,
			pushedAgo: ago(r.pushed_at),
			created: dateLabel(r.created_at),
			readme: { lead: "", headings: [] },
		}));

	// READMEs in parallel — one failure never costs the others.
	await Promise.all(
		repos.map(async (r) => {
			try {
				const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${r.name}/readme`, {
					headers: { "User-Agent": "links.imswarnil.com", Accept: "application/vnd.github.raw", ...auth },
					next: { revalidate: REVALIDATE },
				});
				if (res.ok) r.readme = readReadme(await res.text());
			} catch { /* a card without a README lead is still a card */ }
		}),
	);

	return {
		user: {
			login: user.login, name: user.name, bio: user.bio,
			avatar: user.avatar_url, url: user.html_url, followers: user.followers,
		},
		stats: {
			repos: metric(repos.length),
			stars: metric(repos.reduce((a, r) => a + r.stars, 0)),
			followers: metric(user.followers),
		},
		repos,
	};
}

// ── Ghost ────────────────────────────────────────────────────────────────────

const b64url = (bytes: Uint8Array) => {
	let s = "";
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const b64urlJSON = (o: unknown) => b64url(new TextEncoder().encode(JSON.stringify(o)));

/** Web Crypto rather than node:crypto, so this is identical on Workers and in
 *  `next dev` — the Admin key's secret is hex, hence the pairwise parse. */
async function ghostAdminJWT(key: string): Promise<string> {
	const [id, secret] = key.split(":");
	const bytes = new Uint8Array((secret.match(/.{1,2}/g) ?? []).map((h) => parseInt(h, 16)));
	const iat = Math.floor(Date.now() / 1000);
	const head = b64urlJSON({ alg: "HS256", typ: "JWT", kid: id });
	const body = b64urlJSON({ iat, exp: iat + 300, aud: "/admin/" });

	const cryptoKey = await crypto.subtle.importKey(
		"raw", bytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(`${head}.${body}`));
	return `${head}.${body}.${b64url(new Uint8Array(sig))}`;
}

interface GhostPost {
	title: string; url: string; slug: string; custom_excerpt: string | null; excerpt: string | null;
	html: string | null; feature_image: string | null; primary_tag: { name: string } | null;
	reading_time: number; published_at: string;
}

const asPost = (p: GhostPost): Post => ({
	title: p.title,
	url: p.url,
	slug: p.slug,
	excerpt: (p.custom_excerpt || p.excerpt || "").replace(/\s+/g, " ").trim(),
	html: p.html ?? "",
	image: p.feature_image,
	tag: p.primary_tag?.name ?? "",
	readingTime: p.reading_time,
	publishedAt: p.published_at,
	date: dateLabel(p.published_at),
	ago: ago(p.published_at),
});

async function ghost(): Promise<GhostData> {
	const base = ghostUrl();
	const out: GhostData = {
		url: base, site: null, posts: [], postsTotal: null, nowUpdates: [],
		nowPage: null, members: null, tiers: [], signup: `${base}/#/portal/signup`,
	};

	// Public, no key needed: title, description, cover, accent.
	const pub = await settle("ghost site", () =>
		getJSON<{ site: { title: string; description: string; cover_image: string | null; accent_color: string; version: string } }>(
			`${base}/members/api/site/`));
	if (pub?.site) {
		out.site = {
			title: pub.site.title, description: pub.site.description,
			cover: pub.site.cover_image, accent: pub.site.accent_color, version: pub.site.version,
		};
	}

	const ckey = env("GHOST_CONTENT_KEY");
	if (ckey) {
		const api = <T>(path: string, q = "") =>
			getJSON<T>(`${base}/ghost/api/content/${path}/?key=${ckey}${q}`, { "Accept-Version": "v6.0" });

		const [posts, updates, nowPage, tiers] = await Promise.all([
			settle("ghost posts", () =>
				api<{ posts: GhostPost[]; meta: { pagination: { total: number } } }>(
					"posts", "&limit=6&include=tags&filter=visibility:public")),
			// A #now internal tag on short update posts, so "what I'm doing now"
			// changes without touching this repo.
			settle("ghost #now", () =>
				api<{ posts: GhostPost[] }>("posts", "&limit=4&filter=tag:hash-now&formats=html")),
			settle("ghost /now/", () =>
				api<{ pages: (GhostPost & { updated_at: string })[] }>("pages/slug/now", "&formats=html")),
			settle("ghost tiers", () =>
				api<{ tiers: { name: string; visibility: string; currency: string | null; monthly_price: number | null }[] }>(
					"tiers", "&include=monthly_price&limit=all")),
		]);

		if (posts?.posts) {
			out.posts = posts.posts.map(asPost);
			out.postsTotal = posts.meta?.pagination?.total ?? null;
		}
		if (updates?.posts) out.nowUpdates = updates.posts.map(asPost);
		if (nowPage?.pages?.[0]) {
			const p = nowPage.pages[0];
			out.nowPage = { title: p.title, url: p.url, html: p.html ?? "", date: dateLabel(p.updated_at) };
		}
		if (tiers?.tiers) {
			out.tiers = tiers.tiers
				.filter((t) => t.visibility === "public")
				.map((t) => ({
					name: t.name,
					currency: t.currency ?? "",
					monthly: t.monthly_price ? t.monthly_price / 100 : null,
				}));
		}
	}

	const akey = env("GHOST_ADMIN_KEY");
	if (akey) {
		const members = await settle("ghost members", async () => {
			const jwt = await ghostAdminJWT(akey);
			const admin = (q: string) =>
				getJSON<{ meta: { pagination: { total: number } } }>(
					`${base}/ghost/api/admin/members/?${q}`,
					{ Authorization: `Ghost ${jwt}`, "Accept-Version": "v6.0" });
			const [all, paid] = await Promise.all([
				admin("limit=1&fields=id"),
				admin("limit=1&fields=id&filter=status:paid"),
			]);
			return { total: all.meta.pagination.total, paid: paid.meta.pagination.total };
		});
		if (members) out.members = { total: metric(members.total), paid: metric(members.paid) };
	}

	return out;
}

// ── YouTube ──────────────────────────────────────────────────────────────────

async function youtube(): Promise<YouTubeData> {
	const key = env("YOUTUBE_API_KEY");
	const channel = env("YOUTUBE_CHANNEL");
	if (!key || !channel) return { channel: null, videos: [] };

	const api = <T>(path: string, q: string) =>
		getJSON<T>(`https://www.googleapis.com/youtube/v3/${path}?${q}&key=${key}`);

	const sel = channel.startsWith("@") ? `forHandle=${encodeURIComponent(channel)}` : `id=${channel}`;
	const ch = (await api<{ items: any[] }>("channels", `part=snippet,statistics,contentDetails&${sel}`)).items?.[0];
	if (!ch) throw new Error(`channel not found: ${channel}`);

	const uploads = ch.contentDetails?.relatedPlaylists?.uploads;
	let videos: Video[] = [];
	if (uploads) {
		const items = (await api<{ items: any[] }>("playlistItems", `part=snippet,contentDetails&maxResults=6&playlistId=${uploads}`)).items ?? [];
		const ids = items.map((i) => i.contentDetails.videoId).join(",");
		const details = ids
			? (await api<{ items: any[] }>("videos", `part=contentDetails,statistics&id=${ids}`)).items ?? []
			: [];
		const byId = Object.fromEntries(details.map((d) => [d.id, d]));

		videos = items.map((i) => {
			const id = i.contentDetails.videoId;
			const d = byId[id] ?? {};
			const t = i.snippet.thumbnails ?? {};
			return {
				id,
				title: i.snippet.title,
				url: `https://www.youtube.com/watch?v=${id}`,
				thumbnail: (t.maxres || t.standard || t.high || t.medium || {}).url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
				ago: ago(i.snippet.publishedAt),
				duration: isoDuration(d.contentDetails?.duration),
				views: metric(d.statistics?.viewCount),
			};
		});
	}

	return {
		channel: {
			id: ch.id,
			title: ch.snippet.title,
			url: `https://www.youtube.com/${ch.snippet.customUrl || `channel/${ch.id}`}`,
			subscribers: metric(ch.statistics.subscriberCount),
			views: metric(ch.statistics.viewCount),
			videos: metric(ch.statistics.videoCount),
		},
		videos,
	};
}

// ── The page's one data call ─────────────────────────────────────────────────

export async function getPageData(): Promise<PageData> {
	const [gh, gp, yt] = await Promise.all([
		settle("github", github),
		settle("ghost", ghost),
		settle("youtube", youtube),
	]);
	return { github: gh, ghost: gp, youtube: yt, fetchedAt: new Date().toISOString() };
}
