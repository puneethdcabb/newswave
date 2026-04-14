// Utility helpers for NewsWave
(function(){
  window.NWUtils = {
    debounce(fn, wait){
      let t;
      return function(...args){
        clearTimeout(t);
        t = setTimeout(()=>fn.apply(this,args), wait);
      }
    },

    truncate(text, max){
      if(!text) return '';
      return text.length>max ? text.slice(0,max-1)+'…' : text;
    },

    formatRelative(dateStr){
      try{
        const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
        const date = new Date(dateStr);
        const seconds = Math.floor((Date.now() - date.getTime())/1000);
        const intervals = [
          ['year', 60*60*24*365],
          ['month', 60*60*24*30],
          ['week', 60*60*24*7],
          ['day', 60*60*24],
          ['hour', 60*60],
          ['minute', 60],
          ['second', 1]
        ];
        for(const [unit,secs] of intervals){
          if(Math.abs(seconds) >= secs || unit==='second'){
            const val = Math.round(seconds / secs);
            return rtf.format(-val, unit);
          }
        }
      }catch(e){
        return '';
      }
    },

    safeText(el, text){
      el.textContent = text || '';
    },

    sessionCache(key, data, ttlSeconds=300){
      try{
        if(data===undefined){
          const raw = sessionStorage.getItem(key);
          if(!raw) return null;
          const parsed = JSON.parse(raw);
          if(Date.now() > parsed.expiry) { sessionStorage.removeItem(key); return null; }
          return parsed.value;
        } else {
          const payload = { value: data, expiry: Date.now() + (ttlSeconds*1000) };
          sessionStorage.setItem(key, JSON.stringify(payload));
        }
      }catch(e){return null}
    }
  }
})();
