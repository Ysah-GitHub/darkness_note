function settings_load(){
  let tmp_request = app_db_open();
  app.settings = {};

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("settings", "readonly");
    settings_load_get(tmp_transaction, [
      "note_title_size",
      "note_text_size",
      "note_auto_clean"
    ]);
  };
}

function settings_load_get(tmp_transaction, tmp_settings_list){
  if (tmp_settings_list.length > 0) {
    let tmp_transaction_get = tmp_transaction.objectStore("settings").get(tmp_settings_list[0]);
    tmp_transaction_get.onsuccess = function(){
      if (tmp_transaction_get.result != null) {
        app.settings[tmp_settings_list[0]] = tmp_transaction_get.result[tmp_settings_list[0]];
      }
      else {
        app.settings[tmp_settings_list[0]] = settings_default()[tmp_settings_list[0]];
      }
      tmp_settings_list.splice(0, 1);
      settings_load_get(tmp_transaction, tmp_settings_list);
    };
  }
  else {
    app_load(app.load_stage + 1);
  }
}

function settings_default(){
  return {
    note_title_size: "15px",
    note_text_size: "13px",
    note_auto_clean: "enable"
  };
}

function setting_reset(){
  let tmp_request = app_db_open();
  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("settings", "readwrite");
    tmp_transaction.objectStore("settings").clear();
  };

  app.settings = settings_default();

  document.getElementById("settings").remove();
  document.getElementById("menu_title_sub").remove();
  document.getElementById("menu_settings_back").remove();
  settings();
}

function settings_save(name, value){
  let tmp_request = app_db_open();

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("settings", "readwrite");
    let tmp_transaction_get = tmp_transaction.objectStore("settings").get(name);

    tmp_transaction_get.onsuccess = function(){
      if (tmp_transaction_get.result != null) tmp_transaction.objectStore("settings").delete(name);
      tmp_transaction.objectStore("settings").add({key: name, [name]: value});
    };
  };
}

function settings(){
  if (document.getElementById("note_list")) document.getElementById("note_list").remove();
  document.getElementById("menu_settings").style.display = "none";
  document.getElementById("menu_note_add").style.display = "none";
  document.getElementById("menu_note_trash").style.display = "none";

  let tmp_settings = document.createElement("div");
  tmp_settings.id = "settings";

  tmp_settings.append(settings_section_note_style());
  tmp_settings.append(settings_section_note_management());
  tmp_settings.append(settings_section_links());
  tmp_settings.append(settings_section_other());
  tmp_settings.append(settings_section_service_worker());

  document.getElementsByTagName("main")[0].append(tmp_settings);
  document.getElementById("menu").append(menu_title_sub(app.translate().main.settings));
  document.getElementById("menu").append(menu_settings_back());
  app_url_update("settings");
}

function settings_back(){
  document.getElementById("settings").remove();
  document.getElementById("menu_title_sub").remove();
  document.getElementById("menu_settings_back").remove();
  document.getElementById("menu_settings").removeAttribute("style");
  document.getElementById("menu_note_add").removeAttribute("style");
  document.getElementById("menu_note_trash").removeAttribute("style");
  document.getElementsByTagName("main")[0].append(note_list());
  app_url_update();
}

function settings_language_update(language){
  app_language_new_file(language, function(){
    if (document.getElementById("settings")) {
      document.getElementById("settings").remove();
      document.getElementById("menu_settings_back").remove();
      document.getElementById("menu_title_sub").remove();
      settings();
    }
  });
}

function settings_section(title){
  let tmp_section = document.createElement("div");
  tmp_section.className = "settings_section";

  let tmp_section_title = document.createElement("p");
  tmp_section_title.className = "settings_section_title";
  tmp_section_title.textContent = title;
  tmp_section.append(tmp_section_title);

  return tmp_section;
}

function settings_section_element_select(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.setAttribute("tabindex", "0");
  tmp_settings.onclick = function(){
    if (tmp_settings.getElementsByClassName("settings_section_element_select")[0].classList.value.includes("visible")) {
      tmp_settings.getElementsByClassName("settings_section_element_select")[0].classList.remove("visible")
    }
    else {
      tmp_settings.getElementsByClassName("settings_section_element_select")[0].classList.add("visible");
    }
  };
  tmp_settings.onblur = function(){
    tmp_settings.getElementsByClassName("settings_section_element_select")[0].classList.remove("visible");
  };

  return tmp_settings;
}

function settings_section_element_confirm_result(section_element, result){
  section_element.classList.add(result);
  setTimeout(function(){
    if (section_element) {
      section_element.classList.remove(result);
    }
  }, 250);
}

