// PackColor QC — Service Worker
// https://qc05wann.github.io/ColorMatch-QC/

const CACHE_NAME = 'packcolor-qc-v2.8';
const URLS_TO_CACHE = [
  '/ColorMatch-QC/',
  '/ColorMatch-QC/index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        URLS_TO_CACHE.map(url =>
          fetch(url, { cache: 'reload' })
            .then(r => { if (r.ok) cache.put(url, r); })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && e.request.method === 'GET') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/ColorMatch-QC/index.html'));
    })
  );
});
