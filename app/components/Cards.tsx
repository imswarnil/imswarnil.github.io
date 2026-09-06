import { CARDS, EDUCATION, HANDLES, HIGHLIGHTS, PORTFOLIO, PROFILE, ROLES, SUMMARY, type Card as CardT } from "@/lib/content";
import type { PageData, Repo } from "@/lib/data";
import type { Entry } from "@/lib/db";
import { motifFor } from "@/lib/motif";
import { Brand, Icon } from "./icons";
import { Cover } from "./Cover";
import { Expand } from "./Expand";
import { Guestbook } from "./Guestbook";
import { LiveSubs, Subscribe, Like } from "./Live";
import { Sparkline } from "./Sparkline";

/**
 * Every card has two faces. The compact one is drawn the way its platform
 * draws things, so you know where it goes before you read it. The expanded
 * one — behind the corner button — is the detail: analytics, the full list,
 * the summary, the form. Both are server-rendered; the button only opens a
 * <dialog> that was in the HTML all along.
 *
 * Everything shown is either fetched live or authored in lib/content.ts. A
 * card whose service is not connected says which secret would connect it.
 */

type P = { data: PageData };
const avatarOf = (d: PageData) => (d.github?.user.avatar ? `${d.github.user.avatar}&s=128` : undefined);

function Head({ brand, title, sub, href, label, detail, plain }: {
	brand?: Parameters<typeof Brand>[0]["name"]; title: string; sub?: string; href?: string; label: string; detail?: React.ReactNode; plain?: React.ReactNode;
}) {
	const inner = (
		<>
			<span className={`pc__brand${brand ? ` pc__brand--${brand}` : ""}`}>{brand ? <Brand name={brand} /> : plain}</span>
			<span className="pc__headtext">
				<span className="pc__title">{title}</span>
				{sub && <span className="t-data">{sub}</span>}
			</span>
		</>
	);
	return (
		<div className="pc__head">
			{href ? <a className="pc__headlink" href={href} target="_blank" rel="noopener">{inner}</a> : <span className="pc__headlink">{inner}</span>}
			{detail && <Expand label={label}>{detail}</Expand>}
		</div>
	);
}

function Stat({ value, label, live }: { value: string; label: string; live?: React.ReactNode }) {
	return (
		<div className="stats__item">
			{live ?? <span className="t-stat">{value}</span>}
			<span className="stats__label">{label}</span>
		</div>
	);
}

function Connect({ what, secrets }: { what: string; secrets: string[] }) {
	return (
		<div className="connect">
			<p className="connect__what">{what}</p>
			<p className="t-data">Set {secrets.map((s, i) => <span key={s}><code>{s}</code>{i < secrets.length - 1 ? ", " : ""}</span>)} on the Worker and this fills itself in on the next view.</p>
		</div>
	);
}

// ── YouTube ─────────────────────────────────────────────────────────────────

export function YouTubeCard({ data }: P) {
	const yt = data.youtube, ch = yt?.channel, v = yt?.videos[0];
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">{ch?.title ?? "YouTube"}</h2><p className="dialog__sub">{ch ? "Channel analytics" : "Not connected"}</p></div>
			{ch ? (
				<>
					<div className="stats stats-quiet">
						<Stat value={ch.subscribers.label} label="Subscribers" live={<LiveSubs initial={ch.subscribers.value} label={ch.subscribers.label} />} />
						<Stat value={ch.views.label} label="Total views" />
						<Stat value={ch.videos.label} label="Videos" />
					</div>
					<h3 className="detail__h">Recent uploads</h3>
					<ul className="vids">
						{yt!.videos.map((x) => (
							<li key={x.id}><a className="vid" href={x.url} target="_blank" rel="noopener">
								<span className="vid__thumb"><img src={x.thumbnail} alt="" loading="lazy" /><span className="yt__dur">{x.duration}</span></span>
								<span className="vid__title">{x.title}</span>
								<span className="t-data">{x.views.label} views · {x.ago}</span>
							</a></li>
						))}
					</ul>
					<a className="btn btn-outline" href={ch.url} target="_blank" rel="noopener">Open the channel</a>
				</>
			) : <Connect what="Subscriber count (live), total views, video count and the six latest uploads." secrets={["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL"]} />}
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--yt fx-rise">
			<Head brand="youtube" title={ch?.title ?? "YouTube"} sub={ch ? `${ch.subscribers.label} subscribers` : "Channel coming"} href={ch?.url ?? "https://www.youtube.com/"} label="YouTube" detail={detail} />
			{v ? (
				<a className="yt" href={v.url} target="_blank" rel="noopener">
					<span className="yt__thumb frame-hover"><img src={v.thumbnail} alt="" loading="lazy" /><span className="frame__tr" /><span className="frame__bl" />
						<span className="yt__play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg></span><span className="yt__dur">{v.duration}</span></span>
					<span className="yt__body"><img className="yt__av" src={avatarOf(data)} alt="" />
						<span><span className="yt__title">{v.title}</span><span className="t-data">{ch?.title} · {v.views.label} views · {v.ago}</span></span></span>
				</a>
			) : (
				<div className="yt yt--empty">
					<span className="yt__thumb skeleton skeleton-breathe"><span className="yt__play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg></span></span>
					<p className="t-data">Latest upload appears here once the channel is connected.</p>
				</div>
			)}
		</article>
	);
}

