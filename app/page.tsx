import { PROFILE, SOCIALS, SUPPORT } from "@/lib/content";
import { getPageData } from "@/lib/data";
import { buildCards, otherRepos } from "@/lib/view";
import { Icon, Brand } from "./components/icons";
import { TopBar } from "./components/TopBar";
import { Reveal, Counter } from "./components/Motion";
import { Work } from "./components/Work";

/**
 * Rendered per request, never at build time.
 *
 * The upstream calls are still cached for fifteen minutes (see REVALIDATE in
 * lib/data.ts), so this costs three API round-trips a quarter of an hour rather
 * than three per visitor — but the HTML itself is always assembled fresh.
 *
 * That is the difference that matters: adding a Ghost key, publishing a post
 * tagged #now, or starring a repo changes what visitors see without anybody
 * running a script or triggering a deploy. Prerendering would freeze all of it
 * into the build.
 */
export const dynamic = "force-dynamic";

export default async function Page() {
	const { github, ghost, youtube } = await getPageData();
	const cards = buildCards(github);
	const rest = otherRepos(github);
	const now = PROFILE.now;

	const siteTitle = ghost?.site?.title ?? "imswarnil.com";
	const ghostHome = ghost?.url ?? "https://imswarnil.com";
	const signup = ghost?.signup ?? "https://www.imswarnil.com/#/portal/signup";

	return (
		<>
			<TopBar name={PROFILE.name} />

			<main id="main">
				{/* ══ HERO ══ name authored, the line and the still from Ghost, the avatar from GitHub ══ */}
				<section className="hero">
					<div className="wrap">
						<div className="hero__grid">
							{/* Four things: who, what, the line, the way in. The avatar/role
							    row, the chips and the waveform all came out — each was a
							    fifth thing competing with the name. */}
							<div>
								<p className="hero__eyebrow t-label-sm">
									<span className="rec"><span className="dot dot-live" />On air</span>
									<span className="sep">·</span><span>{PROFILE.role}</span>
								</p>

								<h1 className="hero__title">
									{PROFILE.name.split(" ")[0]} <em>{PROFILE.name.split(" ").slice(-1)[0]}.</em>
								</h1>
								<p className="hero__lead t-lead">{ghost?.site?.description ?? PROFILE.tagline}</p>

								<div className="hero__cta">
									<a className="btn btn--solid" href={ghostHome} target="_blank" rel="noopener">Read the blog</a>
									<a className="btn" href={signup} target="_blank" rel="noopener">Subscribe</a>
								</div>
							</div>

							{ghost?.site?.cover && (
								<div className="hero__media">
									<a className="viewfinder frame" href={ghostHome} target="_blank" rel="noopener" aria-label={`Open ${siteTitle}`}>
										<img src={ghost.site.cover} alt="" width={1024} height={768} />
										<span className="frame__tr" aria-hidden="true" /><span className="frame__bl" aria-hidden="true" />
										<span className="viewfinder__hud">
											<span className="viewfinder__tag t-label-sm"><span className="dot dot-live" />{siteTitle}</span>
										</span>
									</a>
								</div>
							)}
						</div>
					</div>
				</section>
				<span data-hero-end aria-hidden="true" />

				{/* ══ STATS ══ every number came from an API this request ══ */}
				{github && (
					<div className="wrap">
						<Reveal className="stats">
							<div className="stat">
								<Counter value={github.stats.repos.value} label={github.stats.repos.label} />
								<span className="stat__label"><Icon name="code" />Public repos</span>
								<span className="stat__source t-data-sm">GitHub</span>
							</div>
							<div className="stat">
								<Counter value={github.stats.stars.value} label={github.stats.stars.label} />
								<span className="stat__label"><Icon name="star" />Stars</span>
								<span className="stat__source t-data-sm">GitHub</span>
							</div>
							<div className="stat">
								<Counter value={github.stats.followers.value} label={github.stats.followers.label} />
								<span className="stat__label"><Icon name="users" />Followers</span>
								<span className="stat__source t-data-sm">GitHub</span>
							</div>

							{ghost?.members && (
								<div className="stat">
									<Counter value={ghost.members.total.value} label={ghost.members.total.label} />
									<span className="stat__label"><Icon name="users" />Members</span>
									<span className="stat__source t-data-sm">
										{siteTitle}{ghost.members.paid.value > 0 && ` · ${ghost.members.paid.label} paid`}
									</span>
								</div>
							)}
							{ghost?.postsTotal != null && (
								<div className="stat stat--quiet">
									<Counter value={ghost.postsTotal} label={String(ghost.postsTotal)} />
									<span className="stat__label"><Icon name="file" />Posts</span>
									<span className="stat__source t-data-sm">{siteTitle}</span>
								</div>
							)}
							{youtube?.channel && (
								<>
									<div className="stat">
										<Counter value={youtube.channel.subscribers.value} label={youtube.channel.subscribers.label} />
										<span className="stat__label"><Icon name="play" />Subscribers</span>
										<span className="stat__source t-data-sm">YouTube</span>
									</div>
									<div className="stat stat--quiet">
										<Counter value={youtube.channel.views.value} label={youtube.channel.views.label} />
										<span className="stat__label"><Icon name="eye" />Views</span>
										<span className="stat__source t-data-sm">YouTube · {youtube.channel.videos.label} videos</span>
									</div>
								</>
							)}
						</Reveal>
					</div>
				)}

				{/* ══ NOW ══ #now posts from Ghost when they exist; the standing answer always ══ */}
				<section className="section" id="now" aria-labelledby="now-h">
					<div className="wrap">
						<div className="section__head">
							<h2 id="now-h">Now</h2>
							{ghost?.nowPage && (
								<a className="section__more" href={ghost.nowPage.url} target="_blank" rel="noopener">
									The full page <Icon name="arrow" />
								</a>
							)}
						</div>

						<Reveal className="now">
							<div className="now__side">
								<p className="rec t-label-sm"><span className="dot dot-live" />Currently</p>
								<h3>{now.role}</h3>
								<p className="t-data">{now.place}</p>
								{ghost?.nowPage && <p className="t-data">Page updated {ghost.nowPage.date}</p>}
							</div>

							<div className="now__main">
								{ghost && ghost.nowUpdates.length > 0 ? (
									<div className="now__log">
										{ghost.nowUpdates.map((u) => (
											<article className="now__entry" key={u.slug}>
												<p className="now__when t-data">{u.date}</p>
												<div className="now__what">
													<h3>{u.title}</h3>
													{u.excerpt
														? <div className="prose"><p>{u.excerpt}</p></div>
														: <div className="prose" dangerouslySetInnerHTML={{ __html: u.html }} />}
												</div>
											</article>
										))}
									</div>
								) : ghost?.nowPage ? (
									<div className="prose" dangerouslySetInnerHTML={{ __html: ghost.nowPage.html }} />
								) : (
									<p className="prose">{now.status}</p>
								)}

								<dl className="facts">
									<div><dt className="t-label-sm">Hours</dt><dd className="t-data"><Icon name="clock" />{now.hours}</dd></div>
									<div><dt className="t-label-sm">Timezone</dt><dd className="t-data">{now.timezone}</dd></div>
									<div><dt className="t-label-sm">Open to</dt><dd className="t-data">{now.openTo}</dd></div>
								</dl>
							</div>
						</Reveal>
					</div>
				</section>

				{/* ══ WORK ══ clicking a card opens its overview ══ */}
				<section className="section" id="work" aria-labelledby="work-h">
					<div className="wrap">
						<div className="section__head">
							<h2 id="work-h">Sites &amp; projects</h2>
							<span className="t-data">{cards.length}</span>
						</div>
						<Work cards={cards} />
					</div>
				</section>

				{/* ══ WRITING ══ */}
				<section className="section" id="writing" aria-labelledby="posts-h">
					<div className="wrap">
						<div className="section__head">
							<h2 id="posts-h">Latest writing</h2>
							{ghost?.postsTotal != null && <span className="t-data">{ghost.postsTotal}</span>}
							<a className="section__more" href={ghostHome} target="_blank" rel="noopener">{siteTitle} <Icon name="arrow" /></a>
						</div>

						{ghost && ghost.posts.length > 0 ? (
							<div className="deck">
								{ghost.posts.map((p, i) => (
									<a className="card card--flat" key={p.slug} href={p.url} target="_blank" rel="noopener" style={{ ["--i" as string]: i }}>
										<span className="card__media frame-hover">
											{p.image
												? <img src={p.image} alt="" loading="lazy" width={1200} height={750} />
												: <span className="cover-fallback" />}
												<span className="frame__tr" aria-hidden="true" /><span className="frame__bl" aria-hidden="true" />
										</span>
										<span className="card__body">
											<span className="card__kicker t-label-sm">{p.tag && `${p.tag} · `}{p.readingTime} min read</span>
											<span className="card__title">{p.title}</span>
											{p.excerpt && <span className="card__excerpt t-clamp-2">{p.excerpt}</span>}
											<span className="card__foot">
												<span className="t-data">{p.date}</span>
												<span className="card__go"><Icon name="arrow" /></span>
											</span>
										</span>
									</a>
								))}
							</div>
						) : (
							<Reveal className="empty">
								<h3>Posts arrive with a Content API key</h3>
								<p>
									Set <code>GHOST_CONTENT_KEY</code> as a Worker secret and the six latest posts from{" "}
									{siteTitle} appear here — feature image, tag and reading time. No redeploy needed.
								</p>
							</Reveal>
						)}
					</div>
				</section>

				{/* ══ VIDEO ══ */}
				<section className="section" id="video" aria-labelledby="video-h">
					<div className="wrap">
						<div className="section__head">
							<h2 id="video-h">Latest videos</h2>
							{youtube?.channel && (
								<>
									<span className="t-data">{youtube.channel.videos.label}</span>
									<a className="section__more" href={youtube.channel.url} target="_blank" rel="noopener">
										{youtube.channel.title} <Icon name="arrow" />
									</a>
								</>
							)}
						</div>

						{youtube && youtube.videos.length > 0 ? (
							<div className="deck">
								{youtube.videos.map((v, i) => (
									<a className="card card--flat card--video" key={v.id} href={v.url} target="_blank" rel="noopener" style={{ ["--i" as string]: i }}>
										<span className="card__media frame-hover">
											<img src={v.thumbnail} alt="" loading="lazy" width={1280} height={720} />
												<span className="frame__tr" aria-hidden="true" /><span className="frame__bl" aria-hidden="true" />
											<span className="card__play" aria-hidden="true">
												<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
											</span>
											<span className="card__duration t-data">{v.duration}</span>
										</span>
										<span className="card__body">
											<span className="card__title">{v.title}</span>
											<span className="card__foot">
												<span className="t-data card__stats">
													<span><Icon name="eye" />{v.views.label}</span><span>{v.ago}</span>
												</span>
												<span className="card__go"><Icon name="arrow" /></span>
											</span>
										</span>
									</a>
								))}
							</div>
						) : (
							<Reveal className="empty">
								<h3>No channel wired up yet</h3>
								<p>
									Nothing is invented here. Set <code>YOUTUBE_API_KEY</code> and <code>YOUTUBE_CHANNEL</code>{" "}
									as Worker secrets and this fills itself in — subscribers, views, and the six latest uploads.
								</p>
							</Reveal>
						)}
					</div>
				</section>

				{/* ══ ELSEWHERE ══ */}
				<section className="section" id="social" aria-labelledby="social-h">
					<div className="wrap">
						<div className="section__head"><h2 id="social-h">Elsewhere</h2></div>
						<p className="section__lead">Same person on all of them. The blog is the one I actually keep up.</p>
						<div className="socials">
							{SOCIALS.map((s, i) => (
								<Reveal key={s.label} i={i}>
									<a
										className={`social${s.primary ? " social--primary" : ""}`}
										href={s.url}
										{...(s.url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener me" })}
									>
										<span className="social__mark"><Brand name={s.icon} /></span>
										<span className="social__text">
											<span className="social__label">{s.label}</span>
											<span className="social__handle">{s.handle}</span>
										</span>
										<span className="social__go"><Icon name="external" /></span>
									</a>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				{/* ══ SUPPORT ══ ordered by what is asked of the reader: free first ══ */}
				<section className="section" id="support" aria-labelledby="support-h">
					<div className="wrap">
						<div className="section__head"><h2 id="support-h">Support the work</h2></div>
						<p className="section__lead">
							Most of what is on this page is free and stays free. These are the ways it keeps being
							worth the evenings.
						</p>

						<div className="support">
							{SUPPORT.map((g, i) => {
								const soon = g.status === "soon";
								return (
									<Reveal key={g.title} i={i}>
										<div className={`give${g.featured ? " give--featured" : ""}${soon ? " give--soon" : ""}`}>
											<span className="give__mark"><Icon name={g.icon} /></span>
											<h3>{g.title}</h3>
											<p>{g.blurb}</p>
											{soon ? (
												<span className="give__soon t-label-sm">{g.cta}</span>
											) : (
												<a
													className={`btn${g.featured ? " btn--accent" : ""}`}
													href={g.url}
													{...(g.url?.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" })}
												>
													{g.cta}<Icon name="arrow" />
												</a>
											)}
										</div>
									</Reveal>
								);
							})}
						</div>

						{ghost && ghost.tiers.length > 0 && (
							<div className="tiers">
								{ghost.tiers.map((t) => (
									<span className="tier" key={t.name}>
										<b>{t.name}</b>
										<span className="t-data">{t.monthly ? `${t.currency.toUpperCase()} ${t.monthly}/mo` : "Free"}</span>
									</span>
								))}
							</div>
						)}
					</div>
				</section>

				{/* ══ CODE ══ every public repo not already a card above ══ */}
				{rest.length > 0 && (
					<section className="section" id="code" aria-labelledby="repos-h">
						<div className="wrap">
							<div className="section__head">
								<h2 id="repos-h">Everything else on GitHub</h2>
								<a className="section__more" href={github!.user.url} target="_blank" rel="noopener">
									@{github!.user.login} <Icon name="arrow" />
								</a>
							</div>
							<div className="repos">
								{rest.map((r) => (
									<a className="repo" key={r.name} href={r.url} target="_blank" rel="noopener">
										<span className="repo__main">
											<span className="repo__name">
												{r.name}{r.archived && <span className="t-label-sm">archived</span>}
											</span>
											{r.description && <span className="repo__desc">{r.description}</span>}
										</span>
										<span className="repo__meta t-data">
											{r.language && <span><i className="lang" data-lang={r.language} />{r.language}</span>}
											{r.stars > 0 && <span><Icon name="star" />{r.stars}</span>}
											<span>{r.pushedAgo}</span>
										</span>
									</a>
								))}
							</div>
						</div>
					</section>
				)}
			</main>

			<footer className="foot">
				<div className="wrap foot__in">
					<span>© {new Date().getUTCFullYear()} {PROFILE.name}</span>
					<span className="foot__links">
						<a href={`https://github.com/${PROFILE.github}/imswarnil.github.io`} target="_blank" rel="noopener">Source</a>
						<a href="https://design.imswarnil.com/" target="_blank" rel="noopener">Design system</a>
						<a href={`mailto:${PROFILE.email}`}>Email</a>
					</span>
					<span className="rec t-label-sm"><span className="dot dot-live" />Still rolling</span>
				</div>
			</footer>
		</>
	);
}
