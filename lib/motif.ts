import type { Card } from "./content";

/**
 * Which picture a card's cover should draw.
 *
 * The motif says what the thing IS before you read the title — a token ladder
 * for a design system, a page skeleton for a theme, a lesson stack for a
 * curriculum. A random abstract pattern is decoration, and decoration on twelve
 * cards at once is exactly the clutter a cover is supposed to prevent.
 */
export type Motif =
	| "broadcast" | "system" | "theme" | "curriculum"
	| "glyphs" | "platform" | "tool" | "archive";

/**
 * An authored `kind` beats any keyword. The hub's blurb mentions courses but
 * the hub is a blog; a Jekyll theme whose README happens to say "tokens" is
 * still a theme. Only `project` — the kind that means "something else" — is
 * left to the text to classify.
 */
const BY_KIND: Partial<Record<Card["kind"], Motif>> = {
	site: "broadcast",
	theme: "theme",
	tool: "tool",
};

/** First match wins, so the most specific tests come first. */
const RULES: [Motif, RegExp][] = [
	["glyphs", /\bicons?\b|icon set|sprite|glyph/],
	["system", /design system|token|palette|swatch|style guide/],
	["theme", /\btheme\b|jekyll|ghost theme|handlebars|template/],
	["curriculum", /curriculum|academy|course|lesson|guide|tutorial|learn|teaching/],
	["broadcast", /\bblog\b|writing|newsletter|video|creator|personal site|publish/],
	["platform", /platform|lms|portal|saas|next\.js|supabase|dashboard|app\b/],
	["tool", /\btool\b|cli|badge|generator|utility|automation|script/],
];

export function motifFor(
	card: Card,
	repo?: { description?: string; topics?: string[]; readme?: { lead: string; headings: string[] } },
): Motif {
	const byKind = BY_KIND[card.kind];
	if (byKind) return byKind;

	const hay = [
		card.title, card.blurb, card.kind, card.icon,
		repo?.description, repo?.readme?.lead,
		...(repo?.topics ?? []), ...(repo?.readme?.headings ?? []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	for (const [motif, re] of RULES) if (re.test(hay)) return motif;
	return "archive";
}
