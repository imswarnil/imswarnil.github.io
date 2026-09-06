import { NextResponse } from "next/server";
import { addEntry, guestbookConfigured, hashIp, listEntries, recentFrom } from "@/lib/db";

export const dynamic = "force-dynamic";

const NAME_MAX = 40;
const MESSAGE_MAX = 280;

export async function GET() {
	if (!guestbookConfigured()) return NextResponse.json({ entries: [], configured: false });
	return NextResponse.json({ entries: await listEntries(), configured: true });
}

export async function POST(req: Request) {
	if (!guestbookConfigured()) {
		return NextResponse.json({ error: "The guestbook is not connected yet." }, { status: 503 });
	}

	let body: { name?: unknown; message?: unknown; website?: unknown };
	try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }

	// The honeypot: a field no person sees and every form-filling script fills.
	if (typeof body.website === "string" && body.website.trim()) {
		return NextResponse.json({ error: "Thanks." }, { status: 200 });
	}

	const name = String(body.name ?? "").replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
	const message = String(body.message ?? "").replace(/\s+/g, " ").trim().slice(0, MESSAGE_MAX);
	if (name.length < 2) return NextResponse.json({ error: "Add a name." }, { status: 422 });
	if (message.length < 2) return NextResponse.json({ error: "Say something." }, { status: 422 });
	if (/https?:\/\/|www\./i.test(message)) {
		return NextResponse.json({ error: "Links are not allowed in the guestbook." }, { status: 422 });
	}

	const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
	const ipHash = await hashIp(ip);
	if ((await recentFrom(ipHash)) >= 3) {
		return NextResponse.json({ error: "That is plenty for one hour." }, { status: 429 });
	}

	const entry = await addEntry(name, message, ipHash);
	return NextResponse.json({ entry }, { status: 201 });
}
