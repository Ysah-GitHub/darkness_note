function note_load(){
  let request = app_db_open();

  request.onsuccess = function(){
    let transaction = request.result.transaction("note", "readonly");
    transaction.objectStore("note").count().onsuccess = function(){
      if (this.result > 0) {
        note_load_db(transaction, this.result, 0);
      }
      else {
        app.note.push(note_initial());
        app_load(app.load_stage + 1);
      }
    };
  };
}

function note_save(){
  let request = app_db_open();

  request.onsuccess = function(){
    let transaction = request.result.transaction("note", "readwrite");
    transaction.objectStore("note").count().onsuccess = function(){
      let note_length = this.result;
      if (note_length > 0) {
        note_db_replace_delete(transaction, note_length, 0);
      }
      else {
        note_db_replace_add(transaction);
      }
    };
  };
}

function note_load_db(transaction, note_length, load_number){
  let transaction_get = transaction.objectStore("note").get(load_number);
  transaction_get.onsuccess = function(){
    app.note.push({
      id: transaction_get.result.id,
      title: transaction_get.result.title,
      text: transaction_get.result.text,
      settings: {...transaction_get.result.settings}
    });
    load_number = load_number + 1;
    if (load_number < note_length) {
      note_load_db(transaction, note_length, load_number);
    }
    else {
      if (app.settings.note_auto_clean == "enabled") {
        note_auto_clean();
        note_refresh_id();
        note_save();
      }
      app_load(app.load_stage + 1);
    }
  };
}

function note_db_replace_add(transaction){
  for (let i = 0; i < app.note.length; i++) {
    transaction.objectStore("note").add(app.note[i]);
  }
}

function note_db_replace_delete(transaction, note_length, delete_number){
  let transaction_delete = transaction.objectStore("note").delete(delete_number);
  delete_number = delete_number + 1;
  transaction_delete.onsuccess = function(){
    if (delete_number < note_length) {
      note_db_replace_delete(transaction, note_length, delete_number);
    }
    else {
      note_db_replace_add(transaction);
    }
  };
}

function note_initial(){
  return {
    id: 0,
    title: null,
    text: null,
    settings: {}
  };
}

function note_add(){
  app.note.unshift(note_initial());
  document.getElementById("note_list").prepend(note_list_add(app.note[0]));
  document.getElementById("note_list").scrollTop = 0;
  note_refresh_id_with_interface();

  if (app.settings.note_auto_select == "text") {
    document.getElementById("0").getElementsByClassName("note_text")[0].focus();
  }
  else if (app.settings.note_auto_select == "title") {
    document.getElementById("0").getElementsByClassName("note_title")[0].focus();
  }
}

function note_remove(note){
  app.note.splice(note.id, 1);
  document.getElementById(note.id).remove();

  if (note.title != null || note.text != null) {
    note.id = 0;
    app.trash.unshift(note);
    trash_refresh_id();
    document.getElementById("icon_trash").replaceWith(trash_number_icon())
  }

  note_refresh_id_with_interface();
  note_save();
  trash_save();
}

function note_remove_all(){
  app.note.reverse();

  for (let i = 0; i < app.note.length; i++) {
    if (app.note[i].title != null || app.note[i].text != null) {
      app.trash.unshift(app.note[i]);
    }
  }

  app.note = [];
  note_save();
  trash_refresh_id();
  trash_save();
}

function note_auto_clean(){
  for (let i = 0; i < app.note.length; i++) {
    if (
      (app.note[i].title == null || app.note[i].title == "") &&
      (app.note[i].text == null || app.note[i].text == "")
    ) {
      app.note.splice(i, 1);
      i = i - 1;
    }
  }
}

function note_refresh_id(){
  for (let i = 0; i < app.note.length; i++) {
    app.note[i].id = i;
  }
}

function note_refresh_id_with_interface(){
  for (let i = 0; i < app.note.length; i++) {
    app.note[i].id = i;
    document.getElementById("note_list").children[i].id = i;
  }
}

function note_move_first(note_interface){
  let note = app.note[note_interface.id];

  document.getElementById(note.id).remove();
  app.note.splice(note.id, 1);

  app.note.unshift(note);
  document.getElementById("note_list").prepend(note_interface);
  note_interface.scrollIntoView(false);

  note_refresh_id_with_interface();
  note_save();
}

