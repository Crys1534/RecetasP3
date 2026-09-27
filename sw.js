const CACHE_NAME = 'recetas-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Instalar el Service Worker y guardar los archivos estáticos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activar y limpiar cachés viejos si actualizas la app
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Interceptar las peticiones para que funcione Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo desde el caché si existe, si no, lo busca en internet
        return response || fetch(event.request);
      })
  );
});