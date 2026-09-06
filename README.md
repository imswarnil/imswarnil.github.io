<div align="center">

# links.imswarnil.com

**The index of everything I build.**
One page. Live numbers. Every link out.

[![Live](https://img.shields.io/badge/live-links.imswarnil.com-f04e2e?style=flat-square)](https://links.imswarnil.com)
[![Built with Jekyll](https://img.shields.io/badge/built%20with-Jekyll-c1872a?style=flat-square)](https://jekyllrb.com)
[![Design system](https://img.shields.io/badge/design%20system-Swarnil-55556a?style=flat-square)](https://design.imswarnil.com/)

</div>

---

A single static page that collects every site, theme, project, post and video I
run and sends you straight to them. Think linktree, built properly: a bento
grid where each card opens a real overview, a stats band with receipts, and the
latest from GitHub, Ghost and YouTube — rebuilt every six hours so nothing on it
is stale.

It is styled after the [Swarnil Design System](https://design.imswarnil.com/):
oklch ramps on one lightness ladder, both themes declared once with
`light-dark()`, Inter worn four ways. Almost monochrome, so one colour can mean
something — the record light is rationed to what is actually live.

## What is on it

| Section | Where it comes from |
| :--- | :--- |
| Hero | `_data/profile.yml` + the Ghost site's title, description and cover |
| Stats | GitHub, Ghost members and posts, YouTube — whichever have keys |
| **Now** | Ghost posts tagged `#now`, then the `/now/` page, then `profile.yml` |
| Sites & projects | `_data/sites.yml`, joined to GitHub for stars and last push |
| Latest writing | Ghost Content API |
| Latest videos | YouTube Data API |
| Elsewhere | `_data/social.yml` |
| Support the work | `_data/support.yml`, plus real Ghost tier prices |
| Everything else | every public repo not already a card above |

## How it works

```
_data/sites.yml        the cards — the file you edit most
_data/social.yml       the social tiles
_data/support.yml      the support / monetise band
_data/profile.yml      name, role, place, and the standing "now"
_data/live/*.json      every number and every README — gitignored, rebuilt each deploy
assets/shots/*.jpg     a screenshot per live site — gitignored
_includes/cover.html   the drawn cover art, one motif per kind of thing
_includes/sheet.html   the overview a card opens
```

On every push and every six hours, `.github/workflows/pages.yml`:

1. **`npm run fetch`** — GitHub (repos, stars, followers, and each README's lead
   line and headings), Ghost (site, posts, `#now`, `/now/`, tiers, member
   counts) and YouTube (subscribers, views, uploads);
2. **`npm run covers`** — reads those READMEs and picks each card's cover motif;
3. **`npm run shots`** — Playwright screenshots each card's live URL;
4. builds with Jekyll and deploys to GitHub Pages.

Nothing is written back to the repo. Secrets live in the workflow and only
there. Every source degrades on its own: with no Ghost key the site's title,
description and cover still come from its public endpoint; with no YouTube
channel that section stays honestly empty.

### The covers are not decoration

A card's face is a drawn SVG, never a screenshot — twelve photographs at twelve
colour temperatures is exactly the clutter a grid should avoid. The motif is
chosen from what the project actually *is*: a token ladder for a design system,
a page skeleton for a theme, a lesson stack for a curriculum, a nine-mark grid
for an icon set. `scripts/covers.mjs` picks it from the card's `kind` first and
the README's own words second.

The real screenshot lives one click away, in the overview sheet, where it has
room to be looked at.

## Secrets

Set these in **Settings → Secrets and variables → Actions**. All optional.

| Secret | What it unlocks |
| :--- | :--- |
| `GHOST_URL` | defaults to `https://www.imswarnil.com` |
| `GHOST_CONTENT_KEY` | latest posts, post count, `#now` updates, the `/now/` page, tier prices |
| `GHOST_ADMIN_KEY` | member counts (`id:secret`; used server-side only, never shipped) |
| `YOUTUBE_API_KEY` | channel stats and the six latest uploads |
| `YOUTUBE_CHANNEL` | a `UC…` id or an `@handle` |

`GITHUB_TOKEN` is provided by Actions. Pages must be set to deploy from
**GitHub Actions**, not from a branch.

For a subscriber count that refreshes live in the visitor's browser, put a
**referrer-restricted** YouTube key in `_config.yml` → `youtube_public_key`.
That key is public by design; restrict it to this domain first.

## Running it locally

```bash
npm install                        # Playwright, for screenshots
cp .env.example .env               # paste keys; every one is optional
npm run data                       # fetch + covers + shots
jekyll serve --port 4001           # http://localhost:4001
```

Without `.env`, `fetch` still pulls GitHub (via `gh auth token` if you are
logged in) and Ghost's public site info. Port 4001, because 4000 is usually
already taken by another Jekyll site.

## Adding a card

Edit **`_data/sites.yml`**. Add an entry, get a card; delete it, the card goes.

```yaml
- title: My New Thing
  url: https://example.com
  blurb: One line. The grid is scannable, not read.
  kind: project
  repo: my-new-thing        # joins the card to GitHub: stars, language, last push
  span: wide
  meta: Vue · open source
  status: live
  icon: layers
  tags: [One, Two]
```

| Field | | What it does |
| :--- | :--- | :--- |
| `title` | required | The card's name |
| `url` | required | Where the card sends you |
| `blurb` | required | One line |
| `kind` | required | `site` · `theme` · `project` · `tool` — also picks the cover motif and the filter chips |
| `repo` | optional | GitHub repo name — pulls stars, language, last push, README; keeps it out of "everything else" |
| `span` | optional | `hero` (4×2) · `wide` (3×1) — omit for 2×1 |
| `meta` | optional | The small line: stack, role, licence |
| `status` | optional | `live` · `building` · `soon` · `archived` — defaults to `live` |
| `accent` | optional | `craft` — amber brackets. Means "in progress", never "live" |
| `icon` | optional | `ghost` `palette` `book` `layers` `code` `play` `spark` `grid` `briefcase` `shield` `badge` `pen` |
| `tags` | optional | Chips. Best on `hero` and `wide` cards |

Every public repo that is not already a card appears in **Everything else on
GitHub**, automatically.

## Keeping the Now section current

Tag a short post `#now` on imswarnil.com and it appears at the top of the Now
section within six hours — no deploy, no edit here. Failing that the `/now/`
page is used, and failing that the standing lines in `_data/profile.yml`.

## Domain

`CNAME` says `links.imswarnil.com`. Point a DNS `CNAME` record for `links` at
`imswarnil.github.io`, then enable *Enforce HTTPS* in the Pages settings.
