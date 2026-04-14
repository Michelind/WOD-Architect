// WOD Architect — Service Worker v4
const CACHE = 'wod-architect-v4';
const SHELL = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('script.google.com') || url.hostname.includes('docs.google.com') || url.hostname.includes('sheets.googleapis.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('Offline', { status: 503 })));
    return;
  }
  if (url.hostname.includes('cdnjs.cloudflare.com')) {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
      const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, cl)); return r;
    })));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => {
    if (c) return c;
    return fetch(e.request).then(r => {
      if (r && r.status === 200 && r.type !== 'opaque') {
        const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, cl));
      }
      return r;
    }).catch(() => { if (e.request.mode === 'navigate') return caches.match('./index.html'); });
  }));
});
