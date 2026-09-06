"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { compact } from "@/lib/format";
import { Icon } from "./icons";

/** A number that counts from where it was to where it is. */
function useCountUp(target: number, initialLabel: string) {
	const [text, setText] = useState(initialLabel);
	const from = useRef(target);
	useEffect(() => {
		const start = from.current, delta = target - start;
		if (delta === 0) return;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setText(compact(target)); from.current = target; return; }
		const t0 = performance.now();
		let raf = 0;
		const step = (t: number) => {
			const p = Math.min(1, (t - t0) / 900);
			setText(compact(Math.round(start + delta * (1 - Math.pow(1 - p, 3)))));
			if (p < 1) raf = requestAnimationFrame(step); else from.current = target;
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [target]);
	return text;
}

/** Live subscriber count: polls the server route (the key never leaves it). */
export function LiveSubs({ initial, label }: { initial: number; label: string }) {
	const [value, setValue] = useState(initial);
	const [live, setLive] = useState(false);
	const text = useCountUp(value, label);

	useEffect(() => {
		let stop = false;
		const tick = async () => {
			try {
				const r = await fetch("/api/youtube", { cache: "no-store" });
				if (!r.ok) return;
				const j = await r.json();
				if (!stop && typeof j.subscribers === "number") { setValue(j.subscribers); setLive(true); }
			} catch { /* stays at the last good number */ }
		};
		tick();
		const id = setInterval(tick, 60_000);
		return () => { stop = true; clearInterval(id); };
	}, []);

	return (
		<span className="live">
			<span className="t-stat" suppressHydrationWarning>{text}</span>
			{live && <span className="badge badge-live badge-dot live__badge">live</span>}
		</span>
	);
}

/** The newsletter form. Ghost sends the magic link; nothing is stored here. */
export function Subscribe({ compactForm = false }: { compactForm?: boolean }) {
	const [email, setEmail] = useState("");
	const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
	const [error, setError] = useState("");

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (state === "busy") return;
		setState("busy"); setError("");
		const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
		try {
			const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website }) });
			const j = await r.json();
			if (!r.ok) { setError(j.error ?? "Something went wrong."); setState("error"); return; }
			setState("done");
		} catch { setError("Could not reach the server."); setState("error"); }
	}

	if (state === "done") {
		return (
			<p className="sub__done fx-rise" role="status">
				<span className="sub__tick"><Icon name="check" /></span>
				<span><b>Check your inbox.</b> Ghost has sent a link — click it and you are on the list.</span>
			</p>
		);
	}

	return (
		<form className={`sub${compactForm ? " sub-compact" : ""}`} onSubmit={submit}>
			<input className="gb__hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
			<input
				className="sub__in" type="email" name="email" placeholder="you@example.com" required
				value={email} onChange={(e) => setEmail(e.target.value)} disabled={state === "busy"} aria-label="Email address"
			/>
			<button className="btn btn-primary sub__go" type="submit" disabled={state === "busy"} aria-busy={state === "busy"}>
				{state === "busy" ? "Sending…" : "Subscribe"}
			</button>
			{error && <p className="t-data sub__err" role="alert">{error}</p>}
		</form>
	);
}

/** The Instagram heart. Local only — a like on a link page is a gesture, not an API call. */
export function Like() {
	const [on, setOn] = useState(false);
	return (
		<button className={`like${on ? " like--on" : ""}`} type="button" aria-pressed={on} aria-label="Like" onClick={() => setOn((v) => !v)}>
			<Icon name="heart" />
		</button>
	);
}
