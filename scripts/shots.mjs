/*
 * Screenshots every card that points at a live site, into assets/shots/.
 *
 * A card with a screenshot shows the real thing; a card without one falls back
 * to its drawn cover (_includes/cover.html). So a site that is down, slow, or
 * behind a login simply keeps its cover — nothing breaks, nothing is faked.
 *
 * GitHub-only cards are skipped: GitHub already renders a social image for
 * every public repo, and the card uses that instead.
 *
 *   npm run shots          (needs `npx playwright install chromium` once)
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const ROOT = new URL('../', import.meta.url);
const OUT = new URL('assets/shots/', ROOT);

// The data file is flat — a list of `- key: value` blocks — so a small reader
// is enough and the script keeps zero runtime dependencies.
function readSites(yaml) {
	const sites = [];
	let cur = null;
	for (const raw of yaml.split('\n')) {
		const line = raw.replace(/\s+#.*$/, '');
		if (/^\s*#/.test(line) || !line.trim()) continue;
		const m = /^\s*(-\s+)?([a-z_]+):\s*(.*)$/.exec(line);
		if (!m) continue;
		if (m[1]) { cur = {}; sites.push(cur); }
		if (cur) cur[m[2]] = m[3].trim();
	}
	return sites;
}

const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const sites = readSites(await readFile(new URL('_data/sites.yml', ROOT), 'utf8'))
	.filter((s) => s.url && /^https?:\/\//.test(s.url) && !/github\.com/.test(s.url))
	.map((s) => ({ slug: slugify(s.title), url: s.url }));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 1,
	colorScheme: 'light',
	reducedMotion: 'reduce',
});

let done = 0;
for (const s of sites) {
	const page = await ctx.newPage();
	try {
		// 'load', not 'networkidle': a Ghost site keeps connections open and never goes idle.
		await page.goto(s.url, { waitUntil: 'load', timeout: 30000 });
		await page.waitForTimeout(1500);
		const buf = await page.screenshot({ type: 'jpeg', quality: 72, clip: { x: 0, y: 0, width: 1280, height: 800 } });
		await writeFile(new URL(`${s.slug}.jpg`, OUT), buf);
		console.log(`  ✓ ${s.slug}`);
		done += 1;
	} catch (e) {
		console.log(`  – ${s.slug}: ${e.message.split('\n')[0]}`);
	} finally {
		await page.close();
	}
}

await browser.close();
console.log(`assets/shots — ${done}/${sites.length}`);
