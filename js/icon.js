function icon_draw(name, width, height, color){
  return icon_constructor(width, height, color, window["icon_" + name + "_draw"]);
}

function icon_draw_start(element, color, width, height){
  let draw = element.getContext("2d");
  draw.clearRect(0, 0, width, height);
  draw.fillStyle = color;
  return draw;
}

function icon_constructor(width, height, color, draw_func){
  let icon = document.createElement("canvas");
  icon.width = width;
  icon.height = height;
  draw_func(icon, color, width, height);
  return icon;
}

function icon_fillRect(draw, width, height, values){
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < 4; j++) {
      values[i][j] = (values[i][j] / 64);
    }
    draw.fillRect((width * values[i][0]), (height * values[i][1]), (width * values[i][2]), (height * values[i][3]));
  }
}

function icon_add_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
    [29, 14, 6, 36],
    [14, 29, 36, 6]
  ]);
}

function icon_arrow_move_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);

  draw.strokeStyle = color;
  draw.lineWidth = (3 / 64) * width;
  draw.beginPath();
  draw.moveTo((22 / 64) * width, (18 / 64) * height);
  draw.lineTo((22 / 64) * width, (46 / 64) * height);
  draw.moveTo((28 / 64) * width, (18 / 64) * height);
  draw.lineTo((42 / 64) * width, (32 / 64) * height);
  draw.lineTo((28 / 64) * width, (46 / 64) * height);
  draw.stroke();
}

function icon_arrow_move_double_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);

  draw.strokeStyle = color;
  draw.lineWidth = (3 / 64) * width;
  draw.beginPath();
  draw.moveTo((16 / 64) * width, (18 / 64) * height);
  draw.lineTo((16 / 64) * width, (46 / 64) * height);
  draw.moveTo((22 / 64) * width, (18 / 64) * height);
  draw.lineTo((36 / 64) * width, (32 / 64) * height);
  draw.lineTo((22 / 64) * width, (46 / 64) * height);
  draw.moveTo((34 / 64) * width, (18 / 64) * height);
  draw.lineTo((48 / 64) * width, (32 / 64) * height);
  draw.lineTo((34 / 64) * width, (46 / 64) * height);
  draw.stroke();
}

function icon_close_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);

  draw.strokeStyle = color;
  draw.lineWidth = (3 / 64) * width;
  draw.beginPath();
  draw.moveTo((18 / 64) * width, (18 / 64) * height);
  draw.lineTo((46 / 64) * width, (46 / 64) * height);
  draw.moveTo((46 / 64) * width, (18 / 64) * height);
  draw.lineTo((18 / 64) * width, (46 / 64) * height);
  draw.stroke();
}

function icon_folder_back_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
    [38, 20, 4, 10],
    [22, 30, 20, 4]
  ]);

  draw.strokeStyle = color;
  draw.lineWidth = (4 / 64) * width;
  draw.beginPath();
  draw.moveTo((22 / 64) * width, (28 / 64) * height);
  draw.lineTo((22 / 64) * width, (36 / 64) * height);
  draw.lineTo((17 / 64) * width, (32 / 64) * height);
  draw.lineTo((22 / 64) * width, (28 / 64) * height);
  draw.lineTo((22 / 64) * width, (36 / 64) * height);
  draw.stroke();
}

function icon_fullscreen_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
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

function icon_link_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
    [4, 4, 24, 4],
    [40, 4, 20, 4],
    [4, 8, 4, 48],
    [56, 8, 4, 16],
    [56, 36, 4, 20],
    [4, 56, 56, 4]
  ]);

  draw.strokeStyle = color;
  draw.lineWidth = (4 / 64) * width;
  draw.beginPath();
  draw.moveTo(width * 0.5, height * 0.5);
  draw.lineTo(width - ((8 / 64) * width), (8 / 64) * height);
  draw.stroke();
}

function icon_restore_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
    [23, 19, 24, 4],
    [43, 23, 4, 18],
    [19, 41, 28, 4]
  ]);

  draw.strokeStyle = color;
  draw.lineWidth = (4 / 64) * width;
  draw.beginPath();
  draw.moveTo((23 / 64) * width, (17 / 64) * height);
  draw.lineTo((23 / 64) * width, (25 / 64) * height);
  draw.lineTo((18 / 64) * width, (21 / 64) * height);
  draw.lineTo((23 / 64) * width, (17 / 64) * height);
  draw.lineTo((23 / 64) * width, (25 / 64) * height);
  draw.stroke();
}

function icon_select_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);

  draw.strokeStyle = color;
  draw.lineWidth = (4 / 64) * width;
  draw.beginPath();
  draw.moveTo((21 / 64) * width, (27 / 64) * height);
  draw.lineTo((31 / 64) * width, (37 / 64) * height);
  draw.lineTo((41 / 64) * width, (27 / 64) * height);
  draw.stroke();
}

function icon_select_double_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);

  draw.strokeStyle = color;
  draw.lineWidth = (4 / 64) * width;
  draw.beginPath();
  draw.moveTo((21 / 64) * width, (26 / 64) * height);
  draw.lineTo((31 / 64) * width, (16 / 64) * height);
  draw.lineTo((41 / 64) * width, (26 / 64) * height);
  draw.moveTo((21 / 64) * width, (36 / 64) * height);
  draw.lineTo((31 / 64) * width, (46 / 64) * height);
  draw.lineTo((41 / 64) * width, (36 / 64) * height);
  draw.stroke();
}

function icon_settings_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
    [31, 20, 4, 4],
    [31, 31, 4, 4],
    [31, 42, 4, 4]
  ]);
}

function icon_settings_note_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
    [18, 20, 28, 4],
    [18, 31, 28, 4],
    [18, 42, 28, 4]
  ]);
}

function icon_trash_draw(element, color, width, height){
  let draw = icon_draw_start(element, color, width, height);
  icon_fillRect(draw, width, height, [
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
