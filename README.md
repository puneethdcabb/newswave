# NewsWave — Static News Aggregator

A lightweight, mobile-first static news site that aggregates headlines from **BBC News RSS feeds** using the rss2json.com converter. It runs entirely in the browser — no backend required and no API key is necessary for the default setup.

## Highlights
- Uses BBC category RSS feeds (World, Technology, Business, Sports, Health, Science, Entertainment)
- Search queries all 7 feeds in parallel and filters results client-side
- Client-side session caching to reduce repeated network requests
- Dark / Light mode, skeleton loaders, and graceful error banners

## Files
- `index.html` — Main entry
- `config.js` — Feed map and optional `RSS2JSON_KEY` (leave empty to use free tier)
- `css/` — Styles
- `js/` — App code: `utils.js`, `api.js`, `ui.js`, `app.js`

## How it loads news
1. Browser requests a BBC RSS feed URL via rss2json:
	`https://api.rss2json.com/v1/api.json?rss_url=<BBC_FEED_URL>`
2. rss2json converts the XML to JSON and returns it to the browser
3. `js/api.js` normalises items into the article shape used by the UI

Search behavior: the app fetches all 7 category feeds in parallel (~10 items per feed on the free tier), deduplicates articles by URL, then performs a client-side filter to return matches.

## API / Rate & limits
- Free (no key): rss2json returns up to **10 items per feed** and allows ~10,000 requests/month.
- Optional free key: register at https://rss2json.com to increase `count` (up to 50 items per feed). Add the key to `config.js` in `RSS2JSON_KEY` to enable the larger `count` parameter.

## Implementation notes (where to change things)
- Feed list: edit `CATEGORY_FEEDS` in `config.js` to add/remove sources or change feeds.
- Optional key: set `RSS2JSON_KEY` in `config.js`; when present the app will include the `count` parameter.
- Cache TTLs: see `js/api.js` — top headlines cached 120s, search cached 60s (sessionStorage).
- Pagination: RSS feeds are not paginated. The app sets `allLoaded = true` after the first fetch and hides "Load More".

## Local dev
Open `index.html` directly or serve with a static server for better local testing:

```bash
npx serve .
# or
python -m http.server 8000
```

## Troubleshooting
- If no results appear, open DevTools → Network and Console to check for failed requests to `api.rss2json.com` or CORS errors.
- If you want more articles per feed, register at rss2json and add the key to `config.js`.

## Attribution
News content: BBC News RSS feeds — https://www.bbc.com/news
RSS→JSON proxy: rss2json — https://rss2json.com

## Accessibility
- Semantic HTML and ARIA labels are used for navigation and controls.
- All images have alt attributes and keyboard focus styles are present.

---
Commit history: recent refactor replaced GNews with BBC RSS + rss2json and improved search across multiple feeds.

