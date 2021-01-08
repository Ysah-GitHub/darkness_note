function settings_get(){
  if (localStorage.getItem("settings")) {
    app.settings = JSON.parse(localStorage.getItem("settings"));
  }
}

function settings_set(){
  localStorage.setItem("settings", JSON.stringify(app.settings));
}

function settings_main_create(){
  document.body.classList.add("settings");
  document.getElementById("note_main_canvas_settings").children[0].onclick = settings_main_close;
  document.getElementById("note_main_canvas_add").style.display = "none";
  document.getElementById("note_main_canvas_trash").style.display = "none";

  let tmp_settings_main = document.createElement("ol");
  tmp_settings_main.id = "settings_main";

  tmp_settings_main.append(settings_note_export());
  tmp_settings_main.append(settings_note_import());
  tmp_settings_main.append(settings_source_code());

  document.getElementById("note_main").append(tmp_settings_main);
}

function settings_main_close(){
  document.body.classList.remove("settings");
  document.getElementById("settings_main").remove();
  document.getElementById("note_main_canvas_add").style.display = null;
  document.getElementById("note_main_canvas_trash").style.display = null;
  document.getElementById("note_main_canvas_settings").children[0].onclick = settings_main_create;
}

function settings_note_export(){
  let tmp_note_export = document.createElement("li");
  tmp_note_export.className = "settings_main_option";
  tmp_note_export.onclick = note_export;

  let tmp_note_export_title = document.createElement("p");
  tmp_note_export_title.className = "settings_main_option_title";
  tmp_note_export_title.textContent = "Export Note";
  tmp_note_export.append(tmp_note_export_title);

  return tmp_note_export;
}

function settings_note_import(){
  let tmp_note_import = document.createElement("li");
  tmp_note_import.className = "settings_main_option";
  tmp_note_import.onclick = note_import;

  let tmp_note_import_title = document.createElement("p");
  tmp_note_import_title.className = "settings_main_option_title";
  tmp_note_import_title.textContent = "Import Note";
  tmp_note_import.append(tmp_note_import_title);

  return tmp_note_import;
}

function settings_source_code(){
  let tmp_source_code = document.createElement("li");
  tmp_source_code.className = "settings_main_option";

  let tmp_source_code_link = document.createElement("a");
  tmp_source_code_link.className = "settings_main_option_title";
  tmp_source_code_link.href = "https://github.com/Ysah-GitHub/darkness_note";
  tmp_source_code_link.target = "_blank";
  tmp_source_code_link.textContent = "Source Code";
  tmp_source_code.append(tmp_source_code_link);

  return tmp_source_code;
}
