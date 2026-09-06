/** Number and date shapes, shared by the server render and the client islands
 *  so a count never changes format when JavaScript takes over. */

export function compact(n: number | string | undefined | null): string {
	const v = Number(n) || 0;
	if (v < 1000) return String(v);
	if (v < 1e6) return `${(v / 1e3).toFixed(v < 1e4 ? 1 : 0).replace(/\.0$/, "")}K`;
	return `${(v / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
}

export function ago(iso: string | undefined | null, now = Date.now()): string {
	if (!iso) return "";
	const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
	if (s < 60) return "just now";
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
	if (s < 2629800) return `${Math.floor(s / 604800)}w ago`;
	if (s < 31557600) return `${Math.floor(s / 2629800)}mo ago`;
	return `${Math.floor(s / 31557600)}y ago`;
}

/** en-GB with an explicit UTC timezone: the server and the browser are in
 *  different places, and a date that shifts on hydration is a React error. */
export function dateLabel(iso: string | undefined | null): string {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
	});
}

export function isoDuration(d: string | undefined): string {
	const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || "");
	if (!m) return "";
	const [h, mi, s] = [m[1], m[2], m[3]].map((x) => Number(x) || 0);
	const mm = h ? String(mi).padStart(2, "0") : String(mi);
	return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}
