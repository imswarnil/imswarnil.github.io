"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

/**
 * Brand, sections, theme. That is all it is allowed to hold.
 *
 * It used to also carry the avatar, the role line and a running timecode — but
 * the role line is already the second thing in the hero, and a clock on a link
 * page is decoration wearing a uniform. A bar with five clusters in 56px is
 * the first thing that makes a page feel busy.
 */
export function TopBar({ name }: { name: string }) {
	const bar = useRef<HTMLElement>(null);
	const [stuck, setStuck] = useState(false);

	useEffect(() => {
		const sentinel = document.querySelector("[data-hero-end]");
		if (!sentinel || !("IntersectionObserver" in window)) return;
		const h = bar.current?.offsetHeight ?? 56;
		const io = new IntersectionObserver(
			([e]) => setStuck(!e.isIntersecting),
			{ rootMargin: `-${h}px 0px 0px 0px` },
		);
		io.observe(sentinel);
		return () => io.disconnect();
	}, []);

	const toggleTheme = () => {
		const root = document.documentElement;
		const dark =
			root.getAttribute("data-theme") === "dark" ||
			(!root.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
		const next = dark ? "light" : "dark";
		root.setAttribute("data-theme", next);
		try { localStorage.setItem("theme", next); } catch { /* private mode */ }
	};

	return (
		<header className="topbar" ref={bar} {...(stuck ? { "data-stuck": "" } : {})}>
			<div className="topbar__in">
				<a className="brand" href="#main" aria-label={`${name} — top of page`}>
					<svg className="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
						<circle cx="20" cy="20" r="7" fill="var(--accent)" />
					</svg>
					<span className="brand__name">Swarnil</span>
				</a>

				<nav className="topnav" aria-label="Sections">
					<a href="#now">Now</a>
					<a href="#work">Work</a>
					<a href="#writing">Writing</a>
					<a href="#social">Elsewhere</a>
					<a href="#support">Support</a>
				</nav>

				<button className="iconbtn themebtn" type="button" onClick={toggleTheme} aria-label="Switch colour theme">
					<span className="i-sun"><Icon name="sun" /></span>
					<span className="i-moon"><Icon name="moon" /></span>
				</button>
			</div>
		</header>
	);
}
