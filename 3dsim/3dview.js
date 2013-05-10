app.directive("xyloSimulator", function ($q, $rootScope) {
	var clock = new THREE.Clock();
	var light1, light2, light3, light4;
	var renderer, scene;
	var camera;
	var sphere;
	var plane;

	function loadModel(modelName) {
		var deferred = $q.defer();
		var loader = new THREE.CTMLoader();
		loader.loadParts("obj/bottle.json", function (geometries, materials) {
			$rootScope.$apply(function () {
				deferred.resolve({geometries: geometries, materials: materials});
			});
		}, { useWorker: true, useBuffers: true });
		return deferred.promise;
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

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {

		var time = Date.now() * 0.0005;
		var delta = clock.getDelta();

		//camera.position.z = 150 + Math.cos(time) * 25;
		//light1.position.z = 10 + Math.cos(time) * 25;
		//plane.rotation.z += delta;

		renderer.render(scene, camera);

	}

	return {
		link: function (scope, element) {
			scene = new THREE.Scene();
			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(window.innerWidth, window.innerHeight);

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

			var pointLight = new THREE.PointLight(0xFFFFFF);

			// set its position
			pointLight.position.x = 100;
			pointLight.position.y = 50;
			pointLight.position.z = 130;

			// add to the scene
			scene.add(pointLight);

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

			animate();
		}
	};
});
