function hide(el) {
    el.classList.add("hide");
}

function show(el) {
    el.classList.remove("hide");
}

function hidden(el, yes) {
	if (yes) {
		hide(el);
	}
	else {
		show(el);
	}
}

function byId(id) {
    return document.getElementById(id);
}

var nonEmpty = false;

var editor = CodeMirror.fromTextArea(byId("code"), {
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: false,
  mode: "souffle2",
});

editor.setSize("100%", "100%")

var resp_stdout = byId("stdout");
var resp_stderr = byId("stderr");
var run_status = byId("status");

function showStatus(str, error = false) {
    if (error) {
	run_status.classList.add("status-error");
    }
    else {
	run_status.classList.remove("status-error");
    }
    
    run_status.innerText = str;
    show(run_status);
}

function showError(str) {
    showStatus(str, true);
}

function clearStatus() {
    hide(run_status);
}

function do_post() {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState != 4) {
			return;
		}

		if (this.status != 200) {
			if (this.status == 0) {
				showError("Could not connect to the server");
				return;
			}

			try {
				showError(this.response.error);
			}
			catch (e) {
				showError(`Server does not seem to be configured correctly (returned ${this.status} ${this.statusText})`);
			}

			return;
		}

		var resp = this.response;

		if (resp.return_code != 0) {
			showError("Souffle process returned " + resp.return_code);
		}
		else {
			hide(run_status);
		}

		resp_stdout.value = resp.stdout;
		resp_stderr.value = resp.stderr;
	}

	body = {
		souffle_code: editor.getValue(),
		tables: collectTables(),
	};

	showStatus("running...");

	xhr.responseType = "json";
	xhr.open("POST", "api/run", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(body));
}

editor.addKeyMap({
	"Shift-Enter": function() {
		do_post();
	}
});

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

function clearTabs() {
    for (let tab of getAllTabs()) {
        closeTab(tab.tab_name);
    }
}

var overlay = byId("modal_overlay");

function openForm() {
	show(overlay);
	byId("name_of_table").focus();
}

function closeForm() {
  hide(overlay);
  byId("name_of_table").value = null;
  byId("num_of_col").value = null;
}

function createTable(name, nc) {
	div = createNewTab(name);

	if (div == null) {
		alert("Table name already exists");
		return null;
	}

	div.table_name = name;
	div.table_ncols = nc;

	var table = jexcel(div, {
		minDimensions: [nc, 15],
		tableOverflow: true,
		columnSorting: false,
		tableHeight: "100%",
	});

	div.jexcel_table = table;
	return table;
}

function addTable() {
  var name = byId("name_of_table").value;
  var n_cols = byId("num_of_col").value;

  if (createTable(name, n_cols) != null) {
	  closeForm();
  }
}

function trimEmptyRows(data) {
	for (let i = 0; i < data.length;) {
		var empty = true;

		for (let column of data[i]) {
			if (column != "") {
				empty = false;
			}
		}

		if (empty) {
			data.splice(i, 1);
		}
		else {
			i++;
		}
	}
}

function collectTables() {
	var tables = [];

	for (let tab of getAllTabs()) {
		table = {
			name: tab.table_name,
			ncols: tab.table_ncols,
			data: tab.jexcel_table.getData(),
		};

		trimEmptyRows(table.data);
		tables.push(table);
	}

	return tables;
}

function toggleBar() {
    byId("sidebar").classList.toggle("hidden");
    byId("sidehandle").classList.toggle("expanded");
}

tut_list_view = byId("tut_list_view");
tut_list = byId("tut_list");

tut_content_view = byId("tut_content_view");
tut_title = byId("tut_title");
tut_body = byId("tut_body");

function tut_show_index() {
    hide(tut_content_view);
    show(tut_list_view);
}

function tut_show_content() {
    hide(tut_list_view);
    show(tut_content_view);
}

async function fill_code(prefill) {
    if (prefill == "preserve") {
        return;
    }

    resp_stdout.value = "";
	resp_stderr.value = "";
	hide(run_status);

    if (prefill == undefined) {
        editor.setValue("");
        return;
    }

    var resp = await fetch("tutorial/" + prefill);

    if (!resp.ok) {
        alert("Error prefilling editor input: " + resp.statusText);
        return;
    }

    editor.setValue(await resp.text());
}

