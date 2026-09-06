import { PROFILE, CARDS, SOCIALS, SUPPORT } from "@/lib/content";
import { getPageData } from "@/lib/data";
import { Icon, Brand } from "./components/icons";
import { ThemeToggle } from "./components/ThemeToggle";

/**
 * A link tree. One column, a stack of links, nothing to operate.
 *
 * Still rendered per request: stars, last-push times, the latest post and
 * the #now line come from the APIs every fifteen minutes, so the page stays
 * current without anybody touching it. The data is the same as before — what
 * changed is that it is printed small beside a link instead of built into a
 * section of its own.
 */
export const dynamic = "force-dynamic";

export default async function Page() {
	const { github, ghost } = await getPageData();
	const repos = new Map((github?.repos ?? []).map((r) => [r.name, r]));

	const bio = ghost?.site?.description ?? PROFILE.tagline;
	// A #now post title if there is one, otherwise the role — one line either
	// way. The longer status sentence belongs on the /now/ page, not under a bio.
	const now = ghost?.nowUpdates[0]?.title ?? `${PROFILE.now.role} · ${PROFILE.now.place}`;
	const blog = ghost?.url ?? "https://imswarnil.com";
	const listed = new Set(CARDS.map((c) => c.repo).filter(Boolean));
	const rest = (github?.repos ?? []).filter((r) => !listed.has(r.name) && !r.archived);

	return (
		<main className="tree">
			<ThemeToggle />

			<header className="who">
				{github?.user.avatar && (
					<img className="who__avatar" src={`${github.user.avatar}&s=192`} alt="" width={88} height={88} />
				)}
				<h1 className="who__name">{PROFILE.name}</h1>
				<p className="who__bio">{bio}</p>
				<p className="who__now t-data"><span className="dot dot-live" />{now}</p>
			</header>

			<section className="links" aria-label="Sites and projects">
				{CARDS.map((c) => {
					const r = c.repo ? repos.get(c.repo) : undefined;
					const building = c.status && c.status !== "live";
					return (
						<a className="link" key={c.title} href={c.url} target="_blank" rel="noopener">
							<span className="link__main">
								<span className="link__title">{c.title}</span>
								<span className="link__blurb">{c.blurb}</span>
							</span>
							<span className="link__meta t-data">
								{building && <span className="link__tag">{c.status}</span>}
								{r && r.stars > 0 && <span><Icon name="star" />{r.stars}</span>}
								{r && <span>{r.pushedAgo}</span>}
							</span>
							<Icon name="arrow" className="icon link__go" />
						</a>
					);
				})}
			</section>

			{ghost && ghost.posts.length > 0 && (
				<section className="links" aria-labelledby="writing-h">
					<h2 className="links__head t-label-sm" id="writing-h">Latest writing</h2>
					{ghost.posts.slice(0, 4).map((p) => (
						<a className="link" key={p.slug} href={p.url} target="_blank" rel="noopener">
							<span className="link__main">
								<span className="link__title">{p.title}</span>
								{p.excerpt && <span className="link__blurb">{p.excerpt}</span>}
							</span>
							<span className="link__meta t-data"><span>{p.readingTime} min</span><span>{p.ago}</span></span>
							<Icon name="arrow" className="icon link__go" />
						</a>
					))}
					<a className="link link--quiet" href={blog} target="_blank" rel="noopener">
						<span className="link__main"><span className="link__title">Everything on {ghost.site?.title ?? "the blog"}</span></span>
						<Icon name="arrow" className="icon link__go" />
					</a>
				</section>
			)}

			<section className="links" aria-labelledby="support-h">
				<h2 className="links__head t-label-sm" id="support-h">Support</h2>
				{SUPPORT.filter((g) => g.status !== "soon").map((g) => (
					<a
						className={`link${g.featured ? " link--accent" : ""}`}
						key={g.title}
						href={g.url}
						{...(g.url?.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" })}
					>
						<span className="link__main">
							<span className="link__title">{g.title}</span>
							<span className="link__blurb">{g.blurb}</span>
						</span>
						<Icon name="arrow" className="icon link__go" />
					</a>
				))}
			</section>

			{rest.length > 0 && (
				<section className="links" aria-labelledby="repos-h">
					<h2 className="links__head t-label-sm" id="repos-h">Also on GitHub</h2>
					{rest.map((r) => (
						<a className="link link--quiet" key={r.name} href={r.url} target="_blank" rel="noopener">
							<span className="link__main">
								<span className="link__title">{r.name}</span>
								{r.description && <span className="link__blurb">{r.description}</span>}
							</span>
							<span className="link__meta t-data">{r.language && <span>{r.language}</span>}<span>{r.pushedAgo}</span></span>
							<Icon name="arrow" className="icon link__go" />
						</a>
					))}
				</section>
			)}

			<footer className="foot">
				<nav className="socials" aria-label="Elsewhere">
					{SOCIALS.map((s) => (
						<a
							key={s.label}
							className="social"
							href={s.url}
							aria-label={s.label}
							title={s.label}
							{...(s.url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener me" })}
						>
							<Brand name={s.icon} />
						</a>
					))}
				</nav>
				<p className="t-data">© {new Date().getUTCFullYear()} {PROFILE.name} · {PROFILE.place}</p>
			</footer>
		</main>
	);
}
