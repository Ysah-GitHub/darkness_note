importScripts("app.js");
var sw_name = app.version;
var sw_cache = [
  // --- Main
  "/",
  "index.html",
  "rsc/manifest/manifest_" + app.language + ".json",
  "app.js",
  "app_load.js",
  // --- Ressources
  "rsc/font/press_start_2p.ttf",
  "rsc/svg/main.svg"
];
sw_cache = sw_cache.concat(app_file_list_css());
sw_cache = sw_cache.concat(app_file_list_js());

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
