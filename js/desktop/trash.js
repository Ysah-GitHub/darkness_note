function trash_load(){
  let request = app_db_open();
  app.trash = [];

  request.onsuccess = function(){
    let transaction = request.result.transaction("trash", "readonly");
    transaction.objectStore("trash").count().onsuccess = function(){
      if (this.result > 0) {
        trash_load_db(transaction, this.result, 0);
      }
      else {
        app_load(app.load_stage + 1);
      }
    };
  };
}

function trash_save(){
  let request = app_db_open();

  request.onsuccess = function(){
    let transaction = request.result.transaction("trash", "readwrite");
    transaction.objectStore("trash").count().onsuccess = function(){
      let note_length = this.result;
      if (note_length > 0) {
        trash_db_replace_delete(transaction, note_length, 0);
      }
      else {
        trash_db_replace_add(transaction);
      }
    };
  };
}

function trash_load_db(transaction, note_length, load_number){
  let transaction_get = transaction.objectStore("trash").get(load_number);
  transaction_get.onsuccess = function(){
    app.trash.push({
      id: transaction_get.result.id,
      title: transaction_get.result.title,
      text: transaction_get.result.text
    });
    load_number = load_number + 1;
    if (load_number < note_length) {
      trash_load_db(transaction, note_length, load_number);
    }
    else {
      app_load(app.load_stage + 1);
    }
  };
}

function trash_db_replace_add(transaction){
  for (let i = 0; i < app.trash.length; i++) {
    transaction.objectStore("trash").add({
      id: app.trash[i].id,
      title: app.trash[i].title,
      text: app.trash[i].text
    });
  }
}

function trash_db_replace_delete(transaction, note_length, delete_number){
  let transaction_delete = transaction.objectStore("trash").delete(delete_number);
  delete_number = delete_number + 1;
  transaction_delete.onsuccess = function(){
    if (delete_number < note_length) {
      trash_db_replace_delete(transaction, note_length, delete_number);
    }
    else {
      trash_db_replace_add(transaction);
    }
  };
}

function trash_note_remove(note){
  app.trash.splice(note.id, 1);
  document.getElementById(note.id).remove();

  note.id = 0;
  app.note.unshift(note);

  trash_refresh_id_with_interface();
  trash_save();
  note_refresh_id();
  note_save();
}

function trash_note_delete(note){
  app.trash.splice(note.id, 1);
  document.getElementById(note.id).remove();
  trash_refresh_id_with_interface();
  trash_save();
}

function trash_note_delete_all(){
  if (confirm(app.translate().trash.delete_all)) {
    for (let i = 0; i < app.trash.length; i++) {
      document.getElementById(i).remove();
    }
    app.trash = [];
    trash_save();
  }
}

function trash_refresh_id(){
  for (let i = 0; i < app.trash.length; i++) {
    app.trash[i].id = i;
  }
}

function trash_refresh_id_with_interface(){
  for (let i = 0; i < app.trash.length; i++) {
    app.trash[i].id = i;
    document.getElementById("trash_list").children[i].id = i;
  }
}

function trash_list(){
  document.getElementById("note_list").remove();
  document.getElementById("menu_settings").style.display = "none";
  document.getElementById("menu_note_add").style.display = "none";
  document.getElementById("menu_note_trash").style.display = "none";

  let trash_list = document.createElement("ol");
  trash_list.id = "trash_list";

  for (let i = 0; i < app.trash.length; i++) {
    trash_list.append(trash_list_add(app.trash[i]));
  }

  document.getElementsByTagName("main")[0].append(trash_list);
  document.getElementById("menu").append(menu_title_sub(app.translate().main.trash));
  document.getElementById("menu").append(menu_trash_back());
  document.getElementById("menu").append(menu_trash_delete_all());
  app_url_update("trash");
}

function trash_list_back(){
  document.getElementById("trash_list").remove();
  document.getElementById("menu_title_sub").remove();
  document.getElementById("menu_trash_back").remove();
  document.getElementById("menu_trash_delete_all").remove();
  document.getElementById("menu_settings").removeAttribute("style");
  document.getElementById("menu_note_add").removeAttribute("style");
  document.getElementById("menu_note_trash").removeAttribute("style");
  document.getElementsByTagName("main")[0].append(note_list());
  menu_note_trash_refresh_number();
  app_url_update();
}

function trash_list_add(note_trash){
  let note = document.createElement("li");
  note.id = note_trash.id;
  note.className = "note";

  let header = document.createElement("div");
  header.className = "note_header";

  let restore_icon = document.createElement("span");
  restore_icon.className = "icon dark_background";
  restore_icon.onclick = function(){trash_note_remove(app.trash[this.parentElement.parentElement.id])};
  restore_icon.append(icon_draw("restore", 64, 64, "rgb(65, 65, 65)"));
  header.append(restore_icon);

  let title = document.createElement("input");
  title.className = "note_title readonly";
  title.type = "text";
  title.setAttribute("readonly", "");
  title.style.fontSize = app.settings.note_title_size;
  title.value = note_trash.title;
  header.append(title);

  let delete_icon = document.createElement("span");
  delete_icon.className = "icon red_background";
  delete_icon.onclick = function(){trash_note_delete(app.trash[this.parentElement.parentElement.id])};
  delete_icon.append(icon_draw("trash", 64, 64, "rgb(65, 65, 65)"));
  header.append(delete_icon);

  note.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  let text = document.createElement("textarea");
  text.className = "note_text";
  text.setAttribute("readonly", "");
  text.style.fontSize = app.settings.note_text_size;
  text.value = note_trash.text;
  main.append(text);

  note.append(main);
  return note;
}
