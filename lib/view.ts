import { CARDS, slugify, type Card, type IconName } from "./content";
import { motifFor, type Motif } from "./motif";
import type { GitHubData, Repo } from "./data";

/**
 * The shape the client actually needs.
 *
 * The grid does its searching and filtering in the browser, so every card has
 * to cross the server/client boundary as plain JSON. Building that here — once,
 * on the server — keeps the client component free of any knowledge about
 * GitHub, READMEs or motif rules.
 */
export interface CardView {
	slug: string;
	i: number;
	title: string;
	url: string;
	blurb: string;
	kind: Card["kind"];
	meta: string;
	status: NonNullable<Card["status"]>;
	craft: boolean;
	icon?: IconName;
	tags: string[];
	span?: Card["span"];
	motif: Motif;
	host: string;
	/** Lowercased haystack: title, blurb, kind, meta, language and tags. */
	find: string;
	repo: {
		name: string; url: string; homepage: string;
		stars: number; forks: number; language: string; licence: string;
		created: string; pushedAgo: string; topics: string[];
	} | null;
	readme: { lead: string; headings: string[] } | null;
}

const hostOf = (url: string) => url.replace(/^https?:\/\//, "").split("/")[0];

export function buildCards(github: GitHubData | null): CardView[] {
	const byName = new Map<string, Repo>((github?.repos ?? []).map((r) => [r.name, r]));

	return CARDS.map((c, i) => {
		const repo = c.repo ? byName.get(c.repo) ?? null : null;

		return {
			slug: slugify(c.title),
			i,
			title: c.title,
			url: c.url,
			blurb: c.blurb,
			kind: c.kind,
			meta: c.meta ?? "",
			status: c.status ?? "live",
			craft: c.accent === "craft",
			icon: c.icon,
			tags: c.tags ?? [],
			span: c.span,
			motif: motifFor(c, repo ?? undefined),
			host: hostOf(c.url),
			find: [c.title, c.blurb, c.kind, c.meta, repo?.language, ...(c.tags ?? [])]
				.filter(Boolean).join(" ").toLowerCase(),
			repo: repo
				? {
					name: repo.name, url: repo.url, homepage: repo.homepage,
					stars: repo.stars, forks: repo.forks, language: repo.language,
					licence: repo.licence, created: repo.created,
					pushedAgo: repo.pushedAgo, topics: repo.topics,
				}
				: null,
			/* The card's own blurb is the headline; the README lead is a second
			   voice. Repeating one as the other would say nothing twice. */
			readme:
				repo?.readme.lead && repo.readme.lead !== c.blurb
					? { lead: repo.readme.lead, headings: repo.readme.headings }
					: repo?.readme.headings.length
						? { lead: "", headings: repo.readme.headings }
						: null,
		};
	});
}

/** The repos that are not already a card above, in push order. */
export function otherRepos(github: GitHubData | null): Repo[] {
	const listed = new Set(CARDS.map((c) => c.repo).filter(Boolean) as string[]);
	return (github?.repos ?? []).filter((r) => !listed.has(r.name));
}
