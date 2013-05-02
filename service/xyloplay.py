# Music API for the Hard Drive Xylophone controller.
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

### Class Notes ###
class Notes(object):
	DO = 0
	RE = DO + 2
	MI = RE + 2
	FA = MI + 1
	SOL = FA + 2
	LA = SOL + 2
	SI = LA + 2
	HIGH_DO = SI + 1

### Class XyloPlay ###
class XyloPlay(object):
	def __init__(self, backend):
		self.backend = backend
		self._commands = []
		
	def play(self, pitch, time = None):
		"""
		Plays the given pitch at the given time (in seconds). If no time is given, the note
		will be played immediately.
		
		Use the Notes class to translate between note names and pitches.
		"""
		
		pin = None
		delay = 0
		if time:
			delay = int(time * 1000)
		for command in PlaySequences.pitches[pitch]:
			if isinstance(command, PlaySequences.Pin):
				pin = command.pin
			elif isinstance(command, PlaySequences.Delay):
				delay += command.delay
			else:
				self._commands.append((command, pin, delay))
		if time == None:
			self.send_commands()
			
	def play_song(self, note_list, time_unit = 0.5, start_time = 0, auto_play = True):
		current_time = start_time
		for note_spec in note_list:
			if isinstance(note_spec, tuple):
				pitch, delay_units = note_spec
			else:
				pitch = note_spec
				delay_units = 1
			self.play(pitch, current_time)
			current_time += delay_units * time_unit
		if auto_play:
			self.send_commands()
		return current_time
	
	def reset(self):
		self._commands = []
		self.backend.reset()
	
	def send_commands(self):
		self._commands.sort(lambda cmd1, cmd2: cmd1[2] - cmd2[2])
		for direction, pin, delay in self._commands:
			self.backend.pin_command(direction, pin, delay)
		self._commands = []

### Class PlaySequences ###
class PlaySequences:
	class Pin:
		def __init__(self, pin):
			self.pin = pin
			
		def __repr__(self):
			return "Pin(%d)" % self.pin
	
	class Delay(object):
		def __init__(self, delay):
			self.delay = delay
			
		def __repr__(self):
			return "Delay(%d)" % self.delay
	
	Forward = 1
	Backward = -1
	Zero = 0		
#28
	pitches = {
		Notes.DO: (
			Pin(38),
			Backward, Delay(300),
			Forward, Delay(10), 
			Zero, Delay(13), 
			Backward, Delay(1), 
			Zero
		),
		Notes.RE: (
			Pin(38),
			#Backward, Delay(2),
			Forward, Delay(80),
			Zero, Delay(10),
			Backward, Delay(20),
			Forward, Delay(2),
			Zero
		),
		Notes.MI: (
			Pin(18),
			Backward, Delay(2),
			Forward, Delay(80), 
			Zero, Delay(10),
			Backward, Delay(20),
			Forward, Delay(2), 
			Zero
		),
		Notes.FA: (
			Pin(18), 
			Backward, Delay(60),
			Forward, Delay(15), 
			Zero, Delay(10),
			Backward, Delay(1), 
			Zero
		),
		Notes.SOL: (
			Pin(28),
			Backward, Delay(2),
			Forward, Delay(80),
			Zero, Delay(15),
			Backward, Delay(5),
			Forward, Delay(2),
			Zero
		),
		Notes.LA: (
			Pin(28),
			Backward, Delay(60),
			Forward, Delay(10),
			Zero, Delay(10),
			Backward, Delay(1),
			Zero
		),
		Notes.SI: (
			Pin(24),
			Backward, Delay(100),
			Forward, Delay(2),
			Zero, Delay(13),
			#Backward, Delay(1),
			Zero
		),
		Notes.HIGH_DO: (
			Pin(24),
			Backward, Delay(2),
			Forward, Delay(80),
			Zero, Delay(15),
			Backward, Delay(25),
			Forward, Delay(2),
			Zero
		),
	}
