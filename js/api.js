// API wrapper for GNews
(function(){
  const { API_KEY, API_BASE } = window.GNEWS_CONFIG || {};
  const DEFAULT_LANG = 'en';
  const DEFAULT_MAX = 20;

  async function fetchJSON(url){
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      return json;
    }catch(err){
      throw err;
    }
  }

  async function topHeadlines({category='world', page=1, max=DEFAULT_MAX} = {}){
    // GNews supports 'topic' param for categories; if not, fallback to q
    const topic = category || 'world';
    const url = `${API_BASE}/top-headlines?token=${API_KEY}&lang=${DEFAULT_LANG}&max=${max}&page=${page}&topic=${encodeURIComponent(topic)}`;
    const cacheKey = `top:${category}:${page}:${max}`;
    const cached = window.NWUtils.sessionCache(cacheKey);
    if(cached) return cached;
    try{
      const data = await fetchJSON(url);
      window.NWUtils.sessionCache(cacheKey, data, 120);
      return data;
    }catch(err){
      throw err;
    }
  }

  async function searchNews({q, page=1, max=DEFAULT_MAX} = {}){
    const url = `${API_BASE}/search?q=${encodeURIComponent(q)}&token=${API_KEY}&lang=${DEFAULT_LANG}&max=${max}&page=${page}`;
    const cacheKey = `search:${q}:${page}:${max}`;
    const cached = window.NWUtils.sessionCache(cacheKey);
    if(cached) return cached;
    try{
      const data = await fetchJSON(url);
      window.NWUtils.sessionCache(cacheKey, data, 60);
      return data;
    }catch(err){
      throw err;
    }
  }

  window.NWApi = { topHeadlines, searchNews };
})();
