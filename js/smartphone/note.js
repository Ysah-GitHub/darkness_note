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
  for (let i = 0; i < app.note.length; i++) {
    app.note[i].id = i;
    document.getElementById("note_list").children[i].id = i;
  }
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
        tmp_note_interface.getElementsByClassName("icon settings")[0].click();
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
  let tmp_note = app.note[note_interface.id];

  document.getElementById(tmp_note.id).remove();
  app.note.splice(tmp_note.id, 1);

  app.note.unshift(tmp_note);
  document.getElementById("note_list").prepend(note_interface);

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
    let tmp_note = app.note[note_interface.id];

    document.getElementById(tmp_note.id).remove();
    app.note.splice(tmp_note.id, 1);

    app.note.splice(tmp_position, 0, tmp_note);
    document.getElementById("note_list").children[tmp_position - 1].after(note_interface);

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
    let tmp_note = app.note[note_interface.id];

    document.getElementById(tmp_note.id).remove();
    app.note.splice(tmp_note.id, 1);

    app.note.splice(tmp_position, 0, tmp_note);
    document.getElementById("note_list").children[tmp_position - 1].after(note_interface);

    note_refresh_id_with_interface();
    note_save();
  }
  else {
    note_move_last(note_interface);
  }
}

function note_interface_list(){
  note_interface_trash();

  let tmp_note_list = document.createElement("ol");
  tmp_note_list.id = "note_list";

  for (let i = 0; i < app.note.length; i++) {
    tmp_note_list.append(note_interface_new(app.note[i]));
  }

  document.getElementById("trash").after(tmp_note_list);

  note_interface_menu();
}

function note_interface_trash(){
  let tmp_trash = document.createElement("div");
  tmp_trash.id = "trash";

  let tmp_settings_icon = document.createElement("span");
  tmp_settings_icon.className = "icon main_settings dark_background";
  tmp_settings_icon.onclick = settings;
  tmp_settings_icon.append(icon_settings(64, 64));
  tmp_trash.append(tmp_settings_icon);

  tmp_header = document.createElement("div");
  tmp_header.id = "trash_header";
  tmp_header.onclick = trash_interface_list_create;

  let tmp_trash_number = document.createElement("input");
  tmp_trash_number.id = "trash_number";
  tmp_trash_number.type = "text";
  tmp_trash_number.setAttribute("readonly", "");
  tmp_trash_number.addEventListener("DOMNodeInsertedIntoDocument", trash_refresh_number);
  tmp_header.append(tmp_trash_number);

  let tmp_trash_icon = document.createElement("span");
  tmp_trash_icon.id = "trash_icon";
  tmp_trash_icon.className = "icon trash";
  tmp_trash_icon.append(icon_trash(64, 64));
  tmp_header.append(tmp_trash_icon);

  tmp_trash.append(tmp_header);
  document.body.prepend(tmp_trash);
}

function note_interface_menu(){
  let tmp_menu = document.createElement("div");
  tmp_menu.id = "menu";

  let tmp_add_icon = document.createElement("span");
  tmp_add_icon.className = "icon add";
  tmp_add_icon.onclick = function(){
    note_add();
    document.getElementById("note_list").prepend(note_interface_new(app.note[0]));
    note_refresh_id_with_interface();
  };
  tmp_add_icon.append(icon_add(96, 96));
  tmp_menu.append(tmp_add_icon);
  document.getElementById("note_list").after(tmp_menu);
}

function note_interface_new(note){
  let tmp_note = document.createElement("li");
  tmp_note.id = note.id;
  tmp_note.className = "note";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_settings = document.createElement("span");
  tmp_icon_settings.className = "icon settings dark_background";
  tmp_icon_settings.onclick = function(){
    settings_note(this.parentElement.parentElement);
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

function note_fullscreen(note){
  document.getElementById("trash").style.display = "none";
  document.getElementById("note_list").style.display = "none";
  document.getElementById("menu").style.display = "none";

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
    tmp_note.getElementsByClassName("icon settings")[0].click();
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
  document.getElementById("trash").style.display = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById("menu").style.display = "none";

  let tmp_note_fullscreen = document.createElement("div");
  tmp_note_fullscreen.id = "note_fullscreen";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_back = document.createElement("span");
  tmp_icon_back.className = "icon dark_background";
  tmp_icon_back.onclick = note_fullscreen_readonly_back;
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

function note_fullscreen_back(){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("trash").removeAttribute("style");
  document.getElementById("note_list").removeAttribute("style");
  document.getElementById("menu").removeAttribute("style");
}

function note_fullscreen_readonly_back(){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("trash").removeAttribute("style");
  document.getElementById("settings").removeAttribute("style");
}
