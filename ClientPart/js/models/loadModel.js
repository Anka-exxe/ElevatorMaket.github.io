import * as THREE from 'three';
import { TextureLoader } from 'three';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {DefaultSettings, setupReflectors} from "./unusiallElements.js";
import {GetExtremeZPoint, GetExtremeXPoint, GetExtremeYPoint} from "./positionManager.js";
import * as Visibility from "./setVisibilityManager.js";
import * as Element from "./elementNames.js";
import {setAllParameters, getCabinSize} from 
    "../shareConfiguration/allParams.js";
    import {setDesignProject} from 
    "../shareConfiguration/mainParams.js";
import { RectAreaLightUniformsLib } from 'jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLight }            from 'three';
import {reloadParamsForNewModel} from "../shareConfiguration/allParams.js";
import {applyColorToElements} from "./hallTextureManager.js";
import {initCallPostsHandler, initIndicationBoardHandler} from "./hallCallPostsIndBoard.js";
import {setDoorOpen} from "./setVisibilityManager.js";
import {getDoorState} from "../shareConfiguration/doorParams.js";
import {setTextureClassActiveByContainerName,
    setActiveFirstTextureByContainerName, 
    setActiveTextureByContainerNameHallVersion
} 
from "../shareConfiguration/findElementsHelper.js";
import {isHallSettingsSet, 
    getHallState, setHallParamsActive, 
    setFrameExistence, setHallSettings} 
    from "../shareConfiguration/hallParams.js";
import {getOpeningTypeParam} from 
"../shareConfiguration/mainParams.js";
import {MODEL_BASE_PATH} from "../urlHelper/urls.js";
import {GetLamp1Size, GetLamp2Size} from "./lightSizeManager.js";
import { urlLightSettings} from '../urlHelper/urls.js';

let currentModel = null;
export let currentCabinSize = null;
let buttonView3D;
let buttonViewFront;
let buttonViewUp;
let buttonViewInside;
let buttonHallViewInside;
let buttonDoorOpen;
let buttonDoorClose;
let isHallModelLoaded = false;
let currentOpenType;
let areaLightHall;
let lamp1Size;
let lamp2Size;
let areaLight1Ceiling;
let areaLight2Ceiling;
export let renderer

