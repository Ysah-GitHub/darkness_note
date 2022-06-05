function menu_title_sub(title_name){
  let menu_title_sub = document.createElement("div");
  menu_title_sub.id = "menu_title_sub";

  let title = document.createElement("p");
  title.textContent = title_name;
  menu_title_sub.append(title);

  return menu_title_sub;
}

function menu_settings(){
  let menu_settings = document.createElement("div");
  menu_settings.id = "menu_settings";

  let settings_icon = document.createElement("span");
  settings_icon.className = "icon settings";
  settings_icon.onclick = settings;
  settings_icon.append(icon_draw("settings", 64, 64, "rgb(85, 85, 85)"));
  menu_settings.append(settings_icon);

  return menu_settings;
}

function menu_settings_back(){
  let menu_settings_back = document.createElement("div");
  menu_settings_back.id = "menu_settings_back";

  let settings_back_icon = document.createElement("span");
  settings_back_icon.className = "icon";
  settings_back_icon.onclick = settings_back;
  settings_back_icon.append(icon_draw("folder_back", 64, 64, "rgb(65, 65, 65)"));
  menu_settings_back.append(settings_back_icon);

  return menu_settings_back;
}

function menu_note_add(){
  let menu_note_add = document.createElement("div");
  menu_note_add.id = "menu_note_add";
  menu_note_add.onclick = note_add;

  let add_icon = document.createElement("span");
  add_icon.className = "icon";
  add_icon.append(icon_draw("add", 96, 96, "rgb(65, 65, 65)"));
  menu_note_add.append(add_icon);

  return menu_note_add;
}

function menu_note_trash(){
  let menu_note_trash = document.createElement("div");
  menu_note_trash.id = "menu_note_trash";
  menu_note_trash.onclick = trash_list;

  let trash_number = document.createElement("p");
  trash_number.id = "menu_note_trash_number";
  trash_number.addEventListener("DOMNodeInsertedIntoDocument", function(){
    menu_note_trash_refresh_number();
  });
  menu_note_trash.append(trash_number);

  let trash_icon = document.createElement("span");
  trash_icon.id = "menu_note_trash_icon";
  trash_icon.className = "icon";
  trash_icon.append(icon_draw("trash", 64, 64, "rgb(65, 65, 65)"));
  menu_note_trash.append(trash_icon);

  return menu_note_trash;
}

function menu_trash_back(){
  let menu_trash_back = document.createElement("div");
  menu_trash_back.id = "menu_trash_back";
  menu_trash_back.onclick = trash_list_back;

  let trash_back_icon = document.createElement("span");
  trash_back_icon.className = "icon";
  trash_back_icon.append(icon_draw("folder_back", 64, 64, "rgb(65, 65, 65)"));
  menu_trash_back.append(trash_back_icon);

  return menu_trash_back;
}

function menu_trash_delete_all(){
  let menu_trash_delete_all = document.createElement("div");
  menu_trash_delete_all.id = "menu_trash_delete_all";
  menu_trash_delete_all.onclick = trash_note_delete_all;

  let trash_delete_all_icon = document.createElement("span");
  trash_delete_all_icon.className = "icon red_background";
  trash_delete_all_icon.append(icon_draw("trash", 64, 64, "rgb(65, 65, 65)"));
  menu_trash_delete_all.append(trash_delete_all_icon);

  return menu_trash_delete_all;
}

function menu_note_trash_refresh_number(){
  let trash_number_interface = document.getElementById("menu_note_trash_number");
  let trash_number = app.trash.length;
  if (trash_number < 30) {
    trash_number_interface.className = "";
  }
  else if (trash_number >= 30 && trash_number < 50) {
    trash_number_interface.className = "orange";
  }
  else {
    trash_number_interface.className = "red";
  }
  trash_number_interface.textContent = "[" + trash_number + "]";
}
