import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext adapter config.
 *
 * Defaults are right for this app. There is one route, it revalidates on a
 * timer (see `revalidate` in app/page.tsx), and the only state anywhere is the
 * upstream APIs — nothing is written, so there is no cache to keep coherent
 * between isolates. Each isolate re-rendering on its own schedule is correct
 * behaviour here, not a gap.
 *
 * If the page ever needs a shared cache — because it starts writing something,
 * or because GitHub rate limits begin to bite — add an incremental cache
 * override here (R2 or KV) rather than reaching for a database.
 */
export default defineCloudflareConfig();
