window.addEventListener("resize", app_vh);
window.addEventListener("load", function(){
  app_vh();
});

function app_vh(){
  let tmp_document_style = document.documentElement.style;
  tmp_document_style.setProperty("--vh", window.innerHeight + "px");
}
