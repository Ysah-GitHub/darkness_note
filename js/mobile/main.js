window.addEventListener("resize", app_vh);

function app_ready(){
  app_translation_update();
  app_lang();
  app_description();
  app_manifest();

  app_vh();
  app_header();
  app_main();
  app_footer();
  app_url_load();

  app_load(app.load_stage + 1);
}

function app_header(){
  let header = document.createElement("header");

  header.append(menu_settings());
  header.append(menu_note_trash());
  document.body.prepend(header);
}

function app_main(){
  let main = document.createElement("main");

  main.append(note_list());
  document.getElementsByTagName("header")[0].after(main);
}

function app_footer(){
  let footer = document.createElement("footer");

  footer.append(menu_note_add());
  document.getElementsByTagName("main")[0].after(footer);
}

function app_vh(){
  document.documentElement.style.setProperty("--vh", window.innerHeight + "px")
}
