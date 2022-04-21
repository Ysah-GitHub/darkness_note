var app = {
  version: "1.5.2",
  db_version: 2,
  device: /Mobi/.test(navigator.userAgent) ? "mobile" : "desktop"
};

function app_file_list_css(){
  let tmp_file_list = {
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

  return tmp_file_list[app.device];
}

function app_file_list_js(){
  let tmp_file_list = {
    desktop: [
      "js/desktop/main.js",
      "js/desktop/icon.js",
      "js/desktop/note.js",
      "js/desktop/trash.js",
      "js/desktop/menu.js",
      "js/desktop/settings.js",
      "js/desktop/language/translation_" + app.language + ".js"
    ],
    mobile: [
      "js/mobile/main.js",
      "js/mobile/icon.js",
      "js/mobile/note.js",
      "js/mobile/trash.js",
      "js/mobile/menu.js",
      "js/mobile/settings.js",
      "js/mobile/language/translation_" + app.language + ".js"
    ]
  };

  return tmp_file_list[app.device];
}

function app_db_open(){
  return indexedDB.open("app", app.db_version);
}

function app_db_open_update(){
  let tmp_request = indexedDB.open("app", app.db_version);

  tmp_request.onupgradeneeded = function(){
    tmp_db = tmp_request.result;
    if (!tmp_db.objectStoreNames.contains("settings")){
        tmp_db.createObjectStore("settings", {keyPath: "key"});
    }
    if (!tmp_db.objectStoreNames.contains("note")){
        tmp_db.createObjectStore("note", {keyPath: "id"});
    }
    if (!tmp_db.objectStoreNames.contains("trash")){
        tmp_db.createObjectStore("trash", {keyPath: "id"});
    }
  };

  return tmp_request;
}
