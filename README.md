<div align="center">

# links.imswarnil.com

**A sticky hero on the left. On the right, a bento of cards that each look like
the platform they point to.**

[![Next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square)](https://nextjs.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=flat-square)](https://workers.cloudflare.com)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00e599?style=flat-square)](https://neon.tech)
[![Design system](https://img.shields.io/badge/design%20system-Swarnil-55556a?style=flat-square)](https://design.imswarnil.com/)

</div>

---

A YouTube tile, an Instagram post, a LinkedIn résumé, a GitHub profile, a
tweet, a "now playing", the latest posts from the blog, a guestbook people can
sign — you know where a card goes before you read it. The two columns on the
right drift at different rates as you scroll (CSS scroll-driven animation, no
listener; off on phones).

Server-rendered per request on Cloudflare Workers. Every number is fetched
live and cached fifteen minutes: no build step, nothing to run. The page stays
almost monochrome; platform colours live only inside the small brand chips.

## Running it

```bash
npm install
cp .env.example .env.local     # every key optional
npm run dev                    # http://localhost:3300
```

The port is pinned on purpose — every Next app in `~/Swarnil` has its own.

Without any keys: GitHub is fetched anonymously (60 req/hr), Ghost's public
site endpoint gives the bio, and the YouTube / blog / Spotify / guestbook cards
show honest "not connected" states.

## The cards

| Card | Draws | Data |
| :--- | :--- | :--- |
| YouTube | a video tile | `YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL` |
| Sites & projects | a list | `CARDS` in `lib/content.ts`, joined to GitHub |
| LinkedIn | a résumé | `ROLES` in `lib/content.ts` |
| X | a tweet | `PROFILE.tagline` |
| Spotify | now playing | *(placeholder until `SPOTIFY_*` exists)* |
| Instagram | a post | Ghost cover image + `HANDLES.instagram` |
| Blog | latest posts | `GHOST_CONTENT_KEY` |
| GitHub | a profile + top repos | live |
| **Guestbook** | a form + entries | **Neon**, `DATABASE_URL` |
| Now | one line + facts | Ghost `#now` post, else `PROFILE.now` |
| Newsletter | a CTA | Ghost signup URL, member count with `GHOST_ADMIN_KEY` |

Column placement is by hand in `app/page.tsx` so the two tallest cards land on
different sides.

## The guestbook

The one thing on the page that is written. Neon over HTTP, same driver as
`nac.imswarnil.com`.

```bash
# 1. create a Neon project, copy the connection string
# 2. locally:
DATABASE_URL=postgres://… npm run db:init      # creates the table, safe to re-run
# 3. in production:
npx wrangler secret put DATABASE_URL
```

`POST /api/guestbook` validates name (2–40) and message (2–280), rejects links,
drops honeypot submissions silently, and allows three signatures an hour per
hashed IP. The IP is hashed with `GUESTBOOK_SALT` before it is stored — enough
to rate-limit, not enough to identify.

## Secrets

Runtime secrets live on the Worker, read at request time — adding one changes
the live page on the next view:

```bash
npx wrangler secret put GH_TOKEN            # do this one first
npx wrangler secret put GHOST_CONTENT_KEY
npx wrangler secret put GHOST_ADMIN_KEY
npx wrangler secret put YOUTUBE_API_KEY
npx wrangler secret put YOUTUBE_CHANNEL
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
app/components/Cards.tsx      one function per platform card
app/components/Guestbook.tsx  client: the form and the list
app/api/guestbook/route.ts    GET list · POST sign
lib/content.ts                everything authored — cards, roles, handles, profile
lib/data.ts                   everything fetched — GitHub, Ghost, YouTube
lib/db.ts                     Neon: list, count, add, rate-limit
scripts/init-db.mjs           one-time table creation
```
