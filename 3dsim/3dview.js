app.directive("xyloSimulator", function ($q, $rootScope) {
	var clock = new THREE.Clock();
	var renderer, scene;
	var camera;
	var composer;

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

	function devicePixelRatio() {
		return window.devicePixelRatio || 1;
	}

	function createDisk() {
		return loadModel("obj/disk.json").then(function (result) {
			var node = new THREE.Object3D();
			for (var i = 0; i < result.geometries.length; i++) {
				var material = result.materials[i];
				var mesh = new THREE.Mesh(result.geometries[i], material);
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

			createDisk().then(function (node) {
				node.scale = {x: 0.2, y: 0.2, z: 0.2};
				node.position.z = 80;
				node.position.x = 105;
				scene.add(node);
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
});
