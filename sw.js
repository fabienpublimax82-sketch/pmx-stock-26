/* Cache hors ligne. Changer VERSION a chaque nouvelle version de index.html. */
var VERSION = "pmx-stock-v1";
var FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(function(r){
    var c = r.clone(); caches.open(VERSION).then(function(ca){ ca.put(e.request, c); }); return r;
  }).catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match("index.html"); }); }));
});
