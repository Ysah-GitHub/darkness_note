function canvas_add_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 128, 128);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(56, 16, 16, 96);
  tmp_draw.fillRect(16, 56, 96, 16);
}

function canvas_settings_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(18, 18, 28, 4);
  tmp_draw.fillRect(18, 30, 28, 4);
  tmp_draw.fillRect(18, 42, 28, 4);
}

function canvas_close_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(18, 18, 4, 4);
  tmp_draw.fillRect(22, 22, 4, 4);
  tmp_draw.fillRect(26, 26, 4, 4);
  tmp_draw.fillRect(30, 30, 4, 4);
  tmp_draw.fillRect(34, 34, 4, 4);
  tmp_draw.fillRect(38, 38, 4, 4);
  tmp_draw.fillRect(42, 42, 4, 4);

  tmp_draw.fillRect(42, 18, 4, 4);
  tmp_draw.fillRect(38, 22, 4, 4);
  tmp_draw.fillRect(34, 26, 4, 4);
  tmp_draw.fillRect(26, 34, 4, 4);
  tmp_draw.fillRect(22, 38, 4, 4);
  tmp_draw.fillRect(18, 42, 4, 4);
}

function canvas_return_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(16, 22, 32, 4);
  tmp_draw.fillRect(44, 26, 4, 18);
  tmp_draw.fillRect(20, 44, 28, 4);

  tmp_draw.fillRect(24, 16, 4, 16);
  tmp_draw.fillRect(20, 19, 4, 10);
}

function canvas_arrow_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(20, 18, 4, 28);

  tmp_draw.fillRect(28, 18, 4, 4);
  tmp_draw.fillRect(32, 22, 4, 4);
  tmp_draw.fillRect(36, 26, 4, 4);
  tmp_draw.fillRect(40, 30, 4, 4);
  tmp_draw.fillRect(36, 34, 4, 4);
  tmp_draw.fillRect(32, 38, 4, 4);
  tmp_draw.fillRect(28, 42, 4, 4);
}

function canvas_arrow_double_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(14, 18, 4, 28);

  tmp_draw.fillRect(22, 18, 4, 4);
  tmp_draw.fillRect(26, 22, 4, 4);
  tmp_draw.fillRect(30, 26, 4, 4);
  tmp_draw.fillRect(34, 30, 4, 4);
  tmp_draw.fillRect(30, 34, 4, 4);
  tmp_draw.fillRect(26, 38, 4, 4);
  tmp_draw.fillRect(22, 42, 4, 4);

  tmp_draw.fillRect(34, 18, 4, 4);
  tmp_draw.fillRect(38, 22, 4, 4);
  tmp_draw.fillRect(42, 26, 4, 4);
  tmp_draw.fillRect(46, 30, 4, 4);
  tmp_draw.fillRect(42, 34, 4, 4);
  tmp_draw.fillRect(38, 38, 4, 4);
  tmp_draw.fillRect(34, 42, 4, 4);
}

function canvas_trash_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(26, 17, 3, 3);
  tmp_draw.fillRect(29, 17, 6, 2);
  tmp_draw.fillRect(35, 17, 3, 3);
  tmp_draw.fillRect(21, 20, 22, 3);
  tmp_draw.fillRect(21, 26, 22, 4);
  tmp_draw.fillRect(21, 30, 4, 13);
  tmp_draw.fillRect(27, 30, 4, 13);
  tmp_draw.fillRect(33, 30, 4, 13);
  tmp_draw.fillRect(39, 30, 4, 13);
  tmp_draw.fillRect(21, 43, 22, 4);
}

function canvas_trash_background_draw(element, color){
  let tmp_draw = element.getContext("2d");
  tmp_draw.clearRect(0, 0, 64, 64);
  tmp_draw.fillStyle = color;

  tmp_draw.fillRect(130, 85, 15, 15);
  tmp_draw.fillRect(145, 85, 30, 10);
  tmp_draw.fillRect(175, 85, 15, 15);
  tmp_draw.fillRect(105, 100, 110, 15);
  tmp_draw.fillRect(105, 130, 110, 20);
  tmp_draw.fillRect(105, 150, 20, 65);
  tmp_draw.fillRect(135, 150, 20, 65);
  tmp_draw.fillRect(165, 150, 20, 65);
  tmp_draw.fillRect(195, 150, 20, 65);
  tmp_draw.fillRect(105, 215, 110, 20);
}