function note_move_last(note_interface){
  let note = app.note[note_interface.id];

  document.getElementById(note.id).remove();
  app.note.splice(note.id, 1);

  app.note.push(note);
  document.getElementById("note_list").append(note_interface);
  note_interface.scrollIntoView(true);

  note_refresh_id_with_interface();
  note_save();
}

function note_move_prev(note_interface){
  let position = Number(note_interface.id) - 1;

  if (position >= 1) {
    let note = app.note[note_interface.id];

    document.getElementById(note.id).remove();
    app.note.splice(note.id, 1);

    app.note.splice(position, 0, note);
    document.getElementById("note_list").children[position - 1].after(note_interface);
    note_interface.scrollIntoView({block: "center"});

    note_refresh_id_with_interface();
    note_save();
  }
  else {
    note_move_first(note_interface);
  }
}

function note_move_next(note_interface){
  let position = Number(note_interface.id) + 1;

  if (position < app.note.length) {
    let note = app.note[note_interface.id];

    document.getElementById(note.id).remove();
    app.note.splice(note.id, 1);

    app.note.splice(position, 0, note);
    document.getElementById("note_list").children[position - 1].after(note_interface);
    note_interface.scrollIntoView({block: "center"});

    note_refresh_id_with_interface();
    note_save();
  }
  else {
    note_move_last(note_interface);
  }
}

function note_list(){
  document.getElementsByTagName("main")[0].id = "note_list";

  for (let i = 0; i < app.note.length; i++) {
    document.getElementById("note_list").append(note_list_add(app.note[i]));
  }
}

function note_list_add(app_note){
  let note = document.createElement("div");
  note.id = app_note.id;
  note.className = "note";

  let header = document.createElement("div");
  header.className = "note_header";

  header.append(app_icon("settings_note", 64, "rgb(65, 65, 65)", function(){note_settings(this.parentElement.parentElement)}));
  header.append(note_list_add_title(app_note));
  header.append(app_icon("close", 64, "rgb(65, 65, 65)", function(){
    if (app.settings.note_delete_confirm == "enabled") {
      if (confirm(app.translate().confirm.note_delete)) {
        note_remove(app.note[this.parentElement.parentElement.id]);
      }
    }
    else {
      note_remove(app.note[this.parentElement.parentElement.id]);
    }
  }));

  note.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  main.append(note_list_add_text(app_note));
  main.append(app_icon("fullscreen", 64, "rgb(60, 60, 60)", function(){note_fullscreen(app.note[this.parentElement.parentElement.id])}, "", "fullscreen"));

  note.append(main);
  return note;
}

function note_list_add_title(app_note){
  let title = document.createElement("input");
  title.className = "note_title";
  title.type = "text";
  title.setAttribute("maxlength", "200");
  title.style.fontFamily = app.settings.note_title_font;
  title.style.fontSize = app.settings.note_title_size;
  title.placeholder = app.translate().main.title;
  title.value = app_note.title;
  title.oninput = function(){
    app.note[this.parentElement.parentElement.id].title = this.value;
    note_save();
  };
  return title;
}

function note_list_add_text(app_note){
  let text = document.createElement("textarea");
  text.className = "note_text";
  text.style.fontFamily = app.settings.note_text_font;
  text.style.fontSize = app.settings.note_text_size;
  text.placeholder = app.translate().main.note + "...";
  text.value = app_note.text;
  text.oninput = function(){
    app.note[this.parentElement.parentElement.id].text = this.value;
    note_save();
  };

  if (app.settings.note_line_spacing.includes("Custom&")) {
    text.style.lineHeight = app.settings.note_line_spacing.replace("Custom&", "");
  }
  else {
    text.style.lineHeight = app.settings.note_line_spacing;
  }

  if (app_note.settings.blur == "enabled") {
    text.classList.add("blur")
    text.onfocus = function(){text.classList.remove("blur")};
    text.onblur = function(){text.classList.add("blur")};
  }

  return text;
}

function note_fullscreen(app_note){
  document.getElementsByTagName("header")[0].remove();
  document.getElementsByTagName("main")[0].remove();
  document.getElementsByTagName("footer")[0].remove();

  let note_full = document.createElement("div");
  note_full.id = app_note.id;
  note_full.className = "note_fullscreen";

  let header = document.createElement("div");
  header.className = "note_header";

  header.append(app_icon("folder_back", 64, "rgb(65, 65, 65)", note_fullscreen_back));
  header.append(note_list_add_title(app_note));

  note_full.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  main.append(note_list_add_text(app_note));

  note_full.append(main);

  document.body.prepend(note_full);
  app_url_update("note_fullscreen");
}

