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

app.directive("xyloSimulator", function ($q, $rootScope) {
	var clock = new THREE.Clock();
	var renderer, scene;
	var camera;
	var composer;
	var activeDisk = null;

	function loadModel(jsonUrl) {
		var deferred = $q.defer();
		var loader = new THREE.CTMLoader();
		loader.loadParts(jsonUrl, function (geometries, materials) {
			$rootScope.$apply(function () {
				deferred.resolve({geometries: geometries, materials: materials});
			});
		}, { useWorker: true, useBuffers: true });
		return deferred.promise;
	}

	function devicePixelRatio() {
		return window.devicePixelRatio || 1;
	}


	function createBottle() {
		return loadModel("obj/bottle.json").then(function (result) {
			var node = new THREE.Object3D();
			for (var i = 0; i < result.geometries.length; i++) {
				var material = result.materials[i];
				if (material.opacity < 1.0) {
					material.transparent = true;
				}
				if (i == 1) {
					material.refractionRatio = 1;
				}
				if (i < 5) {
					var mesh = THREE.SceneUtils.createMultiMaterialObject(result.geometries[i], [result.materials[1], material]);
				} else {
					var mesh = new THREE.Mesh(result.geometries[i], material);
				}
				node.add(mesh);
			}
			return node;
		});
	}

	function createDisk() {
		return loadModel("obj/disk.json").then(function (result) {
				var node = new THREE.Object3D();
				// TODO reflective material for 9 (platters)

				var actuatorNode = new THREE.Object3D();
				var actuatorPivot = {x: -40, y: 0, z: 135};

				for (var i = 0; i < result.geometries.length; i++) {
					var material = result.materials[i];
					var mesh = new THREE.Mesh(result.geometries[i], material);
					if (i == 3) continue;
					if ([2, 13].indexOf(i) >= 0) {
						mesh.position.x -= actuatorPivot.x;
						mesh.position.z -= actuatorPivot.z;
						actuatorNode.add(mesh);
					} else {
						node.add(mesh);
					}
				}
				node.add(actuatorNode);

				actuatorNode.position.x += actuatorPivot.x;
				actuatorNode.position.z += actuatorPivot.z;

				node.setActuatorPosition = function (pos) {
					var min = -Math.PI / 8;
					var max = 0;
					actuatorNode.rotation.y = min + (max - min) * pos;
				}

				return node;
			}
		)
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		var time = Date.now() * 0.0005;
		var delta = clock.getDelta();

		if (activeDisk) {
			activeDisk.setActuatorPosition(Math.abs(Math.sin(time)));
		}

		composer.render();
	}

	return {
		link: function (scope, element) {
			scene = new THREE.Scene();
			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(element.width(), element.height());

			// camera
			camera = new THREE.PerspectiveCamera(50, element.width() / element.height(), 1, 5000);
			camera.position.set(200, 80, 200);
			camera.lookAt(scene.position);

			// create a point light
			var pointLight = new THREE.PointLight(0xFFFFFF);

			// set its position
			pointLight.position.x = 10;
			pointLight.position.y = 50;
			pointLight.position.z = 130;

			// add to the scene
			scene.add(pointLight);

			var planeMaterial = new THREE.MeshPhongMaterial({color: 0x80a060});
			var plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), planeMaterial);
			plane.overdraw = true;
			plane.doublesided = true;
			plane.material.side = THREE.BackSide;
			plane.rotation.x = Math.PI / 2;
			scene.add(plane);

			renderer = new THREE.WebGLRenderer();
			renderer.setSize(element.width(), element.height());
			element.append(renderer.domElement);

			scene.add(new THREE.AxisHelper(50));

			createBottle().then(function (node) {
				for (var i = 0; i < 3; i++) {
					node.position.z = 100;
					node.position.x = i * 50;
					node.scale = {x: 0.1, y: 0.1, z: 0.1};
					scene.add(node);
					node = node.clone();
				}
			});

			createDisk().then(function (diskNode) {
				diskNode.scale = {x: 0.2, y: 0.2, z: 0.2};
				diskNode.position.z = 80;
				diskNode.position.x = 105;
				scene.add(diskNode);
				activeDisk = diskNode;
			});

			// Post-processing
			var dpr = devicePixelRatio();
			composer = new THREE.EffectComposer(renderer);
			composer.setSize(element.width() * dpr, element.height() * dpr);
			var renderPass = new THREE.RenderPass(scene, camera);
			composer.addPass(renderPass);

			var effect = new THREE.ShaderPass(THREE.FXAAShader);
			effect.uniforms['resolution'].value.set(1 / (element.width() * dpr), 1 / (element.height() * dpr));
			effect.renderToScreen = true;
			composer.addPass(effect);

			animate();
		}
	};
})
;
