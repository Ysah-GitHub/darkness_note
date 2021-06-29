function note_save(){
  localStorage.setItem("note", JSON.stringify(app.note));
}

function note_load(){
  if (localStorage.getItem("note")) {
    app.note = JSON.parse(localStorage.getItem("note"));
  }
  else {
    app.note = [];
  }
}

function note_add(){
  app.note.unshift({
    id: 0,
    title: null,
    text: null
  });
}

function note_remove(note){
  app.note.splice(note.id, 1);
  document.getElementById(note.id).remove();

  if (note.title != null || note.text != null) {
    note.id = app.trash.length;
    app.trash.push(note);
    trash_refresh_number();
  }

  note_refresh_id_with_interface();
  note_save();
  trash_save();
}

function note_remove_all(){
  for (let i = 0; i < app.note.length; i++) {
    document.getElementById(i).remove();
    if (app.note[i].title != null || app.note[i].text != null) {
      app.trash.push(app.note[i]);
      app.trash[app.trash.length - 1].id = app.trash.length - 1;
    }
  }

  app.note = [];
  note_save();
  trash_save();
  trash_refresh_number();
}

function note_refresh_id(){
  for (let i = 0; i < app.note.length; i++) {
    app.note[i].id = i;
  }
}

function note_refresh_id_with_interface(){
  let tmp_note_position = note_position_interface();

  for (let i = 0; i < app.note.length; i++) {
    app.note[i].id = i;
    document.getElementById("note_list").children[tmp_note_position + i].id = i;
  }
}

function note_position_interface(){
  return document.getElementById("note_list").children.length - app.note.length;
}

function note_export_json(){
  let tmp_note_list = encodeURIComponent(JSON.stringify(app.note));
  let tmp_link = document.createElement("a");
  tmp_link.href = "data:application/octet-stream," + tmp_note_list;
  tmp_link.download = translation().note.toLowerCase() + ".json";
  tmp_link.click();
}

function note_export_txt(note){
  let tmp_link = document.createElement("a");
  if (note.text != null) {
    tmp_link.href = "data:application/octet-stream," + note.text.replaceAll(" ", "%20");
  }
  else {
    tmp_link.href = "data:application/octet-stream,";
  }
  if (note.title != null) {
    tmp_link.download = note.title + ".txt";
  }
  else {
    tmp_link.download = translation().note.toLowerCase() + ".txt";
  }
  tmp_link.click();
}

function note_import_json(){
  let tmp_input = document.createElement("input");
  tmp_input.type = "file";

  tmp_input.onchange = function(){
    let tmp_file = tmp_input.files[0];
    let tmp_reader = new FileReader();

    if (tmp_file.name.includes(".json")) {
      tmp_reader.readAsText(tmp_file);
      tmp_reader.onload = function() {
        note_remove_all();
        app.note = JSON.parse(tmp_reader.result);
        note_save();
        for (let i = 0; i < app.note.length; i++) {
          document.getElementById("note_list").append(note_interface_new(app.note[i]));
        }
      };
    }
    else {
      alert(translation().error_file_json);
    }
  };
  tmp_input.click();
}

function note_import_txt(note){
  let tmp_input = document.createElement("input");
  tmp_input.type = "file";

  tmp_input.onchange = function(){
    let tmp_file = tmp_input.files[0];
    let tmp_reader = new FileReader();

    if (tmp_file.name.includes(".txt")) {
      tmp_reader.readAsText(tmp_file);
      tmp_reader.onload = function() {
        if (note.title != null || note.text != null) {
          let tmp_note = JSON.parse(JSON.stringify(note));
          tmp_note.id = app.trash.length;
          app.trash.push(tmp_note);
          trash_refresh_number();
          trash_save();
        }
        let tmp_note_interface = document.getElementById(note.id);
        note.title = tmp_file.name.replace(".txt", "");
        note.text = tmp_reader.result;
        tmp_note_interface.getElementsByClassName("note_title")[0].value = note.title;
        tmp_note_interface.getElementsByClassName("note_text")[0].value = note.text;
        tmp_note_interface.getElementsByClassName("icon settings_note")[0].click();
        note_save();
      };
    }
    else {
      alert(translation().error_file_txt);
    }
  };
  tmp_input.click();
}

