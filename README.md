# BoogerTimeClub

BoogerTimeClub is the brand information page for `boogertime.xyz`.

This repo contains a small React/Vite site, a static Node server for serving the built app, and an nginx setup script for the host-level `.xyz` deployment.
It also includes a live dashboard that reads the deployment spreadsheet and refreshes automatically in the browser.

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
- `public/Introduction to Da World - Deployment Master.xlsx` is the live dashboard source.
- `server.js` serves the built `dist/` output and falls back to `index.html` for SPA routes.
- `setup-nginx.sh` configures the `.xyz` hostnames for nginx deployment.
- The dashboard refreshes from the spreadsheet every 15 seconds.

## Dashboard Flow

1. Keep the spreadsheet in `public/` so Vite serves it as a static asset.
2. The React dashboard fetches the `.xlsx` file in the browser.
3. The dashboard parses the workbook and refreshes its state on a timer.
4. When the spreadsheet changes and the site is rebuilt or redeployed, the dashboard updates with the new data.

## Project Voice

The copy is intentionally direct and brand-forward. It is a brand information page first, not a product app.
