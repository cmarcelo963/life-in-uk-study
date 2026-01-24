const CACHE_NAME = 'life-in-uk-v25'; // Bump to ensure clients fetch the latest assets including topics content
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/data/questions.json',
  '/data/topics_grouped.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_NAME);
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating version:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls; always go to network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback empty JSON for GETs; let others fail
        if (event.request.method === 'GET') {
          return new Response('{}', { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(null, { status: 503 });
      })
    );
    return;
  }

  // Static asset caching
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();
      return fetch(fetchRequest)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
