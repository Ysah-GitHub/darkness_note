function note_load(){
  let tmp_request = app_db_open();
  app.note = [];

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("note", "readonly");
    tmp_transaction.objectStore("note").count().onsuccess = function(){
      if (this.result > 0) {
        note_load_db(tmp_transaction, this.result, 0);
      }
      else {
        app.note.push({id: 0, title: null, text: null, blur: false});
        app_load(app.load_stage + 1);
      }
    };
  };
}

function note_save(){
  let tmp_request = app_db_open();

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("note", "readwrite");
    tmp_transaction.objectStore("note").count().onsuccess = function(){
      let tmp_note_length = this.result;
      if (tmp_note_length > 0) {
        note_db_replace_delete(tmp_transaction, tmp_note_length, 0);
      }
      else {
        note_db_replace_add(tmp_transaction);
      }
    };
  };
}

function note_load_db(tmp_transaction, note_length, load_number){
  let tmp_transaction_get = tmp_transaction.objectStore("note").get(load_number);
  tmp_transaction_get.onsuccess = function(){
    app.note.push({
      id: tmp_transaction_get.result.id,
      title: tmp_transaction_get.result.title,
      text: tmp_transaction_get.result.text,
      blur: tmp_transaction_get.result.blur
    });
    load_number = load_number + 1;
    if (load_number < note_length) {
      note_load_db(tmp_transaction, note_length, load_number);
    }
    else {
      if (app.settings.note_auto_clean == "enable") {
        note_auto_clean();
        note_refresh_id();
        note_save();
      }
      app_load(app.load_stage + 1);
    }
  };
}

function note_db_replace_add(tmp_transaction){
  for (let i = 0; i < app.note.length; i++) {
    tmp_transaction.objectStore("note").add({
      id: app.note[i].id,
      title: app.note[i].title,
      text: app.note[i].text,
      blur: app.note[i].blur
    });
  }
}

function note_db_replace_delete(tmp_transaction, note_length, delete_number){
  let tmp_transaction_delete = tmp_transaction.objectStore("note").delete(delete_number);
  delete_number = delete_number + 1;
  tmp_transaction_delete.onsuccess = function(){
    if (delete_number < note_length) {
      note_db_replace_delete(tmp_transaction, note_length, delete_number);
    }
    else {
      note_db_replace_add(tmp_transaction);
    }
  };
}

function note_add(){
  app.note.unshift({
    id: 0,
    title: null,
    text: null,
    blur: false
  });

  document.getElementById("note_list").prepend(note_list_add(app.note[0]));
  note_refresh_id_with_interface();
}