async function applyLightSettingsFromServer() {
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

let animationId = null;

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

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    function disposeModel(model) {
        if (!model) return;
    
        model.traverse(child => {
            if (child.isMesh) {
                // Очищаем геометрию
                if (child.geometry) {
                    child.geometry.dispose();
                }
    
                // Очищаем материалы и текстуры
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => {
                            disposeMaterial(material);
                        });
                    } else {
                        disposeMaterial(child.material);
                    }
                }
            }
        });
    
        scene.remove(model);
    }
    
    function disposeMaterial(material) {
        material.dispose();
        
        // Очищаем текстуры
        for (const key of Object.keys(material)) {
            const value = material[key];
            if (value && value.isTexture) {
                value.dispose();
            }
        }
    }

    loader.load(
        path,
        async (object) => {
            object.position.set(0, 0, 0);
            scene.add(object);
            
            if (window.model) {
                scene.remove(window.model);
                disposeModel(window.model);
            window.model = null;
            }
            window.model = object;

            getObjectNames(object);
            DefaultSettings()
        

            function getObjectNames(obj) {
                const names = [];
                obj.traverse((child) => {

                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff, // Задайте нужный цвет
                        roughness: 0.2,  // Настройте шероховатость
                        metalness: 1   // Настройте металлическость
                    });
                });}

            isReloaded ? reloadParamsForNewModel() : loadConfiguration();

            isHallModelLoaded = isReloaded ? false : isHallModelLoaded;

            document.getElementById('loading').style.display = 'none'; // Скрыть индикатор загрузки
            document.getElementById('configurator-container').style.visibility = 'visible';
            applyBasicTextures();

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

            await applyLightSettingsFromServer();

            animate();
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
        animationId = requestAnimationFrame(animate);

        renderer.render(scene, camera);

        let unvisibleDistanceDependOnSize;

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

            if(currentCabinSize === "wide") {
                unvisibleDistanceDependOnSize =  unvisibleDistance + 2;
            } else {
                unvisibleDistanceDependOnSize =  unvisibleDistance;
            }

            if(distance < unvisibleDistanceDependOnSize) {
                if (element === Element.ceilingGroup) {
                    Visibility.setCeilingVisibility(false);
                } else if (element === Element.floorGroup) {
                    if(camera.position.y < 0) {
                        group.visible = false;
                    } else {
                        group.visible = true;
                    }
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
}

export function applyBasicTextures() {
    const thresholdNames = [
        "Threshold",
        "ThresholdCentral",
        "ThresholdLeft",
        "Threshold1",
        "Threshold1Central",
        "Threshold1Left"
    ];

    const loader = new TextureLoader();

    // === Текстуры для порогов ===
    const metalTexture = loader.load('../../baseTextures/Steel.jpg');
    const normalMap = loader.load('../../baseTextures/NormalMap.png');
    const roughnessMap = loader.load('../../baseTextures/AmbientOcclusionMap.png');
    const metalnessMap = loader.load('../../baseTextures/Steel.jpg');

    [metalTexture, normalMap, roughnessMap, metalnessMap].forEach(tex => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
        map: metalTexture,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        metalnessMap: metalnessMap,
        side: THREE.DoubleSide
    });

    loader.load('../../baseTextures/Logo.png', (texture) => {
        const logoMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });

        const logo = window.model.getObjectByName("Logo");
        if (logo) {
            logo.traverse(child => {
                if (child.isMesh) {
                    child.material = logoMaterial;
                    child.material.needsUpdate = true;
                }
            });
        }
    })

    // === Применение к порогам ===
    thresholdNames.forEach(name => {
        const obj = window.model.getObjectByName(name);
        if (!obj) {
            console.warn(`⛔ Объект ${name} не найден`);
            return;
        }

        obj.traverse(child => {
            if (child.isMesh) {
                child.material = metalMaterial;
                child.material.needsUpdate = true;
            }
        });
    });

    const mirrorMaterial = new THREE.MeshStandardMaterial({
        color:           "#cdc9c9",
        metalness:       0.7,
        roughness:       0,
    });

    const mirrorNames = [
        "MirrorBack","MirrorBackHalf",
        "MirrorLeft","MirrorLeftHalf",
        "MirrorRight","MirrorRightHalf"
    ];

    mirrorNames.forEach(name => {
        const obj = window.model.getObjectByName(name);
        if (!obj) {
            console.warn(`⛔ Объект ${name} не найден`);
            return;
        }
        obj.traverse(child => {
            if (child.isMesh) {
                child.material = mirrorMaterial;
                child.material.needsUpdate = true;
            }
        });
    });
}

//import {isHallClicked} from "../animation/tabFunctions.js";

//let model;
export let camera, controls;
export let ambientLight;
const maxDistance = 160;
var strDownloadMime = "image/octet-stream";

