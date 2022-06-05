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
  let main = document.createElement("main");
  main.append(note_list());
  document.body.prepend(main);
}

function app_aside(){
  let aside = document.createElement("aside");
  aside.append(menu());
  document.getElementsByTagName("main")[0].before(aside);
}
