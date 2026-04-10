// public/sw.js — Service Worker pour PWA
const CACHE_NAME = 'nexvari-v1'
const STATIC_ASSETS = [
  '/',
  '/pricing',
  '/blog',
  '/offline',
  '/manifest.json',
]

// Installation — mise en cache des assets statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {})
    })
  )
  self.skipWaiting()
})

// Activation — nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — stratégie Network First avec fallback cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes API et non-GET
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/_next/')) {
    // Assets Next.js : Cache First
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return response
        }).catch(() => cached)
      })
    )
    return
  }

  // Pages : Network First
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        return caches.match(request).then(cached => {
          if (cached) return cached
          // Page offline fallback
          return caches.match('/offline') || new Response(
            '<html><body style="background:#080808;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;text-align:center"><div><h1 style="color:#FF2D55">📵 Hors ligne</h1><p style="color:rgba(255,255,255,0.5)">Reconnecte-toi pour utiliser Nexvari</p><a href="/" style="color:#FF2D55">Réessayer</a></div></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          )
        })
      })
  )
})

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nexvari', {
      body: data.body || 'Tu as un nouveau message',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})
