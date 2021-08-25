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
