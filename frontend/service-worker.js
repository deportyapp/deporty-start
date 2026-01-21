const CACHE_NAME = 'deporty-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/icon.png',
  '/assets/images/logo.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  // navigation requests -> serve index.html (SPA fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests try cache first, then network
  event.respondWith(
    caches.match(request).then(response => response || fetch(request).then(r => {
      // optionally cache fetched asset
      return r;
    }))
  );
});
