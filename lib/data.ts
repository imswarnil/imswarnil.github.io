import { compact, ago, dateLabel, isoDuration } from "./format";

/**
 * Every number and every piece of borrowed copy on the page, fetched at request
 * time and cached for fifteen minutes. There is no build step and nothing to
 * run: adding a key changes the live page on the next view.
 *
 * Every source fails alone. `settle` swallows one API's outage and returns
 * null, so a GitHub rate-limit cannot take the Ghost section down with it.
 * Nothing is invented to fill a gap — a card with no data says which secret
 * would give it some.
 */

const REVALIDATE = 900;
const GITHUB_USER = "imswarnil";
const X_USER = "imswarnil";

const env = (k: string) => process.env[k]?.trim() || "";
const ghostUrl = () => (env("GHOST_URL") || "https://www.imswarnil.com").replace(/\/$/, "");

async function getJSON<T>(url: string, headers: Record<string, string> = {}, revalidate: number | false = REVALIDATE): Promise<T> {
	const r = await fetch(url, {
		headers: { "User-Agent": "links.imswarnil.com", ...headers },
		...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
	});
	if (!r.ok) throw new Error(`${r.status} ${url.replace(/key=[^&]+/, "key=…")}`);
	return r.json() as Promise<T>;
}

async function settle<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
	try { return await fn(); } catch (e) { console.warn(`[links] ${label}: ${(e as Error).message}`); return null; }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Metric { value: number; label: string }
export interface Readme { lead: string; headings: string[] }
export interface Repo {
	name: string; description: string; url: string; homepage: string;
	stars: number; forks: number; language: string; licence: string;
	topics: string[]; archived: boolean; pushedAt: string; pushedAgo: string; created: string; readme: Readme;
}
export interface GitHubData {
	user: { login: string; name: string; bio: string; avatar: string; url: string; followers: number };
	stats: { repos: Metric; stars: Metric; followers: Metric };
	repos: Repo[];
}
export interface Post {
	title: string; url: string; slug: string; excerpt: string; image: string | null;
	tag: string; readingTime: number; publishedAt: string; date: string; ago: string;
}
export interface MemberPoint { date: string; free: number; paid: number; total: number }
export interface GhostData {
	url: string;
	site: { title: string; description: string; cover: string | null; accent: string; version: string } | null;
	posts: Post[]; postsTotal: number | null; nowUpdates: Post[];
	members: { total: Metric; paid: Metric; free: Metric; series: MemberPoint[] } | null;
	signup: string;
}
export interface Video { id: string; title: string; url: string; thumbnail: string; ago: string; duration: string; views: Metric }
export interface YouTubeData {
	channel: { id: string; title: string; url: string; subscribers: Metric; views: Metric; videos: Metric } | null;
	videos: Video[];
}
export interface Tweet { id: string; text: string; url: string; ago: string; likes: Metric; reposts: Metric }
export interface XData {
	user: { name: string; handle: string; url: string; bio: string; followers: Metric; following: Metric; tweets: Metric } | null;
	tweets: Tweet[];
}
export interface Track { name: string; artist: string; album: string; art: string; url: string; playing?: boolean; ago?: string }
export interface SpotifyData { now: Track | null; top: Track[]; configured: boolean }

export interface PageData {
	github: GitHubData | null; ghost: GhostData | null; youtube: YouTubeData | null;
	x: XData | null; spotify: SpotifyData | null; fetchedAt: string;
}

const metric = (n: number | string | undefined | null): Metric => ({ value: Number(n) || 0, label: compact(n) });

// ── GitHub ───────────────────────────────────────────────────────────────────

const SKIP_HEADINGS = /^(licen[cs]e|contributing|code of conduct|changelog|acknowledge?ments|credits|contents|table of contents)\b/i;

