window.onload = async function() {
	test_cont = document.getElementById("test_container");
}

function run(code, tables = [], ctype = "application/json") {
	var xhr = new XMLHttpRequest();
	var resp;
	
	xhr.onreadystatechange = function() {
		if (this.readyState != 4) {
			return;
		}
		
		resp = JSON.parse(this.response);
		resp.status = this.status;
	}
	
	body = {
		souffle_code: code,
		tables: tables,
	};
	
	xhr.open("POST", "../api/run", false);
	xhr.setRequestHeader("Content-Type", ctype);
	xhr.send(JSON.stringify(body));
	
	return resp;
}

function run_badjson() {
	var xhr = new XMLHttpRequest();
	var resp;
	
	xhr.onreadystatechange = function() {
		if (this.readyState != 4) {
			return;
		}
		
		resp = JSON.parse(this.response);
		resp.status = this.status;
	}
	
	xhr.open("POST", "../api/run", false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send("{\"foo\": \"bar\""); // Missing closing brace
	
	return resp;
}

function assertEqual(a, b) {
	if (a != b) {
		throw `${a} != ${b}`;
	}
}

function assertNotEqual(a, b) {
	if (a == b) {
		throw `${a} == ${b}`;
	}
}

var tests = {
	testRegularRun: function() {
		var code = ".decl foo(x:number)\n.output foo\nfoo(2).";
		var resp = run(code);
		
		assertEqual(resp.status, 200);
		assertEqual(resp.return_code, 0);
		assertEqual(resp.stderr, "");
		assertEqual(resp.stdout, "---------------\nfoo\nx\n===============\n2\n===============\n");
	},
	
	testRegularRunWithTables: function() {
		var code = ".decl foo(x:number)\n.input foo\n.output foo";
		
		var tables = [
			{
				"name": "foo",
				"ncols": 1,
				"data": [
					[5]
				]
			}
		];
		
		var resp = run(code, tables);
		
		assertEqual(resp.status, 200);
		assertEqual(resp.return_code, 0);
		assertEqual(resp.stderr, "");
		assertEqual(resp.stdout, "---------------\nfoo\nx\n===============\n5\n===============\n");
	},
	
	testStderr: function() {
		var resp = run("asdf");
		
		assertNotEqual(resp.return_code, 0);
		assertNotEqual(resp.stderr, "");
	},
	
	testWrongContentType: function() {
		var resp = run("", [], "text/plain");
		assertEqual(resp.status, 400);
	},
	
	testMalformedRequest: function() {
		var tables = [
			{
				"name": "asdf",
				// data intentionally missing
				"ncols": 4
			}
		];
		
		var resp = run("", tables);
		
		assertEqual(resp.status, 400);
	},
	
	testMalformedJson: function() {
		var resp = run_badjson();
		assertEqual(resp.status, 400);
	},
}

async function run_tests() {
	test_cont.innerHTML = "";
	
	for ([name, fn] of Object.entries(tests)) {
		test_cont.innerHTML += `running ${name}... `;
		
		try {
			fn();
			test_cont.innerHTML += "<span class='pass'>pass</span>";
		}
		catch (e) {
			test_cont.innerHTML += "<span class='fail'>fail</span>";
			console.log(e);
		}
		
		test_cont.innerHTML += "<br/>";
	}
}
