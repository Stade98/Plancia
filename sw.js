// Plancia Progetti: funzionamento senza connessione.
// Quando modifichi i file dell'app, aumenta il numero di versione qui sotto.
const VERSIONE = 'plancia-v24';
const FILE_APP = [
  './',
  './index.html',
  './config.js',
  './sync.js',
  './modello.js',
  './icone.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];
const ESTERNI = ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE_APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // File dell'app: prima la rete (così gli aggiornamenti arrivano subito), altrimenti la copia salvata.
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSIONE).then(c => c.put(req.mode === 'navigate' ? './index.html' : req, copy)); }
        return res;
      }).catch(() => caches.match(req.mode === 'navigate' ? './index.html' : req, { ignoreSearch: true }))
    );
    return;
  }

  // Caratteri tipografici e librerie di Firebase: copia salvata, aggiornata in background.
  if (ESTERNI.includes(url.host)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSIONE).then(c => c.put(req, copy)); }
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    );
  }
  // Tutto il resto (comprese le chiamate a Firebase) passa direttamente in rete.
});

// Un tocco sulla notifica apre (o riporta in primo piano) l'app.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      return self.clients.openWindow('./');
    })
  );
});