// ── X ────────────────────────────────────────────────────────────────────────

export function XCard({ data }: P) {
	const xd = data.x, u = xd?.user, first = xd?.tweets[0];
	const href = `https://x.com/${HANDLES.x}`;
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">@{u?.handle ?? HANDLES.x}</h2><p className="dialog__sub">{u ? u.bio : "Not connected"}</p></div>
			{u ? (
				<>
					<div className="stats stats-quiet"><Stat value={u.followers.label} label="Followers" /><Stat value={u.following.label} label="Following" /><Stat value={u.tweets.label} label="Posts" /></div>
					<h3 className="detail__h">Latest</h3>
					<ul className="tweets">
						{xd!.tweets.map((t) => (
							<li key={t.id}><a className="tw" href={t.url} target="_blank" rel="noopener">
								<span className="tw__text">{t.text}</span>
								<span className="t-data"><Icon name="heart" />{t.likes.label} · <Icon name="share" />{t.reposts.label} · {t.ago}</span>
							</a></li>
						))}
					</ul>
				</>
			) : <Connect what="Followers, following, post count and the five latest posts." secrets={["X_BEARER_TOKEN"]} />}
			<a className="btn btn-outline" href={href} target="_blank" rel="noopener">Follow on X</a>
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--x fx-rise">
			<div className="pc__head">
				<a className="tweet__top" href={href} target="_blank" rel="noopener">
					<img className="tweet__av" src={avatarOf(data)} alt="" />
					<span className="tweet__who"><b>{u?.name ?? PROFILE.name}</b><span className="t-data">@{u?.handle ?? HANDLES.x}{u && ` · ${u.followers.label} followers`}</span></span>
					<Brand name="x" />
				</a>
				<Expand label="X">{detail}</Expand>
			</div>
			<a className="tweet" href={first?.url ?? href} target="_blank" rel="noopener">
				<span className="tweet__text">{first?.text ?? PROFILE.tagline}</span>
				<span className="tweet__foot t-data">
					{first ? <><Icon name="heart" />{first.likes.label}<Icon name="share" />{first.reposts.label}<span>{first.ago}</span></> : "Follow on X"}
				</span>
			</a>
		</article>
	);
}

// ── GitHub ───────────────────────────────────────────────────────────────────

function RepoTile({ r, i, card }: { r: Repo; i: number; card?: CardT }) {
	const motif = motifFor(card ?? { title: r.name, url: r.url, blurb: r.description, kind: "project" }, r);
	return (
		<a className="card card-hover-frame rt" href={card?.url ?? r.url} target="_blank" rel="noopener">
			<span className="rt__media card__media"><Cover motif={motif} i={i} label={r.name} /></span>
			<span className="card__body rt__body">
				<span className="card__title rt__title">{card?.title ?? r.name}</span>
				<span className="card__excerpt rt__desc">{card?.blurb ?? r.description}</span>
				<span className="t-data rt__meta">{r.language && <span><i className="lang" data-lang={r.language} />{r.language}</span>}{r.stars > 0 && <span><Icon name="star" />{r.stars}</span>}<span>{r.pushedAgo}</span></span>
			</span>
		</a>
	);
}

