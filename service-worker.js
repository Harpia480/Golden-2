// Increment this when you change files to force an update
const CACHE_NAME = 'golden-verses-v1';

// Files to cache (add more if you add new assets)
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  // optional icons if you add them:
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // remove old caches when CACHE_NAME changes
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Try cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((resp) => {
          // Optionally cache new GET requests
          if (event.request.method === 'GET') {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return resp;
        }).catch(() => {
          // (Optional) return a basic offline page if index.html requested
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        })
      );
    })
  );
});