function note_fullscreen_back(){
  let note_id = document.getElementsByClassName("note_fullscreen")[0].id;
  document.getElementsByClassName("note_fullscreen")[0].remove();
  app_header();
  app_main();
  app_footer();
  app_url_update();
  document.getElementById(note_id).scrollIntoView({block: "center"});
}

function note_settings_values(){
  return {
    blur: [
      ["enabled", app.translate().main.enabled],
      ["disabled", app.translate().main.disabled]
    ]
  };
}

function note_settings_values_default(){
  return {
    blur: ["disabled", app.translate().main.disabled]
  };
}

function note_settings(note_interface){
  note_interface.classList.add("settings");
  note_interface.getElementsByClassName("note_header")[0].getElementsByClassName("icon")[0].replaceWith(
    app_icon("folder_back", 64, "rgb(65, 65, 65)", function(){note_settings_back(note_interface)})
  );
  note_interface.getElementsByClassName("note_main")[0].replaceChildren(
    note_settings_header(note_interface),
    note_settings_more(note_interface)
  );
}

function note_settings_back(note_interface){
  note_interface.classList.remove("settings");
  note_interface.getElementsByClassName("note_header")[0].getElementsByClassName("icon")[0].replaceWith(
    app_icon("settings_note", 64, "rgb(65, 65, 65)", function(){note_settings(note_interface)})
  );
  note_interface.getElementsByClassName("note_main")[0].replaceChildren(
    note_list_add_text(app.note[note_interface.id]),
    app_icon("fullscreen", 64, "rgb(60, 60, 60)", function(){note_fullscreen(app.note[note_interface.id])}, "", "fullscreen")
  );
}

function note_settings_header(note_interface){
  let settings_header = document.createElement("div");
  settings_header.className = "note_settings_header";

  settings_header.append(app_icon("arrow_move_double", 64, "rgb(65, 65, 65)", function(){note_move_first(note_interface)}));
  settings_header.append(app_icon("arrow_move", 64, "rgb(65, 65, 65)", function(){note_move_prev(note_interface)}));
  settings_header.append(app_icon("arrow_move", 64, "rgb(65, 65, 65)", function(){note_move_next(note_interface)}));
  settings_header.append(app_icon("arrow_move_double", 64, "rgb(65, 65, 65)", function(){note_move_last(note_interface)}));

  return settings_header;
}

function note_settings_more(note_interface){
  let more_settings = document.createElement("div");
  more_settings.className = "note_settings_more";
  more_settings.onclick = function(){
    let settings_container = document.createElement("div");
    settings_container.className = "note_settings";

    settings_container.append(
      note_settings_section("style", note_interface),
      note_settings_section("management", note_interface)
    );

    note_interface.getElementsByClassName("note_main")[0].replaceChildren(settings_container);
    note_interface.getElementsByClassName("note_header")[0].children[0].onclick = function(){note_settings_more_back(note_interface)};
  };

  let more_settings_text = document.createElement("p");
  more_settings_text.textContent = app.translate().settings.more_settings;
  more_settings.append(more_settings_text);

  more_settings.append(app_icon("select", 32, "rgb(65, 65, 65)"));

  return more_settings;
}

function note_settings_more_back(note_interface){
  note_interface.getElementsByClassName("note_main")[0].replaceChildren(note_settings_header(note_interface), note_settings_more(note_interface));
  note_interface.getElementsByClassName("note_header")[0].children[0].onclick = function(){note_settings_back(note_interface)};
}

function note_settings_section(name, note_interface){
  let section = document.createElement("div");
  section.className = "settings_section hidden " + name;

  let section_header = document.createElement("div");
  section_header.className = "settings_section_header";
  section_header.onclick = function(){note_settings_section_visibility(name, section, note_interface)};

  let section_title = document.createElement("p");
  section_title.className = "settings_section_title";
  section_title.textContent = app.translate().settings_note_section[name];
  section_header.append(section_title);

  section_header.append(app_icon("select", 32, "rgb(100, 100, 100)"));

  section.append(section_header);

  let section_main = document.createElement("div");
  section_main.className = "settings_section_main";

  section.append(section_main);

  return section;
}

