import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {DefaultSettings} from "./unusiallElements.js";
import {GetExtremeZPoint, GetExtremeXPoint, GetExtremeYPoint} from "./positionManager.js";
import * as Visibility from "./setVisibilityManager.js";
import * as Element from "./elementNames.js";
import { RectAreaLightUniformsLib } from 'jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper }      from 'jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLight }            from 'three';
import {setAllParameters, 
    getAllParameters, getCabinSize} from 
    "../shareConfiguration/allParams.js";
    import {setDesignProject} from 
    "../shareConfiguration/mainParams.js";
    import {reloadParamsForNewModel} from "../shareConfiguration/allParams.js";
import {fetchTemplateById} from "../designProjectService/designProjectStorage.js";
import {isImagesShowed, loadImagesForAllTabs} from "../animation/tabFunctions.js";
import {API_BASE_URL, MODEL_BASE_PATH} from "../urlHelper/urls.js";
import {GetLamp1Size, GetLamp2Size} from "./lightSizeManager.js";
import { urlLightSettings} from '../urlHelper/urls.js';
import {syncAmbient, syncRect} from "../lightSettingsManager.js";

let currentModel = null;
export let currentCabinSize = null;
let buttonView3D;
let buttonViewFront;
let buttonViewUp;
let buttonViewInside;
let lamp1Size;
let lamp2Size;
export let areaLight1Ceiling;
export let areaLight2Ceiling;

export async function applyLightSettingsFromServer() {
    try {
        const response = await fetch(urlLightSettings);
        if (!response.ok) {
            console.error('Ошибка при получении настроек света:', response.status);
            return;
        }

        const settings = await response.json();

        if (settings.ambientColor) {
            ambientLight.color.set(settings.ambientColor);
        }
        if (typeof settings.ambientIntensity === 'number') {
            ambientLight.intensity = settings.ambientIntensity;
        }

        if (areaLight1Ceiling && settings.reactColor) {
            areaLight1Ceiling.color.set(settings.reactColor);
        }
        if (areaLight2Ceiling && settings.reactColor) {
            areaLight2Ceiling.color.set(settings.reactColor);
        }

        if (areaLight1Ceiling && typeof settings.reactIntensity === 'number') {
            areaLight1Ceiling.intensity = settings.reactIntensity;
        }
        if (areaLight2Ceiling && typeof settings.reactIntensity === 'number') {
            areaLight2Ceiling.intensity = settings.reactIntensity;
        }
    } catch (err) {
        console.error('Ошибка запроса к API настроек света:', err);
    }
}

