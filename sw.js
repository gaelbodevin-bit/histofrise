// ============================================================
//  SERVICE WORKER — HistoFrise (PWA offline-first)
// ============================================================
const CACHE_NAME = "histofrise-v1.0.0";

const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/styles/main.css",
  "/src/game/questions.js",
  "/src/game/scoring.js",
  "/src/game/timeline.js",
  "/src/game/game.js",
  "/src/auth/auth.js",
  "/src/config/firebase-config.js",
  "/src/components/leaderboard.js",
  "/src/components/multiplayer.js"
];

// ── Install ────────────────────────────────────────────────
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────
self.addEventListener("fetch", event => {
  // Ne pas intercepter les requêtes Firebase / AdSense / Google Fonts
  const url = event.request.url;
  if (
    url.includes("googleapis.com") ||
    url.includes("gstatic.com") ||
    url.includes("googlesyndication") ||
    url.includes("firebaseio.com") ||
    url.includes("firestore.googleapis")
  ) {
    return; // Laisser passer sans cache
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
