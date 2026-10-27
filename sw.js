// Service worker simples: guarda o "esqueleto" do app e NUNCA mexe nas chamadas ao servidor IPTV.
const CACHE='app-shell-1793088774805';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return; // servidor IPTV, streams, CDNs: passam direto
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp)).catch(()=>{});return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
});
