/**
 * Everything that is authored rather than fetched.
 *
 * This was four YAML files. It is TypeScript now for one reason that matters:
 * a typo in a `kind` or a missing `title` is a build error instead of a card
 * that silently renders wrong. Nothing else about the authoring changed — add
 * an entry to CARDS and a card appears; delete it and it goes.
 */

export type Kind = "site" | "theme" | "project" | "tool";
export type Status = "live" | "building" | "soon" | "archived";
export type Span = "hero" | "wide";

export type IconName =
	| "ghost" | "palette" | "book" | "layers" | "code" | "play" | "spark"
	| "grid" | "briefcase" | "shield" | "badge" | "pen" | "star" | "clock"
	| "users" | "eye" | "file" | "arrow" | "external" | "expand" | "close"
	| "search" | "link" | "mail" | "heart" | "calendar" | "pin" | "sun" | "moon"
	| "comment" | "share" | "bookmark" | "dots" | "send" | "check";

export type BrandName =
	| "github" | "x" | "youtube" | "instagram" | "facebook" | "linkedin"
	| "ghost" | "mail" | "rss" | "spotify";

export interface Card {
	title: string;
	url: string;
	blurb: string;
	kind: Kind;
	/** GitHub repo name. Joins the card to live stars, language, last push and README. */
	repo?: string;
	span?: Span;
	meta?: string;
	status?: Status;
	/** The amber voice. Means "in progress", never "live". At most one or two. */
	accent?: "craft";
	icon?: IconName;
	tags?: string[];
}

export const PROFILE = {
	name: "Swarnil Singhai",
	handle: "imswarnil",
	tagline: "I slap keyboard & talk to camera.",
	role: "Salesforce · GTM Engineering · 7 years",
	place: "Budapest, Hungary",
	chips: ["Engineer", "YouTuber", "Creator", "Trailblazer"],
	email: "swarnilsinghaicse@gmail.com",
	github: "imswarnil",

	/**
	 * The fallback for the Now section, and the part Ghost cannot know. Posts
	 * tagged #now on imswarnil.com are shown above this when they exist.
	 */
	now: {
		status:
			"Rebuilding the Swarnil Ghost Theme on a two-axis token architecture, " +
			"and growing the design system underneath it one component at a time.",
		role: "Salesforce Engineer at Education First",
		place: "Budapest, Hungary",
		timezone: "Europe/Budapest",
		hours: "Weeknights and weekends, CET",
		openTo: "Theme sales, sponsorship, and interesting Salesforce data problems",
	},
} as const;

