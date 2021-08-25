function app_ready(){
  app_translation_update();
  app_lang();
  app_description();
  app_manifest();

  app_main();
  app_aside();
  app_url_load();

  app_load(app.load_stage + 1);
}

function app_main(){
  let tmp_main = document.createElement("main");
  tmp_main.append(note_list());
  document.body.prepend(tmp_main);
}

function app_aside(){
  let tmp_aside = document.createElement("aside");
  tmp_aside.append(menu());
  document.getElementsByTagName("main")[0].before(tmp_aside);
}
