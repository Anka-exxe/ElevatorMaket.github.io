import * as THREE from 'three';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import {DefaultSettings} from "./unusiallElements.js";
import {GetExtremeZPoint, GetExtremeXPoint, GetExtremeYPoint} from "./positionManager.js";
import * as Visibility from "./setVisibilityManager.js";
import * as Element from "./elementNames.js";
import {setAllParameters} from 
    "../shareConfiguration/allParams.js";
    import {setDesignProject} from 
    "../shareConfiguration/mainParams.js";

let currentModel = null;

export async function loadModelBySize(idToSizeElement) {
    const loader = new FBXLoader();
    const modelPaths = {
        wide: './liftModels/wideModel.fbx',
        square: './liftModels/squareModel.fbx',
        deep: './liftModels/deepModel.fbx',
    };

    const path = modelPaths[idToSizeElement];
    if (!path) return;

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

            await loadConfiguration();

            console.log("Загружено")

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
}
//import {isHallClicked} from "../animation/tabFunctions.js";

let model;
let camera, renderer, controls;
const maxDistance = 160;
var strDownloadMime = "image/octet-stream";
let isHallModelLoaded = false;
export let scene;
function init() {
    console.log('init');
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

    let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 60, 100);
    directionalLight.target.position.set(0, 30, 0);
    scene.add(directionalLight);

     //let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
     //scene.add(directionalLightHelper);

    let directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(100, 60, 0);
    directionalLight1.target.position.set(0, 30, 0);
    scene.add(directionalLight1);

     //let directionalLightHelper1 = new THREE.DirectionalLightHelper(directionalLight1, 3);
     //scene.add(directionalLightHelper1);

    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight2.position.set(-100, 60, 0);
    directionalLight2.target.position.set(0, 30, 0);
    scene.add(directionalLight2);

     //let directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 3);
     //scene.add(directionalLightHelper2);

    let directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
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
    loadModelBySize('square')

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

    const buttonView3D = document.getElementById('view3d');
    const buttonViewFront = document.getElementById('viewFront');
    const buttonViewUp = document.getElementById('viewUp');
    const buttonViewInside = document.getElementById('viewInside');
    const buttonHallViewInside = document.getElementById('hallViewInside');
    const buttonDoorOpen = document.getElementById('doorsOpen');
    const buttonDoorClose = document.getElementById('doorsClose');

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

async function loadConfiguration() {
const templateConfiguration = JSON.parse(localStorage.getItem('templateConfiguration'));
const templateId = JSON.parse(localStorage.getItem('templateId'));

if (templateConfiguration) {
    console.log(JSON.parse(templateConfiguration));
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

//localStorage.removeItem('templateConfiguration');
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

// Логика для разных ракурсов для кнопок
// const buttonView3D = document.getElementById('view3d');
// const buttonViewFront = document.getElementById('viewFront');
// const buttonViewUp = document.getElementById('viewUp');
// const buttonViewInside = document.getElementById('viewInside');
// const buttonHallViewInside = document.getElementById('hallViewInside');
// const buttonDoorOpen = document.getElementById('doorsOpen');
// const buttonDoorClose = document.getElementById('doorsClose');


export function SetSettingsBackFromHallToElevetor() {
    window.hallModel.visible = false;
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
            Visibility.setPortalVisible(radio.value === "have_portal");
         }
     });
 });


export async function loadHall() {
    document.getElementById('loading').style.display = 'flex'; // Скрыть индикатор загрузки
    document.getElementById('configurator-container').style.visibility = 'hidden'; 

    if(isHallModelLoaded) {
        window.hallModel.visible = true;
        document.getElementById('loading').style.display = 'none'; // Скрыть индикатор загрузки
        document.getElementById('configurator-container').style.visibility = 'visible'; 
    } else {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            './hallModels/model18.fbx',
            async (object) => {
                object.position.set(0, 0, 0);
                object.scale.set(0.4, 0.4, 0.4);
                scene.add(object);
                model = object;
                window.hallModel = model;
        
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.computeVertexNormals(); // Пересчитать нормали
                    }
                });
        
                animate();
        
                document.getElementById('loading').style.display = 'none'; // Скрыть индикатор загрузки
                document.getElementById('configurator-container').style.visibility = 'visible'; 
        
               
                isHallModelLoaded= true;
            },
            undefined,
            (error) => {
                alert("Ошибка загрузки холла");
                console.error('Ошибка загрузки FBX модели:', error);
            }
        );
        
        const pointLight = new THREE.PointLight(0xffffff, 100, 1000);
        pointLight.position.set(0, 80, 200);
        scene.add(pointLight);
    }

    camera.position.set(0, (GetExtremeYPoint() / 2) + 10, 300);
        
    controls.target.set(0, GetExtremeYPoint() / 2, 210);
    controls.minPolarAngle = Math.PI / 4; // Минимальный угол по вертикали (в радианах)
    controls.maxPolarAngle = Math.PI / 1.7; // Максимальный угол по вертикали (в радианах)
    controls.minAzimuthAngle = -Math.PI / 2; // Минимальный угол по горизонтали (в радианах)
    controls.maxAzimuthAngle = Math.PI / 2; // Максимальный угол по горизонтали (в радианах)
    controls.maxDistance = 100;
    controls.update();
}

function animate() {
    requestAnimationFrame(animate); // Запрашиваем следующий кадр анимации

    renderer.render(scene, camera); // Рендерим сцену
}

export async function GetImage() {
    try {
        const strMime = "image/jpeg";

        const originalPosition = camera.position.clone();
        const originalTarget = controls.target.clone(); // Сохраняем исходное положение target
        const originalMaxDistance = controls.maxDistance; // Сохраняем исходное значение maxDistance

        // Устанавливаем maxDistance и позицию камеры
        controls.maxDistance = maxDistance; // Устанавливаем maxDistance для скриншота
        camera.position.set(maxDistance - 2, GetExtremeYPoint() / 2, maxDistance - 2);
        controls.target.set(0, 50, 0);
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


        // Преобразуем DataURL в Blob
        const response = await fetch(imgData);
        const blob = await response.blob();

        return blob; // Возвращаем Blob

    } catch (error) {
        console.error('Error while getting image:', error);
        return null; // Возвращаем null в случае ошибки
    }
}