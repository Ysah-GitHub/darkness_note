function settings(){
  let tmp_trash = document.getElementById("trash");
  let tmp_icon_settings = tmp_trash.getElementsByClassName("icon main_settings")[0];

  if (document.getElementById("settings")) {
    document.getElementById("settings").remove();
    document.getElementById("trash_header").removeAttribute("style");
    document.getElementById("note_list").removeAttribute("style");
    document.getElementById("menu").removeAttribute("style");
    tmp_icon_settings.children[0].replaceWith(icon_settings(64, 64));
  }
  else {
    document.getElementById("trash_header").style.display = "none";
    document.getElementById("note_list").style.display = "none";
    document.getElementById("menu").style.display = "none";
    tmp_icon_settings.children[0].replaceWith(icon_folder_back(64, 64));

    let tmp_settings = document.createElement("div");
    tmp_settings.id = "settings";

    tmp_settings.append(settings_section_note_management());
    tmp_settings.append(settings_section_links());
    tmp_settings.append(settings_section_other());

    document.getElementById("trash").after(tmp_settings);
  }
}

function settings_section(title){
  let tmp_section = document.createElement("div");
  tmp_section.className = "settings_section";

  let tmp_section_title = document.createElement("input");
  tmp_section_title.className = "settings_section_title";
  tmp_section_title.type = "text";
  tmp_section_title.setAttribute("readonly", "");
  tmp_section_title.value = title;
  tmp_section.append(tmp_section_title);

  return tmp_section;
}

function settings_section_note_management(){
  let tmp_section = settings_section(translation().note_management);
  tmp_section.classList.add("first");

  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element desc";
  tmp_settings.onclick = note_export_json;

  let tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  let tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().note_export_json;
  tmp_settings_text.append(tmp_settings_title);

  let tmp_settings_description = document.createElement("p");
  tmp_settings_description.className = "settings_section_element_description";
  tmp_settings_description.textContent = translation().note_export_json_desc;
  tmp_settings_text.append(tmp_settings_description);

  tmp_settings.append(tmp_settings_text);

  let tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  let tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_arrow_move(48, 48));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);

  tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element desc";
  tmp_settings.onclick = note_import_json;

  tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().note_import_json;
  tmp_settings_text.append(tmp_settings_title);

  tmp_settings_description = document.createElement("p");
  tmp_settings_description.className = "settings_section_element_description";
  tmp_settings_description.textContent = translation().note_import_json_desc;
  tmp_settings_text.append(tmp_settings_description);

  tmp_settings.append(tmp_settings_text);

  tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_arrow_move(48, 48));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);
  return tmp_section;
}

function settings_section_links(){
  let tmp_section = settings_section(translation().links);

  let tmp_settings = document.createElement("a");
  tmp_settings.className = "settings_section_element desc";
  tmp_settings.href = "mailto:simon.richez@laposte.net";

  let tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  let tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().contact;
  tmp_settings_text.append(tmp_settings_title);

  let tmp_settings_description = document.createElement("p");
  tmp_settings_description.className = "settings_section_element_description";
  tmp_settings_description.textContent = "simon.richez@laposte.net";
  tmp_settings_text.append(tmp_settings_description);

  tmp_settings.append(tmp_settings_text);

  let tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  let tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_link(28, 28));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);

  tmp_settings = document.createElement("a");
  tmp_settings.className = "settings_section_element desc";
  tmp_settings.href = "https://github.com/Ysah-GitHub/darkness_note";
  tmp_settings.target = "_blank";

  tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().source_code;
  tmp_settings_text.append(tmp_settings_title);

  tmp_settings_description = document.createElement("p");
  tmp_settings_description.className = "settings_section_element_description";
  tmp_settings_description.textContent = "https://github.com/Ysah-GitHub/darkness_note";
  tmp_settings_text.append(tmp_settings_description);

  tmp_settings.append(tmp_settings_text);

  tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_link(28, 28));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);
  return tmp_section;
}

function settings_section_other(){
  let tmp_section = settings_section(translation().other);

  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = function(){
    note_fullscreen_readonly(translation().commitment, translation().app_commitment);
  };

  let tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  let tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().commitment;
  tmp_settings_text.append(tmp_settings_title);

  tmp_settings.append(tmp_settings_text);

  let tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  let tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_arrow_move(48, 48));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);

  tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = function(){
    note_fullscreen_readonly(translation().donate, translation().app_donate);
  };

  tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().donate;
  tmp_settings_text.append(tmp_settings_title);

  tmp_settings.append(tmp_settings_text);

  tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_arrow_move(48, 48));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);
  return tmp_section;
}

