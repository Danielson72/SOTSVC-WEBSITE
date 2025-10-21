// Service Worker for aggressive caching
const CACHE_NAME = 'sotsvc-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/css/non-critical.css',
  '/js/modules.js',
  '/favicon.png'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => 
        Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // Clone the request for cache
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for forms (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'form-sync') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Handle offline form submissions when back online
  const pendingForms = await getStoredForms();
  
  for (const form of pendingForms) {
    try {
      await fetch(form.url, {
        method: 'POST',
        body: form.data,
        headers: form.headers
      });
      // Remove from storage after successful sync
      await removeStoredForm(form.id);
    } catch (error) {
      console.error('Form sync failed:', error);
    }
  }
}

// Helper functions for offline form storage
async function getStoredForms() {
  // Implementation would depend on IndexedDB usage
  return [];
}

async function removeStoredForm(id) {
  // Implementation would depend on IndexedDB usage
}