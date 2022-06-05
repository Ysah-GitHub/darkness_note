function settings_load(){
  let request = app_db_open();
  app.settings = {};

  request.onsuccess = function(){
    let transaction = request.result.transaction("settings", "readonly");
    settings_load_get(transaction, [
      "note_title_size",
      "note_text_size",
      "note_auto_clean"
    ]);
  };
}

function settings_load_get(transaction, settings_list){
  if (settings_list.length > 0) {
    let transaction_get = transaction.objectStore("settings").get(settings_list[0]);
    transaction_get.onsuccess = function(){
      if (transaction_get.result != null) {
        app.settings[settings_list[0]] = transaction_get.result[settings_list[0]];
      }
      else {
        app.settings[settings_list[0]] = settings_default()[settings_list[0]];
      }
      settings_list.splice(0, 1);
      settings_load_get(transaction, settings_list);
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
  let request = app_db_open();
  request.onsuccess = function(){
    let transaction = request.result.transaction("settings", "readwrite");
    transaction.objectStore("settings").clear();
  };

  app.settings = settings_default();

  document.getElementById("settings").remove();
  document.getElementById("menu_title_sub").remove();
  document.getElementById("menu_settings_back").remove();
  settings();
}

function settings_save(name, value){
  let request = app_db_open();

  request.onsuccess = function(){
    let transaction = request.result.transaction("settings", "readwrite");
    let transaction_get = transaction.objectStore("settings").get(name);

    transaction_get.onsuccess = function(){
      if (transaction_get.result != null) transaction.objectStore("settings").delete(name);
      transaction.objectStore("settings").add({key: name, [name]: value});
    };
  };
}

function settings(){
  if (document.getElementById("note_list")) document.getElementById("note_list").remove();
  document.getElementById("menu_settings").style.display = "none";
  document.getElementById("menu_note_add").style.display = "none";
  document.getElementById("menu_note_trash").style.display = "none";

  let settings_container = document.createElement("div");
  settings_container.id = "settings";

  settings_container.append(settings_section_note_style());
  settings_container.append(settings_section_note_management());
  settings_container.append(settings_section_links());
  settings_container.append(settings_section_other());
  settings_container.append(settings_section_service_worker());

  document.getElementsByTagName("main")[0].append(settings_container);
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
  let section = document.createElement("div");
  section.className = "settings_section";

  let section_title = document.createElement("p");
  section_title.className = "settings_section_title";
  section_title.textContent = title;
  section.append(section_title);

  return section;
}

function settings_section_element_select(){
  let section_element = document.createElement("div");
  section_element.className = "settings_section_element";
  section_element.setAttribute("tabindex", "0");
  section_element.onclick = function(){
    if (section_element.getElementsByClassName("settings_section_element_select")[0].classList.value.includes("visible")) {
      section_element.getElementsByClassName("settings_section_element_select")[0].classList.remove("visible")
    }
    else {
      section_element.getElementsByClassName("settings_section_element_select")[0].classList.add("visible");
      document.getElementsByTagName("main")[0].onscroll = function(){
        section_element.getElementsByClassName("settings_section_element_select")[0].classList.remove("visible");
        document.getElementsByTagName("main")[0].onscroll = null;
      };
    }
  };
  section_element.onblur = function(){
    section_element.getElementsByClassName("settings_section_element_select")[0].classList.remove("visible");
  };

  return section_element;
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
  let section_text = document.createElement("div");
  section_text.className = "settings_section_element_text";

  let section_title = document.createElement("p");
  section_title.className = "settings_section_element_title";
  section_title.textContent = text;
  section_text.append(section_title);

  if (description != null) {
    let section_description = document.createElement("p");
    section_description.className = "settings_section_element_description";
    section_description.textContent = description;
    section_text.append(section_description);
  }

  return section_text;
}

function settings_icon(func){
  let section_icon = document.createElement("div");
  section_icon.className = "settings_section_element_icon";

  let icon = document.createElement("span");
  icon.append(func());
  section_icon.append(icon);

  return section_icon;
}

function settings_select(settings_section, settings, option_list, func){
  let select = document.createElement("div");
  select.className = "settings_section_element_select";

  let select_icon = document.createElement("span");
  select_icon.append(icon_draw("select_double", 48, 48, "rgb(200, 200, 200)"));
  select.append(select_icon);

  let option_list_container = document.createElement("div");
  option_list_container.className = "option_list";

  for (let i = 0; i < option_list.length; i++) {
    let option = document.createElement("p");
    option.className = "option";
    option.dataset.value = option_list[i][0];
    option.textContent = option_list[i][1];
    option.onclick = function(){
      if (option_list_container.getElementsByClassName("selected")[0].dataset.value != option_list[i][0]) {
        settings_section.getElementsByClassName("settings_section_element_description")[0].textContent = option_list[i][1];
        option_list_container.getElementsByClassName("selected")[0].classList.remove("selected");
        option.classList.add("selected");
        func();
      }
    };
    if (option_list[i][0] == settings) {
      option.classList.add("selected");
      settings_section.getElementsByClassName("settings_section_element_description")[0].textContent = option_list[i][1];
    }
    option_list_container.append(option);
  }
  select.append(option_list_container);
  return select;
}

function settings_section_note_style(){
  let section = settings_section(app.translate().settings.note_style);
  section.append(settings_section_note_style_title_size());
  section.append(settings_section_note_style_title_text());
  return section;
}

function settings_section_note_style_title_size(){
  let section = settings_section_element_select();

  section.append(settings_text(app.translate().settings.note_title_size, ""));
  section.getElementsByClassName("settings_section_element_title")[0].style.fontSize = app.settings.note_title_size;

  section.append(settings_select(section, app.settings.note_title_size,
    [
      ["19px", app.translate().main.extra_large],
      ["17px", app.translate().main.large],
      ["15px", app.translate().main.medium],
      ["13px", app.translate().main.small],
      ["11px", app.translate().main.extra_small]
    ],
    function(){
      app.settings.note_title_size = section.getElementsByClassName("option selected")[0].dataset.value;
      settings_save("note_title_size", app.settings.note_title_size);
      section.getElementsByClassName("settings_section_element_title")[0].style.fontSize = app.settings.note_title_size;
    }
  ));
  return section;
}

function settings_section_note_style_title_text(){
  let section = settings_section_element_select();

  section.append(settings_text(app.translate().settings.note_text_size, ""));
  section.getElementsByClassName("settings_section_element_title")[0].style.fontSize = app.settings.note_text_size;

  section.append(settings_select(section, app.settings.note_text_size,
    [
      ["19px", app.translate().main.extra_large],
      ["17px", app.translate().main.large],
      ["15px", app.translate().main.medium],
      ["13px", app.translate().main.small],
      ["11px", app.translate().main.extra_small]
    ],
    function(){
      app.settings.note_text_size = section.getElementsByClassName("option selected")[0].dataset.value;
      settings_save("note_text_size", app.settings.note_text_size);
      section.getElementsByClassName("settings_section_element_title")[0].style.fontSize = app.settings.note_text_size;
    }
  ));
  return section;
}

function settings_section_note_management(){
  let section = settings_section(app.translate().settings.note_management);
  section.append(settings_section_note_management_import());
  section.append(settings_section_note_management_import_all());
  section.append(settings_section_note_management_export_all());
  section.append(settings_section_note_management_auto_clean());
  section.append(settings_section_note_management_delete_all());
  return section;
}

function settings_section_note_management_import(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = note_import;

  section.append(settings_text(
    app.translate().settings.note_import,
    app.translate().settings.note_import_description
  ));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_note_management_import_all(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = note_import_all;

  section.append(settings_text(
    app.translate().settings.note_import_all,
    app.translate().settings.note_import_all_description
  ));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_note_management_export_all(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = note_export_all;

  section.append(settings_text(
    app.translate().settings.note_export_all,
    app.translate().settings.note_export_all_description
  ));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_note_management_auto_clean(){
  let section = settings_section_element_select();

  section.append(settings_text(app.translate().settings.note_auto_clean, ""));

  section.append(settings_select(section, app.settings.note_auto_clean,
    [
      ["enable", app.translate().main.enable],
      ["disable", app.translate().main.disable]
    ],
    function(){
      app.settings.note_auto_clean = section.getElementsByClassName("option selected")[0].dataset.value;
      settings_save("note_auto_clean", app.settings.note_auto_clean);
    }
  ));
  return section;
}

function settings_section_note_management_delete_all(){
  let section = document.createElement("div");
  section.className = "settings_section_element red";
  section.onclick = function(){
    if (confirm(app.translate().settings.note_delete_all_description)) {
      note_remove_all();
      settings_section_element_confirm_result(section, "validate");
    }
    else {
      settings_section_element_confirm_result(section, "cancel");
    }
  };

  section.append(settings_text(app.translate().settings.note_delete_all, app.translate().settings.note_delete_all_description));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_links(){
  let section = settings_section(app.translate().main.links);
  section.append(settings_section_links_contact());
  section.append(settings_section_links_source_code());
  return section;
}

function settings_section_links_contact(){
  let section = document.createElement("a");
  section.className = "settings_section_element";
  section.href = "mailto:contact@darkness-note.org";

  section.append(settings_text(
    app.translate().main.contact,
    "contact@darkness-note.org"
  ));

  section.append(settings_icon(function(){return icon_draw("link", 28, 28, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_links_source_code(){
  let section = document.createElement("a");
  section.className = "settings_section_element";
  section.href = "https://github.com/Ysah-GitHub/darkness_note";
  section.target = "_blank";

  section.append(settings_text(
    app.translate().main.source_code,
    "https://github.com/Ysah-GitHub/darkness_note"
  ));

  section.append(settings_icon(function(){return icon_draw("link", 28, 28, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_other(){
  let section = settings_section(app.translate().main.other);
  section.append(settings_section_other_language());
  section.append(settings_section_other_about());
  section.append(settings_section_other_reset());
  return section;
}

function settings_section_other_language(){
  let section = settings_section_element_select();

  section.append(settings_text(app.translate().main.language, ""));

  section.append(settings_select(section, app.language,
    [
      ["en", "en"],
      ["fr", "fr"]
    ],
    function(){
      if (navigator.onLine) {
        settings_language_update(section.getElementsByClassName("option selected")[0].dataset.value);
      }
      else {
        alert(app.translate().error.navigator_offline);
        section.getElementsByClassName("settings_section_element_description")[0].textContent = app.language;
        section.getElementsByClassName("selected")[0].classList.remove("selected");
        section.getElementsByClassName("option_list")[0].querySelectorAll("[data-value=" + app.language + "]")[0].classList.add("selected");
      }
    }
  ));
  return section;
}

function settings_section_other_about(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){
    settings_note_fullscreen(app.translate().main.about, app.translate().app.about);
  };

  section.append(settings_text(app.translate().main.about, "Darkness Note - " + app.version));

  section.append(settings_icon(function(){return icon_draw("fullscreen", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_other_reset(){
  let section = document.createElement("div");
  section.className = "settings_section_element red";
  section.onclick = function(){
    if (confirm(app.translate().settings.reset_description)) {
      setting_reset();
      settings_section_element_confirm_result(section, "validate");
    }
    else {
      settings_section_element_confirm_result(section, "cancel");
    }
  };

  section.append(settings_text(app.translate().main.reset, app.translate().settings.reset_description));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_section_service_worker(){
  let section = settings_section(app.translate().settings.cache_offline);
  section.append(settings_section_service_worker_delete());
  return section;
}

function settings_section_service_worker_delete(){
  let section = document.createElement("div");
  section.className = "settings_section_element red";
  section.onclick = function(){
    if (confirm(app.translate().settings.cache_delete_description)) {
      app_service_worker_delete();
      settings_section_element_confirm_result(section, "validate");
    }
    else {
      settings_section_element_confirm_result(section, "cancel");
    }
  };

  section.append(settings_text(app.translate().main.delete, app.translate().settings.cache_delete_description));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_note(note_interface){
  let icon_settings = note_interface.getElementsByClassName("icon settings")[0];

  if (note_interface.className == "note settings") {
    note_interface.classList.remove("settings");
    icon_settings.children[0].replaceWith(icon_draw("settings_note", 64, 64, "rgb(85, 85, 85)"));
    note_interface.getElementsByClassName("note_text")[0].style.display = "block";
    note_interface.getElementsByClassName("settings_note")[0].remove();
    note_interface.getElementsByClassName("settings_note_more")[0].remove();
    note_interface.getElementsByClassName("settings_note_header")[0].remove();
  }
  else {
    note_interface.classList.add("settings");
    icon_settings.children[0].replaceWith(icon_draw("folder_back", 64, 64, "rgb(65, 65, 65)"));
    note_interface.getElementsByClassName("note_text")[0].style.display = "none";

    note_interface.getElementsByClassName("note_main")[0].append(settings_note_header(note_interface));

    let more_settings = document.createElement("div");
    more_settings.className = "settings_note_more";
    more_settings.onclick = function(){
      if (more_settings.classList.value.includes("active")) {
        more_settings.classList.remove("active");
        note_interface.getElementsByClassName("settings_note_header")[0].classList.remove("hidden");
        note_interface.getElementsByClassName("settings_note")[0].classList.add("hidden");
      }
      else {
        more_settings.classList.add("active");
        note_interface.getElementsByClassName("settings_note_header")[0].classList.add("hidden");
        note_interface.getElementsByClassName("settings_note")[0].classList.remove("hidden");
      }
    };

    let more_settings_text = document.createElement("p");
    more_settings_text.textContent = app.translate().settings.more_settings;
    more_settings.append(more_settings_text);

    let more_settings_icon = document.createElement("span");
    more_settings_icon.className = "select_icon";
    more_settings_icon.append(icon_draw("select", 12, 12, "rgb(65, 65, 65)"));
    more_settings.append(more_settings_icon);

    note_interface.getElementsByClassName("note_main")[0].append(more_settings);

    let settings_container = document.createElement("div");
    settings_container.className = "settings_note hidden";

    settings_container.append(settings_note_section_note_management(note_interface));

    note_interface.getElementsByClassName("note_main")[0].append(settings_container);
  }
}

function settings_note_header(note_interface){
  let settings_header = document.createElement("div");
  settings_header.className = "settings_note_header";

  let icon_double_left = document.createElement("span");
  icon_double_left.className = "icon rotate_180";
  icon_double_left.onclick = function(){note_move_first(note_interface)};
  icon_double_left.append(icon_draw("arrow_move_double", 64, 64, "rgb(65, 65, 65)"));
  settings_header.append(icon_double_left);

  let icon_left = document.createElement("span");
  icon_left.className = "icon rotate_180";
  icon_left.onclick = function(){note_move_prev(note_interface)};
  icon_left.append(icon_draw("arrow_move", 64, 64, "rgb(65, 65, 65)"));
  settings_header.append(icon_left);

  let icon_right = document.createElement("span");
  icon_right.className = "icon";
  icon_right.onclick = function(){note_move_next(note_interface)};
  icon_right.append(icon_draw("arrow_move", 64, 64, "rgb(65, 65, 65)"));
  settings_header.append(icon_right);

  let icon_double_right = document.createElement("span");
  icon_double_right.className = "icon";
  icon_double_right.onclick = function(){note_move_last(note_interface)};
  icon_double_right.append(icon_draw("arrow_move_double", 64, 64, "rgb(65, 65, 65)"));
  settings_header.append(icon_double_right);

  let icon_fullscreen = document.createElement("span");
  icon_fullscreen.className = "icon";
  icon_fullscreen.onclick = function(){
    note_fullscreen(app.note[note_interface.id]);
  };
  icon_fullscreen.append(icon_draw("fullscreen", 64, 64, "rgb(65, 65, 65)"));
  settings_header.append(icon_fullscreen);

  return settings_header;
}

function settings_note_section_note_management(note_interface){
  let section = settings_section(app.translate().settings.note_management);
  section.append(settings_note_section_note_management_blur(note_interface));
  section.append(settings_note_section_note_management_duplicate(note_interface));
  section.append(settings_note_section_note_management_export(note_interface));
  return section;
}

function settings_note_section_note_management_blur(note_interface){
  let section = settings_section_element_select();

  section.append(settings_text(app.translate().main.blur, ""));

  section.append(settings_select(section, app.note[note_interface.id].blur,
    [
      [true, app.translate().main.enable],
      [false, app.translate().main.disable]
    ],
    function(){
      if (!app.note[note_interface.id].blur) {
        app.note[note_interface.id].blur = true;
        note_interface.getElementsByClassName("note_text")[0].classList.add("blur");
      }
      else {
        app.note[note_interface.id].blur = false;
        note_interface.getElementsByClassName("note_text")[0].classList.remove("blur");
      }
      note_save();
    }
  ));
  return section;
}

function settings_note_section_note_management_duplicate(note_interface){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){note_duplicate(app.note[note_interface.id])};

  section.append(settings_text(
    app.translate().settings.note_duplicate,
    app.translate().settings.note_duplicate_description
  ));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_note_section_note_management_export(note_interface){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){note_export(app.note[note_interface.id])};

  section.append(settings_text(
    app.translate().settings.note_export,
    app.translate().settings.note_export_description
  ));

  section.append(settings_icon(function(){return icon_draw("arrow_move", 48, 48, "rgb(200, 200, 200)")}));
  return section;
}

function settings_note_fullscreen(title, text){
  document.getElementsByTagName("aside")[0].style.display = "none";
  document.getElementsByTagName("main")[0].classList.add("full");
  document.getElementById("settings").style.display = "none";

  let note_full = document.createElement("div");
  note_full.id = "note_fullscreen";

  let header = document.createElement("div");
  header.className = "note_header";

  let icon_back = document.createElement("span");
  icon_back.className = "icon dark_background";
  icon_back.onclick = settings_note_fullscreen_back;
  icon_back.append(icon_draw("folder_back", 64, 64, "rgb(65, 65, 65)"));
  header.append(icon_back);

  let note_title = document.createElement("input");
  note_title.className = "note_title readonly";
  note_title.type = "text";
  note_title.setAttribute("readonly", "");
  note_title.value = title;
  header.append(note_title);

  note_full.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  let note_text = document.createElement("textarea");
  note_text.className = "note_text";
  note_text.setAttribute("readonly", "");
  note_text.value = text;
  main.append(note_text);

  note_full.append(main);

  document.getElementById("settings").after(note_full);
  app_url_update("settings_note_fullscreen");
}

function settings_note_fullscreen_back(){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("settings").removeAttribute("style");
  document.getElementsByTagName("main")[0].classList.remove("full");
  document.getElementsByTagName("aside")[0].removeAttribute("style");
  app_url_update("settings");
}
