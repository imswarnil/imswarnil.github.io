<div align="center">

# imswarnil.github.io

**The index of everything I build.**
One page. One bento grid. Every link out.

[![Live](https://img.shields.io/badge/live-imswarnil.github.io-f04e2e?style=flat-square)](https://imswarnil.github.io)
[![Built with Jekyll](https://img.shields.io/badge/built%20with-Jekyll-c1872a?style=flat-square)](https://jekyllrb.com)
[![Design system](https://img.shields.io/badge/design%20system-Frame%20%26%20Signal-55556a?style=flat-square)](https://creator.imswarnil.com/)

</div>

---

A single static page that collects every site, theme and project I run, and sends
you straight to them. There are **no collections, no post pages, no CMS** — each
card is a redirect and nothing more. Think linktree, built properly.

It is styled after [Frame & Signal](https://creator.imswarnil.com/), my design
system: a near-monochrome ink ramp, vermilion rationed as the record light, and
Space Grotesk / Inter / IBM Plex Mono. Light and dark come from one token set.

## Adding a card

Edit **`_data/sites.yml`**. That is the whole workflow — add an entry, get a card;
delete it, the card goes.

```yaml
- title: My New Thing
  url: https://example.com
  blurb: One line. The grid is scannable, not read.
  kind: project
  span: wide
  meta: Vue · open source
  status: live
  icon: layers
  tags: [One, Two]
```

| Field    |          | What it does                                                          |
| :------- | :------- | :-------------------------------------------------------------------- |
| `title`  | required | The card's name                                                        |
| `url`    | required | Where the card sends you                                               |
| `blurb`  | required | One line — the grid is scannable, not read                             |
| `kind`   | required | `site` · `theme` · `project` · `code` · `video` · `social`             |
| `span`   | optional | `hero` (2×2) · `wide` (2×1) · `tall` (1×2) — omit for 1×1              |
| `meta`   | optional | The mono line under the title: stack, role, licence                    |
| `status` | optional | `live` · `building` · `soon` · `archived` — defaults to `live`         |
| `accent` | optional | `signal` or `craft`. Swaps the hover brackets to amber                 |
| `icon`   | optional | `ghost` `palette` `book` `layers` `code` `play` `spark`                |
| `tags`   | optional | Small chips. Best on `hero` and `wide` cards only                      |

`span: hero` also draws the animated signal-meter bars behind the tile.
`accent: craft` is the rationed one — one per page at most.

## Video

`_data/videos.yml` ships **empty on purpose**. Add a `channel.url` and entries under
`items` (each needs a YouTube `id`) and the section switches itself on, pulling
thumbnails straight from YouTube. Until then the page shows an honest empty state
rather than placeholder links.

```yaml
channel:
  url: https://www.youtube.com/@yourhandle

items:
  - id: dQw4w9WgXcQ
    title: What the video is called
    meta: 12:04 · CSS layout
    span: wide
```

## Motion

Every animation is on-brand rather than decorative, and all of it sits behind
`prefers-reduced-motion`:

- a pulsing **record light** in the mark and on every `live` pill
- an **audio meter** breathing behind the hero tile
- a **waveform** that draws itself once on load
- **viewfinder brackets** that ease into each card's corners on hover

## Running it

```bash
bundle install     # first time only
jekyll serve       # → http://localhost:4000
```

## Deploying

Pushing to `main` publishes to **<https://imswarnil.github.io>**. GitHub Pages builds
Jekyll natively — there is no Actions workflow and no build step to maintain.

<details>
<summary><strong>Serving it at <code>sites.imswarnil.com</code> instead</strong></summary>

<br>

1. Add a DNS record: `CNAME` · host `sites` · value `imswarnil.github.io`
2. Wait for it to resolve — `dig +short sites.imswarnil.com`
3. `mv CNAME.example CNAME`, commit and push

**Do those in that order.** A `CNAME` file committed before the DNS record exists
takes the site offline until propagation catches up.

</details>

## Layout

```
_data/sites.yml       every card on the page — the only file you normally edit
_data/videos.yml      YouTube; empty until a channel is wired up
_includes/card.html   one YAML entry → one tile
_includes/icon.html   the inline SVG set
_layouts/default.html head, fonts, no-flash theme script
assets/css/style.css  Frame & Signal tokens, copied in so this deploys alone
index.html            the masthead and the two grids
```

The design-system tokens are **copied into this repo**, not imported. The page has no
npm dependency and no build step, so it stays deployable on its own.

---

<div align="center">
<sub><a href="https://imswarnil.com">imswarnil.com</a> · <a href="https://creator.imswarnil.com/">Frame &amp; Signal</a> · <a href="https://github.com/imswarnil">@imswarnil</a></sub>
</div>