function note_move_first(note_interface){
  let tmp_note_list = document.getElementById("note_list");
  let tmp_note = app.note[note_interface.id];

  document.getElementById(tmp_note.id).remove();
  app.note.splice(tmp_note.id, 1);

  app.note.unshift(tmp_note);
  tmp_note_list.children[note_position_interface()].after(note_interface);

  note_refresh_id_with_interface();
  note_save();
}

function note_move_last(note_interface){
  let tmp_note = app.note[note_interface.id];

  document.getElementById(tmp_note.id).remove();
  app.note.splice(tmp_note.id, 1);

  app.note.push(tmp_note);
  document.getElementById("note_list").append(note_interface);

  note_refresh_id_with_interface();
  note_save();
}

function note_move_prev(note_interface){
  let tmp_position = Number(note_interface.id) - 1;

  if (tmp_position >= 1) {
    let tmp_note_list = document.getElementById("note_list");
    let tmp_note = app.note[note_interface.id];

    document.getElementById(tmp_note.id).remove();
    app.note.splice(tmp_note.id, 1);

    app.note.splice(tmp_position, 0, tmp_note);
    tmp_note_list.children[note_position_interface() + tmp_position].after(note_interface);

    note_refresh_id_with_interface();
    note_save();
  }
  else {
    note_move_first(note_interface);
  }
}

function note_move_next(note_interface){
  let tmp_position = Number(note_interface.id) + 1;

  if (tmp_position < app.note.length) {
    let tmp_note_list = document.getElementById("note_list");
    let tmp_note = app.note[note_interface.id];

    document.getElementById(tmp_note.id).remove();
    app.note.splice(tmp_note.id, 1);

    app.note.splice(tmp_position, 0, tmp_note);
    tmp_note_list.children[note_position_interface() + tmp_position].after(note_interface);

    note_refresh_id_with_interface();
    note_save();
  }
  else {
    note_move_last(note_interface);
  }
}

function note_interface_list(){
  let tmp_note_list = document.createElement("ol");
  tmp_note_list.id = "note_list";

  tmp_note_list.append(note_interface_trash());
  tmp_note_list.append(note_interface_menu());

  for (let i = 0; i < app.note.length; i++) {
    tmp_note_list.append(note_interface_new(app.note[i]));
  }

  document.body.prepend(tmp_note_list);
}

function note_interface_trash(){
  let tmp_trash = document.createElement("li");
  tmp_trash.id = "trash";
  tmp_trash.className = "note";
  tmp_trash.title = translation().trash;

  let tmp_trash_number = document.createElement("input");
  tmp_trash_number.id = "trash_number";
  tmp_trash_number.type = "text";
  tmp_trash_number.setAttribute("readonly", "");
  tmp_trash_number.addEventListener("DOMNodeInsertedIntoDocument", trash_refresh_number);
  tmp_trash.append(tmp_trash_number);

  let tmp_trash_icon = document.createElement("span");
  tmp_trash_icon.id = "trash_icon";
  tmp_trash_icon.className = "icon trash";
  tmp_trash_icon.onclick = trash_interface_list_create;
  tmp_trash_icon.append(icon_trash(320, 320));
  tmp_trash.append(tmp_trash_icon);
  return tmp_trash;
}

