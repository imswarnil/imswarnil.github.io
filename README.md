<div align="center">

# links.imswarnil.com

**A link tree.** One column, every link, live numbers.

[![Next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square)](https://nextjs.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=flat-square)](https://workers.cloudflare.com)
[![Design system](https://img.shields.io/badge/design%20system-Swarnil-55556a?style=flat-square)](https://design.imswarnil.com/)

</div>

---

Avatar, name, one line, a stack of links, a row of socials. Nothing to
operate.

What makes it more than a static list: it is server-rendered per request on
Cloudflare Workers, so the star counts and "last pushed" times beside each link
come from GitHub, the bio and latest posts from Ghost, and the "now" line from
whatever post is tagged `#now` — all live, cached fifteen minutes, no build
step and nothing to run.

Styled after the [Swarnil Design System](https://design.imswarnil.com/): one
face, oklch tokens, both themes from one declaration. The accent appears twice
on the whole page — the now-dot and the one link that asks for something.

## Running it

```bash
npm install
cp .env.example .env.local     # every key optional
npm run dev                    # http://localhost:3300
```

The port is pinned on purpose: every Next app in `~/Swarnil` has its own, and
an unpinned one silently lands on someone else's.

## Editing it

- **Links** — `CARDS` in `lib/content.ts`. Add an entry, get a link. A `repo`
  field joins it to GitHub for stars and last push.
- **Support links** — `SUPPORT` in the same file. `status: "soon"` hides one.
- **Socials** — `SOCIALS`. The blog is deliberately not there; it is the first
  link.
- **The now line** — tag a post `#now` on imswarnil.com. Failing that, it
  prints `PROFILE.now.role`.

## Secrets

Runtime secrets live on the Worker, read at request time:

```bash
npx wrangler secret put GH_TOKEN            # essential: anonymous GitHub is 60 req/hr
npx wrangler secret put GHOST_CONTENT_KEY   # latest posts, the #now line
npx wrangler secret put GHOST_ADMIN_KEY     # (unused on this page; kept for the API layer)
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
app/page.tsx                 the page — one server component, one data call
app/layout.tsx               shell, metadata, the pre-paint theme script
app/globals.css              tokens + the link styles
app/components/icons.tsx     UI icons and brand marks
app/components/ThemeToggle.tsx
lib/content.ts               everything authored
lib/data.ts                  everything fetched — GitHub, Ghost, YouTube
lib/format.ts                number and date shapes
```
