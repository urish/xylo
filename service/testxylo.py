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

from xyloback import XyloBackend
from xyloplay import XyloPlay, Notes

### Class Songs ###
class Songs:
	DO = Notes.DO
	RE = Notes.RE
	MI = Notes.MI
	FA = Notes.FA
	SOL = Notes.SOL
	LA = Notes.LA
	SI = Notes.SI
	HIGH_DO = Notes.HIGH_DO

	SCALE = [
		DO, RE, MI, FA, SOL, LA, SI, HIGH_DO
	]
	
	HIGH_SCALE = [
		SI, HIGH_DO, SI, HIGH_DO
	]

	TWINKLE = [
		DO, DO, SOL, SOL, LA, LA, (SOL, 2),
		FA, FA, MI, MI, RE, RE, (DO, 2),
		SOL, SOL, FA, FA, MI, MI, (RE, 2),
		SOL, SOL, FA, FA, MI, MI, (RE, 2),
		DO, DO, SOL, SOL, LA, LA, (SOL, 2),
		FA, FA, MI, MI, RE, RE, (DO, 2),
	]
	
	JONATHAN = [
		SOL, MI, MI, FA, RE, (RE, 2),
		DO, RE, MI, FA, SOL, SOL, (SOL, 2),
		SOL, MI, MI, FA, RE, (RE, 2),
		DO, MI, SOL, SOL, (DO, 2),

		RE, RE, RE, RE, RE, MI, (FA, 2),
		MI, MI, MI, MI, MI, FA, (SOL, 2),

		SOL, MI, MI, FA, RE, (RE, 2),
		DO, MI, SOL, SOL, (DO, 2),
	]
	
	OH_SUSANNA = [
		(DO, .5), (RE, .5), MI, SOL, SOL, LA, SOL, MI, (DO, 1.5),
		(RE, .5), MI, MI, RE, DO, (RE, 3),
		(DO, .5), (RE, .5), MI, SOL, (SOL, 1.5), (LA, .5), SOL, MI, (DO, 1.5),
		(RE, .5), MI, MI, RE, RE, (DO, 4),
		
		(FA, 2), (FA, 2), LA, (LA, 2), LA, SOL, SOL, MI, DO, (RE, 3),

		(DO, .5), (RE, .5), MI, SOL, SOL, LA, SOL, MI, DO,
		RE, MI, MI, RE, RE, (DO, 2),
	]
	
	HANUKKAH = [
		SOL, MI, (SOL, 2), SOL, MI, (SOL, 2), MI, SOL, HIGH_DO, SI, (LA, 2),
		FA, RE, (FA, 2), FA, RE, (FA, 2), RE, FA, SI, LA, (SOL, 2),
		SOL, MI, (SOL, 2), SOL, MI, (SOL, 2), MI, SOL, HIGH_DO, SI, (LA, 2),
		SI, SI, (SI, 2), SI, SI, (SI, 2), SI, SOL, LA, SI, (HIGH_DO, 2),
	]
	
	DOUBLES = [
		(DO, 0), MI,
		(RE, 0), FA,
		(MI, 0), SOL,
		(FA, 0), LA,
		(SOL, 0), SI,
		(DO, 0), (MI, 0), (SOL, 0),
	]

if __name__ == "__main__":	
	XyloPlay(XyloBackend()).play_song(Songs.SCALE)
	