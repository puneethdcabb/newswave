// API wrapper — powered by rss2json.com (no API key required)
(function(){
  const { RSS2JSON_BASE, RSS2JSON_KEY, CATEGORY_FEEDS, SEARCH_FEED } = window.GNEWS_CONFIG || {};
  const DEFAULT_MAX = 20;

  // Strip HTML tags that BBC RSS sometimes includes in descriptions
  function stripHtml(str){
    return str ? str.replace(/<[^>]*>/g, '').trim() : '';
  }

  // Map an rss2json item array to the article shape the rest of the app expects
  function normaliseItems(items, feedTitle){
    return items.map(item => ({
      title:       item.title || '',
      description: stripHtml(item.description || ''),
      content:     stripHtml(item.content     || ''),
      url:         item.link || item.guid || '#',
      // rss2json exposes thumbnail; enclosure.link is the fallback
      image:       item.thumbnail || (item.enclosure && (item.enclosure.thumbnail || item.enclosure.link)) || null,
      publishedAt: item.pubDate || new Date().toISOString(),
      source: {
        name: feedTitle || item.author || '',
        url:  ''
      }
    }));
  }

  async function fetchFeed(rssUrl, count){
    let url = `${RSS2JSON_BASE}?rss_url=${encodeURIComponent(rssUrl)}`;
    if(RSS2JSON_KEY) url += `&api_key=${RSS2JSON_KEY}&count=${count}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`rss2json ${res.status}`);
    const json = await res.json();
    // rss2json returns status:'ok' on success
    if(json.status !== 'ok') throw new Error(json.message || 'Feed error');
    return json;
  }

  async function topHeadlines({category='world', page=1, max=DEFAULT_MAX} = {}){
    // RSS feeds are not paginated — return empty for page > 1 so the
    // app's IntersectionObserver sets allLoaded = true after the first load.
    if(page > 1) return { totalArticles: 0, articles: [] };

    const rssUrl   = CATEGORY_FEEDS[category] || CATEGORY_FEEDS.world;
    const cacheKey = `top:${category}:${max}`;
    const cached   = window.NWUtils.sessionCache(cacheKey);
    if(cached) return cached;

    const json     = await fetchFeed(rssUrl, max);
    const articles = normaliseItems(json.items || [], json.feed && json.feed.title);
    const result   = { totalArticles: articles.length, articles };
    window.NWUtils.sessionCache(cacheKey, result, 120);
    return result;
  }

  async function searchNews({q, page=1, max=DEFAULT_MAX} = {}){
    if(page > 1) return { totalArticles: 0, articles: [] };

    const cacheKey = `search:${q}:${max}`;
    const cached   = window.NWUtils.sessionCache(cacheKey);
    if(cached) return cached;

    // Fetch ALL category feeds in parallel (free tier: ~10 items each × 7 feeds = ~70 articles)
    // then filter client-side — no API key or count param needed.
    const feedEntries = Object.entries(CATEGORY_FEEDS);
    const results = await Promise.allSettled(
      feedEntries.map(([, rssUrl]) => fetchFeed(rssUrl))
    );
    const seen = new Set();
    const all  = [];
    results.forEach((r, i) => {
      if(r.status !== 'fulfilled') return;
      const feedTitle = (r.value.feed && r.value.feed.title) || feedEntries[i][0];
      normaliseItems(r.value.items || [], feedTitle).forEach(a => {
        if(!seen.has(a.url)){ seen.add(a.url); all.push(a); }
      });
    });
    const ql       = q.toLowerCase();
    const filtered = all.filter(a =>
      (a.title + ' ' + a.description).toLowerCase().includes(ql)
    ).slice(0, max);

    const result = { totalArticles: filtered.length, articles: filtered };
    window.NWUtils.sessionCache(cacheKey, result, 60);
    return result;
  }

  window.NWApi = { topHeadlines, searchNews };
})();
