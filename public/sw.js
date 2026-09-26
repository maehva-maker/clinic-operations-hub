// public/sw.js
// Minimal service worker: cache-first for STATIC assets only
// (_next/static/*, /icons/*, fonts, manifest). Page navigations, the Next.js
// RSC/data requests, and anything hitting Supabase are deliberately left
// alone (network passthrough) — this app's data is protected by
// authentication and Row Level Security, and caching HTML or API responses
// here could show a signed-out visitor a stale, previously-cached page or
// serve one user's cached data to another session on a shared device. This
// keeps the app's install/offline-shell requirements without touching how
// any route or data actually loads.

const CACHE_NAME = "clinic-hub-static-v1";

const STATIC_DESTINATIONS = new Set(["style", "script", "font", "image"]);

function isStaticAssetRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (url.pathname.startsWith("/icons/")) return true;
  if (url.pathname === "/manifest.webmanifest") return true;
  return STATIC_DESTINATIONS.has(request.destination);
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!isStaticAssetRequest(request)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }),
  );
});
