# BoogerTimeClub

BoogerTimeClub is the brand information page for `boogertime.xyz`.

This repo contains a small React/Vite site, a static Node server for serving the built app, and an nginx setup script for the host-level `.xyz` deployment.

## Domains

- `boogertime.xyz` - primary brand page
- `www.boogertime.xyz` - canonical alias
- `boogertime.shop` - legacy compatibility name
- `boogertime.club` - reserved brand identity

## Route Map

The page presents a small route map for the brand:

- `/` - landing page
- `/api` - service lane
- `/dash` - operator view
- `/booger` - internal access

The Node server also exposes:

- `/healthz` - health check that returns `ok`

## Local Workflow

```bash
npm install
npm run dev
```

For a production-style local run:

```bash
npm run build
npm start
```

## Deployment Notes

- `src/App.jsx` is the source of truth for the brand page content and domain labels.
- `server.js` serves the built `dist/` output and falls back to `index.html` for SPA routes.
- `setup-nginx.sh` configures the `.xyz` hostnames for nginx deployment.

## Project Voice

The copy is intentionally direct and brand-forward. It is a brand information page first, not a product app.
