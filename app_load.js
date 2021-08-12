app_load(1);

function app_load(load_stage){
  app.load_stage = load_stage;
  switch (load_stage) {
    case 1: app_language(); break;
    case 2: app_file_load_js(app_file_list_js()); break;
    case 3: settings_load(); app_translation_update(); app_lang(); app_description(); app_manifest(); break;
    case 4: note_load(); break;
    case 5: trash_load(); break;
    case 6: app_ready(); break;
    case 7: app_file_load_css(app_file_list_css()); break;
    case 8: delete app.load_stage; delete app.load_file; app_service_worker();
  }
}

function app_file_load_js(file_list_js){
  app.load_file = {load: 0, length: file_list_js.length, func: function(){
    app.load_file.load = app.load_file.load + 1;
    if (app.load_file.load == app.load_file.length) app_load(app.load_stage + 1);
  }};

  for (let i = 0; i < app.load_file.length; i++) {
    let tmp_file = document.createElement("script");
    tmp_file.src = file_list_js[i];
    tmp_file.onload = app.load_file.func;
    tmp_file.onerror = app.load_file.func;
    document.body.append(tmp_file);
  }
}

function app_file_load_css(file_list_css){
  tmp_head = document.head.cloneNode(true);

  for (let i = 0; i < file_list_css.length; i++) {
    let tmp_file = document.createElement("link");
    tmp_file.rel = "stylesheet";
    tmp_file.href = file_list_css[i];
    tmp_head.getElementsByTagName("style")[0].before(tmp_file);
  }

  document.head.replaceWith(tmp_head);
  app_load(app.load_stage + 1);
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
