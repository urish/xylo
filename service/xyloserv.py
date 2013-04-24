# This is a simple web service to control the Hard Drive Xylophone project.
#
# Hard Drive Xylophone Project
# Copyright 2013, Omri Baumer & Uri Shaked
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import BaseHTTPServer, SocketServer
from urlparse import urlparse
import re
import time
import xyloback

PORT = 8281

g_dns_cache = {}
g_xylo = xyloback.XyloBackend()

class XyloRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
	def send_no_content(self):
		self.send_response(204)
		self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
		self.send_header("Pragma", "no-cache")
		self.end_headers()

	def do_GET(self):
		handlers = [
			"forward",
			"backward",
			"zero",
		]
		normalized_path = urlparse(self.path).path.lower().lstrip("/")
		match = re.match(r"^play/([\d]+)$", normalized_path)
		if match:
			self.play_now(int(match.group(1)))
			self.send_no_content()
		else:
			self.send_response(404)
			self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
			self.send_header("Pragma", "no-cache")
			self.end_headers()
	
	def play_now(self, note):
		global g_xylo
		pin = 10 + note * 2
		g_xylo.forward(pin)
		time.sleep(0.2)
		g_xylo.backward(pin)
		time.sleep(0.2)
		g_xylo.zero(pin)
	
	def address_string(self):
		global g_dns_cache
		remote_ip = self.client_address[0]
		if not remote_ip in g_dns_cache:
			g_dns_cache[remote_ip] = BaseHTTPServer.BaseHTTPRequestHandler.address_string(self)
		return g_dns_cache[remote_ip]

class ThreadingHTTPServer(SocketServer.ThreadingMixIn, SocketServer.TCPServer, BaseHTTPServer.HTTPServer):
	pass

print("Listening on port %d..." % PORT)
httpd = ThreadingHTTPServer(('', PORT), XyloRequestHandler)
httpd.serve_forever()	
