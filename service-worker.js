const CACHE_NAME = "banabells-tasks-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./calendar.html",
  "./statistics.html",
  "./settings.html",
  "./manifest.json",
  "./css/style.css",
  "./css/animation.css",
  "./css/variables.css",
  "./css/responsive.css",
  "./js/app.js",
  "./js/storage.js",
  "./js/calendar.js",
  "./js/reminder.js",
  "./js/statistics.js",
  "./js/ui.js",
  "./js/animation.js",
  "./js/utils.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches
        .match(event.request)
        .then((cached) => cached || caches.match("./index.html")),
    ),
  );
});
