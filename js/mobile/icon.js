function icon_constructor(width, height, color, draw_func){
  let tmp_icon = document.createElement("canvas");
  tmp_icon.width = width;
  tmp_icon.height = height;
  draw_func(tmp_icon, color, width, height);
  return tmp_icon;
}

function icon_draw_start(element, color, width, height){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, width, height);
  tmp_draw.fillStyle = color;
  return tmp_draw;
}

function icon_fillRect(draw, width, height, values){
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < 4; j++) {
      values[i][j] = (values[i][j] / 64);
    }
    draw.fillRect((width * values[i][0]), (height * values[i][1]), (width * values[i][2]), (height * values[i][3]));
  }
}

function icon_close(width, height){
  return icon_constructor(width, height, "rgb(85, 85, 85)", icon_close_draw);
}

function icon_settings(width, height){
  return icon_constructor(width, height, "rgb(85, 85, 85)", icon_settings_draw);
}

function icon_settings_note(width, height){
  return icon_constructor(width, height, "rgb(85, 85, 85)", icon_settings_note_draw);
}

function icon_add(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_add_draw);
}

function icon_trash(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_trash_draw);
}

function icon_return(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_return_draw);
}

function icon_folder_back(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_folder_back_draw);
}

function icon_fullscreen(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_fullscreen_draw);
}

function icon_fullscreen_light(width, height){
  return icon_constructor(width, height, "rgb(200, 200, 200)", icon_fullscreen_draw);
}

function icon_arrow_move(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_arrow_move_draw);
}

function icon_arrow_move_light(width, height){
  return icon_constructor(width, height, "rgb(200, 200, 200)", icon_arrow_move_draw);
}

function icon_double_arrow_move(width, height){
  return icon_constructor(width, height, "rgb(65, 65, 65)", icon_double_arrow_move_draw);
}

function icon_link_light(width, height){
  return icon_constructor(width, height, "rgb(200, 200, 200)", icon_link_draw);
}

function icon_select(width, height){
  return icon_constructor(width, height, "rgb(200, 200, 200)", icon_select_draw);
}

function icon_close_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [18, 18, 4, 4],
    [22, 22, 4, 4],
    [26, 26, 4, 4],
    [30, 30, 4, 4],
    [34, 34, 4, 4],
    [38, 38, 4, 4],
    [42, 42, 4, 4],
    [42, 18, 4, 4],
    [38, 22, 4, 4],
    [34, 26, 4, 4],
    [26, 34, 4, 4],
    [22, 38, 4, 4],
    [18, 42, 4, 4]
  ]);
}

function icon_settings_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [31, 20, 4, 4],
    [31, 31, 4, 4],
    [31, 42, 4, 4]
  ]);
}

function icon_settings_note_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [18, 20, 28, 4],
    [18, 31, 28, 4],
    [18, 42, 28, 4]
  ]);
}

function icon_add_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [30, 20, 4, 24],
    [20, 30, 24, 4]
  ]);
}

function icon_trash_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [26, 17, 3, 3],
    [29, 17, 6, 2],
    [35, 17, 3, 3],
    [21, 20, 22, 3],
    [21, 26, 22, 4],
    [21, 30, 4, 13],
    [27, 30, 4, 13],
    [33, 30, 4, 13],
    [39, 30, 4, 13],
    [21, 43, 22, 4]
  ]);
}

function icon_return_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [23, 19, 24, 4],
    [43, 23, 4, 18],
    [19, 41, 28, 4]
  ]);

  tmp_draw.strokeStyle = color;
  tmp_draw.lineWidth = (4 / 64) * width;
  tmp_draw.beginPath();
  tmp_draw.moveTo((23 / 64) * width, (17 / 64) * height);
  tmp_draw.lineTo((23 / 64) * width, (25 / 64) * height);
  tmp_draw.lineTo((18 / 64) * width, (21 / 64) * height);
  tmp_draw.lineTo((23 / 64) * width, (17 / 64) * height);
  tmp_draw.lineTo((23 / 64) * width, (25 / 64) * height);
  tmp_draw.stroke();
}

function icon_folder_back_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [38, 20, 4, 10],
    [22, 30, 20, 4]
  ]);

  tmp_draw.strokeStyle = color;
  tmp_draw.lineWidth = (4 / 64) * width;
  tmp_draw.beginPath();
  tmp_draw.moveTo((22 / 64) * width, (28 / 64) * height);
  tmp_draw.lineTo((22 / 64) * width, (36 / 64) * height);
  tmp_draw.lineTo((17 / 64) * width, (32 / 64) * height);
  tmp_draw.lineTo((22 / 64) * width, (28 / 64) * height);
  tmp_draw.lineTo((22 / 64) * width, (36 / 64) * height);
  tmp_draw.stroke();
}

function icon_fullscreen_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [14, 14, 8, 4],
    [42, 14, 8, 4],
    [14, 18, 4, 4],
    [46, 18, 4, 4],
    [14, 41, 4, 4],
    [46, 41, 4, 4],
    [14, 45, 8, 4],
    [42, 45, 8, 4]
  ]);
}

function icon_arrow_move_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [20, 18, 4, 28],
    [28, 18, 4, 4],
    [32, 22, 4, 4],
    [36, 26, 4, 4],
    [40, 30, 4, 4],
    [36, 34, 4, 4],
    [32, 38, 4, 4],
    [28, 42, 4, 4]
  ]);
}

function icon_double_arrow_move_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [14, 18, 4, 28],
    [22, 18, 4, 4],
    [26, 22, 4, 4],
    [30, 26, 4, 4],
    [34, 30, 4, 4],
    [30, 34, 4, 4],
    [26, 38, 4, 4],
    [22, 42, 4, 4],
    [34, 18, 4, 4],
    [38, 22, 4, 4],
    [42, 26, 4, 4],
    [46, 30, 4, 4],
    [42, 34, 4, 4],
    [38, 38, 4, 4],
    [34, 42, 4, 4],
  ]);
}

function icon_link_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);
  icon_fillRect(tmp_draw, width, height, [
    [4, 4, 24, 4],
    [40, 4, 20, 4],
    [4, 8, 4, 48],
    [56, 8, 4, 16],
    [56, 36, 4, 20],
    [4, 56, 56, 4]
  ]);

  tmp_draw.strokeStyle = color;
  tmp_draw.lineWidth = (4 / 64) * width;
  tmp_draw.beginPath();
  tmp_draw.moveTo(width * 0.5, height * 0.5);
  tmp_draw.lineTo(width - ((8 / 64) * width), (8 / 64) * height);
  tmp_draw.stroke();
}

function icon_select_draw(element, color, width, height){
  let tmp_draw = icon_draw_start(element, color, width, height);

  tmp_draw.strokeStyle = color;
  tmp_draw.lineWidth = (4 / 64) * width;
  tmp_draw.beginPath();
  tmp_draw.moveTo((21 / 64) * width, (26 / 64) * height);
  tmp_draw.lineTo((31 / 64) * width, (16 / 64) * height);
  tmp_draw.lineTo((41 / 64) * width, (26 / 64) * height);
  tmp_draw.moveTo((21 / 64) * width, (36 / 64) * height);
  tmp_draw.lineTo((31 / 64) * width, (46 / 64) * height);
  tmp_draw.lineTo((41 / 64) * width, (36 / 64) * height);
  tmp_draw.stroke();
}
