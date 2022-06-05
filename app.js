var app = {
  version: "1.6.0",
  db_version: 2,
  device: /Mobi/.test(navigator.userAgent) ? "mobile" : "desktop"
};

function app_file_list_css(){
  let file_list = {
    desktop: [
      "css/desktop/main.css",
      "css/desktop/note.css",
      "css/desktop/menu.css",
      "css/desktop/settings.css"
    ],
    mobile: [
      "css/mobile/main.css",
      "css/mobile/note.css",
      "css/mobile/menu.css",
      "css/mobile/settings.css"
    ]
  };

  return file_list[app.device];
}

function app_file_list_js(){
  let file_list = {
    desktop: [
      "js/desktop/main.js",
      "js/icon.js",
      "js/desktop/note.js",
      "js/desktop/trash.js",
      "js/desktop/menu.js",
      "js/desktop/settings.js",
      "js/translation/translation_" + app.language + ".js"
    ],
    mobile: [
      "js/mobile/main.js",
      "js/icon.js",
      "js/mobile/note.js",
      "js/mobile/trash.js",
      "js/mobile/menu.js",
      "js/mobile/settings.js",
      "js/translation/translation_" + app.language + ".js"
    ]
  };

  return file_list[app.device];
}

function app_db_open(){
  return indexedDB.open("app", app.db_version);
}

function app_db_open_update(){
  let request = indexedDB.open("app", app.db_version);

  request.onupgradeneeded = function(){
     let db = request.result;
    if (!db.objectStoreNames.contains("settings")){
        db.createObjectStore("settings", {keyPath: "key"});
    }
    if (!db.objectStoreNames.contains("note")){
        db.createObjectStore("note", {keyPath: "id"});
    }
    if (!db.objectStoreNames.contains("trash")){
        db.createObjectStore("trash", {keyPath: "id"});
    }
  };

  return request;
}
