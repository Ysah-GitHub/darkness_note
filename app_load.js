window.addEventListener("popstate", app_url);
app_load(1);

function app_load(load_stage){
  app.load_stage = load_stage;
  switch (load_stage) {
    case 1: app_language(); break;
    case 2: app_file_load_css(app_file_list_css()); break;
    case 3: app_file_load_js(app_file_list_js()); break;
    case 4: app_translation_update(); app_load(app.load_stage + 1); break;
    case 5: settings_load(); break;
    case 6: note_load(); break;
    case 7: trash_load(); break;
    case 8: app_ready(); break;
    case 9: app_service_worker(); delete app.load_stage;
  }
}

function app_file_load_css(file_list_css){
  app.load_file_css = {load: 0, length: file_list_css.length};

  let load_func = function(){
    app.load_file_css.load = app.load_file_css.load + 1;
    if (app.load_file_css.load == app.load_file_css.length) {
      app_load(app.load_stage + 1);
      delete app.load_file_css;
    }
  };

  let head = document.head.cloneNode(true);

  for (let i = 0; i < file_list_css.length; i++) {
    let file = document.createElement("link");
    file.rel = "stylesheet";
    file.href = file_list_css[i];
    file.onload = load_func;
    file.onerror = load_func;
    head.append(file);
  }

  document.head.replaceWith(head);
}

function app_file_load_js(file_list_js){
  app.load_file_js = {load: 0, length: file_list_js.length};

  let load_func = function(){
    app.load_file_js.load = app.load_file_js.load + 1;
    if (app.load_file_js.load == app.load_file_js.length) {
      app_load(app.load_stage + 1);
      delete app.load_file_js;
    }
  };

  let body = document.body.cloneNode(true);

  for (let i = 0; i < file_list_js.length; i++) {
    let file = document.createElement("script");
    file.src = file_list_js[i];
    file.onload = load_func;
    file.onerror = load_func;
    body.append(file);
  }

  document.body.replaceWith(body);
}

function app_language(){
  let request = app_db_open_update();

  request.onsuccess = function(){
    let db = request.result;

    if (navigator.onLine) {
      let transaction = db.transaction("settings", "readonly");
      let transaction_get = transaction.objectStore("settings").get("language");
      transaction_get.onsuccess = function(){
        if (transaction_get.result != null) {
          app.settings.language = transaction_get.result.language;
        }
        else {
          app.settings.language = app_language_navigator();
        }
        app_load(app.load_stage + 1);
      };
    }
    else {
      let transaction = db.transaction("settings", "readonly");
      let transaction_get = transaction.objectStore("settings").get("language");
      transaction_get.onsuccess = function(){
        if (transaction_get.result != null) {
          app.settings.language = transaction_get.result.language;
        }
        else {
          app.settings.language = app_language_navigator();
        }
        app_load(app.load_stage + 1);
      };
    }
  };
}

function app_language_navigator(){
  let language = navigator.language.substr(0,2);
  let language_available = ["en", "fr"];
  return language_available.includes(language) ? language : "en";
}

function app_language_new_file(language, func_settings_back){
  let script_list = document.getElementsByTagName("script");
  let script_already_loaded = false;

  for (let i = 0; i < script_list.length; i++) {
    if (script_list[i].src.includes("translation_" + language)) {
      script_already_loaded = true;
      break;
    }
  }

  if (script_already_loaded) {
    app_translation_update();
    app_lang();
    func_settings_back();
  }
  else {
    let file = document.createElement("script");
    file.src = "js/translation/translation_" + language + ".js",
    file.onload = function(){app_translation_update(); app_lang(); func_settings_back()};
    document.body.append(file);
  }
}

function app_translation_update(){
  app.translate = window["translation_" + app.settings.language];
}

function app_lang(){
  document.documentElement.lang = app.settings.language;
}

function app_description(){
  let meta = document.createElement("meta");
  meta.setAttribute("name", "description");
  meta.setAttribute("content", app.translate().app.description);
  document.getElementsByName("author")[0].after(meta);
}

function app_manifest(){
  let link = document.createElement("link");
  link.setAttribute("rel", "manifest");
  link.setAttribute("href", "rsc/manifest/manifest_" + app.settings.language + ".json");
  document.getElementsByTagName("link")[0].before(link);
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

function app_url_load(){
  let app_url = window.location.href.split("?");

  if (app_url[1] != null) {
    switch (app_url[1]) {
      case "trash": trash_list(); break;
      case "settings": settings(); break;
      case "settings_select": settings(); break;
      default: history.replaceState({id: "darkness_note"}, null, app_url[0]);
    }
  }
}

function app_url(){
  let app_url = window.location.href.split("?");

  if (app_url[1] == null) {
    if (document.getElementById("trash_list")) {
      trash_list_back();
    }
    else if (document.getElementById("settings")) {
      settings_back();
    }
    else if (document.getElementsByClassName("note_fullscreen")[0]) {
      document.getElementsByClassName("menu_icon_left")[0].children[0].click();
    }
  }
  else if (app_url[1] == "trash") {
    trash_list();
  }
  else if (app_url[1] == "settings") {
    settings();
  }
  else if (app_url[1] == "settings_select") {
    history.replaceState({id: "darkness_note"}, "settings", app_url[0] + "?settings");
  }
  else if (app_url[1] == "note_fullscreen") {
    history.replaceState({id: "darkness_note"}, null, app_url[0]);
  }
}

function app_url_update(path){
  let app_url = window.location.href.split("?");
  let new_url = path ? app_url[0] + "?" + path : app_url[0];

  if (window.location.href != new_url) {
    history.pushState({id: "darkness_note"}, path, new_url);
  }
}
