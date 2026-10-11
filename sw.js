/* Offline support. Bump the version whenever photos or voice files change. */
const V='stretch-v10';
const CORE=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "img/activeham-0.jpg", "img/activeham-1.jpg", "img/birddog-0.jpg", "img/birddog-1.jpg", "img/bridge-0.jpg", "img/bridge-1.jpg", "img/calf-0.jpg", "img/calf-1.jpg", "img/catcow-0.jpg", "img/catcow-1.jpg", "img/childpose-0.jpg", "img/childpose-1.jpg", "img/chintuck-0.jpg", "img/chintuck-1.jpg", "img/cobra-0.jpg", "img/cobra-1.jpg", "img/crossbody-0.jpg", "img/crossbody-1.jpg", "img/done.jpg", "img/elbowsback-0.jpg", "img/elbowsback-1.jpg", "img/fig4-0.jpg", "img/fig4-1.jpg", "img/ham-0.jpg", "img/ham-1.jpg", "img/hero.jpg", "img/hipflexor-0.jpg", "img/hipflexor-1.jpg", "img/kneecross-0.jpg", "img/kneecross-1.jpg", "img/kneehug-0.jpg", "img/kneehug-1.jpg", "img/kneeroll-0.jpg", "img/legup-0.jpg", "img/legup-1.jpg", "img/len10.jpg", "img/len15.jpg", "img/midback-0.jpg", "img/midback-1.jpg", "img/onekneechest-0.jpg", "img/onekneechest-1.jpg", "img/openbook-0.jpg", "img/openbook-1.jpg", "img/pressup-0.jpg", "img/pressup-1.jpg", "img/sidebend-0.jpg", "img/sidebend-1.jpg", "img/sideneck-0.jpg", "img/sideneck-1.jpg", "img/sideplank-0.jpg", "img/sideplank-1.jpg", "img/sidequad-0.jpg", "img/sidequad-1.jpg", "img/soleus-0.jpg", "img/soleus-1.jpg", "img/standhip-0.jpg", "img/standhip-1.jpg", "img/strapopen-0.jpg", "img/strapopen-1.jpg", "img/tilt-0.jpg", "img/uppback-0.jpg", "img/uppback-1.jpg", "img/worlds-0.jpg", "img/worlds-1.jpg"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  const r=e.request;
  if(r.method!=='GET') return;
  /* only the app's own files and its fonts are kept; everything else (Spotify included) always goes to the network */
  const u=new URL(r.url); if(u.origin!==self.location.origin&&!/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname)) return;
  if(r.mode==='navigate'){
    /* the page itself: newest when online, saved copy when offline */
    e.respondWith(fetch(r).then(function(res){const cp=res.clone(); caches.open(V).then(function(c){c.put('index.html',cp);}); return res;}).catch(function(){return caches.match('index.html');}));
    return;
  }
  /* photos, voices and fonts: saved copy first; fetched and kept on first use */
  e.respondWith(caches.match(r).then(function(hit){
    return hit||fetch(r).then(function(res){
      if(res.ok||res.type==='opaque'){const cp=res.clone(); caches.open(V).then(function(c){c.put(r,cp);});}
      return res;
    });
  }));
});
