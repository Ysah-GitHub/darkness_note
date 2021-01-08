var app = {
  version: "1.1.2",
  device: device(),
  note: [],
  trash: []
};

window.onload = function(){
  service_worker();
  load_file();
};

function service_worker(){
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service_worker.js");
  };
}

function load(){
  note_list_create();
  note_main_create();
  note_get();
  trash_get();
  note_load_all();
  note_intro();
}

function load_file(){
  load_file_css(load_file_list_css(app.device));
}

function load_file_list_css(device){
  // --- Main Files
  let tmp_file_list = [
    "css/reset.css",
    "css/main.css"
  ];

  // --- Desktop Files
  if (device == "desktop") {
    tmp_file_list = tmp_file_list.concat([
      "css/desktop/note.css",
      "css/desktop/canvas.css",
      "css/desktop/settings.css",
      "css/desktop/trash.css"
    ]);
  }
  // --- Smartphone Files
  else {
    tmp_file_list = tmp_file_list.concat([
      "css/smartphone/note.css",
      "css/smartphone/canvas.css",
      "css/smartphone/settings.css",
      "css/smartphone/trash.css"
    ]);
  }

  return tmp_file_list;
}

function load_file_list_js(device){
  return [
    "js/canvas_draw.js",
    "js/canvas.js",
    "js/note.js",
    "js/trash.js",
    "js/settings.js"
  ];
}

function load_file_css(file_list){
  let tmp_file = document.createElement("link");
  tmp_file.rel = "stylesheet";
  tmp_file.href = file_list[0];
  file_list.splice(0, 1);

  if (file_list.length > 0) {
    tmp_file.onload = function(){load_file_css(file_list)};
    tmp_file.onerror = function(){load_file_css(file_list)};
  }
  else {
    tmp_file.onload = function(){load_file_js(load_file_list_js(app.device))};
    tmp_file.onerror = function(){load_file_js(load_file_list_js(app.device))};
  }

  document.head.append(tmp_file);
}

function load_file_js(file_list){
  if (file_list.length > 0) {
    let tmp_file = document.createElement("script");
    tmp_file.src = file_list[0];
    file_list.splice(0, 1);
    tmp_file.onload = function(){load_file_js(file_list)};
    tmp_file.onerror = function(){load_file_js(file_list)};

    document.body.append(tmp_file);
  }
  else {
    load();
  }
}

function device(){
  return /Mobi/.test(navigator.userAgent) ? "smartphone" : "desktop";
}
