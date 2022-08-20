function settings_load(){
  let request = app_db_open();
  request.onsuccess = function(){
    let transaction = request.result.transaction("settings", "readonly");
    settings_load_get(transaction, Object.keys(settings_values()));
  };
}

function settings_load_get(transaction, settings_list){
  if (settings_list.length > 0) {
    let transaction_get = transaction.objectStore("settings").get(settings_list[0]);
    transaction_get.onsuccess = function(){
      if (transaction_get.result != null && settings_values_verify(settings_list[0], transaction_get.result[settings_list[0]])) {
        app.settings[settings_list[0]] = transaction_get.result[settings_list[0]];
      }
      else {
        app.settings[settings_list[0]] = settings_values_default()[settings_list[0]];
      }
      settings_list.splice(0, 1);
      settings_load_get(transaction, settings_list);
    };
  }
  else {
    app_load(app.load_stage + 1);
  }
}

function settings_values(){
  return {
    app_border: [
      ["enabled", app.translate().main.enabled],
      ["disabled", app.translate().main.disabled]
    ],
    app_border_radius: [
      ["enabled", app.translate().main.enabled],
      ["disabled", app.translate().main.disabled]
    ],
    note_title_font: [
      ["Arial", "Arial"],
      ["Brush Script MT", "Brush Script MT"],
      ["Courier New", "Courier New"],
      ["Garamond", "Garamond"],
      ["Georgia", "Georgia"],
      ["Helvetica", "Helvetica"],
      ["Tahoma", "Tahoma"],
      ["Times New", "Times New"],
      ["Trebuchet MS", "Trebuchet MS"],
      ["Verdana", "Verdana"]
    ],
    note_text_font: [
      ["Arial", "Arial"],
      ["Brush Script MT", "Brush Script MT"],
      ["Courier New", "Courier New"],
      ["Garamond", "Garamond"],
      ["Georgia", "Georgia"],
      ["Helvetica", "Helvetica"],
      ["Tahoma", "Tahoma"],
      ["Times New", "Times New"],
      ["Trebuchet MS", "Trebuchet MS"],
      ["Verdana", "Verdana"]
    ],
    note_title_size: [
      ["24px", app.translate().main.extra_large],
      ["22px", app.translate().main.large],
      ["20px", app.translate().main.medium],
      ["18px", app.translate().main.small],
      ["16px", app.translate().main.extra_small]
    ],
    note_text_size: [
      ["24px", app.translate().main.extra_large],
      ["22px", app.translate().main.large],
      ["20px", app.translate().main.medium],
      ["18px", app.translate().main.small],
      ["16px", app.translate().main.extra_small]
    ],
    note_line_spacing: [
      ["225%", app.translate().main.extra_large],
      ["200%", app.translate().main.large],
      ["175%", app.translate().main.medium],
      ["150%", app.translate().main.small],
      ["125%", app.translate().main.extra_small]
    ],
    note_auto_clean: [
      ["enabled", app.translate().main.enabled],
      ["disabled", app.translate().main.disabled]
    ],
    note_auto_select: [
      ["title", app.translate().main.title],
      ["text", app.translate().main.text],
      ["disabled", app.translate().main.disabled]
    ],
    note_delete_confirm: [
      ["enabled", app.translate().main.enabled],
      ["disabled", app.translate().main.disabled]
    ],
    trash_delete_confirm: [
      ["enabled", app.translate().main.enabled],
      ["disabled", app.translate().main.disabled]
    ],
    language: [
      ["en", "English"],
      ["fr", "Français"]
    ]
  };
}

function settings_values_default(){
  return {
    app_border: "enabled",
    app_border_radius: "enabled",
    note_title_font: "Verdana",
    note_text_font: "Verdana",
    note_title_size: "20px",
    note_text_size: "20px",
    note_line_spacing: "175%",
    note_auto_clean: "enabled",
    note_auto_select: "text",
    note_delete_confirm: "disabled",
    trash_delete_confirm: "enabled",
    language: app_language_navigator()
  };
}

