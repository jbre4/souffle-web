import http.server
import subprocess
import os
import sys
import random
import string
import tempfile
import shutil
import json
from threading import Lock

# To start the server:
# python server.py [port]

# Some common HTTP response codes:
# 200 - OK, the request was fulfilled.
# 400 - Bad Request, something is wrong and it's the clients fault
# 403 - Permission Denied
# 404 - Not Found
# 408 - Request Timeout
# 500 - Internal Server Error, something is wrong and it's our fault
# 501 - Not Implemented

config = json.loads(open("config.json").read())
time_limit = config["time_limit"]
mem_limit = config["mem_limit"]

port = 8000
tokens = set()

if len(sys.argv) == 2:
	port = int(sys.argv[1])

session_mutex = Lock()

def generate_token():
	session_mutex.acquire()
	
	token = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
	while (token in tokens):
		token = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
	tokens.add(token)
	
	session_mutex.release()
	return token

def delete_token(token):
	session_mutex.acquire()
	tokens.remove(token)
	session_mutex.release()

def generate_fact_file(dictionary, path):
	file_name = dictionary["name"]
	ncols = dictionary["ncols"]
	data = dictionary["data"]
	output_file = os.path.join(path, file_name + ".facts")
	file = open(output_file, "w+")
	for row in data:
		file.write("\t".join(str(e) for e in row))
		file.write("\n")
	file.close()

def create_temp_dir(token):
	path = os.path.join(tempfile.gettempdir(), "souffle-web-session", token)
	if os.path.exists(path):
		shutil.rmtree(path)
	os.makedirs(path)
	return path

def run_souffle(src, dir):
	args = ["./third-party/timeout", "-t", str(time_limit), "-m", str(mem_limit), "--no-info-on-success", "-c", "souffle", "/dev/stdin", "-D", "-"]
	if dir != None:
		args.extend(["-F", dir])
	return subprocess.run(args, input=src, encoding="utf8", capture_output=True, text=True)

class RequestHandler(http.server.BaseHTTPRequestHandler):
	def api_do_run(self, basedir):
		length = int(self.headers["Content-Length"])
		type = self.headers["Content-Type"]
		
		if type != "application/json":
			self.send_error(400, "Wrong Content-Type, expected application/json")
			return
		
		body = self.rfile.read(length)
		req = json.loads(body)
		
		for table in req["tables"]:
			generate_fact_file(table, basedir)
		
		resp = {};

		try:
			proc = run_souffle(req["souffle_code"], basedir)
		except FileNotFoundError:
			self.send_error(500, "Souffle is not installed")
			return
		
		if proc.returncode in range(128, 128 + 65):
			self.send_error(408, "Forcibly killed due to time or memory limit reached")
			return;
		
		resp["return_code"] = proc.returncode;
		resp["stdout"] = proc.stdout;
		resp["stderr"] = proc.stderr;
		
		respbytes = bytearray(json.dumps(resp), "utf8")

		self.send_response(200)
		self.send_header("Content-Type", "application/json")
		self.send_header("Content-Length", len(respbytes))
		self.end_headers()

		self.wfile.write(respbytes)

	def do_POST(self):
		if self.path == "/api/run":
			self.error_message_format = "{\"error\": \"%(message)s\"}"
			self.error_content_type = "application/json"
			
			session = generate_token()
			basedir = create_temp_dir(session)

			try:
				self.api_do_run(basedir)
			except json.decoder.JSONDecodeError:
				self.send_error(400, "Malformed JSON (invalid syntax)")
			except KeyError:
				self.send_error(400, "Malformed request object (missing field?)")

			shutil.rmtree(basedir)
			delete_token(session)
		else:
			self.send_error(404)

sv = http.server.ThreadingHTTPServer(("", port), RequestHandler)
print("Starting server on port " + str(port))
sv.serve_forever()
