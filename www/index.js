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

$(document).ready(function(){
    var code = $(".codemirror-textarea")[0];
    var editor = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
		mode: "python"
    });
});