export let scene;
function init() {
    const canvas = document.getElementById('elevatorCanvas');
    if (!canvas) {
        console.error('Canvas элемент не найден');
        return;
    }

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
    RectAreaLightUniformsLib.init();

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

    InitialOrbitControls();

    function GetDistanceToWall(groupWallName) {
        const group = window.model.getObjectByName(groupWallName);
        if (!group) {
            console.warn(`Group "${groupWallName}" not found.`);
            return Infinity;
        }
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
    
        return camera.position.distanceTo(center);
    }


    const idToSize = {
        wideSize: 'wide',
        squareSize: 'square',
        deepSize: 'deep'
    };


    if(getCabinSizeFromConfiguration()) {
        loadModelBySize(idToSize[getCabinSizeFromConfiguration()]);
    } else {
        window.location.href = `index.html`;
    }

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
    controls.enablePan = false;
    renderer.render(scene, camera);

    buttonView3D = document.getElementById('view3d');
     buttonViewFront = document.getElementById('viewFront');
     buttonViewUp = document.getElementById('viewUp');
     buttonViewInside = document.getElementById('viewInside');
     buttonHallViewInside = document.getElementById('hallViewInside');
     buttonDoorOpen = document.getElementById('doorsOpen');
     buttonDoorClose = document.getElementById('doorsClose');

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
            if(currentCabinSize === "wide") {
                camera.position.set(0, maxDistance, 0);
                controls.target.set(0, GetExtremeYPoint() / 2 + 15, 0);
            } else {
                camera.position.set(0, maxDistance, 0);
                controls.target.set(0, GetExtremeYPoint() / 2, 0);
            }

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

    if (buttonHallViewInside) {
        buttonHallViewInside.onclick = function () {
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
    }

    if (buttonDoorOpen) {
        buttonDoorOpen.onclick = function () {
            Visibility.setDoorVisible(false);
        };
    }

    if (buttonDoorClose) {
        buttonDoorClose.onclick = function () {
            Visibility.setDoorVisible(true);
        };
    }
}

function getCabinSizeFromConfiguration() {
    const templateConfiguration = JSON.parse(localStorage.getItem('templateConfiguration'));

    if (templateConfiguration) {
        return getCabinSize(JSON.parse(templateConfiguration));
    }

    return null;
}


async function loadConfiguration() {
const templateConfiguration = JSON.parse(localStorage.getItem('templateConfiguration'));
const templateId = JSON.parse(localStorage.getItem('templateId'));

isHallModelLoaded = false;

if (templateConfiguration) {
    //console.log(JSON.parse(templateConfiguration));
    try {
        await setAllParameters(JSON.parse(templateConfiguration));
    } catch (error) {
        console.error('Ошибка при установке параметров:', error);
        alert('Произошла ошибка при загрузке параметров.');
        window.location.href = `index.html`;
    }

    setDesignProject(templateId);
} else {
    window.location.href = `index.html`;
}

localStorage.removeItem('templateConfiguration');
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
    controls.enablePan = false;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.target.set(0, 50, 0);
    controls.maxDistance = maxDistance;
    controls.update(); 
}


export function SetSettingsBackFromHallToElevetor() {
    const checkbox = document.getElementById('toggleSwitch');
    checkbox.checked = false;
    setDoorOpen(false);

    window.hallModel.visible = false;
    if(areaLightHall) {
        areaLightHall.visible = false;
    }
    
    camera.position.set(maxDistance - 2, GetExtremeYPoint() / 2, maxDistance - 2); 
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.target.set(0, 50, 0);
    controls.maxDistance = 160;

    controls.minPolarAngle = -Infinity; // Убираем минимальный угол по вертикали
    controls.maxPolarAngle = Infinity; // Убираем максимальный угол по вертикали
    controls.minAzimuthAngle = -Infinity; // Убираем минимальный угол по горизонтали
    controls.maxAzimuthAngle = Infinity; // Убираем максимальный угол по горизонтали
    controls.update();
    renderer.render(scene, camera);

const buttons = [buttonView3D, buttonViewFront, buttonViewUp, buttonViewInside];

// Удаляем класс 'active' у всех кнопок
buttons.forEach(button => {
    if (button) {
        button.classList.remove('active');
    }
});

// Добавляем класс 'active' только к кнопке buttonView3D
if (buttonView3D) {
    buttonView3D.classList.add('active');
}
}

 // Получаем все радиокнопки с именем 'availability_portal'
 const radioButtons = document.querySelectorAll('input[name="availability_portal"]');

 // Добавляем обработчик события 'change' для каждой радиокнопки
 radioButtons.forEach(radio => {
     radio.addEventListener('change', () => {
         if (radio.checked) {
            setFrameExistence(radio.id);
            Visibility.setPortalVisible(radio.value === "have_portal");
         }
     });
 });


 export async function loadHall() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('configurator-container').style.visibility = 'hidden';

    const hallModelPaths = {
        wide: `${MODEL_BASE_PATH}wideHallModel.fbx`,
        square: `${MODEL_BASE_PATH}squareHallModel.fbx`,
        deep: `${MODEL_BASE_PATH}deepHallModel.fbx`,
    }; 

    const hallPositions = {
        wide: {
            central: new THREE.Vector3(1.4, 0, -14),
            right: new THREE.Vector3(10.6, 0, -14),
            left: new THREE.Vector3(-7.2, 0, -14),
        },
        square: {
            central: new THREE.Vector3(-1.7, 2, -4.5),
            right: new THREE.Vector3(8.15, 2, -4.5),
            left: new THREE.Vector3(-11.55, 2, -4.5),
        },
        deep: {
            central: new THREE.Vector3(-2, 0, -5.6),
            left: new THREE.Vector3(-5.65, 0, -5.6),
            right: new THREE.Vector3(1.25, 0, -5.6),
        },
    };

    const hallLightSize = {
        wide: {
            length: 415,
            width: 510
        },
        square: {
            length: 415,
            width: 510
        },
        deep: {
            length: 380,
            width: 510
        },
    };

    const openTypeToProp = {
        centralOpenType: 'central',
        leftOpenType: 'right', 
        rightOpenType: 'left',
    };

    // 2. Получаем параметры
    let doorState = getDoorState();
    let doorTexture = doorState.texture;
    let openType = getOpeningTypeParam();
    let positionType = openTypeToProp[openType];

    // 3. Проверяем загружена ли модель
    if(isHallModelLoaded) {
        window.hallModel.visible = true;
        if(areaLightHall) {
            areaLightHall.visible = true;
        }
        
        await setActiveTextureByContainerNameHallVersion('wallHallTextures', doorTexture);

        // 4. Исправленное условие для изменения позиции
        if(currentOpenType && currentOpenType !== openType) {
            if(hallPositions[currentCabinSize] && hallPositions[currentCabinSize][positionType]) {
                // Диагностика
                console.group('Обновление позиции холла');
                const targetPos = hallPositions[currentCabinSize][positionType];
                console.log('Целевая позиция:', targetPos);
                
                // Устанавливаем позицию
                window.hallModel.position.copy(targetPos);
                window.hallModel.updateMatrixWorld(true);
                
                // Проверка
                const actualWorldPos = new THREE.Vector3();
                window.hallModel.getWorldPosition(actualWorldPos);
                console.log('Фактическая позиция после обновления:', actualWorldPos);
                console.groupEnd();
            }
        }
        currentOpenType = openType;
    } else {
        // 5. Загрузка новой модели
        const path = hallModelPaths[currentCabinSize];
        if (!path) return;

        function disposeModel(model) {
            if (!model) return;
        
            model.traverse(child => {
                if (child.isMesh) {
                    // Очищаем геометрию
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
        
                    // Очищаем материалы и текстуры
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => {
                                disposeMaterial(material);
                            });
                        } else {
                            disposeMaterial(child.material);
                        }
                    }
                }
            });
        
            scene.remove(model);
        }
        
        function disposeMaterial(material) {
            material.dispose();
            
            // Очищаем текстуры
            for (const key of Object.keys(material)) {
                const value = material[key];
                if (value && value.isTexture) {
                    value.dispose();
                }
            }
        }

        const fbxLoader = new FBXLoader();
        await new Promise((resolve, reject) => {
            fbxLoader.load(
                path,
                async (object) => {
                    try {
                        if (!hallPositions[currentCabinSize] || !hallPositions[currentCabinSize][positionType]) {
                            throw new Error('Не найдена позиция для текущей конфигурации');
                        }

                        console.log("I-m loading new hall");
                        object.position.copy(hallPositions[currentCabinSize][positionType]);
                        currentOpenType = openType;

                        if (window.hallModel) {
                            /*// 1. Удаляем модель из сцены и чистим ресурсы
                            window.hallModel.children.forEach(child => {
                                if (child.dispose) child.dispose();
                                window.hallModel.remove(child);
                            });*/

                            // 2. Рекурсивно очищаем геометрию и материалы
                            disposeModel(window.hallModel);

                            scene.remove(window.hallModel);
                            window.hallModel = null;
                        
                            // 3. Удаляем свет (если он существует)
                            if (areaLightHall) {
                                scene.remove(areaLightHall);
                                areaLightHall.dispose();
                                areaLightHall = null; // Очищаем ссылку
                            }
                        
                            //window.hallModel = null; // Важно: убираем ссылку
                        }
                    
                        scene.add(object);
                        window.hallModel = object;

                        await Promise.all([
                            applyColorToElements(),
                            initCallPostsHandler(window.hallModel),
                            initIndicationBoardHandler(window.hallModel)
                        ]);

                        if(!isHallSettingsSet) {
                            await setActiveFirstTextureByContainerName("portalTextures");
                            setHallSettings(true);
                        }
                       
                        await setActiveTextureByContainerNameHallVersion('wallHallTextures', doorTexture);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        isHallModelLoaded = true;

                        if(isHallSettingsSet) {
                            console.log("set:HallParams");
                            await setHallParamsActive();
                        }

                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                undefined,
                (error) => {
                    alert("Ошибка загрузки холла");
                    console.error('Ошибка загрузки FBX модели:', error);
                    reject(error);
                }
            );
        });
        
            areaLightHall = new RectAreaLight(
                0xffffff, 
                0.7, 
                hallLightSize[currentCabinSize].width,
                 hallLightSize[currentCabinSize].length 
                 );
  
            areaLightHall.position.set(-27, 120, 250);

           areaLightHall.lookAt(-27, 0, 250);
           scene.add(areaLightHall);
    }

    // 6. Настройка камеры
    camera.position.set(0, (GetExtremeYPoint() / 2) + 10, 190);
    controls.target.set(0, GetExtremeYPoint() / 2, 110);
    controls.minPolarAngle = Math.PI / 4.5;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2.5;
    controls.maxDistance = 80;
    controls.update();

    document.getElementById('loading').style.display = 'none';
    document.getElementById('configurator-container').style.visibility = 'visible';
}

