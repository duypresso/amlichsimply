const CACHE_NAME = 'amlich-cache-v1';
const GITHUB_PAGES_URL = '/amlichsimply';
const urlsToCache = [
    GITHUB_PAGES_URL + '/',
    GITHUB_PAGES_URL + '/index.html',
    GITHUB_PAGES_URL + '/style.css',
    GITHUB_PAGES_URL + '/script.js',
    GITHUB_PAGES_URL + '/amlich.js',
    GITHUB_PAGES_URL + '/manifest.json',
    GITHUB_PAGES_URL + '/icons/icon-192x192.png',
    GITHUB_PAGES_URL + '/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