function note_interface_menu(){
  let tmp_menu = document.createElement("li");
  tmp_menu.id = "menu";
  tmp_menu.className = "note";

  let tmp_menu_header = document.createElement("div");
  tmp_menu_header.className = "note_header";

  let tmp_settings_icon = document.createElement("span");
  tmp_settings_icon.className = "icon settings dark_background";
  tmp_settings_icon.title = translation().settings;
  tmp_settings_icon.onclick = function(){
    note_interface_menu_settings(this.parentElement.parentElement);
  };
  tmp_settings_icon.append(icon_settings(64, 64));
  tmp_menu_header.append(tmp_settings_icon);

  tmp_menu.append(tmp_menu_header);

  let tmp_menu_main = document.createElement("div");
  tmp_menu_main.className = "note_main";

  let tmp_add_icon = document.createElement("span");
  tmp_add_icon.className = "icon add";
  tmp_add_icon.title = translation().note_add;
  tmp_add_icon.onclick = function(){
    note_add();
    let tmp_note_list = document.getElementById("note_list");
    tmp_note_list.children[note_position_interface()].after(note_interface_new(app.note[0]));
    note_refresh_id_with_interface();
  };
  tmp_add_icon.append(icon_add(256, 256));
  tmp_menu_main.append(tmp_add_icon);

  tmp_menu.append(tmp_menu_main);
  return tmp_menu;
}

function note_interface_menu_settings(note_interface){
  let tmp_icon_settings = note_interface.getElementsByClassName("icon settings")[0];

  if (note_interface.className == "note settings") {
    note_interface.classList.remove("settings");
    tmp_icon_settings.children[0].replaceWith(icon_settings(64, 64));
    tmp_icon_settings.title = translation().settings;
    note_interface.getElementsByClassName("icon add")[0].style.display = "block";
    note_interface.getElementsByClassName("note_settings")[0].remove();
  }
  else {
    note_interface.classList.add("settings");
    tmp_icon_settings.children[0].replaceWith(icon_folder_back(64, 64));
    tmp_icon_settings.removeAttribute("title");
    note_interface.getElementsByClassName("icon add")[0].style.display = "none";

    let tmp_settings = document.createElement("div");
    tmp_settings.className = "note_settings scrollbar_custom";

    let tmp_settings_name = document.createElement("input");
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.type = "text";
    tmp_settings_name.setAttribute("readonly", "");
    tmp_settings_name.title = translation().note_export_json_desc;
    tmp_settings_name.value = translation().note_export_json;
    tmp_settings_name.onclick = note_export_json;
    tmp_settings.append(tmp_settings_name);

    tmp_settings_name = document.createElement("input");
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.type = "text";
    tmp_settings_name.setAttribute("readonly", "");
    tmp_settings_name.title = translation().note_import_json_desc;
    tmp_settings_name.value = translation().note_import_json;
    tmp_settings_name.onclick = note_import_json;
    tmp_settings.append(tmp_settings_name);

    tmp_settings_name = document.createElement("input");
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.type = "text";
    tmp_settings_name.setAttribute("readonly", "");
    tmp_settings_name.value = translation().commitment;
    tmp_settings_name.onclick = function(){
      note_fullscreen_readonly(translation().commitment, translation().app_commitment);
    };
    tmp_settings.append(tmp_settings_name);

    tmp_settings_name = document.createElement("a");
    tmp_settings_name.title = "simon.richez@laposte.net";
    tmp_settings_name.href = "mailto:simon.richez@laposte.net";
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.textContent = translation().contact;
    tmp_settings.append(tmp_settings_name);

    tmp_settings_name = document.createElement("a");
    tmp_settings_name.href = "https://github.com/Ysah-GitHub/darkness_note";
    tmp_settings_name.target = "_blank";
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.textContent = translation().source_code;
    tmp_settings.append(tmp_settings_name);

    tmp_settings_name = document.createElement("input");
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.type = "text";
    tmp_settings_name.setAttribute("readonly", "");
    tmp_settings_name.value = translation().donate;
    tmp_settings_name.onclick = function(){
      note_fullscreen_readonly(translation().donate, translation().app_donate);
    };
    tmp_settings.append(tmp_settings_name);

    note_interface.getElementsByClassName("note_main")[0].append(tmp_settings);
  }
}

