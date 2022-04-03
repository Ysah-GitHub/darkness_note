importScripts("app.js");
var sw_name = app.version;

function service_worker_cache(){
  let tmp_sw_cache = [
    "/",
    "index.html",
    "app.js",
    "app_load.js",
    "rsc/img/main.png",
    "rsc/img/main_maskable.png",
    "rsc/font/press_start_2p.woff2"
  ];

  tmp_sw_cache = tmp_sw_cache.concat(app_file_list_css());
  tmp_sw_cache = tmp_sw_cache.concat(app_file_list_js());

  return tmp_sw_cache;
}

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(sw_name).then(function(cache){
      let tmp_request = app_db_open_update();

      tmp_request.onsuccess = function(){
        let tmp_db = tmp_request.result;
        let tmp_transaction = tmp_db.transaction("settings", "readwrite");
        let tmp_transaction_get = tmp_transaction.objectStore("settings").get("language");

        tmp_transaction_get.onsuccess = function(){
          if (tmp_transaction_get.result != null) {
            app.language = tmp_transaction_get.result.language;
          }
          else {
            let tmp_language = navigator.language.substr(0,2);
            let tmp_language_available = ["en", "fr"];
            app.language = tmp_language_available.includes(tmp_language) ? tmp_language : "en";
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