export const CARDS: Card[] = [
	// ── The hub ────────────────────────────────────────────────────────────
	{
		title: "imswarnil.com",
		url: "https://imswarnil.com",
		blurb: "Writing, videos, courses, projects and travel. The main desk.",
		kind: "site",
		repo: "Imswarnil.com",
		span: "hero",
		meta: "Ghost 6 · self-hosted",
		status: "live",
		icon: "ghost",
		tags: ["Blog", "Videos", "Courses", "Projects", "Travel", "Newsletter"],
	},

	// ── Design ─────────────────────────────────────────────────────────────
	{
		title: "Swarnil Design System",
		url: "https://design.imswarnil.com/",
		blurb:
			"Token-first, dependency-free CSS. Almost monochrome, so one colour can mean something.",
		kind: "project",
		repo: "Swarnil-Design-System",
		span: "wide",
		meta: "CSS · nine layers · MIT",
		status: "live",
		icon: "palette",
	},
	{
		title: "Swarnil Icons",
		url: "https://github.com/imswarnil/swarnil-icons",
		blurb:
			"55 icons on a 24 grid, drawn from scratch. Five weights from one geometry, so bold can never drift from line.",
		kind: "project",
		repo: "swarnil-icons",
		meta: "SVG · MIT",
		status: "building",
		icon: "grid",
	},
	{
		title: "NS Design System",
		url: "https://github.com/imswarnil/NSDS-Design-System",
		blurb: "One set of tokens behind the Namaste Salesforce theme and its LMS.",
		kind: "project",
		repo: "NSDS-Design-System",
		meta: "Tokens · Handlebars + React",
		status: "building",
		accent: "craft",
		icon: "layers",
	},

	// ── Themes ─────────────────────────────────────────────────────────────
	{
		title: "Swarnil Ghost Theme",
		url: "https://theme.imswarnil.com",
		blurb:
			"An editorial Ghost theme for creators who publish in more than one shape — writing, video and notes.",
		kind: "theme",
		repo: "Swarnil-Ghost-Theme",
		span: "wide",
		meta: "Ghost 6 · gscan clean",
		status: "building",
		accent: "craft",
		icon: "spark",
		tags: ["Ghost", "Editorial", "Video"],
	},
	{
		title: "Trailblazer",
		url: "https://trailblazer.imswarnil.com",
		blurb:
			"A Jekyll theme for Salesforce developers — lesson player, printable resume, certification wall.",
		kind: "theme",
		repo: "trailblazer-jekyll-theme",
		meta: "Jekyll · SCSS · MIT",
		status: "live",
		icon: "book",
	},
	{
		title: "dev.imswarnil.com",
		url: "https://dev.imswarnil.com/",
		blurb: "The Jekyll theme this all started from.",
		kind: "theme",
		repo: "Personal-Website-Jekyll-Theme",
		meta: "Jekyll · SCSS",
		status: "live",
		icon: "code",
	},

	// ── Learning ───────────────────────────────────────────────────────────
	{
		title: "CRM Analytics Academy",
		url: "https://crmanalytics.imswarnil.com",
		blurb:
			"A free curriculum for Salesforce CRM Analytics — data prep, SAQL, dashboards, Einstein Discovery.",
		kind: "project",
		repo: "CRM-Analytics-Academy",
		span: "wide",
		meta: "Vue · free forever",
		status: "live",
		icon: "book",
		tags: ["SAQL", "Dashboards", "Einstein"],
	},
	{
		title: "Namaste Salesforce",
		url: "https://github.com/imswarnil/Namaste-Salesforce",
		blurb: "The Salesforce teaching platform — Ghost theme out front, an LMS behind it.",
		kind: "project",
		repo: "Namaste-Salesforce",
		meta: "Handlebars · Next.js",
		status: "building",
		icon: "layers",
	},
	{
		title: "Job Seekers Guide",
		url: "https://jobseekers.imswarnil.com",
		blurb: "Notes and tooling for people job-hunting in the Salesforce ecosystem.",
		kind: "project",
		repo: "Job-Seekers-Guide",
		meta: "Vue",
		status: "live",
		icon: "briefcase",
	},
	{
		title: "Passport Seva Kendra",
		url: "https://salesforce.imswarnil.com",
		blurb: "A public-service workflow, modelled properly on the Salesforce platform.",
		kind: "project",
		repo: "Passport-Seva-Kendra-Salesforce",
		meta: "Salesforce · case study",
		status: "live",
		icon: "shield",
	},

	// ── Tools ──────────────────────────────────────────────────────────────
	{
		title: "No AI Content",
		url: "https://nac.imswarnil.com",
		blurb: "A badge and a position, for people who still write it themselves.",
		kind: "tool",
		repo: "No-AI-Content",
		meta: "Next.js · Cloudflare",
		status: "live",
		icon: "pen",
	},
	{
		title: "JobOS",
		url: "https://github.com/imswarnil/JobOS",
		blurb: "A job-search operating system — pipeline, notes and follow-ups in one place instead of five.",
		kind: "tool",
		repo: "JobOS",
		meta: "TypeScript · Drizzle",
		status: "building",
		icon: "briefcase",
	},
];

export interface Social {
	label: string;
	handle: string;
	url: string;
	icon: BrandName;
	/** One tile drawn in the inverse. Ration it. */
	primary?: boolean;
}

