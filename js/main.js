window.addEventListener("resize", app_vh);

function app_ready(){
  app_lang();
  app_description();
  app_manifest();
  app_vh();

  if (app.settings.app_border == "disabled") {
    document.body.classList.add("no_border");
  }
  if (app.settings.app_border_radius == "disabled") {
    document.body.classList.add("no_border_radius");
  }

  app_header();
  app_main();
  app_footer();

  app_url_load();
  app_load(app.load_stage + 1);
}

function app_header(){
  let header = document.createElement("header");
  header.id = "menu";
  header.append(app_icon("settings", 64, "rgb(65, 65, 65)", settings, "icon_settings"));
  header.append(trash_number_icon());
  document.body.prepend(header);
}

function app_main(){
  let main = document.createElement("main");
  document.getElementsByTagName("header")[0].after(main);
  note_list();
}

function app_footer(){
  let footer = document.createElement("footer");
  footer.append(app_icon("add", 64, "rgb(65, 65, 65)", note_add));
  document.getElementsByTagName("main")[0].after(footer);
}

function app_vh(){
  document.documentElement.style.setProperty("--vh", window.innerHeight + "px")
}

function app_icon(name, size, color, func_onclick, id, className){
  let icon = document.createElement("span");
  if (typeof id === "string") {icon.id = id}
  icon.className = "icon";
  if (typeof className === "string") {icon.classList.add(className)}
  if (typeof func_onclick === "function") {icon.onclick = func_onclick}
  icon.append(icon_draw(name, size, size, color));
  return icon;
}

function app_title_sub(name){
  let title = document.createElement("p");
  title.id = "title_sub";
  title.textContent = name;
  return title;
}
