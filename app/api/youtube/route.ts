import { NextResponse } from "next/server";
import { youtubeLive } from "@/lib/data";

/** The live subscriber count. The key stays here; the browser only ever sees a number. */
export const dynamic = "force-dynamic";

export async function GET() {
	const live = await youtubeLive().catch(() => null);
	if (!live) return NextResponse.json({ error: "not configured" }, { status: 404 });
	return NextResponse.json(live, { headers: { "Cache-Control": "no-store" } });
}
