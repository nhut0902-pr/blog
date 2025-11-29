const CACHE_NAME = 'blogapp-v1';
const STATIC_CACHE = 'blogapp-static-v1';
const DYNAMIC_CACHE = 'blogapp-dynamic-v1';

// Static files to cache
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => caches.delete(name))
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip API requests for POST, PUT, DELETE
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                // Update cache in background
                fetch(request)
                    .then((response) => {
                        if (response && response.status === 200) {
                            caches.open(DYNAMIC_CACHE).then((cache) => {
                                cache.put(request, response.clone());
                            });
                        }
                    })
                    .catch(() => { });
                return cachedResponse;
            }

            // Fetch from network and cache
            return fetch(request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone response to cache
                    const responseToCache = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/offline');
                    }
                    return new Response('Offline', { status: 503 });
                });
        })
    );
});

// Push notification event (for future use)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'BlogApp';
    const options = {
        body: data.body || 'Bài viết mới đã được đăng!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-96.png',
        tag: data.tag || 'default',
        data: data.url || '/',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
