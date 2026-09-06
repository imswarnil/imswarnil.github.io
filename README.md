<div align="center">

# links.imswarnil.com

**A sticky hero on the left. On the right, a bento of cards that each look
like the platform they point to — and each open into their detail.**

[![Next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square)](https://nextjs.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=flat-square)](https://workers.cloudflare.com)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00e599?style=flat-square)](https://neon.tech)
[![Design system](https://img.shields.io/badge/design%20system-Swarnil-55556a?style=flat-square)](https://design.imswarnil.com/)

</div>

---

Built **on** the [Swarnil Design System](https://design.imswarnil.com/), not on
a copy of its tokens: `app/design-system.css` is the system's own built CSS,
vendored from `design.imswarnil.com/dist`, and `app/globals.css` sits outside
its `@layer`s doing only layout and the platform dressing. No `!important`,
anywhere.

Server-rendered per request on Cloudflare Workers. Every number is fetched live
and cached fifteen minutes; there is no build step and nothing to run.

## The cards

Each card has a compact face and, behind the corner button, a detail view.
Both are server-rendered — the button only opens a `<dialog>` that was in the
HTML all along. Where a service is not connected, the detail says which secret
would connect it. Nothing is invented to fill a gap.

| Card | Face | Detail | Needs |
| :--- | :--- | :--- | :--- |
| YouTube | latest video tile | **live** subscriber count, views, videos, six recent uploads | `YOUTUBE_API_KEY` `YOUTUBE_CHANNEL` |
| Quick links | six of the sites | every site & project as a tile with its own drawn SVG cover | — |
| LinkedIn | résumé rows + Connect | summary, highlights, full experience, education | — (authored) |
| X | latest post as a tweet | followers / following / posts, five latest | `X_BEARER_TOKEN` |
| Portfolio | allocation bars | every holding, by percentage — never amounts | — (authored, see below) |
| Spotify | now playing / last played | top ten tracks, last four weeks | `SPOTIFY_CLIENT_ID` `_SECRET` `_REFRESH_TOKEN` |
| Instagram | a post, with a heart that pops | follow CTA | `INSTAGRAM_ACCESS_TOKEN` (not built yet) |
| Blog | three latest posts | member count, paid vs free, a 30-day growth sparkline, six posts | `GHOST_CONTENT_KEY` `GHOST_ADMIN_KEY` |
| GitHub | profile + top three repos | followers / repos / stars, every repo as a tile with its cover | `GH_TOKEN` (rate limit) |
| Guestbook | form + three entries | form + all entries | `DATABASE_URL` (Neon) |
| Now | one line | the `#now` log, hours, what I am open to | — |
| Newsletter | inline subscribe form | subscribe form | — (Ghost sends the link) |

**Per-project covers** are drawn SVG, chosen by `lib/motif.ts` from the card's
kind first and the README's own words second — a token ladder for a design
system, a page skeleton for a theme, a lesson stack for a curriculum.

**Portfolio.** Kite Connect needs a fresh login token every trading day, which
a page cannot do for itself. So holdings are authored in `PORTFOLIO` in
`lib/content.ts` — names and percentages, refreshed by hand when they change.

## Running it

```bash
npm install
cp .env.example .env.local     # every key optional
npm run dev                    # http://localhost:3300
```

The port is pinned on purpose — every Next app in `~/Swarnil` has its own.

**Do not run `npm run build` while `npm run dev` is running.** Both write to
`.next`; the build clobbers the dev server's client chunks and the page stops
hydrating with no error anywhere. Stop dev, build, then `rm -rf .next` before
starting dev again.

## The guestbook

Neon over HTTP, same driver as `nac.imswarnil.com`.

```bash
DATABASE_URL=postgres://… npm run db:init      # once; safe to re-run
npx wrangler secret put DATABASE_URL           # production
```

`POST /api/guestbook` validates, rejects links, drops honeypot submissions
silently, and allows three signatures an hour per salted-hashed IP.

## Secrets

Runtime secrets live on the Worker, read at request time — adding one changes
the live page on the next view:

```bash
npx wrangler secret put GH_TOKEN               # do this one first: anonymous GitHub is 60 req/hr
npx wrangler secret put GHOST_CONTENT_KEY
npx wrangler secret put GHOST_ADMIN_KEY
npx wrangler secret put YOUTUBE_API_KEY
npx wrangler secret put YOUTUBE_CHANNEL
npx wrangler secret put X_BEARER_TOKEN
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
npx wrangler secret put SPOTIFY_REFRESH_TOKEN  # scopes: user-read-currently-playing user-read-recently-played user-top-read
npx wrangler secret put DATABASE_URL
```

CI needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repo secrets.

## Deploying

```bash
npm run preview      # build + run on workerd locally
npm run cf:deploy    # build + ship
```

Pushing to `main` does the same via `.github/workflows/deploy.yml`.
`wrangler.jsonc` attaches a Worker Route to `links.imswarnil.com/*`, so add a
**proxied** DNS record for `links` in Cloudflare first.

## Layout

```
app/page.tsx                  the split, and which card goes in which column
app/components/Cards.tsx      one function per card: compact face + detail
app/components/Expand.tsx     the corner button and the <dialog> it opens
app/components/Live.tsx       client: live subscriber count, subscribe form, the like
app/components/Guestbook.tsx  client: the guestbook form and list
app/components/Cover.tsx      the drawn SVG covers, eight motifs
app/components/Sparkline.tsx  the members-over-time line
app/api/youtube/route.ts      live subscriber count (the key stays here)
app/api/subscribe/route.ts    newsletter → Ghost send-magic-link
app/api/guestbook/route.ts    GET list · POST sign
app/design-system.css         the design system, vendored build
lib/content.ts                everything authored — cards, roles, summary, portfolio
lib/data.ts                   everything fetched — GitHub, Ghost, YouTube, X, Spotify
lib/motif.ts                  which cover a project gets
lib/db.ts                     Neon: list, count, add, rate-limit
```

To refresh the vendored design system after it changes:
`cp ../design.imswarnil.com/dist/swarnil-design.min.css app/design-system.css`.
