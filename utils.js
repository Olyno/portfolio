// Anchor smooth-scrolling is owned by Lenis in +layout.svelte; this file only
// registers the service worker.
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('./serviceWorker.js')
			.then(() => console.log('Service Worker Registered'))
			.catch((err) => console.log('Service Worker failed', err));
	});
}
