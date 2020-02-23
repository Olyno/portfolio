const cacheName = 'v1';
const cacheFiles = [
    // 'https://www.github.com/Olyno.png',
    '/build/bundle.css',
    '/build/bundle.css.map',
    '/build/bundle.js',
    '/build/bundle.js.map',
    '/images/karaom-website.png',
    '/images/skript-website.png',
    '/images/skripthub-website.svg',
    '/images/vixio-website.png',
    '/images/icons/typescript.svg',
    '/fontawesome.js',
    '/utils.js',
    '/index.html',
]

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});