function settings_note(note_interface){
  let tmp_icon_settings = note_interface.getElementsByClassName("icon settings")[0];

  if (note_interface.className == "note settings") {
    note_interface.classList.remove("settings");
    tmp_icon_settings.children[0].replaceWith(icon_settings_note(64, 64));
    note_interface.getElementsByClassName("note_text")[0].style.display = "block";
    note_interface.getElementsByClassName("settings_note")[0].remove();
    note_interface.getElementsByClassName("settings_note_header")[0].remove();
  }
  else {
    note_interface.classList.add("settings");
    tmp_icon_settings.children[0].replaceWith(icon_folder_back(64, 64));
    note_interface.getElementsByClassName("note_text")[0].style.display = "none";

    note_interface.getElementsByClassName("note_main")[0].append(settings_note_header(note_interface));

    let tmp_settings = document.createElement("div");
    tmp_settings.className = "settings_note";

    tmp_settings.append(settings_note_section_note_management(note_interface));

    note_interface.getElementsByClassName("note_main")[0].append(tmp_settings);
  }
}

function settings_note_header(note_interface){
  let tmp_settings_header = document.createElement("div");
  tmp_settings_header.className = "settings_note_header";

  let tmp_icon_double_left = document.createElement("span");
  tmp_icon_double_left.className = "icon rotate_270";
  tmp_icon_double_left.onclick = function(){note_move_first(note_interface)};
  tmp_icon_double_left.append(icon_double_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_double_left);

  let tmp_icon_left = document.createElement("span");
  tmp_icon_left.className = "icon rotate_270";
  tmp_icon_left.onclick = function(){note_move_prev(note_interface)};
  tmp_icon_left.append(icon_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_left);

  let tmp_icon_right = document.createElement("span");
  tmp_icon_right.className = "icon rotate_90";
  tmp_icon_right.onclick = function(){note_move_next(note_interface)};
  tmp_icon_right.append(icon_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_right);

  let tmp_icon_double_right = document.createElement("span");
  tmp_icon_double_right.className = "icon rotate_90";
  tmp_icon_double_right.onclick = function(){note_move_last(note_interface)};
  tmp_icon_double_right.append(icon_double_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_double_right);

  let tmp_icon_fullscreen = document.createElement("span");
  tmp_icon_fullscreen.className = "icon";
  tmp_icon_fullscreen.onclick = function(){note_fullscreen(app.note[note_interface.id])};
  tmp_icon_fullscreen.append(icon_fullscreen(64, 64));
  tmp_settings_header.append(tmp_icon_fullscreen);

  return tmp_settings_header;
}

function settings_note_section_note_management(note_interface){
  let tmp_section = settings_section(translation().note_management);
  tmp_section.classList.add("first");

  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element desc";
  tmp_settings.onclick = function(){note_export_txt(app.note[note_interface.id])};

  let tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  let tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().note_export_txt;
  tmp_settings_text.append(tmp_settings_title);

  let tmp_settings_description = document.createElement("p");
  tmp_settings_description.className = "settings_section_element_description";
  tmp_settings_description.textContent = translation().note_export_txt_desc;
  tmp_settings_text.append(tmp_settings_description);

  tmp_settings.append(tmp_settings_text);

  let tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  let tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_arrow_move(48, 48));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);

  tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element desc";
  tmp_settings.onclick = function(){note_import_txt(app.note[note_interface.id])};

  tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = translation().note_import_txt;
  tmp_settings_text.append(tmp_settings_title);

  tmp_settings_description = document.createElement("p");
  tmp_settings_description.className = "settings_section_element_description";
  tmp_settings_description.textContent = translation().note_import_txt_desc;
  tmp_settings_text.append(tmp_settings_description);

  tmp_settings.append(tmp_settings_text);

  tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  tmp_icon = document.createElement("span");
  tmp_icon.className = "icon white";
  tmp_icon.append(icon_arrow_move(48, 48));
  tmp_settings_icon.append(tmp_icon);

  tmp_settings.append(tmp_settings_icon);
  tmp_section.append(tmp_settings);
  return tmp_section;
}