export async function loadModelBySize(idToSizeElement, isReloaded = false) {

    const loader = new FBXLoader();
    const modelPaths = {
        wide: `${MODEL_BASE_PATH}wideLiftModel.fbx`,
        square: `${MODEL_BASE_PATH}squareLiftModel.fbx`,
        deep: `${MODEL_BASE_PATH}deepLiftModel.fbx`,
    };

    const path = modelPaths[idToSizeElement];
    if (!path) return;
    currentCabinSize = idToSizeElement;

    document.getElementById('loading').style.display = 'flex';

    loader.load(
        path,
        async (object) => {
            object.position.set(0, 0, 0);
            scene.add(object);
            model = object;
            window.model = model;

            if (currentModel) {
                scene.remove(currentModel);
            }
            currentModel = object;
            getObjectNames(object);
            DefaultSettings()
            animate();

            function getObjectNames(obj) {
                const names = [];
                obj.traverse((child) => {

                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff, // Задайте нужный цвет
                        roughness: 0.5,  // Настройте шероховатость
                        metalness: 0.5   // Настройте металлическость
                    });
                });}

            isReloaded ? reloadParamsForNewModel() : loadConfiguration();

            lamp1Size = GetLamp1Size();
            lamp2Size = GetLamp2Size();

            if (areaLight1Ceiling) {
                scene.remove(areaLight1Ceiling);
                areaLight1Ceiling.dispose();
                areaLight1Ceiling = null; // Очищаем ссылку
            }

            if (areaLight2Ceiling) {
                scene.remove(areaLight2Ceiling);
                areaLight2Ceiling.dispose();
                areaLight2Ceiling = null; // Очищаем ссылку
            }

            if(idToSizeElement === "wide") {
                       // --- Создаём RectAreaLight — большой потолочный светильник ---
            areaLight1Ceiling = new RectAreaLight(0xffffff, 3, lamp1Size.x, lamp1Size.y);
            areaLight1Ceiling.position.set(GetExtremeXPoint() / 2 + 5, GetExtremeYPoint() + 0.3, 0);
            areaLight1Ceiling.lookAt(GetExtremeXPoint() / 2 + 5, 0, 0);
            scene.add(areaLight1Ceiling);

            areaLight2Ceiling = new RectAreaLight(0xffffff, 3, lamp2Size.x, lamp2Size.y);
            areaLight2Ceiling.position.set(- (GetExtremeXPoint() / 2), GetExtremeYPoint() + 0.3, 0);
            areaLight2Ceiling.lookAt(- (GetExtremeXPoint() / 2), 0, 0);
            scene.add(areaLight2Ceiling);
            } else {
                let yAddition;

                if(idToSizeElement === "square") {
                    yAddition = 0.3;
                } else {
                    yAddition = -1;
                }
                            // --- Создаём RectAreaLight — большой потолочный светильник ---
            areaLight1Ceiling = new RectAreaLight(0xffffff, 2, lamp1Size.x, lamp1Size.y);
            // 0xffffff — цвет, 5 — интенсивность (можно редактировать), 100×100 — ширина и высота
            areaLight1Ceiling.position.set(0, GetExtremeYPoint() + yAddition, GetExtremeZPoint() / 2 - 3);
            // Направляем вниз:
            areaLight1Ceiling.lookAt(0, 0, GetExtremeZPoint() / 2 -3);
            scene.add(areaLight1Ceiling);

            areaLight2Ceiling = new RectAreaLight(0xffffff, 2, lamp2Size.x, lamp2Size.y);
            // 0xffffff — цвет, 5 — интенсивность (можно редактировать), 100×100 — ширина и высота
            areaLight2Ceiling.position.set(0, GetExtremeYPoint() + yAddition, - (GetExtremeZPoint() / 2 + 2));
            // Направляем вниз:
            areaLight2Ceiling.lookAt(0, 0, - (GetExtremeZPoint() / 2 + 2));
            scene.add(areaLight2Ceiling);
            }

            document.getElementById('loading').style.display = 'none'; // Скрыть индикатор загрузки
            document.getElementById('configurator-container').style.visibility = 'visible';
        },
        undefined,
        (error) => {
            console.error('Ошибка загрузки FBX модели:', error);
        }
    );

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
            let unvisibleDistance =  camera.position.distanceTo(controls.target) - 0.5;

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
    await applyLightSettingsFromServer();
    try {
        const res = await fetch(urlLightSettings);
        if (!res.ok) throw new Error();
        const data = await res.json();

        document.getElementById('ambientColor').value = data.ambientColor;
        syncAmbient(data.ambientIntensity);

        document.getElementById('rectColor').value = data.reactColor;
        syncRect(data.reactIntensity);
    } catch (err) {
        console.warn('Не удалось подгрузить значения света в форму');
    }
}

let model;
export let camera, renderer, controls;
export let ambientLight;
const maxDistance = 160;
export let scene;

async function init() {
    const canvas = document.getElementById('elevatorCanvas');
    if (!canvas) {
        console.error('Canvas элемент не найден');
        return;
    }
    RectAreaLightUniformsLib.init();
    renderer = new THREE.WebGLRenderer({ canvas, 
        antialias: true, 
        preserveDrawingBuffer: true }
        );
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.gammaOutput = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Или другой режим, например, THREE.LinearToneMapping
    //renderer.toneMappingExposure = 1; // Настройте этот параметр для управления яркостью

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0); 
    scene.environment = null

    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(144, 84, 33);

    ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const menuContainer = document.getElementById('menu-container');
    const optionMenuVisibilityBtn = document.getElementById('optionMenuVisibilityBtn');
    //const canvas = document.getElementById('elevatorCanvas'); // Получаем элемент canvas

    const originalWidth = canvas.clientWidth;
    const originalHeight = canvas.clientHeight;
    
    optionMenuVisibilityBtn.addEventListener('click', () => {
        menuContainer.classList.toggle('hidden'); // Переключаем класс для анимации
        onMenuHiden(); // Обновляем размер canvas после изменения меню

        optionMenuVisibilityBtn.classList.toggle('rotate');
    });


