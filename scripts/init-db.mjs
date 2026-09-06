/*
 * One-time: creates the guestbook table. Safe to re-run.
 *
 *   DATABASE_URL=postgres://… npm run db:init
 *
 * Mirrors nac.imswarnil.com's scripts/init-db.mjs. This is the only script in
 * the repo, and it is setup rather than a build step — the page never needs
 * it to run.
 */
import { neon } from "@neondatabase/serverless";

try { process.loadEnvFile(".env.local"); } catch {}

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("Set DATABASE_URL (a Neon connection string) first.");
	process.exit(1);
}

const sql = neon(url);
await sql`
	create table if not exists guestbook (
		id         serial primary key,
		name       text not null check (char_length(name) between 1 and 40),
		message    text not null check (char_length(message) between 1 and 280),
		ip_hash    text not null,
		created_at timestamptz not null default now()
	)`;
await sql`create index if not exists guestbook_created_idx on guestbook (created_at desc)`;
await sql`create index if not exists guestbook_ip_recent_idx on guestbook (ip_hash, created_at desc)`;
console.log("guestbook table ready");
