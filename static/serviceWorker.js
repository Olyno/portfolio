const cacheName = 'olyno-portfolio-v3';

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== cacheName).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

async function networkFirst(req) {
	const cache = await caches.open(cacheName);
	try {
		const fresh = await fetch(req);
		cache.put(req, fresh.clone());
		return fresh;
	} catch (e) {
		const cachedResponse = await cache.match(req);
		return cachedResponse || Response.error();
	}
}

async function cacheFirst(req) {
	const cache = await caches.open(cacheName);
	const cachedResponse = await cache.match(req);
	return cachedResponse || networkFirst(req);
}

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
	// navigations & the app shell must always be fresh-when-possible so a
	// redeploy can't be locked out by stale hashed assets
	if (
		req.mode === 'navigate' ||
		(req.destination === 'document' && !req.url.includes('/images/'))
	) {
		event.respondWith(networkFirst(req));
	} else {
		event.respondWith(cacheFirst(req));
	}
});
