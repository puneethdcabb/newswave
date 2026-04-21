/* rss2json.com — converts any RSS feed to JSON, no API key required.
   Free tier: up to 10,000 requests / month, max 20 items per request.
   Optional: register a free key at https://rss2json.com and add it below
   to raise the limit to 50 items per request.
   const RSS2JSON_KEY = 'YOUR_FREE_KEY'; */

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';
const RSS2JSON_KEY  = '';   // leave empty — works without a key

const CATEGORY_FEEDS = {
  world:         'https://feeds.bbci.co.uk/news/world/rss.xml',
  technology:    'https://feeds.bbci.co.uk/news/technology/rss.xml',
  business:      'https://feeds.bbci.co.uk/news/business/rss.xml',
  sports:        'https://feeds.bbci.co.uk/news/sport/rss.xml',
  health:        'https://feeds.bbci.co.uk/news/health/rss.xml',
  science:       'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  entertainment: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'
};

window.GNEWS_CONFIG = { RSS2JSON_BASE, RSS2JSON_KEY, CATEGORY_FEEDS };
