"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

/**
 * The bar takes over the identity once the hero has scrolled away — until then
 * the hero is saying it, and saying it twice is the clutter.
 */
export function TopBar({ avatar, role, name }: { avatar?: string; role: string; name: string }) {
	const bar = useRef<HTMLElement>(null);
	const [stuck, setStuck] = useState(false);
	const [clock, setClock] = useState("");

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

	// The timecode: the one honest camcorder flourish. Set only after mount, so
	// the server and the browser never disagree about what time it is.
	useEffect(() => {
		const pad = (n: number) => String(n).padStart(2, "0");
		const tick = () => {
			const d = new Date();
			setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
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
						<rect x="1" y="1" width="38" height="38" rx="11" stroke="currentColor" strokeOpacity=".18" strokeWidth="1.5" />
						<circle cx="20" cy="20" r="6.5" fill="var(--accent)">
							<animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite" />
						</circle>
						<circle cx="20" cy="20" r="11" stroke="var(--accent)" strokeOpacity=".35" strokeWidth="1.5">
							<animate attributeName="r" values="9;14;9" dur="2s" repeatCount="indefinite" />
							<animate attributeName="stroke-opacity" values=".45;0;.45" dur="2s" repeatCount="indefinite" />
						</circle>
					</svg>
					<span className="brand__name">Swarnil</span>
				</a>

				<span className="topbar__id">
					{avatar && <img className="topbar__avatar" src={`${avatar}&s=64`} alt="" width={26} height={26} />}
					<span className="t-label-sm">{role}</span>
				</span>

				<nav className="topnav" aria-label="Sections">
					<a href="#now">Now</a>
					<a href="#work">Work</a>
					<a href="#writing">Writing</a>
					<a href="#social">Elsewhere</a>
					<a href="#support">Support</a>
				</nav>

				<div className="strip">
					<span className="strip__tape rec">
						<span className="dot dot-live" />
						<span className="t-data-sm" suppressHydrationWarning>{clock || "--:--:--"}</span>
					</span>
					<button className="iconbtn themebtn" type="button" onClick={toggleTheme} aria-label="Switch colour theme">
						<span className="i-sun"><Icon name="sun" /></span>
						<span className="i-moon"><Icon name="moon" /></span>
					</button>
				</div>
			</div>
		</header>
	);
}
