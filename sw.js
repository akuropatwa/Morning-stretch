/* Offline support. Bump the version whenever photos or voice files change. */
const V='stretch-v2';
const CORE=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "img/activeham-0.jpg", "img/activeham-1.jpg", "img/birddog-0.jpg", "img/birddog-1.jpg", "img/bridge-0.jpg", "img/bridge-1.jpg", "img/calf-0.jpg", "img/calf-1.jpg", "img/catcow-0.jpg", "img/catcow-1.jpg", "img/cobra-0.jpg", "img/cobra-1.jpg", "img/done.jpg", "img/fig4-0.jpg", "img/fig4-1.jpg", "img/ham-0.jpg", "img/ham-1.jpg", "img/hero.jpg", "img/hipflexor-0.jpg", "img/hipflexor-1.jpg", "img/kneeroll-0.jpg", "img/len10.jpg", "img/len15.jpg", "img/openbook-0.jpg", "img/openbook-1.jpg", "img/pressup-0.jpg", "img/pressup-1.jpg", "img/sideplank-0.jpg", "img/sideplank-1.jpg", "img/tilt-0.jpg"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  const r=e.request;
  if(r.method!=='GET') return;
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
