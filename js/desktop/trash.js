function trash_load(){
  let tmp_request = app_db_open();
  app.trash = [];

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("trash", "readonly");
    tmp_transaction.objectStore("trash").count().onsuccess = function(){
      if (this.result > 0) {
        trash_load_db(tmp_transaction, this.result, 0);
      }
      else {
        app_load(app.load_stage + 1);
      }
    };
  };
}

function trash_save(){
  let tmp_request = app_db_open();

  tmp_request.onsuccess = function(){
    let tmp_transaction = tmp_request.result.transaction("trash", "readwrite");
    tmp_transaction.objectStore("trash").count().onsuccess = function(){
      let tmp_note_length = this.result;
      if (tmp_note_length > 0) {
        trash_db_replace_delete(tmp_transaction, tmp_note_length, 0);
      }
      else {
        trash_db_replace_add(tmp_transaction);
      }
    };
  };
}

function trash_load_db(tmp_transaction, note_length, load_number){
  let tmp_transaction_get = tmp_transaction.objectStore("trash").get(load_number);
  tmp_transaction_get.onsuccess = function(){
    app.trash.push({
      id: tmp_transaction_get.result.id,
      title: tmp_transaction_get.result.title,
      text: tmp_transaction_get.result.text
    });
    load_number = load_number + 1;
    if (load_number < note_length) {
      trash_load_db(tmp_transaction, note_length, load_number);
    }
    else {
      app_load(app.load_stage + 1);
    }
  };
}

function trash_db_replace_add(tmp_transaction){
  for (let i = 0; i < app.trash.length; i++) {
    tmp_transaction.objectStore("trash").add({
      id: app.trash[i].id,
      title: app.trash[i].title,
      text: app.trash[i].text
    });
  }
}

function trash_db_replace_delete(tmp_transaction, note_length, delete_number){
  let tmp_transaction_delete = tmp_transaction.objectStore("trash").delete(delete_number);
  delete_number = delete_number + 1;
  tmp_transaction_delete.onsuccess = function(){
    if (delete_number < note_length) {
      trash_db_replace_delete(tmp_transaction, note_length, delete_number);
    }
    else {
      trash_db_replace_add(tmp_transaction);
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
  if (confirm(app.translate().trash.trash_delete_all)) {
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

  let tmp_trash_list = document.createElement("ol");
  tmp_trash_list.id = "trash_list";

  for (let i = 0; i < app.trash.length; i++) {
    tmp_trash_list.append(trash_list_add(app.trash[i]));
  }

  document.getElementsByTagName("main")[0].append(tmp_trash_list);
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

function trash_list_add(note){
  let tmp_note = document.createElement("li");
  tmp_note.id = note.id;
  tmp_note.className = "note";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_return = document.createElement("span");
  tmp_return.className = "icon dark_background";
  tmp_return.onclick = function(){trash_note_remove(app.trash[this.parentElement.parentElement.id])};
  tmp_return.append(icon_return(64, 64));
  tmp_header.append(tmp_return);

  let tmp_title = document.createElement("input");
  tmp_title.className = "note_title readonly";
  tmp_title.type = "text";
  tmp_title.setAttribute("readonly", "");
  tmp_title.value = note.title;
  tmp_header.append(tmp_title);

  let tmp_delete_icon = document.createElement("span");
  tmp_delete_icon.className = "icon red_background";
  tmp_delete_icon.onclick = function(){trash_note_delete(app.trash[this.parentElement.parentElement.id])};
  tmp_delete_icon.append(icon_trash(64, 64));
  tmp_header.append(tmp_delete_icon);

  tmp_note.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  let tmp_text = document.createElement("textarea");
  tmp_text.className = "note_text";
  tmp_text.setAttribute("readonly", "");
  tmp_text.value = note.text;
  tmp_main.append(tmp_text);

  tmp_note.append(tmp_main);
  return tmp_note;
}
