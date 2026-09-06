<div align="center">

# links.imswarnil.com

**The index of everything I build.**
One page. Live data. Every link out.

[![Live](https://img.shields.io/badge/live-links.imswarnil.com-f04e2e?style=flat-square)](https://links.imswarnil.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square)](https://nextjs.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=flat-square)](https://workers.cloudflare.com)
[![Design system](https://img.shields.io/badge/design%20system-Swarnil-55556a?style=flat-square)](https://design.imswarnil.com/)

</div>

---

A single page that collects every site, theme, project, post and video I run and
sends you straight to them. Think linktree, built properly: a bento grid where
each card opens a real overview, a stats band with receipts, and the latest from
GitHub, Ghost and YouTube.

**There is no build step that bakes in data and no script to run.** The page is
server-rendered per request on Cloudflare Workers and fetches everything live,
so starring a repo, publishing a post, or adding an API key changes what
visitors see without a deploy.

It is styled after the [Swarnil Design System](https://design.imswarnil.com/):
oklch ramps on one lightness ladder, both themes declared once with
`light-dark()`, Inter worn four ways. Almost monochrome, so one colour can mean
something — the record light is rationed to what is actually live.

## Running it

```bash
npm install
cp .env.example .env.local     # every key optional
npm run dev                    # http://localhost:3400
```

**Port 3400 is pinned deliberately.** Port 3000 is taken by
`salesforce.imswarnil.com`, 3111 by Amantrika and 3300 by
`sponsor.imswarnil.com` — without a fixed port Next silently picks a free one
and you end up looking at somebody else's app.

Without `.env.local` the page still renders: it pulls GitHub anonymously and
Ghost's public site endpoint, and the Writing and Videos sections show their
empty states. Nothing is invented to fill a gap.

## What is on it

| Section | Where it comes from |
| :--- | :--- |
| Hero | `lib/content.ts` + the Ghost site's title, description and cover |
| Stats | GitHub, Ghost members and posts, YouTube — whichever have keys |
| **Now** | Ghost posts tagged `#now`, then the `/now/` page, then `content.ts` |
| Sites & projects | `lib/content.ts`, joined to GitHub for stars, language and last push |
| Latest writing | Ghost Content API |
| Latest videos | YouTube Data API |
| Elsewhere | `lib/content.ts` |
| Support the work | `lib/content.ts`, plus real Ghost tier prices |
| Everything else | every public repo not already a card above |

## How it is put together

```
app/page.tsx            the page — one server component, one data call
app/layout.tsx          shell, metadata, the pre-paint theme/boot script
app/globals.css         the whole design system, as tokens
app/components/
  TopBar.tsx            client: theme, stuck state, timecode
  Work.tsx              client: the grid, its search, and the overview dialog
  Motion.tsx            client: scroll reveals and the counting numbers
  Cover.tsx             the drawn cover art, eight motifs
  icons.tsx             the UI icon set and the brand marks
lib/
  content.ts            everything authored — cards, socials, support, profile
  data.ts               everything fetched — GitHub, Ghost, YouTube
  view.ts               server → client view models
  motif.ts              which cover a card gets
  format.ts             number and date shapes
```

Every fetch is cached for fifteen minutes (`REVALIDATE` in `lib/data.ts`), so
the page costs three API round-trips a quarter of an hour rather than three per
visitor. Each source fails alone: a GitHub rate-limit cannot take the Ghost
section down with it.

### The covers are not decoration

A card's face is a drawn SVG whose motif says what the thing actually *is* — a
token ladder for a design system, a page skeleton for a theme, a lesson stack
for a curriculum, a nine-mark grid for an icon set. `lib/motif.ts` picks it from
the card's `kind` first and the README's own words second, and each motif has
two arrangements so neighbours are never the same picture.

They are drawn inline rather than linked so they paint in the page's own tokens
and flip with the theme. Nothing in them is a fixed hex.

## Secrets

Runtime secrets live on the Worker, not in the build:

```bash
npx wrangler secret put GH_TOKEN            # essential in prod: 60 req/hr → 5000
npx wrangler secret put GHOST_CONTENT_KEY   # posts, #now, /now/, tier prices
npx wrangler secret put GHOST_ADMIN_KEY     # member counts (id:secret)
npx wrangler secret put YOUTUBE_API_KEY
npx wrangler secret put YOUTUBE_CHANNEL     # a UC… id or an @handle
```

Because they are read at request time, adding one takes effect on the next page
view — no redeploy.

CI needs two repository secrets instead: `CLOUDFLARE_API_TOKEN` (the "Edit
Cloudflare Workers" template, plus Zone → DNS → Read on `imswarnil.com`) and
`CLOUDFLARE_ACCOUNT_ID`.

## Deploying

```bash
npm run preview      # build + run it on workerd locally
npm run cf:deploy    # build + ship it
```

Pushing to `main` does the same thing through `.github/workflows/deploy.yml`.

`wrangler.jsonc` attaches a **Worker Route** — `links.imswarnil.com/*` on the
`imswarnil.com` zone — which is the same pattern `nac.imswarnil.com` uses. It
binds to whatever DNS record already exists, so add a **proxied** record for
`links` in Cloudflare first; the Worker never owns the DNS entry itself.

## Adding a card

Edit **`lib/content.ts`**. Add an entry to `CARDS` and a card appears; delete it
and it goes. It is TypeScript rather than YAML for one reason that matters: a
typo in a `kind` is a build error instead of a card that silently renders wrong.

```ts
{
  title: "My New Thing",
  url: "https://example.com",
  blurb: "One line. The grid is scannable, not read.",
  kind: "project",
  repo: "my-new-thing",   // joins the card to GitHub: stars, language, README
  span: "wide",
  meta: "Vue · open source",
  status: "live",
  icon: "layers",
  tags: ["One", "Two"],
}
```

| Field | | What it does |
| :--- | :--- | :--- |
| `title` `url` `blurb` `kind` | required | `kind` also picks the cover motif and the filter chips |
| `repo` | optional | GitHub repo name — pulls stars, language, last push, README; keeps it out of "everything else" |
| `span` | optional | `hero` (4×2) · `wide` (3×1) — omit for 2×1 |
| `meta` | optional | The small line: stack, role, licence |
| `status` | optional | `live` · `building` · `soon` · `archived` |
| `accent` | optional | `craft` — amber brackets. Means "in progress", never "live" |
| `icon` `tags` | optional | Chips are best on `hero` and `wide` cards |

## Keeping the Now section current

Tag a short post `#now` on imswarnil.com and it appears at the top of the Now
section within fifteen minutes — no deploy, no edit here. Failing that the
`/now/` page is used, and failing that the standing lines in `lib/content.ts`.
