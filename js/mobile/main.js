window.addEventListener("resize", app_vh);

function app_ready(){
  app_vh();
  app_header();
  app_main();
  app_footer();

  app_load(app.load_stage + 1);
}

function app_header(){
  let tmp_header = document.createElement("header");

  tmp_header.append(menu_settings());
  tmp_header.append(menu_note_trash());
  document.body.prepend(tmp_header);
}

function app_main(){
  let tmp_main = document.createElement("main");

  tmp_main.append(note_list());
  document.getElementsByTagName("header")[0].after(tmp_main);
}

function app_footer(){
  let tmp_footer = document.createElement("footer");

  tmp_footer.append(menu_note_add());
  document.getElementsByTagName("main")[0].after(tmp_footer);
}

function app_vh(){
  let tmp_document_style = document.documentElement.style;
  tmp_document_style.setProperty("--vh", window.innerHeight + "px");
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
