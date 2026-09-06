"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CardView } from "@/lib/view";
import { Cover } from "./Cover";
import { Icon } from "./icons";

/**
 * The grid, its search, and the overview each card opens.
 *
 * A card stays a real <a>: middle-click, cmd-click and a dead script all still
 * reach the site. Only a plain left click is intercepted, and only to open the
 * overview — which is a native <dialog>, so Escape, focus trapping and the top
 * layer come from the platform instead of from a rebuild of it.
 */
export function Work({ cards }: { cards: CardView[] }) {
	const [query, setQuery] = useState("");
	const [kind, setKind] = useState<string>("all");
	const [open, setOpen] = useState<CardView | null>(null);
	const input = useRef<HTMLInputElement>(null);
	const dialog = useRef<HTMLDialogElement>(null);

	const kinds = useMemo(
		() => Array.from(new Set(cards.map((c) => c.kind))).sort(),
		[cards],
	);

	const shown = useMemo(() => {
		const q = query.trim().toLowerCase();
		return cards.filter(
			(c) => (!q || c.find.includes(q)) && (kind === "all" || c.kind === kind),
		);
	}, [cards, query, kind]);

	// "/" focuses the search, the way every list of things should.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
			const t = e.target as HTMLElement | null;
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
			e.preventDefault();
			input.current?.focus();
			input.current?.select();
		};
		addEventListener("keydown", onKey);
		return () => removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		const d = dialog.current;
		if (!d) return;
		if (open && !d.open) d.showModal();
		if (!open && d.open) d.close();
	}, [open]);

	return (
		<>
			<div className="finder">
				<div className="field">
					<label className="vh" htmlFor="find">Search projects</label>
					<Icon name="search" />
					<input
						id="find"
						ref={input}
						type="search"
						placeholder="Search projects, stacks, tags…"
						autoComplete="off"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => { if (e.key === "Escape") setQuery(""); }}
					/>
					{!query && <kbd>/</kbd>}
				</div>

				<div className="chipbar" role="group" aria-label="Filter by kind">
					<button className="filter" type="button" aria-pressed={kind === "all"} onClick={() => setKind("all")}>All</button>
					{kinds.map((k) => (
						<button key={k} className="filter" type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>
					))}
				</div>
			</div>

			<div className="bento">
				{shown.map((c) => (
					<Card key={c.slug} card={c} onOpen={() => setOpen(c)} />
				))}
			</div>

			{shown.length === 0 && (
				<p className="empty-note">Nothing matches that. Try a stack, a tag, or part of a name.</p>
			)}

			<dialog
				className={`sheet${open?.craft ? " sheet--craft" : ""}`}
				ref={dialog}
				onClose={() => setOpen(null)}
				onClick={(e) => { if (e.target === dialog.current) setOpen(null); }}
				aria-label={open ? `${open.title} overview` : undefined}
			>
				{open && <Sheet card={open} onClose={() => setOpen(null)} />}
			</dialog>
		</>
	);
}

function Card({ card: c, onOpen }: { card: CardView; onOpen: () => void }) {
	return (
		<a
			className={`card${c.span ? ` card--${c.span}` : ""}${c.craft ? " card--craft" : ""}`}
			href={c.url}
			target="_blank"
			rel="noopener"
			style={{ ["--i" as string]: c.i }}
			onClick={(e) => {
				if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
				e.preventDefault();
				onOpen();
			}}
		>
			<span className="card__media frame-hover">
				<Cover motif={c.motif} i={c.i} label={c.title} />
				<span className="frame__tr" aria-hidden="true" /><span className="frame__bl" aria-hidden="true" />
				{/* Only when it is NOT live. A badge on every card says nothing;
				    a badge on the two that are still being built says something. */}
				{c.status !== "live" && (
					<span className={`status status--${c.status}`}><span className="dot" />{c.status}</span>
				)}
			</span>

			<span className="card__body">
				<span className="card__title">{c.title}</span>
				<span className="card__excerpt">{c.blurb}</span>

				{/* One quiet line, not three. The tag chips and the expand icon
				    moved into the overview, where there is room to read them.
				    The language becomes a coloured dot in front of the meta
				    rather than a word of its own — "TypeScript · TypeScript ·
				    Drizzle" was the card saying the same thing twice. */}
				<span className="card__foot t-data">
					<span>
						{c.repo?.language && <i className="lang" data-lang={c.repo.language} />}
						{c.meta || c.host}
					</span>
					{c.repo && c.repo.stars > 0 && <span><Icon name="star" />{c.repo.stars}</span>}
				</span>
			</span>
		</a>
	);
}

