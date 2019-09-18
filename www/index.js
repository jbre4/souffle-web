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

  xhr = new XMLHttpRequest();
  xhr.open("POST", post_url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var name = document.getElementById("name_of_table").value;
  var ncols = document.getElementById("num_of_col").value;
  var data = getTable();
  var table = JSON.stringify({"name": name, "ncols": ncols, "data": data});
  xhr.send(table);
}

$("textarea").keypress(function(event) {
        if (event.keyCode == 13 && event.shiftKey) {
         do_post(); //Submit your form here
         return false;
         }
});

function getTable() {
  var table = document.getElementById("input_table");
  var num_of_rows = table.rows.length;
  var num_of_col = table.rows[0].cells.length;
  var content = "";
  for(var i=0; i<num_of_rows; i++) {
    for(var j=0; j<num_of_col; j++) {
      content += table.rows[i].cells[j].innerHTML;
      content += "\t";
    }
    content += "\n";
  }
  return content;
}

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

function create_table(){
  var num_of_col = document.getElementById("num_of_col").value;
  var table = document.getElementById("input_table");

  table.innerHTML = "";
  if(num_of_col!=0){
    var row = table.insertRow(0);
    for(var i=0; i<num_of_col; i++){
      var cell = row.insertCell(0);
      cell.contentEditable = "true";
    }
  }
  if(table.rows.length > 0){
    document.getElementById("addRow").style.display = "inline";
    document.getElementById("resetTable").style.display = "inline";
  }
}

function addRow(){
  var num_of_col = document.getElementById("num_of_col").value;
  var table = document.getElementById("input_table");
  var num_of_rows = table.rows.length;
  var row = table.insertRow(num_of_rows);
  for(var i=0; i<num_of_col; i++) {
    var cell = row.insertCell(0);
    cell.contentEditable = "true"
  }
}

function resetTable(){
  document.getElementById("input_table").innerHTML = "";
  addRow();
}