function note_interface_new(note){
  let tmp_note = document.createElement("li");
  tmp_note.id = note.id;
  tmp_note.className = "note";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_settings = document.createElement("span");
  tmp_icon_settings.className = "icon settings_note dark_background";
  tmp_icon_settings.title = translation().note_settings;
  tmp_icon_settings.onclick = function(){
    note_interface_settings(this.parentElement.parentElement);
  };
  tmp_icon_settings.append(icon_settings_note(64, 64));
  tmp_header.append(tmp_icon_settings);

  let tmp_title = document.createElement("input");
  tmp_title.className = "note_title";
  tmp_title.type = "text";
  tmp_title.setAttribute("maxlength", "200");
  tmp_title.placeholder = translation().title;
  tmp_title.value = note.title;
  tmp_title.oninput = function(){
    app.note[this.parentElement.parentElement.id].title = this.value;
    note_save();
  };
  tmp_header.append(tmp_title);

  let tmp_icon_close = document.createElement("span");
  tmp_icon_close.className = "icon red_background";
  tmp_icon_close.title = translation().delete;
  tmp_icon_close.onclick = function(){
    note_remove(app.note[this.parentElement.parentElement.id]);
  };
  tmp_icon_close.append(icon_close(64, 64));
  tmp_header.append(tmp_icon_close);

  tmp_note.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  let tmp_text = document.createElement("textarea");
  tmp_text.className = "note_text scrollbar_custom";
  tmp_text.placeholder = translation().note + "...";
  tmp_text.value = note.text;
  tmp_text.oninput = function(){
    app.note[this.parentElement.parentElement.id].text = this.value;
    note_save();
  };
  tmp_main.append(tmp_text);

  tmp_note.append(tmp_main);
  return tmp_note;
}

function note_interface_settings(note_interface){
  let tmp_icon_settings = note_interface.getElementsByClassName("icon settings_note")[0];

  if (note_interface.className == "note settings") {
    note_interface.classList.remove("settings");
    tmp_icon_settings.children[0].replaceWith(icon_settings_note(64, 64));
    tmp_icon_settings.title = translation().note_settings;
    note_interface.getElementsByClassName("note_text")[0].style.display = "block";
    note_interface.getElementsByClassName("note_settings")[0].remove();
  }
  else {
    note_interface.classList.add("settings");
    tmp_icon_settings.children[0].replaceWith(icon_folder_back(64, 64));
    tmp_icon_settings.removeAttribute("title");
    note_interface.getElementsByClassName("note_text")[0].style.display = "none";

    let tmp_settings = document.createElement("div");
    tmp_settings.className = "note_settings";

    let tmp_settings_header = document.createElement("div");
    tmp_settings_header.className = "note_settings_header";

    let tmp_icon_fullscreen = document.createElement("span");
    tmp_icon_fullscreen.className = "icon";
    tmp_icon_fullscreen.title = translation().fullscreen;
    tmp_icon_fullscreen.onclick = function(){
      note_fullscreen(app.note[note_interface.id]);
    };
    tmp_icon_fullscreen.append(icon_fullscreen(64, 64));
    tmp_settings_header.append(tmp_icon_fullscreen);

    let tmp_icon_double_left = document.createElement("span");
    tmp_icon_double_left.className = "icon rotate_180";
    tmp_icon_double_left.title = translation().move_to_first;
    tmp_icon_double_left.onclick = function(){note_move_first(note_interface)};
    tmp_icon_double_left.append(icon_double_arrow_move(64, 64));
    tmp_settings_header.append(tmp_icon_double_left);

    let tmp_icon_left = document.createElement("span");
    tmp_icon_left.className = "icon rotate_180";
    tmp_icon_left.title = translation().move_to_left;
    tmp_icon_left.onclick = function(){note_move_prev(note_interface)};
    tmp_icon_left.append(icon_arrow_move(64, 64));
    tmp_settings_header.append(tmp_icon_left);

    let tmp_icon_right = document.createElement("span");
    tmp_icon_right.className = "icon";
    tmp_icon_right.title = translation().move_to_right;
    tmp_icon_right.onclick = function(){note_move_next(note_interface)};
    tmp_icon_right.append(icon_arrow_move(64, 64));
    tmp_settings_header.append(tmp_icon_right);

    let tmp_icon_double_right = document.createElement("span");
    tmp_icon_double_right.className = "icon";
    tmp_icon_double_right.title = translation().move_to_last;
    tmp_icon_double_right.onclick = function(){note_move_last(note_interface)};
    tmp_icon_double_right.append(icon_double_arrow_move(64, 64));
    tmp_settings_header.append(tmp_icon_double_right);

    tmp_settings.append(tmp_settings_header);

    let tmp_settings_name = document.createElement("input");
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.type = "text";
    tmp_settings_name.setAttribute("readonly", "");
    tmp_settings_name.title = translation().note_export_txt_desc;
    tmp_settings_name.value = translation().note_export_txt;
    tmp_settings_name.onclick = function(){note_export_txt(app.note[note_interface.id])};
    tmp_settings.append(tmp_settings_name);

    tmp_settings_name = document.createElement("input");
    tmp_settings_name.className = "note_settings_name";
    tmp_settings_name.type = "text";
    tmp_settings_name.setAttribute("readonly", "");
    tmp_settings_name.title = translation().note_import_txt_desc;
    tmp_settings_name.value = translation().note_import_txt;
    tmp_settings_name.onclick = function(){note_import_txt(app.note[note_interface.id])};
    tmp_settings.append(tmp_settings_name);

    note_interface.getElementsByClassName("note_main")[0].append(tmp_settings);
  }
}

