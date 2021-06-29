var app = {
  version: "1.2.1",
  device: app_device(),
  language: app_language_default()
};

function app_device(){
  return /Mobi/.test(navigator.userAgent) ? "smartphone" : "desktop";
}

function app_language_default(){
  let tmp_language = navigator.language.substr(0,2);
  let tmp_language_available = ["en", "fr"];
  return tmp_language_available.includes(tmp_language) ? tmp_language : "en";
}

function app_file_list_css(){
  let tmp_file_list = {
    main: [
      "css/reset.css",
    ],
    desktop: [
      "css/desktop/main.css",
      "css/desktop/icon.css",
      "css/desktop/note.css",
      "css/desktop/trash.css"
    ],
    smartphone: [
      "css/smartphone/main.css",
      "css/smartphone/icon.css",
      "css/smartphone/note.css",
      "css/smartphone/trash.css",
      "css/smartphone/menu.css"
    ]
  };

  return tmp_file_list.main.concat(tmp_file_list[app.device]);
}

function app_file_list_js(){
  let tmp_file_list = {
    main: [],
    desktop: [
      "js/desktop/language/translation_" + app.language + ".js",
      "js/desktop/icon.js",
      "js/desktop/note.js",
      "js/desktop/trash.js"
    ],
    smartphone: [
      "js/smartphone/language/translation_" + app.language + ".js",
      "js/smartphone/icon.js",
      "js/smartphone/main.js",
      "js/smartphone/note.js",
      "js/smartphone/trash.js"
    ]
  };

  return tmp_file_list.main.concat(tmp_file_list[app.device]);
}