function Sheet({ card: c, onClose }: { card: CardView; onClose: () => void }) {
	const isRepoLink = c.url.includes("github.com");

	return (
		<article className="sheet__in">
			<header className="sheet__bar">
				<span className="rec"><span className="dot dot-live" /><span className="t-label-sm">{c.status}</span></span>
				<span className="t-data-sm sheet__path">{c.kind} / {c.slug}</span>
				<button className="iconbtn" type="button" onClick={onClose} aria-label="Close overview">
					<Icon name="close" />
				</button>
			</header>

			<div className="sheet__media">
				<Cover motif={c.motif} i={c.i} label={c.title} />
			</div>

			<div className="sheet__body">
				<p className="t-label-sm">{c.meta || c.kind}</p>
				<h2 className="sheet__title">{c.title}</h2>
				<p className="sheet__lead">{c.blurb}</p>

				{/* The project's own words, from its README — never a paraphrase. */}
				{c.readme?.lead && <p className="sheet__readme">{c.readme.lead}</p>}

				{c.repo && (
					<dl className="facts">
						{c.repo.stars > 0 && <div><dt className="t-label-sm">Stars</dt><dd className="t-data">{c.repo.stars}</dd></div>}
						{c.repo.forks > 0 && <div><dt className="t-label-sm">Forks</dt><dd className="t-data">{c.repo.forks}</dd></div>}
						{c.repo.language && <div><dt className="t-label-sm">Language</dt><dd className="t-data"><i className="lang" data-lang={c.repo.language} />{c.repo.language}</dd></div>}
						{c.repo.licence && <div><dt className="t-label-sm">Licence</dt><dd className="t-data">{c.repo.licence}</dd></div>}
						<div><dt className="t-label-sm">Started</dt><dd className="t-data">{c.repo.created}</dd></div>
						<div><dt className="t-label-sm">Last push</dt><dd className="t-data">{c.repo.pushedAgo}</dd></div>
					</dl>
				)}

				{/* What is inside it, taken from the README's own headings. */}
				{c.readme && c.readme.headings.length > 0 && (
					<div className="sheet__section">
						<p className="t-label-sm">Inside</p>
						<ul className="chips">{c.readme.headings.map((h) => <li className="chip" key={h}>{h}</li>)}</ul>
					</div>
				)}

				{c.repo && c.repo.topics.length > 0 && (
					<div className="sheet__section">
						<p className="t-label-sm">Topics</p>
						<ul className="chips">{c.repo.topics.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>
					</div>
				)}

				<div className="sheet__cta">
					<a className="btn btn--solid" href={c.url} target="_blank" rel="noopener">
						{isRepoLink ? "Open on GitHub" : `Visit ${c.host}`}
						<Icon name="external" />
					</a>
					{c.repo && !isRepoLink && (
						<a className="btn" href={c.repo.url} target="_blank" rel="noopener"><Icon name="code" />Source</a>
					)}
					{c.repo?.homepage && c.repo.homepage !== c.url && (
						<a className="btn" href={c.repo.homepage} target="_blank" rel="noopener"><Icon name="link" />Docs</a>
					)}
				</div>
			</div>
		</article>
	);
}
