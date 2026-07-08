# Citadel Consortium

Modern holding company website for Citadel Consortium.

## Local Development

```bash
npm start
```

This serves the static site from `public/`.

## Netlify Deployment

Netlify can deploy this repository directly. The included `netlify.toml` uses:

- Publish directory: `public`
- Build command: none
- Redirect fallback: all routes serve `/index.html`
