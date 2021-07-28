window.addEventListener("load", function(){
  app_load(1);
})

function app_load(load_stage){
  app.load_stage = load_stage;
  switch (load_stage) {
    case 1: app_language(); break;
    case 2: app_file_load(app_file_list_css(), app_file_list_js()); break;
    case 3: translation_update(); app_lang(); app_description(); app_manifest(); settings_load(); break;
    case 4: note_load(); break;
    case 5: trash_load(); break;
    case 6: app_ready(); app_service_worker();
  }
}

function app_file_load(file_list_css, file_list_js){
  if (file_list_css.length > 0) {
    let tmp_file = document.createElement("link");
    tmp_file.rel = "stylesheet";
    tmp_file.href = file_list_css[0];
    file_list_css.splice(0, 1);
    tmp_file.onload = function(){app_file_load(file_list_css, file_list_js)};
    tmp_file.onerror = function(){app_file_load(file_list_css, file_list_js)};
    document.head.append(tmp_file);
  }
  else if (file_list_js.length > 0) {
    let tmp_file = document.createElement("script");
    tmp_file.src = file_list_js[0];
    file_list_js.splice(0, 1);
    tmp_file.onload = function(){app_file_load(file_list_css, file_list_js)};
    tmp_file.onerror = function(){app_file_load(file_list_css, file_list_js)};
    document.body.append(tmp_file);
  }
  else {
    app_load(app.load_stage + 1);
  }
}

function app_language(){
  let tmp_request = app_db_open_update();

  tmp_request.onsuccess = function(){
    let tmp_db = tmp_request.result;
    let tmp_transaction = tmp_db.transaction("language", "readonly");

    if (navigator.onLine) {
      let tmp_transaction_get = tmp_transaction.objectStore("language").get("app");
      tmp_transaction_get.onsuccess = function(){
        if (tmp_transaction_get.result != null) {
          app.language = tmp_transaction_get.result.language;
        }
        else {
          let tmp_language = navigator.language.substr(0,2);
          let tmp_language_available = ["en", "fr"];
          app.language = tmp_language_available.includes(tmp_language) ? tmp_language : "en";
        }
        app_load(app.load_stage + 1);
      };
    }
    else {
      let tmp_transaction_get = tmp_transaction.objectStore("language").get("cache");
      tmp_transaction_get.onsuccess = function(){
        app.language = tmp_transaction_get.result.language;
        app_load(app.load_stage + 1);
      };
    }
  };
}

function app_lang(){
  document.documentElement.lang = app.language;
}

function app_description(){
  let tmp_meta = document.createElement("meta");
  tmp_meta.setAttribute("name", "description");
  tmp_meta.setAttribute("content", app.translate().app.app_description);
  document.getElementsByName("author")[0].after(tmp_meta);
}

function app_manifest(){
  let tmp_link = document.createElement("link");
  tmp_link.setAttribute("rel", "manifest");
  tmp_link.setAttribute("href", "rsc/manifest/manifest_" + app.language + ".json");
  document.getElementsByTagName("title")[0].after(tmp_link);
}

function app_service_worker(){
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service_worker.js");
  }
}
