# NewsWave — Static News Aggregator

A mobile-first static news aggregator powered by **BBC RSS feeds** via [rss2json.com](https://rss2json.com). Built with HTML, CSS, and vanilla JavaScript (Alpine.js for UI bindings). Deployable on GitHub Pages from a single `index.html`. **No API key required.**

## Features
- Mobile-first responsive layout (1 / 2 / 3 column grid)
- Top headlines hero + card grid
- Category filter with URL-hash routing (World, Tech, Business, Sports, Health, Science, Entertainment)
- Search across all 7 BBC category feeds in parallel with 500ms debounce
- Dark / Light mode (persisted in localStorage)
- Skeleton loaders and graceful error fallback
- Session caching to reduce network requests

## Files
- `index.html` — Main entry
- `config.js` — RSS feed URLs and optional rss2json key
- `css/style.css`, `css/animations.css` — Styles
- `js/utils.js`, `js/api.js`, `js/ui.js`, `js/app.js` — JavaScript
- `assets/placeholder.jpg` — Fallback image

## Setup
No API key needed. Just open `index.html` in a browser — that's it.

```powershell
# Or serve locally with any static server, e.g.:
npx serve .
```

### Optional: raise article count per request
Register a free key at https://rss2json.com and add it to `config.js`:

```js
const RSS2JSON_KEY = 'YOUR_FREE_KEY'; // up to 50 items per feed
```

## Deploy to GitHub Pages
1. Create a new repository (e.g. `newswave`).
2. Commit all files and push to GitHub.
3. In the repository settings → Pages, set source to `main` branch → `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo>`.

## Notes & Troubleshooting
- Free rss2json tier returns up to 10 items per feed (~70 total across 7 feeds). Register a free key to raise this to 50 per feed.
- If a feed fails, the app shows an error banner with a Retry button.
- News data comes from BBC RSS feeds and may have up to a few minutes delay.

## Accessibility
- Semantic HTML and ARIA labels are used for navigation and controls.
- All images have alt attributes and keyboard focus styles are present.

