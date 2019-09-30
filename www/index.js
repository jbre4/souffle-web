var nonEmpty = false;
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true
});

post_url = "/api/run";
post_mime = "text/plain";
resp_body = document.getElementById("output");
resp_mime = "text/plain";
var tables = [];
var jexcels = [];

function do_post() {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			resp_body.value = this.response;
			resp_mime.innerText = this.getResponseHeader("Content-Type");
		}
	}

  xhr.open("POST", post_url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var name = document.getElementById("name_of_table").value;
  var ncols = document.getElementById("num_of_col").value;
  getJexcels();
  var inputs = JSON.stringify({"souffle_code": editor.getValue(), "tables": tables});
  xhr.send(inputs);
}

document.querySelector("#submit_input").onkeypress = function(event) {
  if (event.keyCode == 13 && event.shiftKey) {
    do_post(); //Submit your form here
    return false;
  }
};

function byId(id) {
    return document.getElementById(id);
}

tab_container = byId("tab_container");
table_container = byId("table_container");

function genTabButtonId(name) {
    return `tab_header_button_${name}`;
}

function genTabBodyId(name) {
    return `tab_body_area_${name}`;
}

function genTabButton(name) {
    span = document.createElement("span");
    span.id = genTabButtonId(name);
    span.classList.add("tab_button");
    span.innerText = name;
    return span;
}

function genTabBody(name) {
    div = document.createElement("div");
    div.id = genTabBodyId(name);
    div.classList.add("tab_body");
    div.tab_name = name;
    return div;
}

function tabExists(name) {
    return byId(genTabButtonId(name)) != null;
}

function getTab(name) {
    var button = byId(genTabButtonId(name));
    var body = byId(genTabBodyId(name));

    if (button == null) {
        return null;
    }

    return {
        button: button,
        body: body
    }
}

function getCurrentTab() {
    var button = document.querySelector("#tab_container > .tab_button.current");
    var body = document.querySelector("#table_container > .tab_body.current");

    if (button == null) {
        return null;
    }

    return {
        button: button,
        body: body
    }
}

function switchTab(name) {
    var cur_tab = getCurrentTab();

    if (cur_tab != null) {
        cur_tab.button.classList.remove("current");
        cur_tab.body.classList.remove("current");
    }

    var tab = getTab(name);
    tab.button.classList.add("current");
    tab.body.classList.add("current");
}

// Create a new tab with a name.
// Returns an empty div which you can put stuff inside of.
// Div switching logic is handled automatically.
function createNewTab(name) {
    if (tabExists(name)) {
        return null;
    }

    var tab_button = genTabButton(name);
    var tab_body = genTabBody(name);

    tab_button.onclick = function() {
        switchTab(name);
    }

    tab_container.appendChild(tab_button);
    table_container.appendChild(tab_body);

    switchTab(name);
    return tab_body;
}

// Returns a list all tab divs. Each div contains a property tab_name containing the
// tab name passed in when it was created with createNewTab.
function getAllTabs() {
    return document.querySelectorAll("#table_container > .tab_body");
}



function openForm() {
  document.getElementById("form_container").style.display = "block";
}

function closeForm() {
  document.getElementById("form_container").style.display = "none";
}

function checkName(name) {
  for(var i=0; i<tables.length; i++){
    if(tables[i]["name"]==name){
      return i;
    }
  }
  return -1;
}

function addTable(){
  document.getElementById("submit_input").style.width = "50%";
  var name = document.getElementById("name_of_table").value;
  var n_cols = document.getElementById("num_of_col").value;
  console.log(name);
  var table = {};
  table["name"] = name;
  table["ncols"] = n_cols;
  table["data"] = [];

  var index = checkName(name);
  if(index != -1){
    console.log(index);
    tables.splice(index, 1);
    tables.splice(index, 0, table);
  } else {
    tables.push(table);
    document.getElementById("table_container").innerHTML += `<div  id=${name}></div>`;
  }

  loadTable();

  document.getElementById("form_container").style.display = "none";
  document.getElementById("name_of_table").value = null;
  document.getElementById("num_of_col").value = null;
  createNewTab(name);
}

function loadTable(){
  for(var i = 0; i<tables.length; i++){
    name = tables[i]["name"];
    document.getElementById(name).innerHTML = null;

    var table = jexcel(document.getElementById(name),{
        minDimensions:[tables[i]["ncols"], 15],
        tableOverflow:true,
        columnSorting:false,
        //onchange: loadChange(table)
    });
    var index = checkName(name);
    if(index != -1){
      jexcels.splice(index, 1);
      jexcels.splice(index, 0, table);
    } else {
      jexcels.push(table);
    }
  }
}

function getJexcels(){
  for(var i=0; i<tables.length; i++){
    tables[i]["data"] = jexcels[i].getData();
    //console.log(tables[i]["data"]);
  }
}

var num="";

function uploadFile(){
  var file = document.getElementById("file").files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    editor.setValue(e.target.result);
  };
  reader.readAsText(file);
}
