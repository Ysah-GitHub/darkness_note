var app = {
  version: "1.7.3",
  db_version: 2,
  device: /Mobi/.test(navigator.userAgent) ? "mobile" : "desktop",
  note: [],
  trash: [],
  settings: {},
  translate: null
};

function app_file_list_css(){
  let file_list = {
    desktop: [
      "css/desktop/main.css",
      "css/desktop/note.css",
      "css/desktop/settings.css"
    ],
    mobile: [
      "css/mobile/main.css",
      "css/mobile/note.css",
      "css/mobile/settings.css"
    ]
  };

  return file_list[app.device];
}

function app_file_list_js(){
  return [
    "js/main.js",
    "js/icon.js",
    "js/note.js",
    "js/trash.js",
    "js/settings.js",
    "js/translation/translation_" + app.settings.language + ".js"
  ];
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
