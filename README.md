# Citadel Consortium

Modern holding company website for Citadel Consortium.

## Local Development

```bash
npm start
```

The site runs at `http://localhost:3000` by default.

## Railway Deployment

Railway can deploy this repository with Nixpacks. The included `railway.toml`
sets the start command to:

```bash
npm start
```

The server reads Railway's `PORT` environment variable automatically.
