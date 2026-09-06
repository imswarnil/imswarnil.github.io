"use client";

import { Icon } from "./icons";

export function ThemeToggle() {
	const toggle = () => {
		const root = document.documentElement;
		const dark =
			root.getAttribute("data-theme") === "dark" ||
			(!root.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
		const next = dark ? "light" : "dark";
		root.setAttribute("data-theme", next);
		try { localStorage.setItem("theme", next); } catch { /* private mode */ }
	};

	return (
		<button className="themebtn" type="button" onClick={toggle} aria-label="Switch colour theme">
			<span className="i-sun"><Icon name="sun" /></span>
			<span className="i-moon"><Icon name="moon" /></span>
		</button>
	);
}
