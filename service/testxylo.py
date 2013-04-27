# Test script for the Hard Drive Xylophone controller.
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

import time
import xyloback

g_xylo = xyloback.XyloBackend()
g_play_counter = 100 #ms

def delay(ms):
	global g_play_counter
	g_play_counter += ms

def play_now(note):
	global g_xylo
	global g_play_counter
	pin = 10 + note * 2
	g_xylo.backward(pin, g_play_counter)
	delay(1)
	g_xylo.forward(pin, g_play_counter)
	delay(100)	
	g_xylo.backward(pin, g_play_counter)
	delay(100)	
	g_xylo.zero(pin, g_play_counter)
	
def setup(note):
	global g_xylo
	global g_play_counter
	pin = 10 + note * 2
	g_xylo.forward(pin, g_play_counter)
	delay(50)
	g_xylo.backward(pin, g_play_counter)
	delay(50)
	g_xylo.zero(pin, g_play_counter)

def hd1_play_one(note):
	global g_xylo
	global g_play_counter
	pin = 10 + note * 2
	g_xylo.forward(pin, g_play_counter)
	delay(60)
	g_xylo.backward(pin, g_play_counter)
	delay(23)
	g_xylo.forward(pin, g_play_counter)
	delay(1)
	g_xylo.zero(pin, g_play_counter)
	
def hd1_play_two(note):
	global g_xylo
	global g_play_counter
	pin = 10 + note * 2
	g_xylo.backward(pin, g_play_counter)
	delay(60)
	g_xylo.forward(pin, g_play_counter)
	delay(15)
	g_xylo.zero(pin, g_play_counter)
	delay(13)
	g_xylo.backward(pin, g_play_counter)
	delay(1)
	g_xylo.zero(pin, g_play_counter)
	
DELAY_CONST = 500
def play_note(note_spec, delay_ms):
	type, pin = note_spec
	if type == 0:
		hd1_play_one(pin)
	elif type == 1:
		hd1_play_two(pin)
	elif type == 2:
		play_now(pin)
	delay(delay_ms * DELAY_CONST)

DO = [1, 5]
RE = [0, 9]
MI = [0, 7]
FA = [1, 4]
SOL = [0, 5]
LA = [0, 4]

def play_scale():
	play_note(DO, 1)
	play_note(RE, 1)
	play_note(MI, 1)
	play_note(FA, 1)
	play_note(SOL, 1)
	play_note(LA, 1)

def play_twinkle():
	play_note(DO, 1)
	play_note(DO, 1)
	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(LA, 1)
	play_note(LA, 1)
	play_note(SOL, 2)
	
	play_note(FA, 1)
	play_note(FA, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(RE, 1)
	play_note(RE, 1)
	play_note(DO, 2)
	
	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(FA, 1)
	play_note(FA, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(RE, 2)

	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(FA, 1)
	play_note(FA, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(RE, 2)

	play_note(DO, 1)
	play_note(DO, 1)
	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(LA, 1)
	play_note(LA, 1)
	play_note(SOL, 2)
	
	play_note(FA, 1)
	play_note(FA, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(RE, 1)
	play_note(RE, 1)
	play_note(DO, 2)

def play_johnatan():
	play_note(SOL, 1)
	play_note(MI, 1)
	play_note(MI, 2)
	
	play_note(FA, 1)
	play_note(RE, 1)
	play_note(RE, 2)

	play_note(DO, 1)
	play_note(RE, 1)
	play_note(MI, 1)
	play_note(FA, 1)
	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(SOL, 2)

	play_note(SOL, 1)
	play_note(MI, 1)
	play_note(MI, 2)
	
	play_note(FA, 1)
	play_note(RE, 1)
	play_note(RE, 2)

	play_note(DO, 1)
	play_note(MI, 1)
	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(DO, 2)
	
	play_note(RE, 1)
	play_note(RE, 1)
	play_note(RE, 1)
	play_note(RE, 1)
	play_note(RE, 1)
	play_note(MI, 1)
	play_note(FA, 2)

	play_note(MI, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(MI, 1)
	play_note(FA, 1)
	play_note(SOL, 2)

	play_note(SOL, 1)
	play_note(MI, 1)
	play_note(MI, 2)
	
	play_note(FA, 1)
	play_note(RE, 1)
	play_note(RE, 2)

	play_note(DO, 1)
	play_note(MI, 1)
	play_note(SOL, 1)
	play_note(SOL, 1)
	play_note(DO, 2)
	
if __name__ == "__main__":	
	setup(5)
	setup(4)
	
	delay(1000)
	
	play_johnatan()
	