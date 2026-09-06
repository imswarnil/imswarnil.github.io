"use client";

import { useState, type FormEvent } from "react";
import type { Entry } from "@/lib/db";
import { Icon } from "./icons";

export function Guestbook({ initial, configured, count }: { initial: Entry[]; configured: boolean; count: number }) {
	const [entries, setEntries] = useState(initial);
	const [total, setTotal] = useState(count);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
	const [error, setError] = useState("");

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (state === "busy") return;
		setState("busy"); setError("");
		const form = e.currentTarget;
		const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
		try {
			const r = await fetch("/api/guestbook", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, message, website }),
			});
			const j = await r.json();
			if (!r.ok) { setError(j.error ?? "Something went wrong."); setState("error"); return; }
			if (j.entry) { setEntries((cur) => [j.entry, ...cur].slice(0, 24)); setTotal((n) => n + 1); }
			setName(""); setMessage(""); setState("done");
			setTimeout(() => setState("idle"), 2500);
		} catch {
			setError("Could not reach the guestbook."); setState("error");
		}
	}

	return (
		<div className="gb">
			<form className="gb__form" onSubmit={submit}>
				{/* Honeypot — off-screen, tab-skipped, filled only by scripts. */}
				<input className="gb__hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
				<input
					className="gb__in" name="name" placeholder="Your name" maxLength={40} required
					value={name} onChange={(e) => setName(e.target.value)} disabled={!configured || state === "busy"}
					aria-label="Your name"
				/>
				<div className="gb__row">
					<input
						className="gb__in" name="message" placeholder={configured ? "Leave a note…" : "Guestbook not connected yet"}
						maxLength={280} required value={message} onChange={(e) => setMessage(e.target.value)}
						disabled={!configured || state === "busy"} aria-label="Your note"
					/>
					<button className="gb__send" type="submit" disabled={!configured || state === "busy"} aria-label="Sign the guestbook">
						{state === "done" ? <Icon name="check" /> : <Icon name="send" />}
					</button>
				</div>
				{error && <p className="gb__err t-data" role="alert">{error}</p>}
			</form>

			<ol className="gb__list">
				{entries.length === 0 && (
					<li className="gb__empty t-data">{configured ? "No signatures yet. Be the first." : "Add DATABASE_URL to switch this on."}</li>
				)}
				{entries.map((en) => (
					<li className="gb__entry" key={en.id}>
						<span className="gb__who">{en.name}<span className="t-data"> · {en.ago}</span></span>
						<span className="gb__msg">{en.message}</span>
					</li>
				))}
			</ol>
			{total > entries.length && <p className="t-data gb__more">and {total - entries.length} more</p>}
		</div>
	);
}
