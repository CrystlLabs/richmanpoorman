// Rich Man Poor Man — service worker. Bump CACHE version on any deploy.
const CACHE = 'rmpm-v9';

// Ad / analytics hosts must never be intercepted or cached — they need to hit the network live.
const BYPASS = /(googlesyndication\.com|doubleclick\.net|googleadservices\.com|adtrafficquality\.google|google\.com\/(ads|pagead))/;
const PRECACHE = [
    './',
    './index.html',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://cdn.tailwindcss.com/',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Permanent+Marker&family=Inter:wght@400;700;900&display=swap'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache =>
            // add individually so one flaky CDN fetch can't fail the whole install
            Promise.allSettled(PRECACHE.map(url => cache.add(url)))
        ).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || !req.url.startsWith('http')) return;
    if (BYPASS.test(req.url)) return; // let ad requests go straight to the network

    // Navigations: network-first so deploys show up immediately; cache is the offline fallback.
    if (req.mode === 'navigate') {
        e.respondWith(
            fetch(req).then(res => {
                const copy = res.clone();
                caches.open(CACHE).then(cache => cache.put('./', copy));
                return res;
            }).catch(() => caches.match('./'))
        );
        return;
    }

    // Everything else (CDN, fonts, icons): cache-first.
    e.respondWith(
        caches.match(req).then(hit => {
            if (hit) return hit;
            return fetch(req).then(res => {
                if (res && (res.ok || res.type === 'opaque')) {
                    const copy = res.clone();
                    caches.open(CACHE).then(cache => cache.put(req, copy));
                }
                return res;
            });
        })
    );
});
