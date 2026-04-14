# NewsWave — Static News Aggregator

A mobile-first static news aggregator that uses the GNews API to fetch real-time headlines. Built with HTML, CSS, and vanilla JavaScript (Alpine.js for UI bindings). Deployable on GitHub Pages from a single `index.html`.

## Features
- Mobile-first responsive layout (1 / 2 / 3 column grid)
- Top headlines hero + card grid
- Category filter with URL-hash routing
- Search with 500ms debounce
- Infinite scroll via IntersectionObserver
- Dark / Light mode (persisted in localStorage)
- Skeleton loaders and graceful error fallback
- Session caching to reduce API calls

## Files
- `index.html` — Main entry
- `config.js` — Put your GNews API key here
- `css/style.css`, `css/animations.css` — Styles
- `js/utils.js`, `js/api.js`, `js/ui.js`, `js/app.js` — JavaScript
- `assets/logo.svg`, `assets/placeholder.jpg` — Assets
- `.nojekyll` — Prevent GitHub Pages Jekyll processing

## Setup
1. Get a free API key from GNews: https://gnews.io
2. Open `config.js` and replace the placeholder with your API key:

```js
// Replace with your GNews API key from https://gnews.io
const API_KEY = 'REPLACE_WITH_YOUR_GNEWS_API_KEY';
```

3. Open `index.html` in a browser to run locally. No build step required.

## Deploy to GitHub Pages
1. Create a new repository (for example `newswave`).
2. Commit all files and push to GitHub.
3. In the repository settings -> Pages, set source to `main` branch -> `/ (root)`.
4. Wait a minute — your site will be available at `https://<username>.github.io/<repo>`.

## Notes & Troubleshooting
- Rate limits: Free GNews keys have limits (100 requests/day). Use session caching and pagination to reduce requests.
- If the API fails, the app shows skeletons and an error banner with a Retry button. Replace your API key if you see API errors.

## Accessibility
- Semantic HTML and ARIA labels are used for navigation and controls.
- All images have alt attributes and keyboard focus styles are present.

