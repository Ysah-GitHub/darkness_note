function translation_update(){
  app.translate = window["translation_" + app.language];
}

function language_file(language, reload_func){
  let tmp_script_list = document.getElementsByTagName("script");
  let tmp_script_already_loaded = false;

  for (let i = 0; i < tmp_script_list.length; i++) {
    if (tmp_script_list[i].src.includes("translation_" + language)) {
      tmp_script_already_loaded = true;
      break;
    }
  }

  if (tmp_script_already_loaded) {
    language_update(language, reload_func);
  }
  else {
    let tmp_file = document.createElement("script");
    tmp_file.src = "js/" + app.device + "/language/translation_" + language + ".js",
    tmp_file.onload = function(){language_update(language, reload_func)};
    document.body.append(tmp_file);
  }
}

function language_update(language, reload_func){
    let tmp_request = app_db_open();

    tmp_request.onsuccess = function(){
      let tmp_transaction = tmp_request.result.transaction("language", "readwrite");

      let tmp_transaction_get = tmp_transaction.objectStore("language").get("app");
      tmp_transaction_get.onsuccess = function(){
        if (tmp_transaction_get.result != null) {
          tmp_transaction.objectStore("language").delete("app");
        }
        app.language = language;
        translation_update();
        tmp_transaction.objectStore("language").add({key: "app", language: app.language}).onsuccess = reload_func;
      };
    };
}

function language_update_settings(language){
  language_file(language, function(){
    if (document.getElementById("settings")) {
      document.getElementById("settings").remove();
      document.getElementById("menu_title_sub").remove();
      document.getElementById("menu_settings_back").remove();
      settings();
    }
  });
}
