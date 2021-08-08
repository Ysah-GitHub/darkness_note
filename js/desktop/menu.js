function menu(){
  let tmp_menu = document.createElement("div");
  tmp_menu.id = "menu";

  tmp_menu.append(menu_title());
  tmp_menu.append(menu_settings());
  tmp_menu.append(menu_note_add());
  tmp_menu.append(menu_note_trash());

  return tmp_menu;
}

function menu_title(){
  let tmp_title_container = document.createElement("div");
  tmp_title_container.id = "menu_title";

  let tmp_title = document.createElement("h1");
  tmp_title.textContent = "Darkness Note";
  tmp_title_container.append(tmp_title);

  let tmp_version = document.createElement("p");
  tmp_version.textContent = app.version;
  tmp_title_container.append(tmp_version);

  return tmp_title_container;
}

function menu_title_sub(title){
  let tmp_title_container = document.createElement("div");
  tmp_title_container.id = "menu_title_sub";

  let tmp_title = document.createElement("p");
  tmp_title.textContent = title;
  tmp_title_container.append(tmp_title);

  return tmp_title_container;
}

function menu_settings(){
  let tmp_settings = document.createElement("div");
  tmp_settings.id = "menu_settings";

  let tmp_settings_icon = document.createElement("span");
  tmp_settings_icon.className = "icon settings";
  tmp_settings_icon.title = window["translation_" + app.language]().main.settings;
  tmp_settings_icon.onclick = settings;
  tmp_settings_icon.append(icon_settings(64, 64));
  tmp_settings.append(tmp_settings_icon);

  return tmp_settings;
}

function menu_settings_back(){
  let tmp_settings_back = document.createElement("div");
  tmp_settings_back.id = "menu_settings_back";

  let tmp_settings_back_icon = document.createElement("span");
  tmp_settings_back_icon.className = "menu icon";
  tmp_settings_back_icon.onclick = settings_back;
  tmp_settings_back_icon.append(icon_folder_back(192, 192));
  tmp_settings_back.append(tmp_settings_back_icon);

  return tmp_settings_back;
}

function menu_note_add(){
  let tmp_note_add = document.createElement("div");
  tmp_note_add.id = "menu_note_add";
  tmp_note_add.onclick = note_add;

  let tmp_add_icon = document.createElement("span");
  tmp_add_icon.className = "menu icon";
  tmp_add_icon.title = window["translation_" + app.language]().note.note_add;
  tmp_add_icon.append(icon_add(192, 192));
  tmp_note_add.append(tmp_add_icon);

  return tmp_note_add;
}

function menu_note_trash(){
  let tmp_note_trash = document.createElement("div");
  tmp_note_trash.id = "menu_note_trash";
  tmp_note_trash.title = window["translation_" + app.language]().main.trash;
  tmp_note_trash.onclick = trash_list;

  let tmp_trash_number = document.createElement("p");
  tmp_trash_number.id = "menu_note_trash_number";
  tmp_trash_number.addEventListener("DOMNodeInsertedIntoDocument", function(){
    menu_note_trash_refresh_number();
  });
  tmp_note_trash.append(tmp_trash_number);

  let tmp_trash_icon = document.createElement("span");
  tmp_trash_icon.id = "menu_note_trash_icon";
  tmp_trash_icon.className = "menu icon";
  tmp_trash_icon.append(icon_trash(192, 192));
  tmp_note_trash.append(tmp_trash_icon);

  return tmp_note_trash;
}

function menu_note_trash_refresh_number(){
  let tmp_trash_number_interface = document.getElementById("menu_note_trash_number");
  let tmp_trash_number = app.trash.length;
  if (tmp_trash_number < 30) {
    tmp_trash_number_interface.className = "";
  }
  else if (tmp_trash_number >= 30 && tmp_trash_number < 50) {
    tmp_trash_number_interface.className = "orange";
  }
  else {
    tmp_trash_number_interface.className = "red";
  }
  tmp_trash_number_interface.textContent = "[" + tmp_trash_number + "]";
}

function menu_trash_delete_all(){
  let tmp_trash_delete_all = document.createElement("div");
  tmp_trash_delete_all.id = "menu_trash_delete_all";
  tmp_trash_delete_all.onclick = trash_note_delete_all;

  let tmp_trash_delete_all_icon = document.createElement("span");
  tmp_trash_delete_all_icon.className = "icon red_background";
  tmp_trash_delete_all_icon.title = window["translation_" + app.language]().trash.delete_all_note;
  tmp_trash_delete_all_icon.append(icon_trash(64, 64));
  tmp_trash_delete_all.append(tmp_trash_delete_all_icon);

  return tmp_trash_delete_all;
}

function menu_trash_back(){
  let tmp_trash_back = document.createElement("div");
  tmp_trash_back.id = "menu_trash_back";
  tmp_trash_back.onclick = trash_list_remove;

  let tmp_trash_back_icon = document.createElement("span");
  tmp_trash_back_icon.className = "menu icon";
  tmp_trash_back_icon.append(icon_folder_back(192, 192));
  tmp_trash_back.append(tmp_trash_back_icon);

  return tmp_trash_back;
}