export function GitHubCard({ data }: P) {
	const gh = data.github;
	const repos = (gh?.repos ?? []).filter((r) => !r.archived);
	const top = repos.slice(0, 3);
	const byName = new Map(repos.map((r) => [r.name, r]));
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">{gh?.user.name ?? HANDLES.github}</h2><p className="dialog__sub">{gh?.user.bio}</p></div>
			{gh && <div className="stats stats-quiet"><Stat value={gh.stats.followers.label} label="Followers" /><Stat value={gh.stats.repos.label} label="Public repos" /><Stat value={gh.stats.stars.label} label="Stars earned" /></div>}
			<h3 className="detail__h">Every repository</h3>
			<div className="rtgrid">
				{repos.map((r, i) => <RepoTile key={r.name} r={r} i={i} card={CARDS.find((c) => c.repo === r.name)} />)}
			</div>
			{repos.length === 0 && <Connect what="Repositories, stars and follower counts." secrets={["GH_TOKEN"]} />}
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--gh fx-rise">
			<Head brand="github" title={gh?.user.login ?? HANDLES.github} sub={gh ? `${gh.stats.followers.label} followers · ${gh.stats.repos.label} repos · ${gh.stats.stars.label} stars` : "GitHub"} href={`https://github.com/${HANDLES.github}`} label="GitHub" detail={detail} />
			<ul className="gh">
				{top.map((r) => (
					<li key={r.name}><a className="gh__repo" href={r.url} target="_blank" rel="noopener">
						<span className="gh__name"><Icon name="code" />{r.name}</span>
						{r.description && <span className="gh__desc">{r.description}</span>}
						<span className="t-data gh__meta">{r.language && <span><i className="lang" data-lang={r.language} />{r.language}</span>}{r.stars > 0 && <span><Icon name="star" />{r.stars}</span>}<span>{r.pushedAgo}</span></span>
					</a></li>
				))}
				{top.length === 0 && <li className="t-data">GitHub is rate-limited right now — set GH_TOKEN.</li>}
			</ul>
			{byName.size > 3 && <span className="t-data pc__more">+ {byName.size - 3} more inside</span>}
		</article>
	);
}

// ── Projects (quick links) ───────────────────────────────────────────────────

export function ProjectsCard({ data }: P) {
	const byName = new Map((data.github?.repos ?? []).map((r) => [r.name, r]));
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">Sites &amp; projects</h2><p className="dialog__sub">{CARDS.length} things, each drawn as what it is</p></div>
			<div className="rtgrid">
				{CARDS.map((c, i) => {
					const r = c.repo ? byName.get(c.repo) : undefined;
					return r ? <RepoTile key={c.title} r={r} i={i} card={c} /> : (
						<a key={c.title} className="card card-hover-frame rt" href={c.url} target="_blank" rel="noopener">
							<span className="rt__media card__media"><Cover motif={motifFor(c)} i={i} label={c.title} /></span>
							<span className="card__body rt__body"><span className="card__title rt__title">{c.title}</span><span className="card__excerpt rt__desc">{c.blurb}</span></span>
						</a>
					);
				})}
			</div>
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--proj fx-rise">
			<Head title="Quick links" sub={`${CARDS.length} sites & projects`} label="Sites and projects" detail={detail} plain={<Icon name="grid" />} />
			<ul className="proj">
				{CARDS.slice(0, 6).map((c) => (
					<li key={c.title}><a className="proj__row" href={c.url} target="_blank" rel="noopener">
						<span className="proj__icon"><Icon name={c.icon} /></span>
						<span className="proj__main"><span className="proj__title">{c.title}</span><span className="proj__blurb">{c.blurb}</span></span>
						{c.status && c.status !== "live" && <span className="badge badge-craft badge-quiet">{c.status}</span>}
						<Icon name="arrow" className="icon proj__go" />
					</a></li>
				))}
			</ul>
			<span className="t-data pc__more">+ {CARDS.length - 6} more inside</span>
		</article>
	);
}

// ── Blog (Ghost) + members analytics ─────────────────────────────────────────

