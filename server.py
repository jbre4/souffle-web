import http.server
import os
import sys

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

if len(sys.argv) == 2:
	port = int(sys.argv[1])

def ext_to_mime(ext):
	if ext == ".html":
		return "text/html"
	elif ext == ".css":
		return "text/css"
	elif ext == ".js":
		return "application/javascript"
	elif ext == ".png":
		return "image/png"
	elif ext == ".jpeg" or ext == ".jpg":
		return "image/jpeg"
	elif ext == ".gif":
		return "image/gif"
	elif ext == ".txt":
		return "text/plain"
	elif ext == ".json":
		return "application/json"
	elif ext == ".ico":
		return "image/x-icon"
	
	return "application/octect-stream"

class RequestHandler(http.server.BaseHTTPRequestHandler):
	def serve_file(self):
		path = self.path
		
		if not os.path.isabs(path):
			self.send_error(400)
			return
		
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
	
	def api_do_run(self):
		len = int(self.headers["Content-Length"])
		
		self.send_response(200)
		self.send_header("Content-Type", self.headers["Content-Type"])
		self.send_header("Content-Length", str(len))
		self.end_headers()
		
		self.wfile.write(self.rfile.read(len))
	
	def do_POST(self):
		if self.path == "/api/run":
			self.api_do_run()
		else:
			self.send_error(404)

sv = http.server.ThreadingHTTPServer(("", port), RequestHandler)
print("Starting server on port " + str(port))
sv.serve_forever()
