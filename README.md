# imswarnil.github.io

The index of everything I build. One page, one bento grid, every link out.
No collections, no post pages — every card is a redirect.

Styled after [Frame & Signal](https://creator.imswarnil.com/): near-monochrome
ink, vermilion as the record light, Space Grotesk / Inter / IBM Plex Mono.

## Adding a card

Edit **`_data/sites.yml`**. That's the whole workflow — add an entry, get a card.

```yaml
- title: My New Thing
  url: https://example.com
  blurb: One line. The grid is scannable, not read.
  kind: project          # site | theme | project | code | video | social
  span: wide             # hero (2x2) | wide (2x1) | tall (1x2) | omit for 1x1
  meta: Vue · open source
  status: live           # live | building | soon | archived
  icon: layers           # ghost palette book layers code play spark
  tags: [One, Two]       # optional chips — best on hero/wide only
```

`span: hero` also draws the animated signal-meter bars. `accent: craft` swaps the
hover brackets from vermilion to amber — ration it, one per page at most.

## Video

`_data/videos.yml` is **deliberately empty**. Add `channel.url` and entries under
`items` (each needs the YouTube `id`) and the section switches on; thumbnails are
pulled straight from YouTube. Until then the page shows an honest empty state.

## Run it

```bash
bundle install     # first time only
jekyll serve       # http://localhost:4000
```

## Deploying

Pushing to `main` publishes to <https://imswarnil.github.io> — GitHub Pages builds
Jekyll natively, no Actions workflow needed.

To serve it at **sites.imswarnil.com** instead:

1. Add a DNS `CNAME` record: `sites` → `imswarnil.github.io`
2. `mv CNAME.example CNAME` and push

Do those in that order. A `CNAME` file committed before the DNS record exists takes
the site offline until DNS propagates.
