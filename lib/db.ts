import { neon } from "@neondatabase/serverless";
import { ago } from "./format";

/**
 * The guestbook — the one thing on the page that is written, not fetched.
 *
 * Neon over HTTP, the same driver nac.imswarnil.com uses, so a Worker can
 * reach Postgres without a socket. Everything here degrades: with no
 * DATABASE_URL the guestbook renders with its form disabled and says so,
 * rather than throwing and taking the page with it.
 */

export interface Entry { id: number; name: string; message: string; created_at: string; ago: string }

const url = () => process.env.DATABASE_URL?.trim() || "";
export const guestbookConfigured = () => Boolean(url());

const sql = () => neon(url());

export async function listEntries(limit = 24): Promise<Entry[]> {
	if (!guestbookConfigured()) return [];
	const rows = await sql()`
		select id, name, message, created_at
		from guestbook
		order by created_at desc
		limit ${limit}` as { id: number; name: string; message: string; created_at: string }[];
	return rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString(), ago: ago(r.created_at) }));
}

export async function countEntries(): Promise<number> {
	if (!guestbookConfigured()) return 0;
	const [{ n }] = await sql()`select count(*)::int as n from guestbook` as { n: number }[];
	return n;
}

/** Three signatures an hour per address — enough for a correction, not for a script. */
export async function recentFrom(ipHash: string): Promise<number> {
	const [{ n }] = await sql()`
		select count(*)::int as n from guestbook
		where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'` as { n: number }[];
	return n;
}

export async function addEntry(name: string, message: string, ipHash: string): Promise<Entry> {
	const [row] = await sql()`
		insert into guestbook (name, message, ip_hash)
		values (${name}, ${message}, ${ipHash})
		returning id, name, message, created_at` as { id: number; name: string; message: string; created_at: string }[];
	return { ...row, created_at: new Date(row.created_at).toISOString(), ago: "just now" };
}

/** The address is hashed before it is stored: enough to rate-limit, not enough to identify. */
export async function hashIp(ip: string): Promise<string> {
	const salt = process.env.GUESTBOOK_SALT?.trim() || "links.imswarnil.com";
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
	return Array.from(new Uint8Array(buf).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}