export function readReadme(md: string): Readme {
	const clean = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/<[^>]*>/g, "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
	const headings: string[] = []; let lead = ""; let para: string[] = []; let inFence = false;
	const flush = () => {
		if (!lead && para.length) { const t = clean(para.join(" ")); if (t.length >= 40 && /\s/.test(t)) lead = t; }
		para = [];
	};
	for (const raw of md.split("\n")) {
		const line = raw.trim();
		if (/^```/.test(line)) { inFence = !inFence; flush(); continue; }
		if (inFence) continue;
		const h = /^#{2,3}\s+(.+)$/.exec(line);
		if (h) {
			flush();
			const t = clean(h[1]).replace(/[\p{Extended_Pictographic}️]/gu, "").replace(/\s*[·—-]\s*$/, "").trim();
			if (t && !SKIP_HEADINGS.test(t) && headings.length < 5) headings.push(t);
			continue;
		}
		if (!line || /^[#<>|]/.test(line) || /^[-*+]\s/.test(line) || /^\d+\.\s/.test(line) || /^!?\[/.test(line) || /^(-{3,}|={3,}|\*{3,})$/.test(line)) { flush(); continue; }
		para.push(line);
	}
	flush();
	return { lead: lead.slice(0, 300), headings };
}

interface GhRepo {
	name: string; description: string | null; html_url: string; homepage: string | null;
	stargazers_count: number; forks_count: number; language: string | null; license: { spdx_id: string } | null;
	topics?: string[]; archived: boolean; fork: boolean; pushed_at: string; created_at: string;
}

async function github(): Promise<GitHubData> {
	const token = env("GH_TOKEN") || env("GITHUB_TOKEN");
	const auth: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
	const [user, raw] = await Promise.all([
		getJSON<{ login: string; name: string; bio: string; avatar_url: string; html_url: string; followers: number }>(`https://api.github.com/users/${GITHUB_USER}`, auth),
		getJSON<GhRepo[]>(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, auth),
	]);
	const repos: Repo[] = raw.filter((r) => !r.fork).map((r) => ({
		name: r.name, description: r.description ?? "", url: r.html_url, homepage: r.homepage ?? "",
		stars: r.stargazers_count, forks: r.forks_count, language: r.language ?? "",
		licence: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : "",
		topics: r.topics ?? [], archived: r.archived, pushedAt: r.pushed_at, pushedAgo: ago(r.pushed_at),
		created: dateLabel(r.created_at), readme: { lead: "", headings: [] },
	}));
	await Promise.all(repos.map(async (r) => {
		try {
			const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${r.name}/readme`, {
				headers: { "User-Agent": "links.imswarnil.com", Accept: "application/vnd.github.raw", ...auth }, next: { revalidate: REVALIDATE },
			});
			if (res.ok) r.readme = readReadme(await res.text());
		} catch { /* a card without a README lead is still a card */ }
	}));
	return {
		user: { login: user.login, name: user.name, bio: user.bio, avatar: user.avatar_url, url: user.html_url, followers: user.followers },
		stats: { repos: metric(repos.length), stars: metric(repos.reduce((a, r) => a + r.stars, 0)), followers: metric(user.followers) },
		repos,
	};
}

// ── Ghost ────────────────────────────────────────────────────────────────────

const b64url = (bytes: Uint8Array) => { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const b64urlJSON = (o: unknown) => b64url(new TextEncoder().encode(JSON.stringify(o)));

async function ghostAdminJWT(key: string): Promise<string> {
	const [id, secret] = key.split(":");
	const bytes = new Uint8Array((secret.match(/.{1,2}/g) ?? []).map((h) => parseInt(h, 16)));
	const iat = Math.floor(Date.now() / 1000);
	const head = b64urlJSON({ alg: "HS256", typ: "JWT", kid: id });
	const body = b64urlJSON({ iat, exp: iat + 300, aud: "/admin/" });
	const k = await crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(`${head}.${body}`));
	return `${head}.${body}.${b64url(new Uint8Array(sig))}`;
}

interface GhostPost { title: string; url: string; slug: string; custom_excerpt: string | null; excerpt: string | null; feature_image: string | null; primary_tag: { name: string } | null; reading_time: number; published_at: string }
const asPost = (p: GhostPost): Post => ({
	title: p.title, url: p.url, slug: p.slug, excerpt: (p.custom_excerpt || p.excerpt || "").replace(/\s+/g, " ").trim(),
	image: p.feature_image, tag: p.primary_tag?.name ?? "", readingTime: p.reading_time,
	publishedAt: p.published_at, date: dateLabel(p.published_at), ago: ago(p.published_at),
});

async function ghost(): Promise<GhostData> {
	const base = ghostUrl();
	const out: GhostData = { url: base, site: null, posts: [], postsTotal: null, nowUpdates: [], members: null, signup: `${base}/#/portal/signup` };

	const pub = await settle("ghost site", () => getJSON<{ site: { title: string; description: string; cover_image: string | null; accent_color: string; version: string } }>(`${base}/members/api/site/`));
	if (pub?.site) out.site = { title: pub.site.title, description: pub.site.description, cover: pub.site.cover_image, accent: pub.site.accent_color, version: pub.site.version };

	const ckey = env("GHOST_CONTENT_KEY");
	if (ckey) {
		const api = <T>(path: string, q = "") => getJSON<T>(`${base}/ghost/api/content/${path}/?key=${ckey}${q}`, { "Accept-Version": "v6.0" });
		const [posts, updates] = await Promise.all([
			settle("ghost posts", () => api<{ posts: GhostPost[]; meta: { pagination: { total: number } } }>("posts", "&limit=6&include=tags&filter=visibility:public")),
			settle("ghost #now", () => api<{ posts: GhostPost[] }>("posts", "&limit=4&filter=tag:hash-now")),
		]);
		if (posts?.posts) { out.posts = posts.posts.map(asPost); out.postsTotal = posts.meta?.pagination?.total ?? null; }
		if (updates?.posts) out.nowUpdates = updates.posts.map(asPost);
	}

	const akey = env("GHOST_ADMIN_KEY");
	if (akey) {
		const members = await settle("ghost members", async () => {
			const jwt = await ghostAdminJWT(akey);
			const h = { Authorization: `Ghost ${jwt}`, "Accept-Version": "v6.0" };
			const [all, paid, stats] = await Promise.all([
				getJSON<{ meta: { pagination: { total: number } } }>(`${base}/ghost/api/admin/members/?limit=1&fields=id`, h),
				getJSON<{ meta: { pagination: { total: number } } }>(`${base}/ghost/api/admin/members/?limit=1&fields=id&filter=status:paid`, h),
				// The one endpoint that gives a series rather than a count — the sparkline.
				settle("ghost member series", () => getJSON<{ stats: { data: { date: string; free: number; paid: number; comped: number }[] }[] }>(`${base}/ghost/api/admin/members/stats/count/`, h)),
			]);
			const raw = stats?.stats?.[0]?.data ?? [];
			const series = raw.slice(-30).map((d) => ({ date: d.date, free: d.free, paid: d.paid + d.comped, total: d.free + d.paid + d.comped }));
			const total = all.meta.pagination.total, paidN = paid.meta.pagination.total;
			return { total: metric(total), paid: metric(paidN), free: metric(total - paidN), series };
		});
		if (members) out.members = members;
	}
	return out;
}

// ── YouTube ──────────────────────────────────────────────────────────────────

async function youtube(): Promise<YouTubeData> {
	const key = env("YOUTUBE_API_KEY"), channel = env("YOUTUBE_CHANNEL");
	if (!key || !channel) return { channel: null, videos: [] };
	const api = <T>(path: string, q: string) => getJSON<T>(`https://www.googleapis.com/youtube/v3/${path}?${q}&key=${key}`);
	const sel = channel.startsWith("@") ? `forHandle=${encodeURIComponent(channel)}` : `id=${channel}`;
	const ch = (await api<{ items: any[] }>("channels", `part=snippet,statistics,contentDetails&${sel}`)).items?.[0];
	if (!ch) throw new Error(`channel not found: ${channel}`);
	const uploads = ch.contentDetails?.relatedPlaylists?.uploads;
	let videos: Video[] = [];
	if (uploads) {
		const items = (await api<{ items: any[] }>("playlistItems", `part=snippet,contentDetails&maxResults=6&playlistId=${uploads}`)).items ?? [];
		const ids = items.map((i) => i.contentDetails.videoId).join(",");
		const details = ids ? (await api<{ items: any[] }>("videos", `part=contentDetails,statistics&id=${ids}`)).items ?? [] : [];
		const byId = Object.fromEntries(details.map((d) => [d.id, d]));
		videos = items.map((i) => {
			const id = i.contentDetails.videoId, d = byId[id] ?? {}, t = i.snippet.thumbnails ?? {};
			return { id, title: i.snippet.title, url: `https://www.youtube.com/watch?v=${id}`,
				thumbnail: (t.maxres || t.standard || t.high || t.medium || {}).url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
				ago: ago(i.snippet.publishedAt), duration: isoDuration(d.contentDetails?.duration), views: metric(d.statistics?.viewCount) };
		});
	}
	return {
		channel: { id: ch.id, title: ch.snippet.title, url: `https://www.youtube.com/${ch.snippet.customUrl || `channel/${ch.id}`}`,
			subscribers: metric(ch.statistics.subscriberCount), views: metric(ch.statistics.viewCount), videos: metric(ch.statistics.videoCount) },
		videos,
	};
}

/** The live number the YouTube card polls for. Uncached on purpose. */
export async function youtubeLive(): Promise<{ subscribers: number; views: number; videos: number } | null> {
	const key = env("YOUTUBE_API_KEY"), channel = env("YOUTUBE_CHANNEL");
	if (!key || !channel) return null;
	const sel = channel.startsWith("@") ? `forHandle=${encodeURIComponent(channel)}` : `id=${channel}`;
	const ch = (await getJSON<{ items: any[] }>(`https://www.googleapis.com/youtube/v3/channels?part=statistics&${sel}&key=${key}`, {}, false)).items?.[0];
	if (!ch) return null;
	return { subscribers: Number(ch.statistics.subscriberCount) || 0, views: Number(ch.statistics.viewCount) || 0, videos: Number(ch.statistics.videoCount) || 0 };
}

// ── X ────────────────────────────────────────────────────────────────────────

async function x(): Promise<XData> {
	const bearer = env("X_BEARER_TOKEN");
	if (!bearer) return { user: null, tweets: [] };
	const h = { Authorization: `Bearer ${bearer}` };
	const u = (await getJSON<{ data: any }>(`https://api.x.com/2/users/by/username/${X_USER}?user.fields=public_metrics,description,name`, h)).data;
	const t = await settle("x tweets", () => getJSON<{ data?: any[] }>(`https://api.x.com/2/users/${u.id}/tweets?max_results=5&exclude=retweets,replies&tweet.fields=created_at,public_metrics`, h));
	const m = u.public_metrics ?? {};
	return {
		user: { name: u.name, handle: u.username, url: `https://x.com/${u.username}`, bio: u.description ?? "",
			followers: metric(m.followers_count), following: metric(m.following_count), tweets: metric(m.tweet_count) },
		tweets: (t?.data ?? []).map((tw) => ({
			id: tw.id, text: tw.text, url: `https://x.com/${u.username}/status/${tw.id}`, ago: ago(tw.created_at),
			likes: metric(tw.public_metrics?.like_count), reposts: metric(tw.public_metrics?.retweet_count),
		})),
	};
}

// ── Spotify ──────────────────────────────────────────────────────────────────

async function spotifyToken(): Promise<string | null> {
	const id = env("SPOTIFY_CLIENT_ID"), secret = env("SPOTIFY_CLIENT_SECRET"), refresh = env("SPOTIFY_REFRESH_TOKEN");
	if (!id || !secret || !refresh) return null;
	const r = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { Authorization: `Basic ${btoa(`${id}:${secret}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
		next: { revalidate: 3000 },
	});
	if (!r.ok) throw new Error(`spotify token ${r.status}`);
	return (await r.json()).access_token as string;
}

const asTrack = (t: any, extra: Partial<Track> = {}): Track => ({
	name: t.name, artist: (t.artists ?? []).map((a: any) => a.name).join(", "), album: t.album?.name ?? "",
	art: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? "", url: t.external_urls?.spotify ?? "", ...extra,
});

async function spotify(): Promise<SpotifyData> {
	const token = await spotifyToken();
	if (!token) return { now: null, top: [], configured: false };
	const h = { Authorization: `Bearer ${token}` };
	const [nowRes, recent, top] = await Promise.all([
		fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers: h, cache: "no-store" }),
		settle("spotify recent", () => getJSON<{ items: any[] }>("https://api.spotify.com/v1/me/player/recently-played?limit=1", h, 120)),
		settle("spotify top", () => getJSON<{ items: any[] }>("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", h)),
	]);
	let now: Track | null = null;
	if (nowRes.status === 200) {
		const j = await nowRes.json();
		if (j?.item && j.is_playing) now = asTrack(j.item, { playing: true });
	}
	if (!now && recent?.items?.[0]) now = asTrack(recent.items[0].track, { playing: false, ago: ago(recent.items[0].played_at) });
	return { now, top: (top?.items ?? []).map((t) => asTrack(t)), configured: true };
}

// ── The page's one data call ─────────────────────────────────────────────────

export async function getPageData(): Promise<PageData> {
	const [gh, gp, yt, xd, sp] = await Promise.all([
		settle("github", github), settle("ghost", ghost), settle("youtube", youtube), settle("x", x), settle("spotify", spotify),
	]);
	return { github: gh, ghost: gp, youtube: yt, x: xd, spotify: sp, fetchedAt: new Date().toISOString() };
}
