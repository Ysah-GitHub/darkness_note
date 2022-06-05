importScripts("app.js");
var sw_name = app.version;

function service_worker_cache(){
  let sw_cache = [
    "/",
    "index.html",
    "css/reset.css",
    "app.js",
    "app_load.js",
    "rsc/img/main.png",
    "rsc/img/main_maskable.png",
    "rsc/font/press_start_2p.woff2"
  ];

  sw_cache = sw_cache.concat(app_file_list_css());
  sw_cache = sw_cache.concat(app_file_list_js());

  return sw_cache;
}

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(sw_name).then(function(cache){
      let request = app_db_open_update();

      request.onsuccess = function(){
        let db = request.result;
        let transaction = db.transaction("settings", "readwrite");
        let transaction_get = transaction.objectStore("settings").get("language");

        transaction_get.onsuccess = function(){
          if (transaction_get.result != null) {
            app.language = transaction_get.result.language;
          }
          else {
            let language = navigator.language.substr(0,2);
            let language_available = ["en", "fr"];
            app.language = language_available.includes(language) ? language : "en";
          }
          cache.addAll(service_worker_cache());
        };
      };
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return keys.filter(function(key){
        return key !== sw_name;
      });
    }).then(function(keys){
      return Promise.all(keys.map(function(key){
        return caches.delete(key);
      }));
    })
  );
});

self.addEventListener("fetch", function(event){
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request);
    })
  );
});
