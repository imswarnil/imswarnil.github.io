import { NextResponse } from "next/server";

/**
 * Newsletter signup, proxied to Ghost's members endpoint.
 *
 * Ghost sends a magic link and creates the member when it is clicked, so this
 * page never stores an address. It is proxied rather than posted from the
 * browser because Ghost only answers cross-origin calls from its own domain.
 */
export const dynamic = "force-dynamic";

const GHOST = () => (process.env.GHOST_URL?.trim() || "https://www.imswarnil.com").replace(/\/$/, "");

export async function POST(req: Request) {
	let body: { email?: unknown; website?: unknown };
	try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
	if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

	const email = String(body.email ?? "").trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "That does not look like an email." }, { status: 422 });

	const r = await fetch(`${GHOST()}/members/api/send-magic-link/`, {
		method: "POST",
		headers: { "Content-Type": "application/json", "User-Agent": "links.imswarnil.com" },
		body: JSON.stringify({ email, emailType: "subscribe", labels: ["links"] }),
		cache: "no-store",
	});
	if (!r.ok) {
		const text = await r.text().catch(() => "");
		return NextResponse.json({ error: /already|exists/i.test(text) ? "You are already on the list." : "Ghost did not accept that." }, { status: 502 });
	}
	return NextResponse.json({ ok: true });
}
