// Main app logic using Alpine.js-style data binding (mounted via x-data in index.html)
function newsApp(){
  return {
    category: 'world',
    page: 1,
    loading: false,
    drawerOpen: false,
    darkMode: (localStorage.getItem('nw:dark') === 'true'),
    featured: null,
    allLoaded: false,
    stickySearch: false,

    init(){
      window._NW_APP = this;
      // read hash
      const h = location.hash.replace('#','');
      if(h) this.category = h;
      this.setupScrollObserver();
      this.fetchCategory(this.category);
      // search input handling
      const searchEl = document.getElementById('search');
      this.onSearchInput = NWUtils.debounce((e)=>{
        const q = e.target.value.trim();
        if(q.length===0){ this.fetchCategory(this.category); return; }
        this.search(q);
      },500);
      // sticky search on scroll
      window.addEventListener('scroll', ()=>{
        this.stickySearch = window.scrollY > 80;
      });
    },

    async fetchCategory(cat){
      this.category = cat || 'world';
      location.hash = this.category;
      this.page = 1;
      this.loading = true;
      NWUI.clearError();
      NWUI.renderSkeletons(6);
      try{
        const data = await NWApi.topHeadlines({category: this.category, page: this.page});
        const articles = data?.articles || [];
        if(articles.length>0){
          this.featured = articles[0];
          NWUI.renderHero(this.featured);
          NWUI.renderArticles(articles.slice(1), false, this.category);
        } else {
          NWUI.renderArticles([], false, this.category);
        }
        // RSS feeds are one-shot — mark as fully loaded after the first fetch
        this.allLoaded = true;
      }catch(err){
        NWUI.showError('Unable to load news. Please check your API key or network.', ()=>this.fetchCategory(this.category));
      }finally{ this.loading = false; }
    },

    async loadMore(){
      if(this.loading || this.allLoaded) return;
      this.page += 1;
      this.loading = true;
      NWUI.clearError();
      try{
        const data = await NWApi.topHeadlines({category: this.category, page: this.page});
        const articles = data?.articles || [];
        if(articles.length>0){
          NWUI.renderArticles(articles, true, this.category);
        }
        if(articles.length === 0) this.allLoaded = true;
      }catch(err){
        NWUI.showError('Unable to load more articles.','');
      }finally{ this.loading=false }
    },

    async search(q){
      this.loading = true;
      NWUI.clearError();
      NWUI.renderSkeletons(4);
      try{
        const data = await NWApi.searchNews({q});
        const articles = data?.articles || [];
        if(articles.length===0){
          NWUI.renderArticles([]);
          NWUI.showError(`No results found for "${q}"`);
        } else {
          NWUI.clearError();
          this.featured = articles[0];
          NWUI.renderHero(this.featured);
          NWUI.renderArticles(articles.slice(1), false, this.category);
        }
      }catch(err){
        NWUI.showError('Search failed. Try again later.');
      }finally{ this.loading=false }
    },

    changeCategory(cat){
      this.fetchCategory(cat);
      this.drawerOpen = false;
    },

    toggleDrawer(){ this.drawerOpen = !this.drawerOpen },

    toggleDarkMode(){
      this.darkMode = !this.darkMode;
      localStorage.setItem('nw:dark', this.darkMode);
    },

    scrollTop(){ window.scrollTo({top:0,behavior:'smooth'}) },

    setupScrollObserver(){
      const sentinel = document.getElementById('scroll-sentinel');
      if(!sentinel) return;
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){ this.loadMore(); }
        });
      },{rootMargin:'200px'});
      obs.observe(sentinel);
    }
  }
}