function note_settings_section_visibility(name, section, note_interface){
  if (section.classList.contains("hidden")) {
    section.classList.remove("hidden");
    section.classList.add("visible");
    window["note_settings_section_" + name](section.getElementsByClassName("settings_section_main")[0], note_interface)
  }
  else {
    section.classList.remove("visible");
    section.classList.add("hidden");
    section.getElementsByClassName("settings_section_main")[0].replaceChildren();
  }
}

function note_settings_section_style(section_main, note_interface){
  section_main.append(note_settings_section_style_blur(note_interface));
}

function note_settings_section_style_blur(note_interface){
  let section = note_settings_section_element_select("blur", note_interface);
  section.append(settings_text(app.translate().main.blur, note_settings_select_section_value("blur", note_interface.id)));
  section.append(app_icon("select_double", 48, "rgb(200, 200, 200)"));
  return section;
}

function note_settings_section_management(section_main, note_interface){
  section_main.append(note_settings_section_management_duplicate(note_interface));
  section_main.append(note_settings_section_management_export(note_interface));
}

function note_settings_section_management_duplicate(note_interface){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){
    note_clone = JSON.parse(JSON.stringify(app.note[note_interface.id]))
    app.note.splice(note_clone.id, 0, note_clone);
    document.getElementById("note_list").children[note_clone.id].after(note_list_add(note_clone));
    note_refresh_id_with_interface();
    note_save();
  };

  section.append(settings_text(app.translate().settings.note_duplicate, app.translate().settings.note_duplicate_description));
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function note_settings_section_management_export(note_interface){
  let section = document.createElement("div");
  section.className = "settings_section_element";
  section.onclick = function(){
    let note = app.note[note_interface.id];
    let link = document.createElement("a");
    if (note.text != null) {
      link.href = "data:application/octet-stream," + note.text.replaceAll(" ", "%20");
    }
    else {
      link.href = "data:application/octet-stream,";
    }
    if (note.title != null) {
      link.download = note.title + ".txt";
    }
    else {
      link.download = app.translate().main.note.toLowerCase() + ".txt";
    }
    link.click();
  };

  section.append(settings_text(app.translate().settings.note_export, app.translate().settings.note_export_description));
  section.append(app_icon("arrow_move", 48, "rgb(200, 200, 200)"));
  return section;
}

function note_settings_section_element_select(name, note_interface){
  let section = document.createElement("div");
  section.className = "settings_section_element " + name;
  section.onclick = function(){note_settings_select(name, note_interface)};
  return section;
}

function note_settings_select(name, note_interface){
  let section_name = note_interface.getElementsByClassName(name)[0].parentElement.parentElement.classList.item(1);
  let option_list = note_settings_values()[name];

  note_interface.getElementsByClassName("note_header")[0].children[0].onclick = function(){
    note_settings_select_back(section_name, note_interface);
  };
  note_interface.getElementsByClassName("note_settings")[0].replaceChildren();

  for (let i = 0; i < option_list.length; i++) {
    let option = document.createElement("p");
    option.className = "settings_option";
    option.dataset.value = option_list[i][0];
    option.textContent = option_list[i][1];
    if (app.note[note_interface.id].settings[name]) {
      if (option_list[i][0] == app.note[note_interface.id].settings[name]) {option.classList.add("selected")}
    }
    else {
      if (option_list[i][0] == note_settings_values_default()[name][0]) {option.classList.add("selected")}
    }
    option.onclick = function(){
      if (!option.classList.contains("selected")) {
        app.note[note_interface.id].settings[name] = option.dataset.value;
        note_save();
        note_interface.getElementsByClassName("note_header")[0].children[0].click();
      }
    };
    note_interface.getElementsByClassName("note_settings")[0].append(option);
  }
}

function note_settings_select_back(section_name, note_interface){
  note_interface.getElementsByClassName("note_header")[0].children[0].onclick = function(){
    note_settings(note_interface);
  };
  note_interface.getElementsByClassName("note_settings")[0].remove();
  note_interface.getElementsByClassName("note_main")[0].append(note_settings_more(note_interface));
  note_interface.getElementsByClassName("note_settings_more")[0].click();
  note_interface.getElementsByClassName(section_name)[0].children[0].click();
}

function note_settings_select_section_value(name, note_id){
  for (let i = 0; i < note_settings_values()[name].length; i++) {
    if (note_settings_values()[name][i][0] == app.note[note_id].settings[name]) {
      return note_settings_values()[name][i][1];
    }
  }
  return note_settings_values_default()[name][1];
}
