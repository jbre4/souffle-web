var nonEmpty = false;
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  mode: "souffle",
});

editor.setSize("100%", "100%")

resp_body = document.getElementById("output");

function do_post() {
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			resp_body.value = this.response;
		}
	}
	
	body = {
		souffle_code: editor.getValue(),
		tables: collectTables(),
	};
	
	xhr.open("POST", "/api/run", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(body));
}

document.querySelector("#code").onkeypress = function(event) {
  if (event.keyCode == 13 && event.shiftKey) {
    do_post();
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
    
    text = document.createElement("span");
    text.classList.add("tab_text");
    text.innerText = name;
    span.appendChild(text);
    
    xbtn = document.createElement("span");
    xbtn.classList.add("xbtn");
    xbtn.innerText = "✖";
    
    xbtn.onclick = function(e) {
		closeTab(name);
		e.stopPropagation();
	};
	
	span.appendChild(xbtn);
    
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

function closeTab(name) {
	tab = getTab(name);
	
	if (tab == null) {
		return;
	}
    
    if (tab.button.classList.contains("current")) {
        fallback_tab = getAllTabs()[0];
        
        if (fallback_tab != null) {
            switchTab(fallback_tab.tab_name);
        }
    }
	
	tab_container.removeChild(tab.button);
	table_container.removeChild(tab.body);
}

// Returns a list all tab divs.
function getAllTabs() {
    return document.querySelectorAll("#table_container > .tab_body");
}

var overlay = byId("modal_overlay");

function openForm() {
  overlay.classList.remove("hide");
}

function closeForm() {
  overlay.classList.add("hide");
  byId("name_of_table").value = null;
  byId("num_of_col").value = null;
}

function addTable() {
  var name = byId("name_of_table").value;
  var n_cols = byId("num_of_col").value;

  div = createNewTab(name);
  
  if (div == null) {
	  alert("Table name already exists");
  }
  
  div.table_name = name;
  div.table_ncols = n_cols;
  
  div.jexcel_table = jexcel(div, {
	  minDimensions: [n_cols, 15],
	  tableOverflow: true,
	  columnSorting: false,
      tableHeight: "100%",
  });
  
  closeForm();
}

function collectTables() {
	var tables = [];
	
	for (let tab of getAllTabs()) {
		table = {
			name: tab.table_name,
			ncols: tab.table_ncols,
			data: tab.jexcel_table.getData(),
		};
		
		tables.push(table);
	}
	
	return tables;
}

function toggleBar() {
    byId("sidebar").classList.toggle("expanded");
}
