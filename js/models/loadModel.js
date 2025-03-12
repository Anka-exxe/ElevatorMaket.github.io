import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {applyDefaultElevatorTextures} from './textureManager.js'
import {DefaultSettings} from "./unusiallElements.js";
import {GetExtremeZPoint, GetExtremeXPoint, GetExtremeYPoint} from "./positionManager.js";
import * as Visibility from "./setVisibilityManager.js";
import * as Element from "./elementNames.js";

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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
   renderer.gammaOutput = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Или другой режим, например, THREE.LinearToneMapping
renderer.toneMappingExposure = 1; // Настройте этот параметр для управления яркостью


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0); 
    scene.environment = null

    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(144, 84, 33);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(0, 100, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);


    const skyColor = 0xB1E1FF;  // светло-синий
    const groundColor = 0xB97A20;  // коричневато-оранжевый
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    /*let pointLight = new THREE.PointLight(0xffffff, 50, 80);
    pointLight.position.set(1, 70, 1);
    scene.add(pointLight);
    
    pointLight = new THREE.PointLight(0xffffff, 100, 80);
    pointLight.position.set(1, 10, 1);
    scene.add(pointLight);*/

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.target.set(0, 50, 0);

    controls.maxDistance = maxDistance;

    function GetDistanceToWall(groupWallName) {
        const group = window.model.getObjectByName(groupWallName);
        if (!group) {
            console.warn(`Group "${groupWallName}" not found.`);
            return Infinity; // or some default value
        }
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
    
        return camera.position.distanceTo(center);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

       for (let element of Element.groupNames) {
            let distance = GetDistanceToWall(element);

            let  group = window.model.getObjectByName(element);
            let unvisibleDistance =  camera.position.distanceTo(controls.target) - 2;

            if(distance < unvisibleDistance) {
                if (element === Element.ceilingGroup) {
                    Visibility.setCeilingVisibility(false);
                } else if (element === Element.floorGroup) {
                    group.visible = false;
                } else {
                    Visibility.setWallVisibleByGroupName(element, false);
                }

            } else {
                if (element === Element.ceilingGroup) {
                    Visibility.setCeilingVisibility(true);
                } else if (element === Element.floorGroup) {
                    group.visible = true;
                } else {
                    Visibility.setWallVisibleByGroupName(element, true);
                }
            }
        }  
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
                './liftModels/Model1Final.fbx',
                (object) => {
                    object.position.set(0, 0, 0);
                    scene.add(object);
                    model = object;
                    window.model = model;
                    getObjectNames(object);
                    applyDefaultElevatorTextures();
                  // applyTextures();
                    DefaultSettings()
                    animate();

                    let pointLight = new THREE.PointLight(0xffffff, 50, 80);
                    pointLight.position.set(0, GetExtremeYPoint() / 2, GetExtremeZPoint() / 2);
                    scene.add(pointLight);
                    
                    pointLight = new THREE.PointLight(0xffffff, 100, 80);
                    pointLight.position.set(0, GetExtremeYPoint() / 2, -GetExtremeZPoint() / 2);
                    scene.add(pointLight);


                    function getObjectNames(obj) {
                        const names = [];
                        obj.traverse((child) => {

                            child.material = new THREE.MeshStandardMaterial({
                                color: 0xffffff, // Задайте нужный цвет
                                roughness: 0.5,  // Настройте шероховатость
                                metalness: 0.5   // Настройте металлическость
                            });

                            if (child.isMesh) {
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

    function applyTextures() {
        const textureLoader = new THREE.TextureLoader();

        // Загрузка текстур
        const albedoTexture = textureLoader.load('./wood/TCom_Wood_OakVeneer2_512_albedo.png', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1); // Настройте повторение по необходимости
        });
        
        const normalTexture = textureLoader.load('./wood/TCom_Wood_OakVeneer2_512_normal.png', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        });
        
        const roughnessTexture = textureLoader.load('./wood/TCom_Wood_OakVeneer2_512_roughness.png', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        });
        
        // Создание материала с использованием загруженных текстур
        const material = new THREE.MeshStandardMaterial({
            map: albedoTexture,
            normalMap: normalTexture,
            roughnessMap: roughnessTexture,
            roughness: 0.9, // Настройте по желанию
        });
    
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = material; // Примените созданный материал
            }
        });
    }





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

