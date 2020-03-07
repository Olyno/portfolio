document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Service Worker
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker
    //         .register('./serviceWorker.js', { scope: './' })
    //         .then(console.log('Service Worker Registered'))
    //         .catch(err => console.log('Service Worker failed', err))
    // }

})