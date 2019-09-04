post_body = document.getElementById("input");
post_url = "/api/run";
post_mime = "text/plain";
resp_body = document.getElementById("output");
resp_mime = "text/plain";

function do_post() {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			resp_body.value = this.response;
			resp_mime.innerText = this.getResponseHeader("Content-Type");
		}
	}

	xhr.open("POST", post_url, true);
	xhr.setRequestHeader("Content-Type", post_mime);
	xhr.send(post_body.value);
}

$("textarea").keypress(function(event) {
        if (event.keyCode == 13 && event.shiftKey) {
         do_post(); //Submit your form here
         return false;
         }
});

function syntaxHighlight() {
  var text = document.getElementById("input").value;
  console.log(text);
  //still testing
}

var num="";
keyUp();
function keyUp(){
  var input = document.getElementById("input");
  var code = input.value;
  code = code.replace(/\r/gi,"");
  code = code.split("\n");
  var n = code.length;
  line(n);
}
function line(n){
  var lineobj = document.getElementById("row_numbers");
  for(var i=1;i<=n;i++){
    if(document.all){
      num+=i+"\r\n";
    }else{
      num+=i+"\n";
    }
  }
  lineobj.value=num;
  num="";
}

function autoScroll(){
  var nV = 0;
  if(!document.all) {
    nV=document.getElementById("input").scrollTop;
    document.getElementById("row_numbers").scrollTop=nV;
    setTimeout("autoScroll()", 20);
  }
}
if(!document.all){
  window.addEventListener("load", autoScroll,false);
}