export function BlogCard({ data }: P) {
	const g = data.ghost, posts = g?.posts ?? [], m = g?.members;
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">{g?.site?.title ?? "imswarnil.com"}</h2><p className="dialog__sub">{g?.site?.description}</p></div>
			{m ? (
				<>
					<div className="stats stats-quiet"><Stat value={m.total.label} label="Members" /><Stat value={m.paid.label} label="Paid" /><Stat value={m.free.label} label="Free" /></div>
					{m.series.length > 1 && (
						<div className="spark-wrap">
							<Sparkline values={m.series.map((p) => p.total)} label={`Members over the last ${m.series.length} days`} />
							<span className="t-data">Members · last {m.series.length} days</span>
						</div>
					)}
				</>
			) : <Connect what="Member count, paid vs free, and a 30-day growth line." secrets={["GHOST_ADMIN_KEY"]} />}
			<h3 className="detail__h">Latest writing{g?.postsTotal ? <span className="t-data"> · {g.postsTotal} posts</span> : null}</h3>
			{posts.length ? (
				<ul className="posts posts--big">
					{posts.map((p) => (
						<li key={p.slug}><a className="post" href={p.url} target="_blank" rel="noopener">
							{p.image && <img className="post__img" src={p.image} alt="" loading="lazy" />}
							<span className="post__main"><span className="post__title">{p.title}</span>{p.excerpt && <span className="post__ex">{p.excerpt}</span>}<span className="t-data">{p.tag && `${p.tag} · `}{p.readingTime} min · {p.date}</span></span>
						</a></li>
					))}
				</ul>
			) : <Connect what="The six latest posts with feature image, tag and reading time." secrets={["GHOST_CONTENT_KEY"]} />}
			<a className="btn btn-outline" href={g?.url ?? "https://imswarnil.com"} target="_blank" rel="noopener">Open the blog</a>
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--blog fx-rise">
			<Head brand="ghost" title={g?.site?.title ?? "imswarnil.com"} sub={m ? `${m.total.label} members${g?.postsTotal ? ` · ${g.postsTotal} posts` : ""}` : g?.postsTotal ? `${g.postsTotal} posts` : "The blog"} href={g?.url ?? "https://imswarnil.com"} label="Blog" detail={detail} />
			{posts.length ? (
				<ul className="posts">
					{posts.slice(0, 3).map((p) => (
						<li key={p.slug}><a className="post" href={p.url} target="_blank" rel="noopener">
							{p.image && <img className="post__img" src={p.image} alt="" loading="lazy" />}
							<span className="post__main"><span className="post__title">{p.title}</span><span className="t-data">{p.tag && `${p.tag} · `}{p.readingTime} min · {p.ago}</span></span>
						</a></li>
					))}
				</ul>
			) : <p className="t-data pc__empty">Latest posts appear here with GHOST_CONTENT_KEY.</p>}
		</article>
	);
}

// ── Instagram ────────────────────────────────────────────────────────────────

export function InstagramCard({ data }: P) {
	const img = data.ghost?.site?.cover ?? avatarOf(data), href = `https://instagram.com/${HANDLES.instagram}`;
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">@{HANDLES.instagram}</h2><p className="dialog__sub">{PROFILE.tagline}</p></div>
			<Connect what="Follower count and the latest posts and reels." secrets={["INSTAGRAM_ACCESS_TOKEN"]} />
			<a className="btn btn-outline" href={href} target="_blank" rel="noopener">Open on Instagram</a>
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--ig fx-rise">
			<span className="ig__top">
				<a className="ig__who" href={href} target="_blank" rel="noopener"><img className="ig__av" src={avatarOf(data)} alt="" /><span className="ig__handle">{HANDLES.instagram}</span></a>
				<Expand label="Instagram">{detail}</Expand>
			</span>
			<a className="ig__media" href={href} target="_blank" rel="noopener">{img && <img src={img} alt="" loading="lazy" />}</a>
			<span className="ig__actions"><Like /><Icon name="comment" /><Icon name="share" /><Icon name="bookmark" className="icon ig__save" /></span>
			<span className="ig__caption"><b>{HANDLES.instagram}</b> {PROFILE.tagline}</span>
		</article>
	);
}

// ── LinkedIn ─────────────────────────────────────────────────────────────────

