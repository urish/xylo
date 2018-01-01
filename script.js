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

function XyloController($scope, $http, $document, $timeout, xyloSynth, xyloBackend) {
	$scope.playing = {};

	$scope.play = function (index) {
		xyloSynth.play(index);
		$scope.$emit("playNote", {
			pitch: index
		});
		xyloBackend.play(index);
		if ($scope.playing[index]) {
			$timeout.cancel($scope.playing[index]);
			$scope.playing[index] = false;
		}
		$timeout(function () {
			$scope.playing[index] = $timeout(function () {
				$scope.playing[index] = false;
			}, 500);
		});
	};

	$scope.getAnimation = function (index) {
		return $scope.playing[index] ? 'animate' : '';
	}

	$document.bind('keypress', function (e) {
		var keyMap = {
			49: 0, 50: 2, 51: 4, 52: 5, 53: 7, 54: 9, 55: 11, 56: 12
		};
		var index = keyMap[event.keyCode];
		if (index !== undefined) {
			$scope.$apply(function () {
				$scope.play(index);
			});
		}
	});
}

var app = angular.module('XyloDisk', []);

app.service("xyloSynth", function ($http, $q, $rootScope) {
	var audioContext = typeof AudioContext != 'undefined' ? new AudioContext() : null;

	var audioBuffer = $http({
		method: "GET",
		url: "do7.wav",
		responseType: "arraybuffer"
	}).then(function (response) {
			var deferred = $q.defer();
			audioContext.decodeAudioData(response.data, function(decodedData) {
				$rootScope.$apply(function() {
					deferred.resolve(decodedData);
				});
			});
			return deferred.promise;
		});

	this.play = function (pitch) {
		var source = audioContext.createBufferSource();
		source.connect(audioContext.destination);
		audioBuffer.then(function (buffer) {
			source.playbackRate.value = Math.pow(2, pitch / 12.);
			source.buffer = buffer;
			source.start(0);
		});
	};
});

app.service("xyloBackend", function ($http) {
	this.play = function (pitch) {
		$http.get("/play/" + pitch);
	};
});
