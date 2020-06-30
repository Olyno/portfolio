const cacheName = 'pwa-conf-v1';
const staticAssets = [
  './',
  './index.html',
  './fontawesome.js',
  './utils.js',
  './build',
  './images'
];

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cachedResponse = await cache.match(req);
    return cachedResponse;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || networkFirst(req);
}

self.addEventListener('install', async event => {
  caches.open(cacheName)
    .then(cache => cache.addAll(staticAssets));
});

self.addEventListener('fetch', event => {
  event.respondWith(networkFirst(event.request));
});