export function LinkedInCard({ data }: P) {
	const href = `https://www.linkedin.com/in/${HANDLES.linkedin}/`;
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">{PROFILE.name}</h2><p className="dialog__sub">{PROFILE.role} · {PROFILE.place}</p></div>
			<p className="detail__p">{SUMMARY}</p>
			<h3 className="detail__h">Highlights</h3>
			<ul className="hl">{HIGHLIGHTS.map((h) => <li key={h}><Icon name="check" />{h}</li>)}</ul>
			<h3 className="detail__h">Experience</h3>
			<ol className="li li--full">
				{ROLES.map((r) => (
					<li className="li__row" key={`${r.org}-${r.when}`}>
						<span className="li__dot" data-current={r.current || undefined} />
						<span className="li__main"><span className="li__title">{r.title}</span><span className="t-data">{r.org} · {r.where}</span></span>
						<span className="t-data li__when">{r.when}</span>
					</li>
				))}
			</ol>
			<p className="t-data">{EDUCATION}</p>
			<a className="btn btn-primary btn--li" href={href} target="_blank" rel="noopener">Connect on LinkedIn</a>
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--li fx-rise">
			<span className="li__banner" />
			<span className="li__avatar"><img src={avatarOf(data)} alt="" /></span>
			<Head brand="linkedin" title={PROFILE.name} sub={PROFILE.role} href={href} label="LinkedIn" detail={detail} />
			<ol className="li">
				{ROLES.slice(0, 3).map((r) => (
					<li className="li__row" key={`${r.org}-${r.when}`}>
						<span className="li__dot" data-current={r.current || undefined} />
						<span className="li__main"><span className="li__title">{r.title}</span><span className="t-data">{r.org} · {r.where}</span></span>
						<span className="t-data li__when">{r.when}</span>
					</li>
				))}
			</ol>
			<a className="btn btn-primary btn-sm btn--li" href={href} target="_blank" rel="noopener">Connect</a>
		</article>
	);
}

// ── Spotify ──────────────────────────────────────────────────────────────────

