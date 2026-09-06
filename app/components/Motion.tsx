"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { compact } from "@/lib/format";

/**
 * Two small behaviours, both of which the page is complete without.
 *
 * PRINCIPLE: the finished state is the resting state. `Reveal` renders its
 * children normally and only ADDS a starting offset via CSS, so a browser with
 * no IntersectionObserver — or a dead script — shows the page exactly as it
 * should look, just without the movement.
 */
export function Reveal({ children, className, i }: { children: ReactNode; className?: string; i?: number }) {
	const el = useRef<HTMLDivElement>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		const node = el.current;
		if (!node) return;
		if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(true);
			return;
		}
		const io = new IntersectionObserver(
			([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
			{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
		);
		io.observe(node);
		return () => io.disconnect();
	}, []);

	return (
		<div
			ref={el}
			className={className}
			data-reveal=""
			{...(shown ? { "data-in": "" } : {})}
			style={i === undefined ? undefined : ({ ["--i" as string]: i })}
		>
			{children}
		</div>
	);
}

/** A number that counts up the first time it is seen, and simply IS the number
 *  if it never is. `label` is the server-rendered value, so nothing flickers. */
export function Counter({ value, label }: { value: number; label: string }) {
	const el = useRef<HTMLSpanElement>(null);
	const [text, setText] = useState(label);

	useEffect(() => {
		const node = el.current;
		if (!node || !("IntersectionObserver" in window)) return;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches || value < 10) return;

		const io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			io.disconnect();
			const start = performance.now();
			const step = (t: number) => {
				const p = Math.min(1, (t - start) / 900);
				setText(compact(Math.round(value * (1 - Math.pow(1 - p, 3)))));
				if (p < 1) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		}, { threshold: 0.4 });

		io.observe(node);
		return () => io.disconnect();
	}, [value]);

	return <span className="t-stat" ref={el} suppressHydrationWarning>{text}</span>;
}
