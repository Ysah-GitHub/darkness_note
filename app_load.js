app_file_load(app_file_list_css(), app_file_list_js());

function app_file_load(file_list_css, file_list_js){
  if (file_list_css.length > 0) {
    let tmp_file = document.createElement("link");
    tmp_file.rel = "stylesheet";
    tmp_file.href = file_list_css[0];
    file_list_css.splice(0, 1);
    tmp_file.onload = function(){app_file_load(file_list_css, file_list_js)};
    tmp_file.onerror = function(){app_file_load(file_list_css, file_list_js)};
    document.head.append(tmp_file);
  }
  else if (file_list_js.length > 0) {
    let tmp_file = document.createElement("script");
    tmp_file.src = file_list_js[0];
    file_list_js.splice(0, 1);
    tmp_file.onload = function(){app_file_load(file_list_css, file_list_js)};
    tmp_file.onerror = function(){app_file_load(file_list_css, file_list_js)};
    document.body.append(tmp_file);
  }
  else {
    app_load();
  }
}

function app_load(){
  app_service_worker();
  app_lang();
  app_description();
  app_manifest();
  note_load();
  trash_load();
  note_interface_list();
}

function app_lang(){
  document.documentElement.lang = app.language;
}

function app_description(){
  let tmp_meta = document.createElement("meta");
  tmp_meta.setAttribute("name", "description");
  tmp_meta.setAttribute("content", translation().app_description);
  document.getElementsByName("author")[0].after(tmp_meta);
}

function app_manifest(){
  let tmp_link = document.createElement("link");
  tmp_link.setAttribute("rel", "manifest");
  tmp_link.setAttribute("href", "rsc/manifest/manifest_" + app.language + ".json");
  document.getElementsByTagName("title")[0].after(tmp_link);
}

function app_service_worker(){
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service_worker.js");
  }
}
