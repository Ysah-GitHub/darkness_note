var sw_name = "1.1.2";
var sw_cache = [
  // --- Main
  "/",
  "index.html",
  "manifest.json",
  "load.js",
  // --- CSS
  "css/reset.css",
  "css/main.css",
  // --- JS
  "js/canvas_draw.js",
  "js/canvas.js",
  "js/note.js",
  "js/settings.js",
  "js/trash.js",
  // --- Ressources
  "rsc/main.svg"
];

if (/Mobi/.test(navigator.userAgent)) {
  // --- Smartphone
  sw_cache = sw_cache.concat([
    // --- CSS
    "css/smartphone/canvas.css",
    "css/smartphone/note.css",
    "css/smartphone/settings.css",
    "css/smartphone/trash.css"
  ]);
}
else {
  // --- Desktop
  sw_cache = sw_cache.concat([
    // --- CSS
    "css/desktop/canvas.css",
    "css/desktop/note.css",
    "css/desktop/settings.css",
    "css/desktop/trash.css"
  ]);
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(sw_name).then(cache => cache.addAll(sw_cache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== sw_name))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            return caches.delete(key);
          })
        )
      )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
