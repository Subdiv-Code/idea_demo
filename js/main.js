import * as THREE from '../js/three.module.js';

import {OrbitControls} from '../js/OrbitControls.js';
import {GLTFLoader} from '../js/GLTFLoader.js';
import { KTX2Loader } from '../js/KTX2Loader.js';
import { MeshoptDecoder } from '../js/decoder/meshopt_decoder.module.js';
//import {RGBELoader} from '../js/RGBELoader.js';

	console.log(document.getElementById('three-conteiner').offsetHeight);
	console.log(document.getElementById('three-conteiner').offsetWidth);
	
	// Загрузка
	var progress = document.createElement('div');
	progress.className = "progress";
	var progressBar = document.createElement('div');
	progressBar.className = "progress-bar";
	
	progress.appendChild(progressBar);
	document.body.appendChild(progress);
	
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		progressBar.style.width = (loaded / total * 100) + '%';
	};
	manager.onLoad = function () {
		console.log('del');
		document.querySelector('.progress').remove();
	};

	// Настройки сцены
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcacaca );
	scene.fog = new THREE.FogExp2( 0xcacaca, 0.008 );
	scene.position.set(0, -3.5, 0);

	//Камера
	const camera = new THREE.PerspectiveCamera( 30, document.getElementById('three-conteiner').offsetWidth / document.getElementById('three-conteiner').offsetHeight, 0.1, 1000 );
	camera.position.y = 0;
	camera.position.x = -33;
	camera.position.z = 62;
	// camera.zoom = 0.5;
	// //camera.zoom = zoomFactor;
	// camera.updateProjectionMatrix();

	// Рендер
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( document.getElementById('three-conteiner').offsetWidth, document.getElementById('three-conteiner').offsetHeight);

	document.getElementById('three-conteiner').appendChild( renderer.domElement );

	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;

	//Окружение
	let textureEquirec;
	const textureLoader = new THREE.TextureLoader();
	textureEquirec = textureLoader.load('env/env-min.png', function (texture) {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		textureEquirec.encoding = THREE.sRGBEncoding;
		//scene.background = texture;
		scene.environment = texture;
	});

	// Геометрия
	
	const ktx2Loader = new KTX2Loader().setTranscoderPath( 'js/decoder/libs/' ).detectSupport( renderer );

	const loader = new GLTFLoader(manager);
	loader.setKTX2Loader( ktx2Loader );
	console.log(loader.setKTX2Loader);
	loader.setMeshoptDecoder( MeshoptDecoder );
	
	loader.load( 'model/all-castom/project_1/Project_1.gltf', function ( gltf ) {
		scene.add( gltf.scene );
	});
	loader.load( 'model/all/Env_Tree.glb', function ( gltf ) {
		scene.add( gltf.scene );
	});
	console.log(scene);


	// Контроллер
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.1;
	//controls.enableZoom = false;
	controls.target = new THREE.Vector3(0, 0, 0);
	controls.minDistance = 40;
	controls.maxDistance = 70;
	controls.maxPolarAngle = Math.PI/2;
	controls.mouseButtons = {
		LEFT: THREE.MOUSE.ROTATE,
		MIDDLE: THREE.MOUSE.ROTATE,
		RIGHT: THREE.MOUSE.ROTATE
	};
	controls.touches = {
		ONE: THREE.TOUCH.ROTATE,
		TWO: THREE.TOUCH.DOLLY
	};

	//Вызовы
	window.addEventListener( 'resize', onWindowResize );
	animate();

	// Функции
	function animate() {
		requestAnimationFrame( animate );
		//scene.rotation.y += 0.0005;
		controls.update();
		renderer.render( scene, camera );
		//console.log(camera);
	};

	function onWindowResize() {
		camera.aspect = document.getElementById('three-conteiner').offsetWidth / document.getElementById('three-conteiner').offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(document.getElementById('three-conteiner').offsetWidth, document.getElementById('three-conteiner').offsetHeight);
	};