function settings_text(text, description){
  let tmp_settings_text = document.createElement("div");
  tmp_settings_text.className = "settings_section_element_text";

  let tmp_settings_title = document.createElement("p");
  tmp_settings_title.className = "settings_section_element_title";
  tmp_settings_title.textContent = text;
  tmp_settings_text.append(tmp_settings_title);

  if (description != null) {
    let tmp_settings_description = document.createElement("p");
    tmp_settings_description.className = "settings_section_element_description";
    tmp_settings_description.textContent = description;
    tmp_settings_text.append(tmp_settings_description);
  }

  return tmp_settings_text;
}

function settings_icon(func){
  let tmp_settings_icon = document.createElement("div");
  tmp_settings_icon.className = "settings_section_element_icon";

  let tmp_icon = document.createElement("span");
  tmp_icon.append(func());
  tmp_settings_icon.append(tmp_icon);

  return tmp_settings_icon;
}

function settings_select(settings, option_list, func){
  let tmp_select = document.createElement("div");
  tmp_select.className = "settings_section_element_select";

  let tmp_option_selected = document.createElement("p");
  tmp_option_selected.className = "option_selected";
  tmp_option_selected.dataset.value = settings;
  tmp_select.append(tmp_option_selected);

  let tmp_select_icon = document.createElement("span");
  tmp_select_icon.className = "select_icon";
  tmp_select_icon.append(icon_select(12, 12));
  tmp_select.append(tmp_select_icon);

  let tmp_option_list = document.createElement("div");
  tmp_option_list.className = "option_list";

  for (let i = 0; i < option_list.length; i++) {
    let tmp_option = document.createElement("p");
    tmp_option.className = "option";
    tmp_option.dataset.value = option_list[i][0];
    tmp_option.textContent = option_list[i][1];
    tmp_option.onclick = function(){
      if (tmp_option_selected.dataset.value != option_list[i][0]) {
        tmp_option_selected.dataset.value = option_list[i][0];
        tmp_option_selected.textContent = option_list[i][1];
        tmp_option_list.getElementsByClassName("selected")[0].classList.remove("selected");
        tmp_option.classList.add("selected");
        func();
      }
    };
    if (option_list[i][0] == settings) {
      tmp_option.classList.add("selected");
      tmp_option_selected.textContent = option_list[i][1];
    }
    tmp_option_list.append(tmp_option);
  }
  tmp_select.append(tmp_option_list);
  return tmp_select;
}

function settings_section_note_style(){
  let tmp_section = settings_section(app.translate().settings.settings_note_style);
  tmp_section.append(settings_section_note_style_title_size());
  tmp_section.append(settings_section_note_style_title_text());
  return tmp_section;
}

function settings_section_note_style_title_size(){
  let tmp_settings = settings_section_element_select();

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_title_size,
    app.translate().settings.settings_note_title_size_exemple
  ));
  tmp_settings.getElementsByClassName("settings_section_element_description")[0].style.fontSize = app.settings.note_title_size;

  tmp_settings.append(settings_select(app.settings.note_title_size,
    [
      ["19px", app.translate().main.extra_large],
      ["17px", app.translate().main.large],
      ["15px", app.translate().main.medium],
      ["13px", app.translate().main.small],
      ["11px", app.translate().main.extra_small]
    ],
    function(){
      app.settings.note_title_size = tmp_settings.getElementsByClassName("option_selected")[0].dataset.value;
      settings_save("note_title_size", app.settings.note_title_size);
      tmp_settings.getElementsByClassName("settings_section_element_description")[0].style.fontSize = app.settings.note_title_size;
    }
  ));
  return tmp_settings;
}

function settings_section_note_style_title_text(){
  let tmp_settings = settings_section_element_select();

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_text_size,
    app.translate().settings.settings_note_text_size_exemple
  ));
  tmp_settings.getElementsByClassName("settings_section_element_description")[0].style.fontSize = app.settings.note_text_size;

  tmp_settings.append(settings_select(app.settings.note_text_size,
    [
      ["19px", app.translate().main.extra_large],
      ["17px", app.translate().main.large],
      ["15px", app.translate().main.medium],
      ["13px", app.translate().main.small],
      ["11px", app.translate().main.extra_small]
    ],
    function(){
      app.settings.note_text_size = tmp_settings.getElementsByClassName("option_selected")[0].dataset.value;
      settings_save("note_text_size", app.settings.note_text_size);
      tmp_settings.getElementsByClassName("settings_section_element_description")[0].style.fontSize = app.settings.note_text_size;
    }
  ));
  return tmp_settings;
}

function settings_section_note_management(){
  let tmp_section = settings_section(app.translate().settings.settings_note_management);
  tmp_section.append(settings_section_note_management_import());
  tmp_section.append(settings_section_note_management_import_all());
  tmp_section.append(settings_section_note_management_export_all());
  tmp_section.append(settings_section_note_management_auto_clean());
  tmp_section.append(settings_section_note_management_delete_all());
  return tmp_section;
}

