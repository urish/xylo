# Simple API to the Hard Drive Xylophone controller.
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

import os
import serial

### Constants ###
SERIAL_PORT	= os.getenv("ROBOT_PORT") or "COM8"
SERIAL_BAUD = 115200
DEBUG_TO_CONSOLE = False

### Class XyloBackend ###
class XyloBackend(object):
	def __init__(self):
		self.robot_device = serial.Serial(SERIAL_PORT, SERIAL_BAUD)
		
	def _write(self, cmd):
		if DEBUG_TO_CONSOLE:
			print ">>> Sending to Xylo: ", repr(cmd)
		self.robot_device.write(cmd + "\n")
		self.robot_device.flush()
		
		arduino_output = self.robot_device.readline()
		if DEBUG_TO_CONSOLE:
			print "<<< Xylo response: ", arduino_output.strip()
	
	def forward(self, pin):
		self._write("C 1 %d" % pin)

	def backward(self, pin):
		self._write("C -1 %d" % pin)

	def zero(self, pin):
		self._write("C 0 %d" % pin)
	
	def raw_command(self, cmd):
		self._write(cmd)
