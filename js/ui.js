// UI rendering helpers — creates DOM nodes safely and injects content
(function(){
  const ARTICLES_ROOT_ID = 'articles';
  const placeholder = 'assets/placeholder.jpg';

  function createBadge(category){
    const span = document.createElement('span');
    span.className = `category-badge badge-${category}`;
    span.textContent = category.charAt(0).toUpperCase()+category.slice(1);
    span.setAttribute('aria-hidden','true');
    return span;
  }

  function createCard(article, category){
    const articleEl = document.createElement('article');
    articleEl.className = 'card fade-in';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.alt = article.image ? (article.title || 'Article image') : `${category} placeholder`;
    img.src = article.image || placeholder;
    img.onerror = ()=>{ img.src = placeholder };

    const body = document.createElement('div');
    body.className = 'card-body';

    const badge = createBadge(category);
    body.appendChild(badge);

    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.textContent = article.title || 'Untitled';
    body.appendChild(h3);

    const p = document.createElement('p');
    p.className = 'card-desc';
    p.textContent = article.description || article.content || '';
    body.appendChild(p);

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const src = document.createElement('div');
    src.textContent = article.source?.name || '';
    const time = document.createElement('time');
    time.textContent = window.NWUtils.formatRelative(article.publishedAt || article.pubDate || new Date().toISOString());
    meta.appendChild(src);
    meta.appendChild(time);
    body.appendChild(meta);

    const actions = document.createElement('div');
    actions.style.marginTop = '8px';
    const btn = document.createElement('a');
    btn.className = 'btn';
    btn.textContent = 'Read More';
    btn.href = article.url || '#';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', `Read more: ${article.title}`);
    actions.appendChild(btn);
    body.appendChild(actions);

    articleEl.appendChild(img);
    articleEl.appendChild(body);
    return articleEl;
  }

  function renderArticles(list, append=false, category='world'){
    const root = document.getElementById(ARTICLES_ROOT_ID);
    if(!append) root.innerHTML = '';
    list.forEach(a => {
      const card = createCard(a, category);
      root.appendChild(card);
    });
  }

  function renderHero(article){
    // Set Alpine state directly if available
    const app = window._NW_APP;
    if(app){
      app.featured = article;
      app.featured.timeAgo = window.NWUtils.formatRelative(article.publishedAt || article.publishedAt);
    }
  }

  function renderSkeletons(count=6){
    const root = document.getElementById(ARTICLES_ROOT_ID);
    root.innerHTML = '';
    for(let i=0;i<count;i++){
      const div = document.createElement('div');
      div.className = 'card-skeleton';
      root.appendChild(div);
    }
  }

  function showError(message, retryFn){
    const existing = document.querySelector('.error-banner');
    if(existing) existing.remove();
    const banner = document.createElement('div');
    banner.className = 'error-banner';
    banner.style.background = 'var(--primary)';
    banner.style.color = '#fff';
    banner.style.padding = '12px';
    banner.style.borderRadius = '8px';
    banner.style.margin = '12px 0';
    banner.textContent = message || 'An error occurred while fetching news.';
    if(retryFn){
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = 'Retry';
      btn.style.marginLeft = '12px';
      btn.onclick = retryFn;
      banner.appendChild(btn);
    }
    const main = document.querySelector('.main-content');
    main.insertBefore(banner, main.firstChild);
  }

  window.NWUI = { renderArticles, renderHero, renderSkeletons, showError };
})();