function onMenuHiden() {
    const element = document.getElementById('elevator-container');
    const width = element.clientWidth;
    const height = element.clientHeight;

    // Если меню скрыто, возвращаем исходные размеры
    if (!menuContainer.classList.contains('hidden')) {
        canvas.style.width = `${originalWidth}px`;
        canvas.style.height = `${originalHeight}px`;
        renderer.setSize(originalWidth, originalHeight);
        onWindowResize();
    } else {
        // Устанавливаем размеры в зависимости от контейнера
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
}    

// Функция изменения размера
function onWindowResize() {
    const element = document.getElementById('elevator-container');
    const width = element.clientWidth;
    const height = element.clientHeight;

        // Устанавливаем размеры в зависимости от контейнера
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

    /*const areaLightCeiling = new RectAreaLight(0xffffff, 3, 90, 80);
    // 0xffffff — цвет, 5 — интенсивность (можно редактировать), 100×100 — ширина и высота
    areaLightCeiling.position.set(0, 88, 0);
    // Направляем вниз:
    areaLightCeiling.lookAt(0, 0, 0);
    scene.add(areaLightCeiling);

    const areaLightLeft = new RectAreaLight(0xffffff, 0.5, 80, 50);
    areaLightLeft.position.set(-60, 50, 0);
    areaLightLeft.lookAt(0, 50, 0);
    scene.add(areaLightLeft);

    const areaLightRight = new RectAreaLight(0xffffff, 0.5, 80, 50);
    areaLightRight.position.set(60, 50, 0);
    areaLightRight.lookAt(0, 50, 0);
    scene.add(areaLightRight);

    const helperCeil = new RectAreaLightHelper(areaLightCeiling);
    const helperLeft  = new RectAreaLightHelper(areaLightLeft);
    const helperRight = new RectAreaLightHelper(areaLightRight);
*/
    /*let directionalLight4 = new THREE.AmbientLight(0xffffff, 100);
    directionalLight4.position.set(0, 80, 0);
    directionalLight4.target.position.set(0, 40, 0);
    scene.add(directionalLight4);

    let directionalLightHelper4 = new THREE.DirectionalLightHelper(directionalLight4, 10);
    scene.add(directionalLightHelper4);*/

    InitialOrbitControls();

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

    /*function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

       for (let element of Element.groupNames) {
            let distance = GetDistanceToWall(element);

            let  group = window.model.getObjectByName(element);
            let unvisibleDistance =  camera.position.distanceTo(controls.target) - 0.5;

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
    }*/

    const idToSize = {
        wideSize: 'wide',
        squareSize: 'square',
        deepSize: 'deep'
    };

    let modelSize= await getCabinSizeFromConfiguration();

    if(modelSize) {
        loadModelBySize(idToSize[modelSize]);
    } else {
        //window.location.href = `index.html`;
    }

    /*const gltfLoader = new GLTFLoader();
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
                './liftModels/squareModel.fbx',
                async (object) => {
                    object.position.set(0, 0, 0);
                    scene.add(object);
                    model = object;
                    window.model = model;
                    getObjectNames(object);
                    DefaultSettings()
                    animate();
                  
                    //let pointLight = new THREE.PointLight(0xffffff, 50, 80);
                    //pointLight.position.set(0, GetExtremeYPoint() / 2, GetExtremeZPoint() / 2);
                    //scene.add(pointLight);
                    
                    //pointLight = new THREE.PointLight(0xffffff, 100, 80);
                    //pointLight.position.set(0, GetExtremeYPoint() / 2, -GetExtremeZPoint() / 2);
                    //scene.add(pointLight);

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

                        await loadConfiguration();

                        document.getElementById('loading').style.display = 'none'; // Скрыть индикатор загрузки
                        document.getElementById('configurator-container').style.visibility = 'visible'; 
                        console.log("Hi");
                },
                undefined,
                (error) => {
                    console.error('Ошибка загрузки FBX модели:', error);
                }
            );
        }
    );*/

    window.addEventListener('resize', () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    controls.target.set(0, 50, 0);
    camera.position.set(maxDistance - 2, 40, maxDistance - 2);
    controls.update(); 
    renderer.render(scene, camera);

    buttonView3D = document.getElementById('view3d');
     buttonViewFront = document.getElementById('viewFront');
     buttonViewUp = document.getElementById('viewUp');
     buttonViewInside = document.getElementById('viewInside');

    if (buttonView3D) {
        buttonView3D.onclick = function () {
            animateButton(buttonView3D);
            camera.position.set(maxDistance - 2, GetExtremeYPoint() / 2, maxDistance - 2);
            controls.target.set(0, 50, 0);
            controls.maxDistance = 160;
            controls.update();
            checkCeilingVisibilityAndSet();
            checkFrontVisibilityAndSet();
        };
    }

    if (buttonViewUp) {
        buttonViewUp.onclick = function () {
            animateButton(buttonViewUp);
            controls.maxDistance = maxDistance;
            camera.position.set(0, maxDistance, 0);
            controls.target.set(0, GetExtremeYPoint() / 2, 0);
            controls.update();
            Visibility.setCeilingVisibility(false);
            checkFrontVisibilityAndSet();
        };
    }

    if (buttonViewFront) {
        buttonViewFront.onclick = function () {
            animateButton(buttonViewFront);
            controls.maxDistance = maxDistance;
            camera.position.set(0, (GetExtremeYPoint() / 2) - 10, maxDistance);
            controls.target.set(0, GetExtremeYPoint() / 2, 0);
            controls.update();
            Visibility.setFrontVisible(false);
            checkCeilingVisibilityAndSet();
        };
    }

    if (buttonViewInside) {
        buttonViewInside.onclick = function () {
            animateButton(buttonViewInside);
            camera.position.set(0, (GetExtremeYPoint() / 2) + 10, -1);
            controls.target.set(0, (GetExtremeYPoint() / 2) + 10, 0);
            controls.maxDistance = GetExtremeZPoint() / 2 - 10;
            controls.update();
            checkCeilingVisibilityAndSet();
            checkFrontVisibilityAndSet();
        };
    }
}

async function getCabinSizeFromConfiguration() {

    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('designProject'); // Получаем ID проекта

    if (templateId) {
        const template = await fetchTemplateById(templateId); // Ожидаем результат
        if (!template) {
            throw new Error('Template not found');
        }

        const templateConfiguration = template.configuration;

        if (templateConfiguration) {
            return getCabinSize(templateConfiguration);
        }
    }

    return "wideSize";
}

async function reloadConfiguration() {
    reloadParamsForNewModel();
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

export function InitialOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.target.set(0, 50, 0);
    controls.maxDistance = maxDistance;
    controls.update(); 
}


export let templateId;

async function loadConfiguration() {

    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('designProject'); // Получаем ID проекта

    if(!isImagesShowed) {
        await loadImagesForAllTabs();
    }

    if (templateId) {
        try {
            const template = await fetchTemplateById(templateId); // Ожидаем результат
            if (!template) {
                throw new Error('Template not found');
            }

            document.getElementById('projectTitle').value = template.name; // Используем имя шаблона

            const preview = document.getElementById('preview-pattern');
            if (preview) {
                preview.innerHTML = `<img src=" ${API_BASE_URL}${template.previewImageUrl}" alt="Preview" class="pattern-img" style="max-width: 100%;">`;
            }
           
            await setAllParameters(template.configuration);
            setDesignProject(templateId);
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

        reloadParamsForNewModel();
    }
}