async function fill_tables(tables) {
    if (tables == "preserve") {
        return;
    }

    clearTabs();

    if (tables == undefined) {
        return;
    }

    for (let table of tables) {
        var name = table[0];
        var ncol = table[1]
        var path = table[2];

        var resp = await fetch("tutorial/" + path);

        if (!resp.ok) {
            alert("Error prefilling tables: " + resp.statusText);
            return;
        }

        var data = CSV.parse(await resp.text(), {
			delimiter: "\t",
		});

        var jtable = createTable(name, ncol);
        jtable.setData(data);
    }
}

async function fetch_editor_content(tut) {
	fill_code(tut.prefill);
	fill_tables(tut.tables);
}

var tutorials = [];

async function open_tutorial(index) {
	var tut = tutorials[index];
	var resetBtn = byId("tut_reset");

	resetBtn.onclick = function() {
		fetch_editor_content(tut);
	}

	hidden(resetBtn, tut.prefill == "preserve");

	tut_title.innerText = tut.title;

	try {
		var resp = await fetch("tutorial/" + tut.markdown);

		if (!resp.ok) {
			throw resp.statusText;
		}

		tut_body.innerHTML = marked(await resp.text());
	}
	catch (err) {
		alert("Error fetching tutorial markdown: " + err);
		return;
	}

	var nav_prev = byId("nav_previous");
	var nav_next = byId("nav_next");

	if (index > 0) {
		nav_prev.onclick = function() {
			open_tutorial(index - 1);
		}

		show(nav_prev);
	}
	else {
		hide(nav_prev);
	}

	if (index < tutorials.length - 1) {
		nav_next.onclick = function() {
			open_tutorial(index + 1);
		}

		show(nav_next);
	}
	else {
		hide(nav_next);
	}

	fetch_editor_content(tut);
	tut_show_content();
}

function insert_section(list, name) {
	var span = document.createElement("span");
	span.classList.add("tut_section");
	span.innerText = name + ":";
	list.appendChild(span);
}

function insert_tutorial(list, tut) {
	if (tut.title == undefined) {
		tut.title = tut.name;
	}

	var span = document.createElement("span");

	span.classList.add("link");
	span.innerText = tut.name;
	span.title = tut.title;

	span.onclick = function() {
		open_tutorial(tut.index);
	}

	list.appendChild(span);
}

async function fetch_tutorials() {
    var resp = await fetch("tutorial/index.json");

    if (!resp.ok) {
        throw resp.statusText;
    }

    manifest = await resp.json();

    tut_list.innerHTML = "";

    for (var i = 0; i < manifest.length; i++) {
		var item = manifest[i];

		if (item.section != undefined) {
			insert_section(tut_list, item.section);
		}
		else {
			item.index = tutorials.length;
			tutorials.push(item);
			insert_tutorial(tut_list, item);
		}
    }
}

async function main() {
    marked.setOptions({
        headerIds: false,
        baseUrl: "tutorial/",
    });

    try {
        await fetch_tutorials();
    }
    catch (err) {
        alert("Error fetching tutorials: " + err);
    }
}

window.onload = main;

function downloadZip() {
  var zip = new JSZip();
  zip.file("Soufflé-Web-Code.dl", editor.getValue());
  zip.file("Soufflé-Web-Output.txt", byId("stdout_container").value);

  for (let tab of getAllTabs()) {
    table = {
			name: tab.table_name,
			ncols: tab.table_ncols,
			data: tab.jexcel_table.getData(),
		};
    dataName = tab.table_name + ".facts";
    zip.file(dataName, toFacts(table.data));
	}

  zip.generateAsync({type:"blob"})
  .then(function(content) {
    saveAs(content, "archive.zip");
  });
}

function toFacts(data){
  var content = "";
  for(i=0;i<data.length;i++){
    for(j=0; j<data[i].length; j++){
      content += data[i][j];
      content += " ";
    }
    content += "\n";
  }
  return content;
}
