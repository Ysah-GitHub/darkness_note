function trash_save(){
  localStorage.setItem("trash", JSON.stringify(app.trash));
}

function trash_load(){
  if (localStorage.getItem("trash")) {
    app.trash = JSON.parse(localStorage.getItem("trash"));
  }
  else {
    app.trash = [];
    trash_save();
  }
}

function trash_note_remove(note){
  app.trash.splice(note.id, 1);
  document.getElementById(note.id).remove();

  note.id = app.note.length;
  app.note.push(note);
  trash_refresh_id();
  trash_save();
  note_save();
}

function trash_note_delete(note){
  app.trash.splice(note.id, 1);
  document.getElementById(note.id).remove();
  trash_refresh_id();
  trash_save();
}

function trash_note_delete_all(){
  if (confirm(translation().delete_all_note_confirm)) {
    let tmp_child_number = document.getElementById("trash_list").children.length - app.trash.length;
    for (let i = 0; i < app.trash.length; i++) {
      document.getElementById(i).remove();
    }
    app.trash = [];
    trash_save();
  }
}

function trash_refresh_id(){
  let tmp_child_number = document.getElementById("trash_list").children.length - app.trash.length;

  for (let i = 0; i < app.trash.length; i++) {
    app.trash[i].id = i;
    document.getElementById("trash_list").children[tmp_child_number + i].id = i;
  }
}

function trash_refresh_number(){
  let tmp_trash_number = app.trash.length;
  if (tmp_trash_number < 30) {
    document.getElementById("trash_number").className = "";
  }
  else if (tmp_trash_number >= 30 && tmp_trash_number < 50) {
    document.getElementById("trash_number").className = "orange";
  }
  else {
    document.getElementById("trash_number").className = "red";
  }
  document.getElementById("trash_number").textContent = "[" + tmp_trash_number + "]";
}

function trash_interface_list_create(){
  document.getElementById("note_list").remove();

  let tmp_trash_list = document.createElement("ol");
  tmp_trash_list.id = "trash_list";

  let tmp_trash = document.createElement("li");
  tmp_trash.id = "trash";
  tmp_trash.className = "note";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_delete_all_icon = document.createElement("span");
  tmp_delete_all_icon.className = "icon red_background trash_delete_all";
  tmp_delete_all_icon.title = translation().delete_all_note;
  tmp_delete_all_icon.onclick = trash_note_delete_all;
  tmp_delete_all_icon.append(icon_trash(64, 64));
  tmp_header.append(tmp_delete_all_icon);

  tmp_trash.append(tmp_header);

  let tmp_trash_icon = document.createElement("span");
  tmp_trash_icon.className = "icon trash_return";
  tmp_trash_icon.title = translation().back;
  tmp_trash_icon.onclick = trash_interface_list_remove;
  tmp_trash_icon.append(icon_folder_back(256, 256));
  tmp_trash.append(tmp_trash_icon);

  tmp_trash_list.append(tmp_trash);

  for (let i = 0; i < app.trash.length; i++) {
    tmp_trash_list.append(trash_interface_note(app.trash[i]));
  }

  document.body.prepend(tmp_trash_list);
}

function trash_interface_list_remove(){
  document.getElementById("trash_list").remove();
  note_interface_list();
}

function trash_interface_note(note){
  let tmp_note = document.createElement("li");
  tmp_note.id = note.id;
  tmp_note.className = "note";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_return = document.createElement("span");
  tmp_return.className = "icon dark_background";
  tmp_return.title = translation().restore;
  tmp_return.onclick = function(){trash_note_remove(app.trash[this.parentElement.parentElement.id])};
  tmp_return.append(icon_return(64, 64));
  tmp_header.append(tmp_return);

  let tmp_title = document.createElement("input");
  tmp_title.className = "note_title";
  tmp_title.title = translation().title;
  tmp_title.type = "text";
  tmp_title.setAttribute("readonly", "");
  tmp_title.value = note.title;
  tmp_header.append(tmp_title);

  let tmp_delete_icon = document.createElement("span");
  tmp_delete_icon.className = "icon red_background";
  tmp_delete_icon.title = translation().delete;
  tmp_delete_icon.onclick = function(){trash_note_delete(app.trash[this.parentElement.parentElement.id])};
  tmp_delete_icon.append(icon_trash(64, 64));
  tmp_header.append(tmp_delete_icon);

  tmp_note.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  let tmp_text = document.createElement("textarea");
  tmp_text.className = "note_text scrollbar_custom";
  tmp_text.title = translation().note;
  tmp_text.setAttribute("readonly", "");
  tmp_text.value = note.text;
  tmp_main.append(tmp_text);

  tmp_note.append(tmp_main);
  return tmp_note;
}
