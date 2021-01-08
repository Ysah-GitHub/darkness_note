function note_get(){
  if (localStorage.getItem("note_list")) {
    app.note = JSON.parse(localStorage.getItem("note_list"));
  }
}

function note_set(){
  localStorage.setItem("note_list", JSON.stringify(app.note));
}

function note_load_all(){
  for (let i = 0; i < app.note.length; i++) {
    document.getElementById("note_list").append(note_create(app.note[i]));
  }
}

function note_intro(){
  if (app.note.length == 0) {
    document.getElementById("note_list").append(note_create());
  }
}

function note_remove(note){
  note.remove();
  trash_add(app.note[note.id]);
  app.note.splice(note.id, 1);
  trash_update();
}

function note_remove_all(){
  for (let i = app.note.length - 1; i > -1; i--) {
    note_remove(document.getElementById(i));
  }
}

function note_refresh_id(){
  for (let i = 0; i < app.note.length; i++) {
    app.note[i].id = i;
    document.getElementsByClassName("note")[i].id = i;
  }
}

function note_list_create(){
  let tmp_note_list = document.createElement("ol");
  tmp_note_list.id = "note_list";

  document.body.prepend(tmp_note_list);
}

function note_main_create(){
  let tmp_note_main = document.createElement("li");
  tmp_note_main.id = "note_main";

  let tmp_note_main_header = document.createElement("div");
  tmp_note_main_header.id = "note_main_header";

  let tmp_canvas_container = document.createElement("span");
  tmp_canvas_container.id = "note_main_canvas_settings";
  tmp_canvas_container.className = "canvas_container";
  tmp_canvas_container.append(canvas_settings_main());
  tmp_note_main_header.append(tmp_canvas_container);

  tmp_canvas_container = document.createElement("span");
  tmp_canvas_container.id = "note_main_canvas_trash";
  tmp_canvas_container.className = "canvas_container";
  tmp_canvas_container.append(canvas_trash_main());
  tmp_note_main_header.append(tmp_canvas_container);

  tmp_note_main.append(tmp_note_main_header);
  tmp_note_main.append(canvas_add_main());

  document.getElementById("note_list").append(tmp_note_main);
}

function note_create(note){
  if (!note) {
    var note = {id: app.note.length, title: null, text: null};
    app.note.push(note);
  }

  let tmp_note = document.createElement("li");
  tmp_note.id = note.id;
  tmp_note.className = "note";

  let tmp_header = document.createElement("div");
  tmp_header.className = "note_header";

  let tmp_canvas_container = document.createElement("span");
  tmp_canvas_container.className = "canvas_container settings";
  tmp_canvas_container.append(canvas_settings());
  tmp_header.append(tmp_canvas_container);

  tmp_element = document.createElement("input");
  tmp_element.className = "note_title";
  tmp_element.type = "text";
  tmp_element.placeholder = "Title";
  tmp_element.value = note.title;
  tmp_element.oninput = function(){
    app.note[this.parentElement.parentElement.id].title = this.value;
    note_set();
  };
  tmp_header.append(tmp_element);

  tmp_canvas_container = document.createElement("span");
  tmp_canvas_container.className = "canvas_container red";
  tmp_canvas_container.append(canvas_close());
  tmp_header.append(tmp_canvas_container);

  tmp_note.append(tmp_header);

  let tmp_main = document.createElement("div");
  tmp_main.className = "note_main";

  tmp_element = document.createElement("textarea");
  tmp_element.className = "note_text";
  tmp_element.placeholder = "Note...";
  tmp_element.textContent = note.text;
  tmp_element.oninput = function(){
    app.note[this.parentElement.parentElement.id].text = this.value;
    note_set();
  };
  tmp_main.append(tmp_element);

  tmp_note.append(tmp_main);

  return tmp_note;
}

function note_settings(note){
  note.getElementsByClassName("canvas_container settings")[0].classList.add("active");
  note.getElementsByClassName("canvas_container settings")[0].children[0].onclick = function(){note_settings_close(note)};
  note.getElementsByClassName("note_title")[0].onclick = function(){note_settings_close(note)};;

  note.getElementsByClassName("note_text")[0].style.display = "none";

  let tmp_container = document.createElement("div");
  tmp_container.className = "note_arrow";

  tmp_container.append(canvas_arrow_first());
  tmp_container.append(canvas_arrow_previous());
  tmp_container.append(canvas_arrow_next());
  tmp_container.append(canvas_arrow_last());

  note.children[1].append(tmp_container);
}

function note_settings_close(note){
  note.getElementsByClassName("canvas_container settings")[0].classList.remove("active");
  note.getElementsByClassName("canvas_container settings")[0].children[0].onclick = function(){note_settings(this.parentElement.parentElement.parentElement)};
  note.getElementsByClassName("note_title")[0].onclick = null;

  note.getElementsByClassName("note_arrow")[0].remove();
  note.getElementsByClassName("note_text")[0].style.display = null;
}

function note_move(note, move_function){
  let tmp_note = app.note[note.id];

  note.remove();
  app.note.splice(note.id, 1);

  move_function(note, tmp_note);

  note_refresh_id();
  note_set();
}

function note_move_first(note, tmp_note){
  app.note.unshift(tmp_note);
  document.getElementById("note_main").after(note);
}

function note_move_last(note, tmp_note){
  app.note.push(tmp_note);
  document.getElementById("note_list").append(note);
}

function note_move_previous(note, tmp_note){
  if ((Number(note.id) - 1) >= 0) {
    let tmp_position = Number(note.id) - 1;
    app.note.splice(tmp_position, 0, tmp_note)

    if (tmp_position > 0) {
      document.getElementById("note_list").children[tmp_position].after(note);
    }
    else {
      document.getElementById("note_main").after(note);
    }
  }
  else {
    note_move_first(note, tmp_note);
  }
}

function note_move_next(note, tmp_note){
  if ((Number(note.id) + 1) < app.note.length) {
    let tmp_position = Number(note.id) + 1;
    app.note.splice(tmp_position, 0, tmp_note)
    document.getElementById("note_list").children[tmp_position].after(note);
  }
  else {
    note_move_last(note, tmp_note);
  }
}

function note_export(){
  let tmp_link = document.createElement("a");
  tmp_link.href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(app.note));
  tmp_link.download = "darkness_note.json";
  tmp_link.click();
}

function note_import(){
  let tmp_input = document.createElement("input");
  tmp_input.type = "file";

  tmp_input.onchange = function(){
    let tmp_file = tmp_input.files[0];
    let tmp_reader = new FileReader();

    if (tmp_file.name.includes("darkness_note") && tmp_file.name.includes(".json")) {
      tmp_reader.readAsText(tmp_file);
      tmp_reader.onload = function() {
        note_remove_all();
        app.note = JSON.parse(tmp_reader.result);
        settings_main_close();
        note_load_all();
        note_set();
      };
    }
    else {
      alert("error : darkness_note.json required");
    }
  };

  tmp_input.click();
}
