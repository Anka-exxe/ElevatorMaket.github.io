import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {applyDefaultElevatorTextures} from './textureManager.js'
import {DefaultSettings} from "./unusiallElements.js";

let model;
let scene, camera, renderer, controls;

function init() {
    const canvas = document.querySelector('.elevator-container__elevator-observer');
    if (!canvas) {
        console.error('Canvas элемент не найден');
        return;
    }

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0); 

    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(144, 84, 33);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 75, 1);
    scene.add(directionalLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.target.set(0, 50, 0);

    controls.maxDistance = 160;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        './liftModels/LiftModel.fbx',
        (gltf) => {
            object.position.set(0, 0, 0);
            scene.add(gltf.scene);
            model = gltf.scene;
            window.model = model;
            applyDefaultElevatorTextures();
            animate();
        },
        undefined,
        (error) => {
            console.error('Ошибка загрузки GLTF модели:', error);

            const fbxLoader = new FBXLoader();
            fbxLoader.load(
                './liftModels/LiftModel.fbx',
                (object) => {
                    object.position.set(0, 0, 0);
                    scene.add(object);
                    model = object;
                    window.model = model;
                    applyDefaultElevatorTextures();
                    DefaultSettings()
                    animate();
                },
                undefined,
                (error) => {
                    console.error('Ошибка загрузки FBX модели:', error);
                }
            );
        }
    );

    window.addEventListener('resize', () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

document.addEventListener('DOMContentLoaded', init);

