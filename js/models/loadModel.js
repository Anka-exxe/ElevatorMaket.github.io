import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {applyDefaultElevatorTextures} from './textureManager.js'
import {DefaultSettings} from "./unusiallElements.js";
import {GetExtremeZPoint, GetExtremeXPoint, GetExtremeYPoint} from "./positionManager.js";
import * as Visibility from "./setVisibilityManager.js";

let model;
let scene, camera, renderer, controls;
const maxDistance = 160;

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
     controls.dampingFactor = 0.25;
     controls.enableZoom = true;
    controls.target.set(0, 50, 0);

    controls.maxDistance = maxDistance;
    //controls.update(); 

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
                './liftModels/newTestLiftModel.fbx',
                (object) => {
                    object.position.set(0, 0, 0);
                    scene.add(object);
                    model = object;
                    window.model = model;
                    applyDefaultElevatorTextures();
                    DefaultSettings()
                    animate();

                    getObjectNames(object);

                    function getObjectNames(obj) {
                        const names = [];
                        obj.traverse((child) => {
                            if (child.isMesh) {
                                console.log(child.name);
                            }
                        });}

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

let animateButton = function selectParameterButton(button) {
    const container = button.parentNode; 
    const buttons = container.querySelectorAll('button'); 
    buttons.forEach(btn => {
        btn.classList.remove('active'); 
    });
    button.classList.add('active'); 
}

function checkCeilingVisibilityAndSet() {
    if (!Visibility.isCeilingVisible()) {
        Visibility.setCeilingVisibility(true);
    }
}

function checkFrontVisibilityAndSet() {
    if (!Visibility.isFrontVisible()) {
        Visibility.setFrontVisible(true);
    }
}


// Логика для разных ракурсов для кнопок
const buttonView3D = document.getElementById('view3d');
const buttonViewFront = document.getElementById('viewFront');
const buttonViewUp = document.getElementById('viewUp');
const buttonViewInside = document.getElementById('viewInside');

buttonView3D.onclick = function() {
    animateButton(buttonView3D);
    camera.position.set(0, GetExtremeYPoint() / 2, GetExtremeZPoint() + 110); 
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.target.set(0, 50, 0);
    controls.maxDistance = 160;
    controls.update(); 
    checkCeilingVisibilityAndSet();
    checkFrontVisibilityAndSet();
};

buttonViewUp.onclick = function() {
    animateButton(buttonViewUp);
    controls.maxDistance = maxDistance;
    camera.position.set(0, maxDistance, 0); 
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.target.set(0, GetExtremeYPoint() - 10, 0);
    controls.update();  
    Visibility.setCeilingVisibility(false);
    checkFrontVisibilityAndSet();
}

buttonViewFront.onclick = function() {
    animateButton(buttonViewFront);
    controls.maxDistance = maxDistance;
    camera.position.set(0, (GetExtremeYPoint() / 2) - 10, maxDistance); 
    controls.enableZoom = false;
    controls.target.set(0, GetExtremeYPoint() / 2, 0);
    controls.enableRotate = false;
    controls.update(); 
    Visibility.setFrontVisible(false);
    checkCeilingVisibilityAndSet();
};

buttonViewInside.onclick = function() {
    animateButton(buttonViewInside);
    camera.position.set(0, (GetExtremeYPoint() / 2) + 5, -1); 
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.target.set(0, (GetExtremeYPoint() / 2) + 5, 0);
    controls.maxDistance = GetExtremeZPoint() / 2 - 10;
    controls.update(); 
    checkCeilingVisibilityAndSet();
    checkFrontVisibilityAndSet();
};