function note_remove(note){
  app.note.splice(note.id, 1);
  document.getElementById(note.id).remove();

  if (note.title != null || note.text != null) {
    note.id = 0;
    app.trash.unshift(note);
    trash_refresh_id();
    menu_note_trash_refresh_number();
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
  menu_note_trash_refresh_number();
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

function note_export(note){
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
    tmp_link.download = app.translate().main.note.toLowerCase() + ".txt";
  }
  tmp_link.click();
}

function note_export_all(){
  let tmp_note_list = encodeURIComponent(JSON.stringify(app.note));
  let tmp_link = document.createElement("a");
  tmp_link.href = "data:application/octet-stream," + tmp_note_list;
  tmp_link.download = app.translate().main.note.toLowerCase() + ".json";
  tmp_link.click();
}

function note_import(){
  let tmp_input = document.createElement("input");
  tmp_input.type = "file";

  tmp_input.onchange = function(){
    let tmp_file = tmp_input.files[0];
    let tmp_reader = new FileReader();
    tmp_reader.readAsText(tmp_file);

    tmp_reader.onload = function(){
      switch (true) {
        case !tmp_file.name.includes(".txt"):
          alert(app.translate().error.error_file_txt); break;
        case tmp_reader.result.length > 100000:
          alert(app.translate().error.error_character_length_100000); break;
        default:
          app.note.unshift({
            id: 0,
            title: tmp_file.name.replace(".txt", ""),
            text: tmp_reader.result
          });
          note_refresh_id();
          note_save();
          document.getElementById("menu_settings_back").children[0].click();
      }
    };
  };
  tmp_input.click();
}

function note_import_all(){
  let tmp_input = document.createElement("input");
  tmp_input.type = "file";

  tmp_input.onchange = function(){
    let tmp_file = tmp_input.files[0];
    let tmp_reader = new FileReader();
    tmp_reader.readAsText(tmp_file);

    tmp_reader.onload = function(){
      switch (true) {
        case !tmp_file.name.includes(".json"):
          alert(app.translate().error.error_file_json); break;
        case tmp_file > 1000000:
          alert(app.translate().error.error_file_size_1000000); break;
        default:
          let tmp_note_list = JSON.parse(tmp_reader.result).reverse();
          for (let i = 0; i < tmp_note_list.length; i++) {
            app.note.unshift({
              id: 0,
              title: tmp_note_list[i].title,
              text: tmp_note_list[i].text
            });
            note_refresh_id();
          }
          note_save();
          document.getElementById("menu_settings_back").children[0].click();
      }
    };
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

function note_list(){
  let tmp_note_list = document.createElement("ol");
  tmp_note_list.id = "note_list";

  for (let i = 0; i < app.note.length; i++) {
    tmp_note_list.append(note_list_add(app.note[i]));
  }

  return tmp_note_list;
}

function note_list_add(note){
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
  tmp_title.style.fontSize = app.settings.note_title_size;
  tmp_title.placeholder = app.translate().main.title;
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
  tmp_text.className = "note_text";
  if (note.blur) tmp_text.classList.add("blur");
  tmp_text.style.fontSize = app.settings.note_text_size;
  tmp_text.placeholder = app.translate().main.note + "...";
  tmp_text.value = note.text;
  tmp_text.onfocus = function(){if (note.blur) tmp_text.classList.remove("blur")};
  tmp_text.onblur = function(){if (note.blur) tmp_text.classList.add("blur")};
  tmp_text.oninput = function(){
    app.note[this.parentElement.parentElement.id].text = this.value;
    note_save();
  };
  tmp_main.append(tmp_text);

  tmp_note.append(tmp_main);
  return tmp_note;
}

function note_fullscreen(note){
  document.getElementsByTagName("header")[0].style.display = "none";
  document.getElementsByTagName("footer")[0].style.display = "none";
  document.getElementsByTagName("main")[0].classList.add("full");
  document.getElementById("note_list").style.display = "none";

  let tmp_note_fullscreen = document.createElement("div");
  tmp_note_fullscreen.id = "note_fullscreen";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_icon_back = document.createElement("span");
  tmp_icon_back.className = "icon note_fullscreen_back dark_background";
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
  tmp_title.style.fontSize = app.settings.note_title_size;
  tmp_title.placeholder = app.translate().main.title;
  tmp_title.value = note.title;
  tmp_title.oninput = function(){note.title = this.value; note_save()};
  tmp_header.append(tmp_title);

  tmp_note_fullscreen.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  let tmp_text = document.createElement("textarea");
  tmp_text.className = "note_text";
  tmp_text.style.fontSize = app.settings.note_text_size;
  tmp_text.placeholder = app.translate().main.note + "...";
  tmp_text.value = note.text;
  tmp_text.oninput = function(){note.text = this.value; note_save()};
  tmp_main.append(tmp_text);

  tmp_note_fullscreen.append(tmp_main);

  document.getElementById("note_list").after(tmp_note_fullscreen);
  app_url_update("note_fullscreen");
}

function note_fullscreen_back(){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("note_list").removeAttribute("style");
  document.getElementsByTagName("main")[0].classList.remove("full");
  document.getElementsByTagName("header")[0].removeAttribute("style");
  document.getElementsByTagName("footer")[0].removeAttribute("style");
  app_url_update();
}
