# Citadel Consortium — working notes

Static marketing site. **No build step, no backend, no database, no secrets.**
Netlify publishes `public/` (`netlify.toml`), so everything the site needs at
runtime must live in `public/` — keep it plain HTML/CSS/JS.

## Layout of the site

- `public/index.html` — the single page (all sections are anchors on it)
- `public/styles.css` — full design system (dark navy / burnished gold theme)
- `public/app.js` — progressive enhancement only: year, mobile menu, scroll
  reveals, ticker duplication, ambient constellation canvas
- `public/assets/` — logo + favicon

No framework, no bundler, no npm dependency is required to serve the site.

## Running locally (Base44 sandbox)

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Serves the repo's own `public/` directory (bind-mounted) on host port 3000
  using the same command the repo declares (`serve public`), so edits appear on
  refresh. There is no live-reload dev server: refresh the preview (or use the
  platform's reload) after editing.
- One service (`web`), `node:22-alpine`, `restart: on-failure`, HTTP healthcheck
  against `/` using node's built-in `fetch`.
- `BASE44_PREVIEW_MODE` is passed through unchanged (bare entry under
  `environment:`) for platform compatibility. Nothing in the site currently
  branches on it — the site is identical with it unset.
- Static `serve` accepts the sandbox's proxied `Host` header as-is, so no host
  allowlist edit was needed.

## Quirks

- `package.json`'s `npm start` uses `npx serve public`; the compose file
  installs `serve` at container startup so boot does not depend on `npx`.
- The hero backdrop and the two full-width image bands are hosted on the Base44
  media CDN. To make the repo self-contained for a Netlify deploy, download them
  into `public/assets/` and swap the `src` values.
- The ticker marquee loops on `translateX(-50%)`, so `app.js` duplicates the
  track's contents once — do not also hardcode the list twice in the HTML.
- Scroll reveals (`.reveal`) are animation-based; if `IntersectionObserver` is
  missing the elements are shown immediately.
