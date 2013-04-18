/**
 * Hard Drive Xylophone Project
 * Copyright 2013, Omri Baumer & Uri Shaked
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

function XyloController($scope, $http) {
	var audioContext = typeof webkitAudioContext != 'undefined' ? new webkitAudioContext() : null;

	var audioBuffer = $http({
		method: "GET",
		url: "do7.wav",
		responseType: "arraybuffer"
	}).then(function(response) {
		return audioContext.createBuffer(response.data, false);
	});

	$scope.play = function(index) {
		var source = audioContext.createBufferSource();
		source.connect(audioContext.destination);
		audioBuffer.then(function(buffer) {
			source.playbackRate.value = Math.pow(2,index/12.);
			source.buffer = buffer;
			source.noteOn(0);
		});
	};
}
