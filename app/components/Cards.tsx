import { CARDS, HANDLES, PROFILE, ROLES } from "@/lib/content";
import type { PageData } from "@/lib/data";
import type { Entry } from "@/lib/db";
import { Brand, Icon } from "./icons";
import { Guestbook } from "./Guestbook";

/**
 * Each card is drawn the way its platform draws things — a YouTube tile, an
 * Instagram post, a LinkedIn résumé, a GitHub profile — so you know where a
 * link goes before you read it. Everything inside them is either fetched live
 * or authored in lib/content.ts. Nothing is a number nobody can back.
 */

type Props = { data: PageData };

const avatarOf = (data: PageData) => data.github?.user.avatar ? `${data.github.user.avatar}&s=128` : undefined;

function Head({ brand, title, sub, href }: { brand: Parameters<typeof Brand>[0]["name"]; title: string; sub?: string; href: string }) {
	return (
		<a className="card__head" href={href} target="_blank" rel="noopener">
			<span className={`card__brand card__brand--${brand}`}><Brand name={brand} /></span>
			<span className="card__headtext">
				<span className="card__title">{title}</span>
				{sub && <span className="t-data">{sub}</span>}
			</span>
			<Icon name="external" className="icon card__ext" />
		</a>
	);
}

export function YouTubeCard({ data }: Props) {
	const yt = data.youtube;
	const v = yt?.videos[0];
	const href = yt?.channel?.url ?? "https://www.youtube.com/";
	return (
		<article className="card card--yt">
			<Head brand="youtube" title={yt?.channel?.title ?? "YouTube"} sub={yt?.channel ? `${yt.channel.subscribers.label} subscribers` : "Channel coming"} href={href} />
			{v ? (
				<a className="yt" href={v.url} target="_blank" rel="noopener">
					<span className="yt__thumb">
						<img src={v.thumbnail} alt="" loading="lazy" width={1280} height={720} />
						<span className="yt__play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg></span>
						<span className="yt__dur">{v.duration}</span>
					</span>
					<span className="yt__body">
						<img className="yt__av" src={avatarOf(data)} alt="" width={36} height={36} />
						<span>
							<span className="yt__title">{v.title}</span>
							<span className="t-data">{yt?.channel?.title} · {v.views.label} views · {v.ago}</span>
						</span>
					</span>
				</a>
			) : (
				<div className="yt yt--empty">
					<span className="yt__thumb">
						<span className="yt__play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg></span>
					</span>
					<p className="t-data">No channel connected yet — set YOUTUBE_CHANNEL and YOUTUBE_API_KEY.</p>
				</div>
			)}
		</article>
	);
}

export function InstagramCard({ data }: Props) {
	const img = data.ghost?.site?.cover ?? avatarOf(data);
	const href = `https://instagram.com/${HANDLES.instagram}`;
	return (
		<article className="card card--ig">
			<a className="ig" href={href} target="_blank" rel="noopener">
				<span className="ig__top">
					<img className="ig__av" src={avatarOf(data)} alt="" width={32} height={32} />
					<span className="ig__handle">{HANDLES.instagram}</span>
					<Icon name="dots" className="icon ig__dots" />
				</span>
				<span className="ig__media">{img && <img src={img} alt="" loading="lazy" width={640} height={640} />}</span>
				<span className="ig__actions">
					<Icon name="heart" /><Icon name="comment" /><Icon name="share" />
					<Icon name="bookmark" className="icon ig__save" />
				</span>
				<span className="ig__caption"><b>{HANDLES.instagram}</b> {PROFILE.tagline}</span>
				<span className="t-data">Open on Instagram</span>
			</a>
		</article>
	);
}

export function LinkedInCard({ data }: Props) {
	return (
		<article className="card card--li">
			<Head brand="linkedin" title={PROFILE.name} sub={PROFILE.role} href={`https://www.linkedin.com/in/${HANDLES.linkedin}/`} />
			<ol className="li">
				{ROLES.map((r) => (
					<li className="li__row" key={`${r.org}-${r.when}`}>
						<span className="li__dot" data-current={r.current || undefined} />
						<span className="li__main">
							<span className="li__title">{r.title}</span>
							<span className="t-data">{r.org} · {r.where}</span>
						</span>
						<span className="t-data li__when">{r.when}</span>
					</li>
				))}
			</ol>
			<a className="btn btn--li" href={`https://www.linkedin.com/in/${HANDLES.linkedin}/`} target="_blank" rel="noopener">Connect</a>
			<span className="li__avatar"><img src={avatarOf(data)} alt="" width={56} height={56} /></span>
		</article>
	);
}

export function GitHubCard({ data }: Props) {
	const gh = data.github;
	const top = (gh?.repos ?? []).filter((r) => !r.archived).slice(0, 3);
	return (
		<article className="card card--gh">
			<Head brand="github" title={gh?.user.login ?? HANDLES.github} sub={gh ? `${gh.stats.followers.label} followers · ${gh.stats.repos.label} repos · ${gh.stats.stars.label} stars` : "GitHub"} href={`https://github.com/${HANDLES.github}`} />
			<ul className="gh">
				{top.map((r) => (
					<li key={r.name}>
						<a className="gh__repo" href={r.url} target="_blank" rel="noopener">
							<span className="gh__name">{r.name}</span>
							{r.description && <span className="gh__desc">{r.description}</span>}
							<span className="t-data gh__meta">
								{r.language && <span><i className="lang" data-lang={r.language} />{r.language}</span>}
								{r.stars > 0 && <span><Icon name="star" />{r.stars}</span>}
								<span>{r.pushedAgo}</span>
							</span>
						</a>
					</li>
				))}
				{top.length === 0 && <li className="t-data">GitHub is rate-limited right now — set GH_TOKEN.</li>}
			</ul>
		</article>
	);
}

