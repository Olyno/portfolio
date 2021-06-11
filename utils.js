document.addEventListener('DOMContentLoaded', () => {
    
    async function setLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    setLinks();

    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./serviceWorker.js')
                .then(() => console.log('Service Worker Registered'))
                .catch(err => console.log('Service Worker failed', err))
        });
    }

})