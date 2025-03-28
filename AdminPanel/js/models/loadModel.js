﻿import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {applyDefaultElevatorTextures} from './textureManager.js'
import {DefaultSettings} from "./unusiallElements.js";
import {GetExtremeZPoint, GetExtremeXPoint, GetExtremeYPoint} from "./positionManager.js";
import * as Visibility from "./setVisibilityManager.js";
import * as Element from "./elementNames.js";
import {setAllParameters, 
    getAllParameters} from 
    "../shareConfiguration/allParams.js";
import {fetchTemplateById} from "../designProjectService/designProjectStorage.js";
import {isImagesShowed, loadImagesForAllTabs} from "../animation/tabFunctions.js";

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
    //renderer.outputColorSpace = THREE.SRGBColorSpace;
    //renderer.gammaOutput = true;
    //renderer.toneMapping = THREE.ACESFilmicToneMapping; // Или другой режим, например, THREE.LinearToneMapping
    //renderer.toneMappingExposure = 1; // Настройте этот параметр для управления яркостью


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0); 
    scene.environment = null

    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(144, 84, 33);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);


    function onWindowResize() { // Чтобы менялся размер на норм, когдп делаешь полноэкранный или режим разраба
        const element = document.getElementById('elevator-container');
        const width = element.clientWidth;
        const height = element.clientHeight;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('fullscreenchange', onWindowResize);
    document.addEventListener('webkitfullscreenchange', onWindowResize); // Для Safari
    document.addEventListener('mozfullscreenchange', onWindowResize); // Для Firefox
    document.addEventListener('MSFullscreenChange', onWindowResize); // Для IE/Edge

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 60, 100);
    directionalLight.target.position.set(0, 30, 0);
    scene.add(directionalLight);

     //let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
     //scene.add(directionalLightHelper);

    let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(100, 60, 0);
    directionalLight1.target.position.set(0, 30, 0);
    scene.add(directionalLight1);

     //let directionalLightHelper1 = new THREE.DirectionalLightHelper(directionalLight1, 3);
     //scene.add(directionalLightHelper1);

    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-100, 60, 0);
    directionalLight2.target.position.set(0, 30, 0);
    scene.add(directionalLight2);

     //let directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 3);
     //scene.add(directionalLightHelper2);

    let directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(0, 60, -100);
    directionalLight3.target.position.set(0, 30, 0);
    scene.add(directionalLight3);

     //let directionalLightHelper3 = new THREE.DirectionalLightHelper(directionalLight3, 3);
     //scene.add(directionalLightHelper3);

    /*let directionalLight4 = new THREE.AmbientLight(0xffffff, 100);
    directionalLight4.position.set(0, 80, 0);
    directionalLight4.target.position.set(0, 40, 0);
    scene.add(directionalLight4);

    let directionalLightHelper4 = new THREE.DirectionalLightHelper(directionalLight4, 10);
    scene.add(directionalLightHelper4);*/


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

            if(camera.position.x >= -GetExtremeXPoint() &&  camera.position.x <= GetExtremeXPoint()  &&
                camera.position.z <= GetExtremeZPoint() &&  camera.position.z >= -GetExtremeZPoint() &&
                camera.position.y < 0) {
                Visibility.setWallVisibleByGroupName(Element.floorGroup, false);
                Visibility.setWallVisibleByGroupName(Element.leftGroup, true);
                Visibility.setWallVisibleByGroupName(Element.rightGroup, true);
                Visibility.setWallVisibleByGroupName(Element.backGroup, true);
                Visibility.setWallVisibleByGroupName(Element.frontGroup, true);
                continue;
            }

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
                './liftModels/Model1.fbx',
                async (object) => {
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
console.log("load conf");
                        await loadConfiguration();

                        document.getElementById('loading').style.display = 'none'; // Скрыть индикатор загрузки
                        document.getElementById('configurator-container').style.visibility = 'visible'; 
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

export let templateId;

async function loadConfiguration() {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('designProject'); // Получаем ID проекта
    console.log("templateId" + templateId);

    if(!isImagesShowed) {
        await loadImagesForAllTabs();
    }

    if (templateId) {
        try {
            const template = await fetchTemplateById(templateId); // Ожидаем результат
            console.log(template);
            if (!template) {
                throw new Error('Template not found');
            }

            document.getElementById('projectTitle').value = template.name; // Используем имя шаблона

            const preview = document.getElementById('preview-pattern');
            if (preview) {
                preview.innerHTML = `<img src="${template.previewImageUrl}" alt="Preview" class="pattern-img" style="max-width: 100%;">`;
            }

            setAllParameters(template.configuration);
        } catch (error) {
            alert('Ошибка при загрузке шаблона: ' + error.message); // Уведомляем пользователя об ошибке
        }
    } else {
        // Очистка формы, если templateId не указан
        document.getElementById('projectTitle').value = '';
        const preview = document.getElementById('preview-pattern');
        if (preview) {
            preview.innerHTML = '';
        }
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
    camera.position.set(maxDistance - 2, GetExtremeYPoint() / 2 + 10, maxDistance - 2); 
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

