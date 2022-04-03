window.addEventListener("popstate", app_url);
app_load(1);

function app_load(load_stage){
  app.load_stage = load_stage;
  switch (load_stage) {
    case 1: app_language(); break;
    case 2: app_file_load_css(app_file_list_css()); break;
    case 3: app_file_load_js(app_file_list_js()); break;
    case 4: settings_load(); break;
    case 5: note_load(); break;
    case 6: trash_load(); break;
    case 7: app_ready(); break;
    case 8: app_service_worker(); delete app.load_stage;
  }
}

function app_file_load_css(file_list_css){
  app.load_file_css = {load: 0, length: file_list_css.length};

  let tmp_load_func = function(){
    app.load_file_css.load = app.load_file_css.load + 1;
    if (app.load_file_css.load == app.load_file_css.length) {
      app_load(app.load_stage + 1);
      delete app.load_file_css;
    }
  };

  tmp_head = document.head.cloneNode(true);

  for (let i = 0; i < file_list_css.length; i++) {
    let tmp_file = document.createElement("link");
    tmp_file.rel = "stylesheet";
    tmp_file.href = file_list_css[i];
    tmp_file.onload = tmp_load_func;
    tmp_file.onerror = tmp_load_func;
    tmp_head.append(tmp_file);
  }

  document.head.replaceWith(tmp_head);
}

function app_file_load_js(file_list_js){
  app.load_file_js = {load: 0, length: file_list_js.length};

  let tmp_load_func = function(){
    app.load_file_js.load = app.load_file_js.load + 1;
    if (app.load_file_js.load == app.load_file_js.length) {
      app_load(app.load_stage + 1);
      delete app.load_file_js;
    }
  };

  tmp_body = document.body.cloneNode(true);

  for (let i = 0; i < file_list_js.length; i++) {
    let tmp_file = document.createElement("script");
    tmp_file.src = file_list_js[i];
    tmp_file.onload = tmp_load_func;
    tmp_file.onerror = tmp_load_func;
    tmp_body.append(tmp_file);
  }

  document.body.replaceWith(tmp_body);
}

function app_language(){
  let tmp_request = app_db_open_update();

  tmp_request.onsuccess = function(){
    let tmp_db = tmp_request.result;

    if (navigator.onLine) {
      let tmp_transaction = tmp_db.transaction("settings", "readonly");
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
        app_load(app.load_stage + 1);
      };
    }
    else {
      let tmp_transaction = tmp_db.transaction("service_worker", "readonly");
      let tmp_transaction_get = tmp_transaction.objectStore("service_worker").get("language");
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
  };
}

function app_language_new_file(language, reload_func){
  let tmp_script_list = document.getElementsByTagName("script");
  let tmp_script_already_loaded = false;

  for (let i = 0; i < tmp_script_list.length; i++) {
    if (tmp_script_list[i].src.includes("translation_" + language)) {
      tmp_script_already_loaded = true;
      break;
    }
  }

  if (tmp_script_already_loaded) {
    app_language_update(language, reload_func);
  }
  else {
    let tmp_file = document.createElement("script");
    tmp_file.src = "js/" + app.device + "/language/translation_" + language + ".js",
    tmp_file.onload = function(){app_language_update(language, reload_func)};
    document.body.append(tmp_file);
  }
}

function app_language_update(language, reload_func){
  let tmp_request = app_db_open();

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("settings", "readwrite");

    let tmp_transaction_get = tmp_transaction.objectStore("settings").get("language");
    tmp_transaction_get.onsuccess = function(){
      if (tmp_transaction_get.result != null) {
        tmp_transaction.objectStore("settings").delete("language");
      }
      app.language = language;
      app_translation_update();
      tmp_transaction.objectStore("settings").add({key: "language", language: app.language}).onsuccess = reload_func;
    };
  };
}

function app_translation_update(){
  app.translate = window["translation_" + app.language];
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

function app_service_worker_delete(){
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations){
      for (let registration of registrations) {
        registration.unregister();
      }
    });
    caches.keys().then(function(names){
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
}

function app_url(){
  let tmp_app_url = window.location.href.split("?");

  if (tmp_app_url[1] == null) {
    if (document.getElementById("trash_list")) {
      trash_list_back();
    }
    else if (document.getElementById("settings")) {
      settings_back();
    }
    else if (document.getElementById("note_fullscreen")) {
      document.getElementsByClassName("note_fullscreen_back")[0].click();
    }
  }
  else if (tmp_app_url[1] == "trash") {
    trash_list();
  }
  else if (tmp_app_url[1] == "settings") {
    if (document.getElementById("note_fullscreen")) settings_note_fullscreen_back();
    else if (!document.getElementById("settings")) settings();
  }
  else if (tmp_app_url[1] == "note_fullscreen") {
    history.replaceState({id: "darkness_note"}, null, tmp_app_url[0]);
  }
  else if (tmp_app_url[1] == "settings_note_fullscreen") {
    history.replaceState({id: "darkness_note"}, "settings", tmp_app_url[0] + "?settings");
  }
}

function app_url_load(){
  let tmp_app_url = window.location.href.split("?");

  if (tmp_app_url[1] != null) {
    switch (tmp_app_url[1]) {
      case "trash": trash_list(); break;
      case "settings": settings(); break;
      case "settings_note_fullscreen": settings(); break;
      default: history.replaceState({id: "darkness_note"}, null, tmp_app_url[0]);
    }
  }
}

function app_url_update(path){
  let tmp_app_url = window.location.href.split("?");
  let tmp_new_url = path ? tmp_app_url[0] + "?" + path : tmp_app_url[0];

  if (window.location.href != tmp_new_url) {
    history.pushState({id: "darkness_note"}, path, tmp_new_url);
  }
}