export async function GetImage() {
    try {
        const strMime = "image/jpeg";
        let isHallHiden = false;

        if (isHallModelLoaded && window.hallModel.visible) {
            window.hallModel.visible = false;
            isHallHiden = true;
        }

        const originalPosition = camera.position.clone();
        const originalTarget = controls.target.clone(); // Сохраняем исходное положение target
        const originalMaxDistance = controls.maxDistance; // Сохраняем исходное значение maxDistance

        scene.background = new THREE.Color(0xffffff);

        // Устанавливаем maxDistance и позицию камеры
        controls.maxDistance = maxDistance; // Устанавливаем maxDistance для скриншота
        camera.position.set(maxDistance - 2, GetExtremeYPoint() / 2, maxDistance - 2);
        controls.target.set(0, 45, 0);
        controls.update(); // Обновляем управление

        // Рендерим сцену
        renderer.render(scene, camera);

        // Задержка, чтобы гарантировать завершение рендеринга
        await new Promise(resolve => setTimeout(resolve, 100));

        // Получаем данные изображения в формате DataURL
        const imgData = renderer.domElement.toDataURL(strMime);

        // Проверяем, получаем ли мы корректные данные
        if (!imgData || imgData === "data:,") {
            console.error("Ошибка: не удалось получить данные изображения.");
            return null;
        }

        // Восстанавливаем исходные значения
        camera.position.copy(originalPosition); // Возвращаем камеру в оригинальное положение
        controls.target.copy(originalTarget); // Возвращаем target в оригинальное положение
        controls.maxDistance = originalMaxDistance; // Восстанавливаем maxDistance
        controls.update(); // Обновляем управление

        scene.background = new THREE.Color(0xe0e0e0); 

        if (isHallHiden) {
            window.hallModel.visible = true;
        }

        // Преобразуем DataURL в Blob
        const response = await fetch(imgData);
        const blob = await response.blob();

        return blob; // Возвращаем Blob
    } catch (error) {
        console.error('Error while getting image:', error);
        return null; // Возвращаем null в случае ошибки
    }
}
