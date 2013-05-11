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
	var allObjs;
	var composer;
	var xyloUnits = [];
	var debug = false;

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

	var liquidMaterial = new THREE.MeshPhongMaterial({
		color: 0x404000,
		diffuse: 0xffffff,
		reflectivity: 1.0
	});
	liquidMaterial.side = THREE.DoubleSide;

	function addLiquid(bottle, level) {
		if (level == 0) {
			return;
		}

		var height = 500 * level;
		var liquid = new THREE.Mesh(new THREE.CylinderGeometry(120, 120, height, 50, 50, false), liquidMaterial);
		liquid.position.x = -25;
		liquid.position.z = -800;
		liquid.position.y = 30 + height / 2;
		bottle.add(liquid);
	}

	function createDisk() {
		return loadModel("obj/disk.json").then(function (result) {
			var node = new THREE.Object3D();

			var actuatorNode = new THREE.Object3D();
			var actuatorPivot = {x: -40, y: 0, z: 135};

			var armMaterial = new THREE.MeshPhongMaterial({
				color: 0xffffaa, emissive: 0x403000, specular: 0x442200, reflectivity: 0.4, metal: true });
			var malletMaterial = new THREE.MeshPhongMaterial({
				color: 0xaaaaaa, emissive: 0x404040, specular: 0x444444, reflectivity: 0.2, metal: true });

			for (var i = 0; i < result.geometries.length; i++) {
				var material = result.materials[i];
				if (i == 0) {
					material = armMaterial;
				}
				if (i == 14 || i == 9) {
					material = malletMaterial;
				}
				var mesh = new THREE.Mesh(result.geometries[i], material);
				if (i == 3) continue;
				if ([0, 2, 13, 14].indexOf(i) >= 0) {
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
			actuatorNode.name = "Actuator";
			return node;
		});
	}

	function setActuatorPosition(diskObject, position) {
		var min = -Math.PI / 8;
		var max = 0;
		diskObject.getObjectByName("Actuator").rotation.y = min + (max - min) * position;
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		var time = Date.now() * 0.0005;
		var delta = clock.getDelta();

		xyloUnits.map(function (unit) {
			if (unit.disk && (unit.actuatorPosition != unit.targetPosition)) {
				var actuatorDelta = delta * unit.speed;
				if (unit.actuatorPosition > unit.targetPosition) {
					unit.actuatorPosition = Math.max(0, unit.actuatorPosition - actuatorDelta);
				} else {
					unit.actuatorPosition = Math.min(1, unit.actuatorPosition + actuatorDelta);
				}
				if (unit.targetPosition == 0.5) {
					unit.speed /= 1.5;
				}
				setTimeout(function () {
					if (unit.actuatorPosition == unit.targetPosition) {
						unit.targetPosition = 0.5;
					}
				}, 50);
				setActuatorPosition(unit.disk, unit.actuatorPosition);
			}
		});

		allObjs.rotation.y = time / 2.;

		composer.render();
	}

	return {
		link: function (scope, element) {
			scene = new THREE.Scene();

			// Camera
			camera = new THREE.PerspectiveCamera(50, element.width() / element.height(), 1, 5000);
			camera.position.set(200, 80, 200);
			camera.lookAt(scene.position);

			// Lights
			var pointLight = new THREE.PointLight(0xFFFFFF);
			pointLight.position.x = 10;
			pointLight.position.y = 50;
			pointLight.position.z = 130;
			scene.add(pointLight);

			// Objects
			allObjs = new THREE.Object3D();
			scene.add(allObjs);

			var planeMaterial = new THREE.MeshPhongMaterial({color: 0x80a060});
			var plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), planeMaterial);
			plane.overdraw = true;
			plane.doublesided = true;
			plane.material.side = THREE.BackSide;
			plane.rotation.x = Math.PI / 2;
			allObjs.add(plane);

			if (debug) {
				allObjs.add(new THREE.AxisHelper(50));
			}

			// Xylophone Units
			for (i = 0; i < 4; i++) {
				var unit = new THREE.Object3D();
				unit.position.z = parseInt(i / 2) * 160 - 80;
				unit.position.x = (i % 2) * 140 - 60;
				if (i == 2) {
					unit.position.z -= 32;
					unit.position.x -= 10;
				}
				if (i == 3) {
					unit.rotation.y = -Math.PI / 2;
					unit.bottleRotation = {
						x: 0, y: Math.PI, z: 0
					};
				}
				unit.actuatorPosition = 0.5;
				unit.targetPosition = unit.actuatorPosition;
				xyloUnits.push(unit);
				allObjs.add(unit);
			}

			xyloUnits[0].liquidLevelLeft = 0.1;
			xyloUnits[0].liquidLevelRight = 0.0;
			xyloUnits[1].liquidLevelLeft = 0.3;
			xyloUnits[1].liquidLevelRight = 0.2;
			xyloUnits[2].liquidLevelLeft = 0.5;
			xyloUnits[2].liquidLevelRight = 0.4;
			xyloUnits[3].liquidLevelLeft = 0.8;
			xyloUnits[3].liquidLevelRight = 1.0;

			createBottle().then(function (bottleNode) {
				bottleNode.scale = {x: 0.1, y: 0.1, z: 0.1};

				xyloUnits.map(function (unit) {
					var currentBottle = bottleNode.clone();
					currentBottle.position.z = 111;
					currentBottle.position.x = -50;
					addLiquid(currentBottle, unit.liquidLevelLeft);
					unit.add(currentBottle);
					var currentBottle = bottleNode.clone();
					currentBottle.position.z = 146;
					currentBottle.position.x = -30;
					addLiquid(currentBottle, unit.liquidLevelRight);
					unit.add(currentBottle);
				});
			});

			createDisk().then(function (diskNode) {
				diskNode.scale = {x: 0.2, y: 0.2, z: 0.2};
				xyloUnits.map(function (unit) {
					var currentDisk = diskNode.clone();
					unit.disk = currentDisk;
					unit.add(currentDisk);
					setActuatorPosition(unit.disk, unit.actuatorPosition);
				});
			});

			// Renderer
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(element.width(), element.height());
			element.append(renderer.domElement);

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

			var pitchToUnit = {
				0: [3, 0], 2: [3, 1],
				4: [2, 0], 5: [2, 1],
				7: [1, 0], 9: [1, 1],
				11: [0, 0], 12: [0, 1]
			};
			scope.$on("playNote", function (event, args) {
				var unitSpec = pitchToUnit[args.pitch];
				var unit = xyloUnits[unitSpec[0]];
				unit.speed = 20;
				unit.targetPosition = unitSpec[1];
			});

			animate();
		}
	};
})
;
