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
    transaction.objectStore("trash").add(app.trash[i]);
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
  trash_number_refresh();
}

function trash_note_delete(note){
  app.trash.splice(note.id, 1);
  document.getElementById(note.id).remove();
  trash_refresh_id_with_interface();
  trash_save();
  trash_number_refresh();
}

function trash_note_delete_all(){
  if (confirm(app.translate().trash.delete_all)) {
    for (let i = 0; i < app.trash.length; i++) {
      document.getElementById(i).remove();
    }
    app.trash = [];
    trash_save();
    trash_number_refresh();
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

function trash_number_refresh(){
  if (app.trash.length > 0) {
    document.getElementById("title_sub").textContent = app.translate().main.trash + " [" + app.trash.length + "]";
  }
  else {
    document.getElementById("title_sub").textContent = app.translate().main.trash;
  }
}

function trash_number_icon(){
  let trash_number = app.trash.length;
  if (trash_number < 30) {return app_icon("trash", 64, "rgb(65, 65, 65)", trash_list, "icon_trash")}
  else if (trash_number >= 30 && trash_number < 50) {return app_icon("trash", 64, "rgb(130, 90, 65)", trash_list, "icon_trash")}
  else if (trash_number >= 50) {return app_icon("trash", 64, "rgb(130, 65, 65)", trash_list, "icon_trash")}
}

function trash_list(){
  document.getElementById("menu").replaceChildren(
    app_icon("folder_back", 64, "rgb(65, 65, 65)", trash_list_back),
    app_title_sub(app.translate().main.trash)
  );
  document.getElementsByTagName("main")[0].replaceChildren();
  document.getElementsByTagName("main")[0].id = "trash_list";
  document.getElementsByTagName("main")[0].scrollTop = 0;
  document.getElementsByTagName("footer")[0].replaceChildren(app_icon("trash", 64, "rgb(65, 65, 65)", trash_note_delete_all));

  for (let i = 0; i < app.trash.length; i++) {
    document.getElementById("trash_list").append(trash_list_add(app.trash[i]));
  }

  trash_number_refresh();
  app_url_update("trash");
}

function trash_list_back(){
  document.getElementById("menu").remove();
  document.getElementsByTagName("main")[0].remove();
  document.getElementsByTagName("footer")[0].remove();

  app_header();
  app_main();
  app_footer();
  app_url_update();
}

function trash_list_add(note_trash){
  let note = document.createElement("div");
  note.id = note_trash.id;
  note.className = "note";

  let header = document.createElement("div");
  header.className = "note_header";

  header.append(app_icon("restore", 64, "rgb(65, 65, 65)", function(){trash_note_remove(app.trash[this.parentElement.parentElement.id])}));

  let title = document.createElement("input");
  title.className = "note_title readonly";
  title.type = "text";
  title.setAttribute("readonly", "");
  title.style.fontFamily = app.settings.note_title_font;
  title.style.fontSize = app.settings.note_title_size;
  title.value = note_trash.title;
  header.append(title);

  header.append(app_icon("trash", 64, "rgb(65, 65, 65)", function(){trash_note_delete(app.trash[this.parentElement.parentElement.id])}));

  note.append(header);

  let main = document.createElement("div");
  main.className = "note_main";

  let text = document.createElement("textarea");
  text.className = "note_text";
  text.setAttribute("readonly", "");
  text.style.fontFamily = app.settings.note_text_font;
  text.style.fontSize = app.settings.note_text_size;
  text.style.lineHeight = app.settings.note_line_spacing;
  text.value = note_trash.text;
  main.append(text);

  note.append(main);
  return note;
}
