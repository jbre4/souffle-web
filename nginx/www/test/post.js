post_body = document.getElementById("post_body");
post_url = document.getElementById("post_url");
post_mime = document.getElementById("post_mime");
resp_body = document.getElementById("resp_body");
resp_mime = document.getElementById("resp_mime");

function do_post() {
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			resp_body.innerText = this.response;
			resp_mime.innerText = this.getResponseHeader("Content-Type");
		}
	}
	
	xhr.open("POST", post_url.value, true);
	xhr.setRequestHeader("Content-Type", post_mime.value);
	xhr.send(post_body.value);
}