/* The blog is not here: it is the first link on the page, and the Ghost mark
   at icon size reads as an empty ring rather than as a site. */
export const SOCIALS: Social[] = [
	{ label: "GitHub", handle: "@imswarnil", url: "https://github.com/imswarnil", icon: "github" },
	{ label: "X", handle: "@imswarnil", url: "https://x.com/imswarnil", icon: "x" },
	{ label: "LinkedIn", handle: "in/imswarnil", url: "https://www.linkedin.com/in/imswarnil/", icon: "linkedin" },
	{ label: "Instagram", handle: "@imswarnil", url: "https://instagram.com/imswarnil", icon: "instagram" },
	{ label: "Facebook", handle: "hashtag_swarnil", url: "https://facebook.com/hashtag_swarnil", icon: "facebook" },
	{ label: "Email", handle: "say hello", url: "mailto:swarnilsinghaicse@gmail.com", icon: "mail" },
	// No channel exists yet — youtube.com/@imswarnil is a 404. Add it here the
	// day it does; the stats band and video section come from YOUTUBE_CHANNEL.
];

export interface Give {
	title: string;
	blurb: string;
	url?: string;
	cta: string;
	icon: IconName;
	kind: "free" | "paid" | "hire";
	status?: "soon";
	featured?: boolean;
}

/** Ordered by what is asked of the reader: free first, paid last. */
export const SUPPORT: Give[] = [
	{
		title: "The newsletter",
		blurb:
			"New posts, build logs and the occasional video, sent when there is something worth sending. No cadence promised, no filler.",
		url: "https://www.imswarnil.com/#/portal/signup",
		cta: "Subscribe free",
		icon: "mail",
		kind: "free",
		featured: true,
	},
	{
		title: "Star something",
		blurb:
			"Every project here is public and most are MIT. A star is the cheapest signal that a thing is worth continuing.",
		url: "https://github.com/imswarnil",
		cta: "Browse the repos",
		icon: "star",
		kind: "free",
	},
	{
		title: "Buy the Ghost theme",
		blurb:
			"An editorial Ghost theme for creators who publish in more than one shape — writing, video and notes. One purchase, yours forever.",
		url: "https://theme.imswarnil.com",
		cta: "See the theme",
		icon: "spark",
		kind: "paid",
	},
	{
		title: "Sponsor a build",
		blurb:
			"Put your name on a project, a video or a repo. A single-tenant ad platform I run myself, so there is no network and no tracking.",
		cta: "Coming soon",
		icon: "badge",
		kind: "paid",
		status: "soon",
	},
	{
		title: "Work with me",
		blurb:
			"Salesforce and GTM engineering — CRM Analytics, CPQ, pipeline and product-usage data turned into dashboards people actually open.",
		url: "mailto:swarnilsinghaicse@gmail.com?subject=Working%20together",
		cta: "Start a conversation",
		icon: "briefcase",
		kind: "hire",
	},
];

/** The résumé rows the LinkedIn card draws. Newest first. */
export interface Role { when: string; title: string; org: string; where: string; current?: boolean }
export const ROLES: Role[] = [
	{ when: "2026 —", title: "Salesforce Engineer", org: "Education First", where: "Budapest", current: true },
	{ when: "2022 – 26", title: "Salesforce GTM Engineer", org: "Twilio", where: "Bangalore" },
	{ when: "2021 – 22", title: "CRM Analytics Consultant", org: "Cognizant", where: "Bangalore" },
	{ when: "2018 – 21", title: "Salesforce Engineer", org: "Accenture", where: "Bangalore" },
];

export const HANDLES = {
	github: "imswarnil",
	x: "imswarnil",
	instagram: "imswarnil",
	linkedin: "imswarnil",
	facebook: "hashtag_swarnil",
} as const;

export const slugify = (s: string) =>
	s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
