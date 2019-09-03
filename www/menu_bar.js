var url = window.location.toString().split("/");
var links = document.getElementById("menu_list").getElementsByTagName("a");

var i=0;
var currentPage = url[url.length - 1];

for(i; i<links.length; i++) {
  var tag = links[i].href.split("/");
  if(tag[tag.length-1] == currentPage) {
    links[i].className = "current";
  }
}
