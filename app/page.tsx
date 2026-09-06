import { PROFILE, SOCIALS } from "@/lib/content";
import { getPageData } from "@/lib/data";
import { countEntries, guestbookConfigured, listEntries } from "@/lib/db";
import { Brand, Icon } from "./components/icons";
import { ThemeToggle } from "./components/ThemeToggle";
import {
	BlogCard, GitHubCard, GuestbookCard, InstagramCard, LinkedInCard,
	NewsletterCard, NowCard, ProjectsCard, SpotifyCard, XCard, YouTubeCard,
} from "./components/Cards";

/**
 * Split: a hero that stays put on the left, a bento that scrolls on the right.
 *
 * The right side is two independent columns rather than one grid, so each can
 * drift at its own rate — that is the parallax, and it is CSS scroll-driven
 * animation, so there is no scroll listener and it costs nothing on phones,
 * where it is switched off anyway.
 *
 * Rendered per request. Every number is from an API, cached fifteen minutes.
 */
export const dynamic = "force-dynamic";

export default async function Page() {
	const [data, entries, count] = await Promise.all([getPageData(), listEntries().catch(() => []), countEntries().catch(() => 0)]);
	const bio = data.ghost?.site?.description ?? PROFILE.tagline;
	const blog = data.ghost?.url ?? "https://imswarnil.com";
	const nowLine = data.ghost?.nowUpdates[0]?.title ?? PROFILE.now.role;

	/* Placed by hand rather than round-robin: the two tallest cards (Projects,
	   Instagram) have to land in different columns or one side runs a screen
	   past the other. */
	const cols = [
		[
			<YouTubeCard key="yt" data={data} />,
			<ProjectsCard key="proj" />,
			<LinkedInCard key="li" data={data} />,
			<XCard key="x" data={data} />,
			<SpotifyCard key="sp" />,
		],
		[
			<InstagramCard key="ig" data={data} />,
			<BlogCard key="blog" data={data} />,
			<GitHubCard key="gh" data={data} />,
			<GuestbookCard key="gb" entries={entries} configured={guestbookConfigured()} count={count} />,
			<NowCard key="now" data={data} />,
			<NewsletterCard key="news" data={data} />,
		],
	];

	return (
		<div className="split">
			<aside className="side">
				<ThemeToggle />
				<div className="side__in">
					{data.github?.user.avatar && (
						<img className="side__avatar" src={`${data.github.user.avatar}&s=240`} alt="" width={112} height={112} />
					)}
					<p className="t-label"><span className="dot dot-live" />{nowLine}</p>
					<h1 className="side__name">{PROFILE.name.split(" ")[0]} <em>{PROFILE.name.split(" ").slice(-1)[0]}.</em></h1>
					<p className="side__bio">{bio}</p>
					<div className="side__cta">
						<a className="btn btn--solid" href={blog} target="_blank" rel="noopener">Read the blog</a>
						<a className="btn" href="#bento">Explore</a>
					</div>
					<nav className="side__socials" aria-label="Elsewhere">
						{SOCIALS.map((s) => (
							<a key={s.label} className="social" href={s.url} aria-label={s.label} title={s.label}
								{...(s.url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener me" })}>
								<Brand name={s.icon} />
							</a>
						))}
					</nav>
					<p className="t-data side__foot">© {new Date().getUTCFullYear()} · {PROFILE.place} <Icon name="pin" className="icon side__pin" /></p>
				</div>
			</aside>

			<main className="bento" id="bento">
				{cols.map((col, i) => <div className="col" key={i}>{col}</div>)}
			</main>
		</div>
	);
}
