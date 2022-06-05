function note_load(){
  let request = app_db_open();
  app.note = [];

  request.onsuccess = function(){
    let transaction = request.result.transaction("note", "readonly");
    transaction.objectStore("note").count().onsuccess = function(){
      if (this.result > 0) {
        note_load_db(transaction, this.result, 0);
      }
      else {
        app.note.push({id: 0, title: null, text: null, blur: false});
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
      blur: transaction_get.result.blur
    });
    load_number = load_number + 1;
    if (load_number < note_length) {
      note_load_db(transaction, note_length, load_number);
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

function note_db_replace_add(transaction){
  for (let i = 0; i < app.note.length; i++) {
    transaction.objectStore("note").add({
      id: app.note[i].id,
      title: app.note[i].title,
      text: app.note[i].text,
      blur: app.note[i].blur
    });
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
}

function note_export_all(){
  let note_list_export = encodeURIComponent(JSON.stringify(app.note));
  let link = document.createElement("a");
  link.href = "data:application/octet-stream," + note_list_export;
  link.download = app.translate().main.note.toLowerCase() + ".json";
  link.click();
}

function note_import(){
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
        case reader.result.length > 100000:
          alert(app.translate().error.character_length_100000); break;
        default:
          app.note.unshift({
            id: 0,
            title: file.name.replace(".txt", ""),
            text: reader.result
          });
          note_refresh_id();
          note_save();
          document.getElementById("menu_settings_back").children[0].click();
      }
    };
  };
  input.click();
}

function note_import_all(){
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
        case file > 1000000:
          alert(app.translate().error.file_size_1000000); break;
        default:
          let note_list_import = JSON.parse(reader.result).reverse();
          for (let i = 0; i < note_list_import.length; i++) {
            app.note.unshift({
              id: 0,
              title: note_list_import[i].title,
              text: note_list_import[i].text
            });
            note_refresh_id();
          }
          note_save();
          document.getElementById("menu_settings_back").children[0].click();
      }
    };
  };
  input.click();
}

function note_move_first(note_interface){
  let note = app.note[note_interface.id];

  document.getElementById(note.id).remove();
  app.note.splice(note.id, 1);

  app.note.unshift(note);
  document.getElementById("note_list").prepend(note_interface);

  note_refresh_id_with_interface();
  note_save();
}

function note_move_last(note_interface){
  let note = app.note[note_interface.id];

  document.getElementById(note.id).remove();
  app.note.splice(note.id, 1);

  app.note.push(note);
  document.getElementById("note_list").append(note_interface);

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

    note_refresh_id_with_interface();
    note_save();
  }
  else {
    note_move_last(note_interface);
  }
}

function note_list(){
  let note_list_ol = document.createElement("ol");
  note_list_ol.id = "note_list";

  for (let i = 0; i < app.note.length; i++) {
    note_list_ol.append(note_list_add(app.note[i]));
  }

  return note_list_ol;
}

function note_list_add(app_note){
  let note = document.createElement("li");
  note.id = app_note.id;
  note.className = "note";

  let header = document.createElement("div");
  header.className = "note_header";

  let icon_settings = document.createElement("span");
  icon_settings.className = "icon settings dark_background";
  icon_settings.onclick = function(){
    settings_note(this.parentElement.parentElement);
  };
  icon_settings.append(icon_draw("settings_note", 64, 64, "rgb(85, 85, 85)"));
  header.append(icon_settings);

  let title = document.createElement("input");
  title.className = "note_title";
  title.type = "text";
  title.setAttribute("maxlength", "200");
  title.style.fontSize = app.settings.note_title_size;
  title.placeholder = app.translate().main.title;
  title.value = app_note.title;
  title.oninput = function(){
    app.note[this.parentElement.parentElement.id].title = this.value;
    note_save();
  };
  header.append(title);

  let icon_close = document.createElement("span");
  icon_close.className = "icon red_background";
  icon_close.onclick = function(){
    note_remove(app.note[this.parentElement.parentElement.id]);
  };
  icon_close.append(icon_draw("close", 64, 64, "rgb(85, 85, 85)"));
  header.append(icon_close);

  note.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  let text = document.createElement("textarea");
  text.className = "note_text";
  if (app_note.blur) text.classList.add("blur");
  text.style.fontSize = app.settings.note_text_size;
  text.placeholder = app.translate().main.note + "...";
  text.value = app_note.text;
  text.onfocus = function(){if (app_note.blur) text.classList.remove("blur")};
  text.onblur = function(){if (app_note.blur) text.classList.add("blur")};
  text.oninput = function(){
    app.note[this.parentElement.parentElement.id].text = this.value;
    note_save();
  };
  main.append(text);

  note.append(main);
  return note;
}

function note_fullscreen(app_note){
  document.getElementsByTagName("aside")[0].style.display = "none";
  document.getElementsByTagName("main")[0].classList.add("full");
  document.getElementById("note_list").style.display = "none";

  let note_full = document.createElement("div");
  note_full.id = "note_fullscreen";

  let header = document.createElement("div");
  header.className = "note_header";

  let icon_back = document.createElement("span");
  icon_back.className = "icon note_fullscreen_back dark_background";
  icon_back.onclick = function(){
    let note = document.getElementById(app_note.id);
    note.getElementsByClassName("note_title")[0].value = app_note.title;
    note.getElementsByClassName("note_text")[0].value = app_note.text;
    note_fullscreen_back();
    note.getElementsByClassName("icon settings")[0].click();
  };
  icon_back.append(icon_draw("folder_back", 64, 64, "rgb(65, 65, 65)"));
  header.append(icon_back);

  let title = document.createElement("input");
  title.className = "note_title";
  title.type = "text";
  title.setAttribute("maxlength", "200");
  title.style.fontSize = app.settings.note_title_size;
  title.placeholder = app.translate().main.title;
  title.value = app_note.title;
  title.oninput = function(){app_note.title = this.value; note_save()};
  header.append(title);

  note_full.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  let text = document.createElement("textarea");
  text.className = "note_text";
  text.style.fontSize = app.settings.note_text_size;
  text.placeholder = app.translate().main.note + "...";
  text.value = app_note.text;
  text.oninput = function(){app_note.text = this.value; note_save()};
  main.append(text);

  note_full.append(main);

  document.getElementById("note_list").after(note_full);
  app_url_update("note_fullscreen");
}

function note_fullscreen_back(){
  document.getElementById("note_fullscreen").remove();
  document.getElementById("note_list").removeAttribute("style");
  document.getElementsByTagName("main")[0].classList.remove("full");
  document.getElementsByTagName("aside")[0].removeAttribute("style");
  app_url_update();
}

function note_duplicate(note){
  note_clone = JSON.parse(JSON.stringify(note))
  app.note.splice(note_clone.id, 0, note_clone);
  document.getElementById("note_list").children[note_clone.id].after(note_list_add(note_clone));
  note_refresh_id_with_interface();
  note_save();
}
