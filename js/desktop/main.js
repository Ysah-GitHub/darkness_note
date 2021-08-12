function app_ready(){
  app_main();
  app_aside();
  app_load(app.load_stage + 1);
}

function app_main(){
  let tmp_main = document.createElement("main");
  tmp_main.className = "scrollbar";
  tmp_main.append(note_list());
  document.body.prepend(tmp_main);
}

function app_aside(){
  let tmp_aside = document.createElement("aside");
  tmp_aside.append(menu());
  document.getElementsByTagName("main")[0].before(tmp_aside);
}

function app_translation_update(){
  app.translate = window["translation_" + app.language];
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
      let tmp_transaction = tmp_request.result.transaction("language", "readwrite");

      let tmp_transaction_get = tmp_transaction.objectStore("language").get("app");
      tmp_transaction_get.onsuccess = function(){
        if (tmp_transaction_get.result != null) {
          tmp_transaction.objectStore("language").delete("app");
        }
        app.language = language;
        app_translation_update();
        tmp_transaction.objectStore("language").add({key: "app", language: app.language}).onsuccess = reload_func;
      };
    };
}