function settings_section_note_management_import(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = note_import;

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_import,
    app.translate().settings.settings_note_import_description
  ));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  return tmp_settings;
}

function settings_section_note_management_import_all(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = note_import_all;

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_import_all,
    app.translate().settings.settings_note_import_all_description
  ));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  return tmp_settings;
}

function settings_section_note_management_export_all(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = note_export_all;

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_export_all,
    app.translate().settings.settings_note_export_all_description
  ));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  return tmp_settings;
}

function settings_section_note_management_auto_clean(){
  let tmp_settings = settings_section_element_select();

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_auto_clean,
    app.translate().settings.settings_note_auto_clean_desc
  ));

  tmp_settings.append(settings_select(app.settings.note_auto_clean,
    [
      ["enable", app.translate().main.enable],
      ["disable", app.translate().main.disable]
    ],
    function(){
      app.settings.note_auto_clean = tmp_settings.getElementsByClassName("option_selected")[0].dataset.value;
      settings_save("note_auto_clean", app.settings.note_auto_clean);
    }
  ));
  return tmp_settings;
}

function settings_section_note_management_delete_all(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element red";
  tmp_settings.onclick = function(){
    if (confirm(app.translate().settings.settings_note_delete_all_description)) {
      note_remove_all();
      settings_section_element_confirm_result(tmp_settings, "validate");
    }
    else {
      settings_section_element_confirm_result(tmp_settings, "cancel");
    }
  };

  tmp_settings.append(settings_text(app.translate().settings.settings_note_delete_all, app.translate().settings.settings_note_delete_all_description));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  return tmp_settings;
}

function settings_section_links(){
  let tmp_section = settings_section(app.translate().main.links);
  tmp_section.append(settings_section_links_contact());
  tmp_section.append(settings_section_links_source_code());
  return tmp_section;
}

function settings_section_links_contact(){
  let tmp_settings = document.createElement("a");
  tmp_settings.className = "settings_section_element";
  tmp_settings.href = "mailto:contact@darkness-note.org";

  tmp_settings.append(settings_text(
    app.translate().main.contact,
    "contact@darkness-note.org"
  ));

  tmp_settings.append(settings_icon(function(){return icon_link_light(28, 28)}));
  return tmp_settings;
}

function settings_section_links_source_code(){
  let tmp_settings = document.createElement("a");
  tmp_settings.className = "settings_section_element";
  tmp_settings.href = "https://github.com/Ysah-GitHub/darkness_note";
  tmp_settings.target = "_blank";

  tmp_settings.append(settings_text(
    app.translate().main.source_code,
    "https://github.com/Ysah-GitHub/darkness_note"
  ));

  tmp_settings.append(settings_icon(function(){return icon_link_light(28, 28)}));
  return tmp_settings;
}

function settings_section_other(){
  let tmp_section = settings_section(app.translate().main.other);
  tmp_section.append(settings_section_other_language());
  tmp_section.append(settings_section_other_donate());
  tmp_section.append(settings_section_other_about());
  tmp_section.append(settings_section_other_reset());
  return tmp_section;
}

function settings_section_other_language(){
  let tmp_settings = settings_section_element_select();

  tmp_settings.append(settings_text(app.translate().main.language));

  tmp_settings.append(settings_select(app.language,
    [
      ["en", "en"],
      ["fr", "fr"]
    ],
    function(){
      if (navigator.onLine) {
        settings_language_update(tmp_settings.getElementsByClassName("option_selected")[0].dataset.value);
      }
      else {
        alert(app.translate().error.error_navigator_offline);
        tmp_settings.getElementsByClassName("option_selected")[0].dataset.value = app.language;
        tmp_settings.getElementsByClassName("option_selected")[0].textContent = app.language;
        tmp_settings.getElementsByClassName("selected")[0].classList.remove("selected");
        tmp_settings.getElementsByClassName("option_list")[0].querySelectorAll("[data-value=" + app.language + "]")[0].classList.add("selected");
      }
    }
  ));
  return tmp_settings;
}

function settings_section_other_donate(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = function(){
    settings_note_fullscreen(app.translate().main.donate, app.translate().app.app_donate);
  };

  tmp_settings.append(settings_text(app.translate().main.donate));

  tmp_settings.append(settings_icon(function(){return icon_fullscreen_light(48, 48)}));
  return tmp_settings;
}

function settings_section_other_about(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = function(){
    settings_note_fullscreen(app.translate().main.about, app.translate().app.app_about);
  };

  tmp_settings.append(settings_text(app.translate().main.about, "Darkness Note - " + app.version));

  tmp_settings.append(settings_icon(function(){return icon_fullscreen_light(48, 48)}));
  return tmp_settings;
}

