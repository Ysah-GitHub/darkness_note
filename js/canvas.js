function canvas_constructor(properties, functions){
  let tmp_canvas = document.createElement("canvas");
  tmp_canvas.width = properties[0];
  tmp_canvas.height = properties[1];
  functions[0](tmp_canvas, properties[4]);

  tmp_canvas.id = properties[2];
  tmp_canvas.className = properties[3];
  tmp_canvas.onclick = functions[1];

  return tmp_canvas;
}

function canvas_add_main(){
  return canvas_constructor(
    [128, 128, "note_main_canvas_add", "canvas add", "rgb(65, 65, 65)"],
    [canvas_add_draw, function(){document.getElementById("note_list").append(note_create()); note_set()}]
  );
}

function canvas_settings(){
  return canvas_constructor(
    [64, 64, "", "canvas settings", "rgb(65, 65, 65)"],
    [canvas_settings_draw, function(){note_settings(this.parentElement.parentElement.parentElement)}]
  );
}

function canvas_settings_main(){
  return canvas_constructor(
    [64, 64, "", "canvas settings", "rgb(65, 65, 65)"],
    [canvas_settings_draw, settings_main_create]
  );
}

function canvas_close(){
  return canvas_constructor(
    [64, 64, "", "canvas close", "rgb(65, 65, 65)"],
    [canvas_close_draw, function(){note_remove(this.parentElement.parentElement.parentElement); note_refresh_id(); note_set()}]
  );
}

function canvas_close_trash(){
  return canvas_constructor(
    [64, 64, "", "canvas close", "rgb(65, 65, 65)"],
    [canvas_close_draw, function(){trash_delete(this.parentElement.parentElement.className)}]
  );
}

function canvas_close_trash_all(){
  return canvas_constructor(
    [64, 64, "", "canvas close", "rgb(65, 65, 65)"],
    [canvas_close_draw, trash_delete_all]
  );
}

function canvas_return_trash(){
  return canvas_constructor(
    [64, 64, "", "canvas return", "rgb(65, 65, 65)"],
    [canvas_return_draw, function(){trash_remove(this.parentElement.parentElement.className)}]
  );
}

function canvas_arrow_previous(){
  return canvas_constructor(
    [64, 64, "", "canvas arrow_previous", "rgb(65, 65, 65)"],
    [canvas_arrow_draw, function(){note_move(this.parentElement.parentElement.parentElement, note_move_previous)}]
  );
}

function canvas_arrow_next(){
  return canvas_constructor(
    [64, 64, "", "canvas arrow_next", "rgb(65, 65, 65)"],
    [canvas_arrow_draw, function(){note_move(this.parentElement.parentElement.parentElement, note_move_next)}]
  );
}

function canvas_arrow_first(){
  return canvas_constructor(
    [64, 64, "", "canvas arrow_first", "rgb(65, 65, 65)"],
    [canvas_arrow_double_draw, function(){note_move(this.parentElement.parentElement.parentElement, note_move_first)}]
  );
}

function canvas_arrow_last(){
  return canvas_constructor(
    [64, 64, "", "canvas arrow_last", "rgb(65, 65, 65)"],
    [canvas_arrow_double_draw, function(){note_move(this.parentElement.parentElement.parentElement, note_move_last)}]
  );
}

function canvas_trash_main(){
  return canvas_constructor(
    [64, 64, "", "canvas trash", "rgb(65, 65, 65)"],
    [canvas_trash_draw, trash_list_create]
  );
}

function canvas_trash_background(){
  return canvas_constructor(
    [320, 320, "canvas_trash_background", "", "rgb(55, 55, 55)"],
    [canvas_trash_background_draw]
  );
}
