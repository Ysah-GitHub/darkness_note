function trash_get(){
  if (localStorage.getItem("trash_list")) {
    app.trash = JSON.parse(localStorage.getItem("trash_list"));
  }
}

function trash_set(){
  localStorage.setItem("trash_list", JSON.stringify(app.trash));
}

function trash_add(note){
  if (note.title || note.text) {
    note.id = app.trash.length;
    app.trash.push(note);
    trash_set();
  }
}

function trash_refresh_id(){
  for (let i = 0; i < app.trash.length; i++) {
    app.trash[i].id = i;
    document.getElementById("trash_list").children[i + 1].className = i;
  }
}

function trash_update(){
  if (document.body.className.includes("trash")) {
    trash_list_close();
    trash_list_create();
  }
}

function trash_list_create(){
  document.body.classList.add("trash");
  document.getElementById("note_main_canvas_trash").children[0].onclick = trash_list_close;
  document.getElementById("note_main_canvas_add").style.display = "none";
  document.getElementById("note_main_canvas_settings").style.display = "none";

  let tmp_canvas_container = document.createElement("span");
  tmp_canvas_container.id = "note_main_canvas_close_trash_all";
  tmp_canvas_container.className = "canvas_container";
  tmp_canvas_container.append(canvas_close_trash_all());
  document.getElementById("note_main_header").prepend(tmp_canvas_container);

  let tmp_trash_list = document.createElement("ol");
  tmp_trash_list.id = "trash_list";

  let tmp_trash_background = document.createElement("div");
  tmp_trash_background.id = "trash_background";
  tmp_trash_background.append(canvas_trash_background());
  tmp_trash_list.append(tmp_trash_background);

  for (let i = 0; i < app.trash.length; i++) {
    let tmp_trash_element = document.createElement("li");
    tmp_trash_element.className = i;

    tmp_canvas_container = document.createElement("span");
    tmp_canvas_container.className = "canvas_container red";
    tmp_canvas_container.append(canvas_close_trash());
    tmp_trash_element.append(tmp_canvas_container);

    let tmp_trash_text = document.createElement("p");
    tmp_trash_text.textContent = app.trash[i].title ? app.trash[i].title : app.trash[i].text;
    tmp_trash_text.onclick = function(){trash_remove(this.parentElement.className)};
    tmp_trash_element.append(tmp_trash_text);
    tmp_trash_list.append(tmp_trash_element);

    tmp_canvas_container = document.createElement("span");
    tmp_canvas_container.className = "canvas_container";
    tmp_canvas_container.append(canvas_return_trash());
    tmp_trash_element.append(tmp_canvas_container);
  }

  document.getElementById("note_main").append(tmp_trash_list);
}

function trash_list_close(){
  document.body.classList.remove("trash");
  document.getElementById("trash_list").remove();
  document.getElementById("note_main_canvas_close_trash_all").remove();
  document.getElementById("note_main_canvas_add").style.display = null;
  document.getElementById("note_main_canvas_settings").style.display = null;
  document.getElementById("note_main_canvas_trash").children[0].onclick = trash_list_create;
}

function trash_remove(trash_number){
  let tmp_note = app.trash[trash_number];
  tmp_note.id = app.note.length;

  document.getElementById("trash_list").getElementsByClassName(trash_number)[0].remove();
  app.trash.splice(trash_number, 1);
  trash_refresh_id();
  trash_update();
  trash_set();

  app.note.push(tmp_note);
  document.getElementById("note_list").append(note_create(tmp_note));
  note_set();

  if (app.trash.length == 0) {
    trash_list_close();
  }
}

function trash_delete(trash_number){
  document.getElementById("trash_list").getElementsByClassName(trash_number)[0].remove();
  app.trash.splice(trash_number, 1);
  trash_refresh_id();
  trash_update();
  trash_set();
}

function trash_delete_all(){
  trash_list_close();
  app.trash = [];
  trash_set();
}