function settings_section_other_reset(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element red";
  tmp_settings.onclick = function(){
    if (confirm(app.translate().settings.settings_reset_description)) {
      setting_reset();
      settings_section_element_confirm_result(tmp_settings, "validate");
    }
    else {
      settings_section_element_confirm_result(tmp_settings, "cancel");
    }
  };

  tmp_settings.append(settings_text(app.translate().main.reset, app.translate().settings.settings_reset_description));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  return tmp_settings;
}

function settings_section_service_worker(){
  let tmp_section = settings_section(app.translate().settings.settings_cache_offline);
  tmp_section.append(settings_section_service_worker_delete());
  return tmp_section;
}

function settings_section_service_worker_delete(){
  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element red";
  tmp_settings.onclick = function(){
    if (confirm(app.translate().settings.settings_cache_delete_description)) {
      app_service_worker_delete();
      settings_section_element_confirm_result(tmp_settings, "validate");
    }
    else {
      settings_section_element_confirm_result(tmp_settings, "cancel");
    }
  };

  tmp_settings.append(settings_text(app.translate().main.delete, app.translate().settings.settings_cache_delete_description));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  return tmp_settings;
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

  let tmp_icon_fullscreen = document.createElement("span");
  tmp_icon_fullscreen.className = "icon";
  tmp_icon_fullscreen.onclick = function(){
    note_fullscreen(app.note[note_interface.id]);
  };
  tmp_icon_fullscreen.append(icon_fullscreen(64, 64));
  tmp_settings_header.append(tmp_icon_fullscreen);

  let tmp_icon_double_left = document.createElement("span");
  tmp_icon_double_left.className = "icon rotate_180";
  tmp_icon_double_left.onclick = function(){note_move_first(note_interface)};
  tmp_icon_double_left.append(icon_double_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_double_left);

  let tmp_icon_left = document.createElement("span");
  tmp_icon_left.className = "icon rotate_180";
  tmp_icon_left.onclick = function(){note_move_prev(note_interface)};
  tmp_icon_left.append(icon_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_left);

  let tmp_icon_right = document.createElement("span");
  tmp_icon_right.className = "icon";
  tmp_icon_right.onclick = function(){note_move_next(note_interface)};
  tmp_icon_right.append(icon_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_right);

  let tmp_icon_double_right = document.createElement("span");
  tmp_icon_double_right.className = "icon";
  tmp_icon_double_right.onclick = function(){note_move_last(note_interface)};
  tmp_icon_double_right.append(icon_double_arrow_move(64, 64));
  tmp_settings_header.append(tmp_icon_double_right);

  return tmp_settings_header;
}

function settings_note_section_note_management(note_interface){
  let tmp_section = settings_section(app.translate().settings.settings_note_management);

  let tmp_settings = document.createElement("div");
  tmp_settings.className = "settings_section_element";
  tmp_settings.onclick = function(){note_export(app.note[note_interface.id])};

  tmp_settings.append(settings_text(
    app.translate().settings.settings_note_export,
    app.translate().settings.settings_note_export_description
  ));

  tmp_settings.append(settings_icon(function(){return icon_arrow_move_light(48, 48)}));
  tmp_section.append(tmp_settings);
  return tmp_section;
}

function settings_note_fullscreen(title, text){
  document.getElementsByTagName("aside")[0].style.display = "none";
  document.getElementsByTagName("main")[0].classList.add("full");
  document.getElementById("settings").style.display = "none";

  let tmp_note_fullscreen = document.createElement("div");
  tmp_note_fullscreen.id = "note_fullscreen";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_back = document.createElement("span");
  tmp_icon_back.className = "icon dark_background";
  tmp_icon_back.onclick = settings_note_fullscreen_back;
  tmp_icon_back.append(icon_folder_back(64, 64));
  tmp_header.append(tmp_icon_back);

  let tmp_title = document.createElement("input");
  tmp_title.className = "note_title readonly";
  tmp_title.type = "text";
  tmp_title.setAttribute("readonly", "");
  tmp_title.value = title;
  tmp_header.append(tmp_title);

  tmp_note_fullscreen.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  let tmp_text = document.createElement("textarea");
  tmp_text.className = "note_text";
  tmp_text.value = text;
  tmp_main.append(tmp_text);

  tmp_note_fullscreen.append(tmp_main);

  document.getElementById("settings").after(tmp_note_fullscreen);
  app_url_update("settings_note_fullscreen");
}

function settings_note_fullscreen_back(){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("settings").removeAttribute("style");
  document.getElementsByTagName("main")[0].classList.remove("full");
  document.getElementsByTagName("aside")[0].removeAttribute("style");
  app_url_update("settings");
}