export function SpotifyCard({ data }: P) {
	const sp = data.spotify, now = sp?.now;
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">On repeat</h2><p className="dialog__sub">{sp?.configured ? "Top tracks, last four weeks" : "Not connected"}</p></div>
			{sp?.configured ? (
				<ol className="tracks">
					{sp.top.map((t, i) => (
						<li key={t.url + i}><a className="track" href={t.url} target="_blank" rel="noopener">
							<span className="t-data track__n">{String(i + 1).padStart(2, "0")}</span>
							{t.art && <img className="track__art" src={t.art} alt="" loading="lazy" />}
							<span className="track__main"><span className="track__name">{t.name}</span><span className="t-data">{t.artist}</span></span>
						</a></li>
					))}
				</ol>
			) : <Connect what="What is playing right now, the last thing played, and the top ten tracks." secrets={["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"]} />}
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--sp fx-rise">
			<Head brand="spotify" title={now ? (now.playing ? "Now playing" : "Last played") : "Spotify"} sub={now ? (now.playing ? "Live" : now.ago) : "Not connected yet"} href={now?.url ?? "https://open.spotify.com/"} label="Spotify" detail={detail} />
			<a className="sp" href={now?.url ?? "https://open.spotify.com/"} target="_blank" rel="noopener">
				{now?.art ? <img className="sp__art" src={now.art} alt="" /> : <span className="sp__art sp__art--empty" />}
				<span className="sp__main"><span className="sp__title">{now?.name ?? "Nothing yet"}</span><span className="t-data">{now ? `${now.artist} · ${now.album}` : "Connect Spotify to show what is playing."}</span></span>
				<span className={`sp__bars${now?.playing ? " sp__bars--on" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
			</a>
		</article>
	);
}

// ── Portfolio ────────────────────────────────────────────────────────────────

export function PortfolioCard() {
	const total = PORTFOLIO.reduce((a, h) => a + h.pct, 0);
	const kinds = Array.from(PORTFOLIO.reduce((m, h) => m.set(h.kind, (m.get(h.kind) ?? 0) + h.pct), new Map<string, number>()));
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">Portfolio</h2><p className="dialog__sub">Allocation only — never amounts</p></div>
			{PORTFOLIO.length ? (
				<ul className="holds">
					{PORTFOLIO.map((h) => (
						<li key={h.name} className="hold">
							<span className="hold__main"><span className="hold__name">{h.name}</span><span className="t-data">{h.kind}{h.note && ` · ${h.note}`}</span></span>
							<span className="t-data hold__pct">{h.pct}%</span>
							<span className="meter meter-thin hold__meter"><span style={{ inlineSize: `${h.pct}%` }} /></span>
						</li>
					))}
				</ul>
			) : (
				<div className="connect">
					<p className="connect__what">The shape of the portfolio, by allocation.</p>
					<p className="t-data">Kite Connect needs a fresh login every trading day, which a page cannot do for itself — so holdings are authored: fill <code>PORTFOLIO</code> in <code>lib/content.ts</code> with names and percentages.</p>
				</div>
			)}
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--pf fx-rise">
			<Head title="Portfolio" sub={PORTFOLIO.length ? `${PORTFOLIO.length} holdings · ${total}%` : "Not shared yet"} label="Portfolio" detail={detail} plain={<Icon name="layers" />} />
			{kinds.length ? (
				<ul className="alloc">
					{kinds.map(([k, pct]) => (
						<li key={k}><span className="alloc__row"><span className="alloc__k">{k}</span><span className="t-data">{pct}%</span></span><span className="meter meter-thin"><span style={{ inlineSize: `${pct}%` }} /></span></li>
					))}
				</ul>
			) : <p className="t-data pc__empty">Allocation bars appear here once holdings are filled in.</p>}
		</article>
	);
}

// ── Now ──────────────────────────────────────────────────────────────────────

export function NowCard({ data }: P) {
	const u = data.ghost?.nowUpdates[0], all = data.ghost?.nowUpdates ?? [];
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">Now</h2><p className="dialog__sub">What I am doing at the moment</p></div>
			{all.length ? <ul className="nowlog">{all.map((p) => <li key={p.slug}><span className="t-data">{p.date}</span><a href={p.url} target="_blank" rel="noopener">{p.title}</a></li>)}</ul> : <p className="detail__p">{PROFILE.now.status}</p>}
			<dl className="now__facts"><div><dt className="t-data">Role</dt><dd>{PROFILE.now.role}</dd></div><div><dt className="t-data">Hours</dt><dd>{PROFILE.now.hours}</dd></div><div><dt className="t-data">Open to</dt><dd>{PROFILE.now.openTo}</dd></div></dl>
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--now fx-rise">
			<Head title="Now" sub={u ? u.ago : PROFILE.now.place} label="Now" detail={detail} plain={<span className="dot dot-live" />} />
			<p className="now__text">{u?.title ?? PROFILE.now.status}</p>
		</article>
	);
}

// ── Newsletter ───────────────────────────────────────────────────────────────

export function NewsletterCard({ data }: P) {
	const members = data.ghost?.members?.total.label;
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">The newsletter</h2><p className="dialog__sub">New posts, build logs and the occasional video — sent when there is something worth sending.</p></div>
			<Subscribe />
			<p className="t-data">Ghost sends a magic link. Nothing is stored on this page.</p>
		</div>
	);
	return (
		<article className="card card-accent pc pc--news fx-rise">
			<Head title="The newsletter" sub={members ? `${members} readers` : "Free, occasional"} label="Newsletter" detail={detail} plain={<Icon name="mail" />} />
			<Subscribe compactForm />
		</article>
	);
}

// ── Guestbook ────────────────────────────────────────────────────────────────

export function GuestbookCard({ entries, configured, count }: { entries: Entry[]; configured: boolean; count: number }) {
	const detail = (
		<div className="detail__body">
			<div className="dialog__head"><h2 className="dialog__title">Guestbook</h2><p className="dialog__sub">{count ? `${count} people have signed` : "Be the first"}</p></div>
			<Guestbook initial={entries} configured={configured} count={count} />
		</div>
	);
	return (
		<article className="card card-hover-lift pc pc--gb fx-rise">
			<Head title="Guestbook" sub={count ? `${count} signed` : "Sign it"} label="Guestbook" detail={detail} plain={<Icon name="pen" />} />
			<Guestbook initial={entries.slice(0, 3)} configured={configured} count={count} />
		</article>
	);
}