function note_fullscreen(note){
  document.getElementById("note_list").style.display = "none";

  let tmp_note_fullscreen = document.createElement("div");
  tmp_note_fullscreen.id = "note_fullscreen";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_back = document.createElement("span");
  tmp_icon_back.className = "icon dark_background";
  tmp_icon_back.onclick = function(){
    let tmp_note = document.getElementById(note.id);
    tmp_note.getElementsByClassName("note_title")[0].value = note.title;
    tmp_note.getElementsByClassName("note_text")[0].value = note.text;
    note_fullscreen_back();
    tmp_note.getElementsByClassName("icon settings_note")[0].click();
  };
  tmp_icon_back.append(icon_folder_back(64, 64));
  tmp_header.append(tmp_icon_back);

  let tmp_title = document.createElement("input");
  tmp_title.className = "note_title";
  tmp_title.type = "text";
  tmp_title.setAttribute("maxlength", "200");
  tmp_title.placeholder = translation().title;
  tmp_title.value = note.title;
  tmp_title.oninput = function(){note.title = this.value; note_save()};
  tmp_header.append(tmp_title);

  tmp_note_fullscreen.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  let tmp_text = document.createElement("textarea");
  tmp_text.className = "note_text scrollbar_custom";
  tmp_text.placeholder = translation().note + "...";
  tmp_text.value = note.text;
  tmp_text.oninput = function(){note.text = this.value; note_save()};
  tmp_main.append(tmp_text);

  tmp_note_fullscreen.append(tmp_main);

  document.body.prepend(tmp_note_fullscreen);
}

function note_fullscreen_readonly(title, text){
  document.getElementById("note_list").style.display = "none";

  let tmp_note_fullscreen = document.createElement("div");
  tmp_note_fullscreen.id = "note_fullscreen";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_back = document.createElement("span");
  tmp_icon_back.className = "icon dark_background";
  tmp_icon_back.onclick = note_fullscreen_back;
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
  tmp_text.className = "note_text scrollbar_custom";
  tmp_text.value = text;
  tmp_main.append(tmp_text);

  tmp_note_fullscreen.append(tmp_main);

  document.body.prepend(tmp_note_fullscreen);
}

function note_fullscreen_back(note){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("note_list").style.display = "block";
}