export function BlogCard({ data }: Props) {
	const g = data.ghost;
	const posts = g?.posts.slice(0, 3) ?? [];
	return (
		<article className="card card--blog">
			<Head brand="ghost" title={g?.site?.title ?? "imswarnil.com"} sub={g?.postsTotal ? `${g.postsTotal} posts` : "The blog"} href={g?.url ?? "https://imswarnil.com"} />
			{posts.length > 0 ? (
				<ul className="posts">
					{posts.map((p) => (
						<li key={p.slug}>
							<a className="post" href={p.url} target="_blank" rel="noopener">
								{p.image && <img className="post__img" src={p.image} alt="" loading="lazy" width={160} height={100} />}
								<span className="post__main">
									<span className="post__title">{p.title}</span>
									<span className="t-data">{p.tag && `${p.tag} · `}{p.readingTime} min · {p.ago}</span>
								</span>
							</a>
						</li>
					))}
				</ul>
			) : (
				<p className="card__empty t-data">Latest posts appear here with GHOST_CONTENT_KEY.</p>
			)}
		</article>
	);
}

export function XCard({ data }: Props) {
	return (
		<article className="card card--x">
			<a className="tweet" href={`https://x.com/${HANDLES.x}`} target="_blank" rel="noopener">
				<span className="tweet__top">
					<img className="tweet__av" src={avatarOf(data)} alt="" width={40} height={40} />
					<span className="tweet__who"><b>{PROFILE.name}</b><span className="t-data">@{HANDLES.x}</span></span>
					<Brand name="x" />
				</span>
				<span className="tweet__text">{PROFILE.tagline}</span>
				<span className="t-data">Follow on X</span>
			</a>
		</article>
	);
}

export function ProjectsCard() {
	return (
		<article className="card card--projects">
			<div className="card__head card__head--plain">
				<span className="card__brand"><Icon name="grid" /></span>
				<span className="card__headtext"><span className="card__title">Sites & projects</span><span className="t-data">{CARDS.length} things</span></span>
			</div>
			<ul className="proj">
				{CARDS.map((c) => (
					<li key={c.title}>
						<a className="proj__row" href={c.url} target="_blank" rel="noopener">
							<span className="proj__icon"><Icon name={c.icon} /></span>
							<span className="proj__main">
								<span className="proj__title">{c.title}</span>
								<span className="proj__blurb">{c.blurb}</span>
							</span>
							{c.status && c.status !== "live" && <span className="proj__tag t-data">{c.status}</span>}
							<Icon name="arrow" className="icon proj__go" />
						</a>
					</li>
				))}
			</ul>
		</article>
	);
}

export function NowCard({ data }: Props) {
	const u = data.ghost?.nowUpdates[0];
	return (
		<article className="card card--now">
			<div className="card__head card__head--plain">
				<span className="card__brand card__brand--live"><span className="dot dot-live" /></span>
				<span className="card__headtext"><span className="card__title">Now</span><span className="t-data">{u ? u.ago : `${PROFILE.now.place}`}</span></span>
			</div>
			<p className="now__text">{u?.title ?? PROFILE.now.status}</p>
			<dl className="now__facts">
				<div><dt className="t-data">Role</dt><dd>{PROFILE.now.role}</dd></div>
				<div><dt className="t-data">Hours</dt><dd>{PROFILE.now.hours}</dd></div>
				<div><dt className="t-data">Open to</dt><dd>{PROFILE.now.openTo}</dd></div>
			</dl>
		</article>
	);
}

export function NewsletterCard({ data }: Props) {
	const signup = data.ghost?.signup ?? "https://www.imswarnil.com/#/portal/signup";
	const members = data.ghost?.members?.total.label;
	return (
		<article className="card card--news">
			<div className="card__head card__head--plain">
				<span className="card__brand card__brand--accent"><Icon name="mail" /></span>
				<span className="card__headtext"><span className="card__title">The newsletter</span><span className="t-data">{members ? `${members} readers` : "Free, occasional"}</span></span>
			</div>
			<p className="card__text">New posts, build logs and the occasional video, sent when there is something worth sending.</p>
			<a className="btn btn--accent" href={signup} target="_blank" rel="noopener">Subscribe free</a>
		</article>
	);
}

export function SpotifyCard() {
	return (
		<article className="card card--sp">
			<Head brand="spotify" title="Spotify" sub="Not connected yet" href="https://open.spotify.com/" />
			<div className="sp">
				<span className="sp__art" />
				<span className="sp__main"><span className="sp__title">Now playing</span><span className="t-data">Add SPOTIFY_* secrets to switch this on.</span></span>
				<span className="sp__bars" aria-hidden="true"><i /><i /><i /></span>
			</div>
		</article>
	);
}

export function GuestbookCard({ entries, configured, count }: { entries: Entry[]; configured: boolean; count: number }) {
	return (
		<article className="card card--gb">
			<div className="card__head card__head--plain">
				<span className="card__brand"><Icon name="pen" /></span>
				<span className="card__headtext"><span className="card__title">Guestbook</span><span className="t-data">{count > 0 ? `${count} signed` : "Sign it"}</span></span>
			</div>
			<Guestbook initial={entries} configured={configured} count={count} />
		</article>
	);
}