function settings_values_verify(name, value){
  if (value.includes("Custom&")) {
    return true;
  }
  else {
    let values_array = [];
    for (let i = 0; i < settings_values()[name].length; i++) {
      values_array.push(settings_values()[name][i][0]);
    }
    return values_array.includes(value);
  }
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

function setting_reset(){
  let request = app_db_open();
  request.onsuccess = function(){
    let transaction = request.result.transaction("settings", "readwrite");
    let transaction_get = transaction.objectStore("settings").get("language");
    transaction_get.onsuccess = function(){
      if (transaction_get.result != null) {
        let language = transaction_get.result["language"];
        transaction.objectStore("settings").clear();
        settings_save("language", language);
        app.settings = settings_values_default();
        app.settings.language = language;
      }
      else {
        transaction.objectStore("settings").clear();
        app.settings = settings_values_default();
      }
      settings();
    };
  };
}

function settings(){
  document.getElementById("menu").replaceChildren();
  if (!document.getElementById("settings")) {document.getElementsByTagName("footer")[0].remove()}
  document.getElementsByTagName("main")[0].id = "settings";
  document.getElementsByTagName("main")[0].classList.add("half_full");

  document.getElementById("settings").replaceChildren(
    settings_section("app_style"),
    settings_section("note_style"),
    settings_section("note_management"),
    settings_section("trash_management"),
    settings_section("links"),
    settings_section("other"),
    settings_section("cache_offline")
  );

  document.getElementById("menu").append(app_icon("folder_back", 64, "rgb(65, 65, 65)", settings_back));
  document.getElementById("menu").append(app_title_sub(app.translate().main.settings));
  app_url_update("settings");
}

function settings_back(){
  document.getElementById("menu").remove();
  document.getElementById("settings").remove();
  app_header();
  app_main();
  app_footer();
  app_url_update();
}

function settings_section(name){
  let section = document.createElement("div");
  section.className = "settings_section hidden " + name;

  let section_header = document.createElement("div");
  section_header.className = "settings_section_header";
  section_header.onclick = function(){settings_section_visibility(name, section)};

  let section_title = document.createElement("p");
  section_title.className = "settings_section_title";
  section_title.textContent = app.translate().settings_section[name];
  section_header.append(section_title);

  section_header.append(app_icon("select", 32, "rgb(100, 100, 100)"));

  section.append(section_header);

  let section_main = document.createElement("div");
  section_main.className = "settings_section_main";

  section.append(section_main);

  return section;
}

function settings_section_visibility(name, section){
  if (section.classList.contains("hidden")) {
    section.classList.remove("hidden");
    section.classList.add("visible");
    window["settings_section_" + name](section.getElementsByClassName("settings_section_main")[0])
  }
  else {
    section.classList.remove("visible");
    section.classList.add("hidden");
    section.getElementsByClassName("settings_section_main")[0].replaceChildren();
  }
}

function settings_section_app_style(section_main){
  section_main.append(settings_section_app_style_border());
  section_main.append(settings_section_app_style_border_radius());
}

function settings_section_app_style_border(){
  let section = settings_section_element_select("app_border", "", function(name, option){
    app.settings[name] = option.dataset.value;
    if (app.settings[name] == "enabled") {
      document.body.classList.remove("no_border");
    }
    else {
      document.body.classList.add("no_border");
    }
    settings_save(name, app.settings[name]);
    document.getElementById("menu").children[0].children[0].click();
  });
  section.append(settings_text(app.translate().settings_option.app_border, settings_select_section_value("app_border")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_app_style_border_radius(){
  let section = settings_section_element_select("app_border_radius", "", function(name, option){
    app.settings[name] = option.dataset.value;
    if (app.settings[name] == "enabled") {
      document.body.classList.remove("no_border_radius");
    }
    else {
      document.body.classList.add("no_border_radius");
    }
    settings_save(name, app.settings[name]);
    document.getElementById("menu").children[0].children[0].click();
  });
  section.append(settings_text(app.translate().settings_option.app_border_radius, settings_select_section_value("app_border_radius")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_style(section_main){
  section_main.append(settings_section_note_style_title_font());
  section_main.append(settings_section_note_style_text_font());
  section_main.append(settings_section_note_style_title_size());
  section_main.append(settings_section_note_style_text_size());
  section_main.append(settings_section_note_style_line_spacing());
}

function settings_section_note_style_title_font(){
  let section = settings_section_element_select("note_title_font", function(name, option, option_list, i){
    option.style.fontFamily = option_list[i][0];
  });
  section.append(settings_text(app.translate().settings_option.note_title_font, settings_select_section_value("note_title_font")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_style_text_font(){
  let section = settings_section_element_select("note_text_font", function(name, option, option_list, i){
    option.style.fontFamily = option_list[i][0];
  });
  section.append(settings_text(app.translate().settings_option.note_text_font, settings_select_section_value("note_text_font")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_style_title_size(){
  let section = settings_section_element_select("note_title_size", function(name, option, option_list, i){
    option.style.fontFamily = app.settings.note_title_font;
    option.style.fontSize = option_list[i][0];
  });
  section.append(settings_text(app.translate().settings_option.note_title_size, settings_select_section_value("note_title_size")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_style_text_size(){
  let section = settings_section_element_select("note_text_size", function(name, option, option_list, i){
    option.style.fontFamily = app.settings.note_text_font;
    option.style.fontSize = option_list[i][0];
  });
  section.append(settings_text(app.translate().settings_option.note_text_size, settings_select_section_value("note_text_size")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_style_line_spacing(){
  let section = settings_section_element_select("note_line_spacing", "", "", function(){
    let custom_value = prompt("0 - 500", document.getElementsByClassName("settings_option selected")[0].dataset.value.replace("%", ""));
    if (custom_value != null && custom_value >= 0 && custom_value <= 500) {
      app.settings.note_line_spacing = "Custom&" + custom_value + "%";
      settings_save("note_line_spacing", app.settings.note_line_spacing);
      document.getElementById("menu").children[0].children[0].click();
    }
  });
  if (app.settings.note_line_spacing.includes("Custom&")) {
    section.append(settings_text(app.translate().settings_option.note_line_spacing, app.translate().main.custom + " : " + app.settings.note_line_spacing.replace("Custom&", "")));
  }
  else {
    section.append(settings_text(app.translate().settings_option.note_line_spacing, settings_select_section_value("note_line_spacing")));
  }
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_management(section_main){
  section_main.append(settings_section_note_management_import());
  section_main.append(settings_section_note_management_import_all());
  section_main.append(settings_section_note_management_export_all());
  section_main.append(settings_section_note_management_auto_clean());
  section_main.append(settings_section_note_management_auto_select());
  section_main.append(settings_section_note_management_delete_confirm());
  section_main.append(settings_section_note_management_delete_all());
}

function settings_section_note_management_import(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){
    let input = document.createElement("input");
    input.type = "file";

    input.onchange = function(){
      let file = input.files[0];
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function(){
        switch (true) {
          case !file.name.includes(".txt"):
            alert(app.translate().error.file_txt); break;
          default:
            app.note.unshift({
              id: 0,
              title: file.name.replace(".txt", ""),
              text: reader.result
            });
            note_refresh_id();
            note_save();
            document.getElementById("menu").children[0].children[0].click();
        }
      };
    };
    input.click();
  };

  section.append(settings_text(app.translate().settings.note_import, app.translate().settings.note_import_description));
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_management_import_all(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){
    let input = document.createElement("input");
    input.type = "file";

    input.onchange = function(){
      let file = input.files[0];
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function(){
        switch (true) {
          case !file.name.includes(".json"):
            alert(app.translate().error.file_json); break;
          default:
            let note_list_import = JSON.parse(reader.result).reverse();
            for (let i = 0; i < note_list_import.length; i++) {
              app.note.unshift({
                id: 0,
                title: note_list_import[i].title,
                text: note_list_import[i].text,
                blur: note_list_import[i].blur
              });
              note_refresh_id();
            }
            note_save();
            document.getElementById("menu").children[0].children[0].click();
        }
      };
    };
    input.click();
  };

  section.append(settings_text(app.translate().settings.note_import_all, app.translate().settings.note_import_all_description));
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_management_export_all(){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){
    let note_list_export = encodeURIComponent(JSON.stringify(app.note));
    let link = document.createElement("a");
    link.href = "data:application/octet-stream," + note_list_export;
    link.download = app.translate().main.note.toLowerCase() + ".json";
    link.click();
  };

  section.append(settings_text(app.translate().settings.note_export_all, app.translate().settings.note_export_all_description));
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_management_auto_clean(){
  let section = settings_section_element_select("note_auto_clean");
  section.append(settings_text(app.translate().settings_option.note_auto_clean, settings_select_section_value("note_auto_clean")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_management_auto_select(){
  let section = settings_section_element_select("note_auto_select");
  section.append(settings_text(app.translate().settings_option.note_auto_select, settings_select_section_value("note_auto_select")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_note_management_delete_confirm(){
  let section = settings_section_element_select("note_delete_confirm");
  section.append(settings_text(app.translate().settings_option.note_delete_confirm, settings_select_section_value("note_delete_confirm")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
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
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_trash_management(section_main){
  section_main.append(settings_section_trash_management_delete_confirm());
}

function settings_section_trash_management_delete_confirm(){
  let section = settings_section_element_select("trash_delete_confirm");
  section.append(settings_text(app.translate().settings_option.note_delete_confirm, settings_select_section_value("trash_delete_confirm")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_links(section_main){
  section_main.append(settings_section_links_contact());
  section_main.append(settings_section_links_source_code());
}

function settings_section_links_contact(){
  let section = document.createElement("a");
  section.className = "settings_section_element";
  section.href = "mailto:contact@darkness-note.org";

  section.append(settings_text(app.translate().main.contact, "contact@darkness-note.org"));
  section.append(app_icon("link", 28, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_links_source_code(){
  let section = document.createElement("a");
  section.className = "settings_section_element";
  section.href = "https://github.com/Ysah-GitHub/darkness_note";
  section.target = "_blank";

  section.append(settings_text(app.translate().main.source_code, "https://github.com/Ysah-GitHub/darkness_note"));
  section.append(app_icon("link", 28, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_other(section_main){
  section_main.append(settings_section_other_language());
  section_main.append(settings_section_other_reset());
  section_main.append(settings_section_other_app_version());
}

function settings_section_other_language(){
  let section = settings_section_element_select("language", "", function(name, option){
    if (navigator.onLine) {
      app.settings["language"] = option.dataset.value;
      settings_save("language", app.settings.language);
      app_language_new_file(option.dataset.value, function(){
        document.getElementById("menu").children[0].children[0].click();
      });
    }
    else {
      document.getElementById("menu").children[0].children[0].click();
      alert(app.translate().error.navigator_offline);
    }
  });
  section.append(settings_text(app.translate().settings_option.language, settings_select_section_value("language")));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
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
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_other_app_version(){
  let section = document.createElement("div");
  section.className = "settings_section_element borderTop";
  section.append(settings_text("", "Darkness Note - " + app.version));
  section.getElementsByClassName("settings_section_element_description")[0].classList.add("marginBottom");
  return section;
}

function settings_section_cache_offline(section_main){
  section_main.append(settings_section_cache_offline_delete());
}

function settings_section_cache_offline_delete(){
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
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function settings_section_element_select(name, func, func_onclick, custom){
  let section = document.createElement("div");
  section.className = "settings_section_element " + name;
  section.onclick = function(){
    settings_select(name, func, func_onclick, custom);
    app_url_update("settings_select");
  };
  return section;
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

function settings_select(name, func, func_onclick, custom){
  let section_name = document.getElementsByClassName(name)[0].parentElement.parentElement.classList.item(1);
  let option_list = settings_values()[name];

  document.getElementById("menu").replaceChildren(
    app_icon("folder_back", 64, "rgb(65, 65, 65)", function(){settings_select_back(section_name)}),
    app_title_sub(app.translate().settings_option[name])
  );
  document.getElementById("settings").replaceChildren();

  for (let i = 0; i < option_list.length; i++) {
    let option = document.createElement("p");
    option.className = "settings_option";
    option.dataset.value = option_list[i][0];
    option.textContent = option_list[i][1];
    if (option_list[i][0] == app.settings[name]) {option.classList.add("selected")}
    if (typeof func === "function") {func(name, option, option_list, i)}
    option.onclick = function(){
      if (!option.classList.contains("selected")) {
        if (typeof func_onclick === "function") {
          func_onclick(name, option);
        }
        else {
          app.settings[name] = option.dataset.value;
          settings_save(name, app.settings[name]);
          document.getElementById("menu").children[0].children[0].click();
        }
      }
    };
    document.getElementById("settings").append(option);
  }

  if (typeof custom === "function") {document.getElementById("settings").append(settings_select_custom(name, custom))}
}

function settings_select_back(section_name){
  settings();
  document.getElementsByClassName(section_name)[0].children[0].click();
  app_url_update("settings");
}

function settings_select_section_value(name){
  for (let i = 0; i < settings_values()[name].length; i++) {
    if (settings_values()[name][i][0] == app.settings[name]) {
      return settings_values()[name][i][1];
    }
  }
}

function settings_select_custom(name, func_onclick){
  let custom = document.createElement("p");
  custom.className = "settings_option custom";
  custom.textContent = app.translate().main.custom;
  if (app.settings[name].includes("Custom&")) {
    custom.classList.add("selected");
    custom.dataset.value = app.settings[name].replace("Custom&", "");
  }
  custom.onclick = func_onclick;
  return custom;
}
