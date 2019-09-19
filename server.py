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
# 500 - Internal Server Error, something is wrong and it's our fault
# 501 - Not Implemented

port = 8000
tokens = set()

if len(sys.argv) == 2:
	port = int(sys.argv[1])

def ext_to_mime(ext):
	mimemap = {
		".html": "text/html",
		".css":  "text/css",
		".js":   "application/javascript",
		".png":  "image/png",
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".gif":  "image/gif",
		".txt":  "text/plain",
		".json": "application/json",
		".ico":  "image/x-icon"
	}

	return mimemap.get(ext, "application/octet-stream")

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
	args = ["souffle", "/dev/stdin", "-D", "-"]
	if dir != None:
		args.extend(["-F", dir])
	return subprocess.run(args, input=bytearray(src, "utf8"), capture_output=True)

class RequestHandler(http.server.BaseHTTPRequestHandler):
	def serve_file(self):
		path = self.path

		if not os.path.isabs(path):
			self.send_error(400)
			return

		path = os.path.normpath(path)

		if path == "/":
			path = "/index.html"

		path = "www" + path

		if os.path.isdir(path):
			self.send_error(403)
			return
		elif not os.path.exists(path):
			self.send_error(404)
			return

		ext = os.path.splitext(path)[1]
		mime = ext_to_mime(ext)

		self.send_response(200)
		self.send_header("Content-Type", mime)
		self.send_header("Content-Length", os.path.getsize(path))
		self.end_headers()

		file = open(path, "rb")
		self.wfile.write(file.read())

	def do_GET(self):
		self.serve_file()

	def api_do_run(self, basedir):
		self.error_message_format = "%(message)s"
		self.error_content_type = "text/plain"
		
		length = int(self.headers["Content-Length"])
		type = self.headers["Content-Type"]
		
		if type != "application/json":
			self.send_error(400, "Wrong Content-Type, expected application/json")
		
		body = self.rfile.read(length)
		req = json.loads(body)
		
		for table in req["tables"]:
			generate_fact_file(table, basedir)

		try:
			proc = run_souffle(req["souffle_code"], basedir)
		except FileNotFoundError:
			self.send_error(500, "Souffle is not installed")
			return

		if proc.returncode != 0:
			body = proc.stderr
		else:
			body = proc.stdout

		self.send_response(200)
		self.send_header("Content-Type", "text/plain")
		self.send_header("Content-Length", len(body))
		self.end_headers()

		self.wfile.write(body)

	def do_POST(self):
		if self.path == "/api/run":
			session = generate_token()
			basedir = create_temp_dir(session)

			try:
				self.api_do_run(basedir)
			except json.decoder.JSONDecodeError:
				self.send_error(400, "Malformed JSON")
			except KeyError:
				self.send_error(400, "Malformed request object")

			shutil.rmtree(basedir)
			delete_token(session)
		else:
			self.send_error(404)

sv = http.server.ThreadingHTTPServer(("", port), RequestHandler)
print("Starting server on port " + str(port))
sv.serve_forever()
