app_vh();

window.addEventListener("resize", app_vh);

function app_vh(){
  let tmp_document_style = document.documentElement.style;
  tmp_document_style.setProperty("--vh", window.innerHeight + "px");
}
