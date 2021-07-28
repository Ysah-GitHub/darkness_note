function app_ready(){
  app_main();
  app_aside();
}

function app_main(){
  let tmp_main = document.createElement("main");
  tmp_main.className = "scrollbar_custom";

  tmp_main.append(note_list());
  document.body.prepend(tmp_main);
}

function app_aside(){
  let tmp_aside = document.createElement("aside");

  tmp_aside.append(menu());
  document.getElementsByTagName("main")[0].before(tmp_aside);
}
