﻿import * as THREE from 'three';
import * as WallTextureChoice from '../shareConfiguration/wallTexturesChoice.js';
import {setDoorTexture} from '../shareConfiguration/doorParams.js';
import {setFloorTexture} from '../shareConfiguration/floorParameters.js';
import * as Ceiling from '../shareConfiguration/ceilingParams.js';
import * as Panel from '../shareConfiguration/panelParams.js';
import {setHandrailTexture} from '../shareConfiguration/handrailParams.js';
import * as Bumper from '../shareConfiguration/otherParams.js';
import {currentCabinSize} from "./loadModel.js";

let currentCeilingTextureURL = null;
export function applyTextureToElement(model,
                                      elementNames,
                                      color,
                                      textureInput,
                                      alphaMapInput = null,
                                      bump= null,
                                      aoMap= null,
                                      displacementMap= null,
                                      metalnessMap= null,
                                      normalMap= null,
                                      roughnessMap= null,
                                      materialOptions = {}) {
    const elementNamesArr = Array.isArray(elementNames) ? elementNames : [elementNames];
    const textureLoader = new THREE.TextureLoader();

    const loadTexture = (input) => {
        return new Promise((resolve, reject) => {
            if (typeof input === 'string' && input) {
                textureLoader.load(
                    input,
                    (tex) => {
                        tex.colorSpace = THREE.SRGBColorSpace;
                        resolve(tex);
                    },
                    undefined,
                    reject
                );
            } else {
                resolve(input);
            }
        });
    };

    Promise.all([
        color,
        loadTexture(textureInput),
        loadTexture(alphaMapInput),
        loadTexture(bump),
        loadTexture(aoMap),
        loadTexture(displacementMap),
        loadTexture(metalnessMap),
        loadTexture(normalMap),
        loadTexture(roughnessMap)
    ])
        .then(([color,
                   texture,
                   alphaMap,
                   bump,
                   aoMap,
                   displacementMap,
                   metalnessMap,
                   normalMap,
                   roughnessMap
               ]) => {
            if (texture) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    texture.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    texture.repeat.set(1, 1);
                }
            }
            if (alphaMap) {
                alphaMap.wrapS = THREE.RepeatWrapping;
                alphaMap.wrapT = THREE.RepeatWrapping;
                //alphaMap.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    alphaMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    alphaMap.repeat.set(1, 1);
                }

                if (elementNamesArr.includes('Lamp')) {
                    if (currentCabinSize !== 'square') {
                        alphaMap.center = new THREE.Vector2(0.5, 0.5);
                        alphaMap.rotation = Math.PI / 2;
                    }
                }
            }
            if (bump) {
                bump.wrapS = THREE.RepeatWrapping;
                bump.wrapT = THREE.RepeatWrapping
                if (materialOptions.repeat) {
                    bump.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    bump.repeat.set(1, 1);
                }
            }
            if (aoMap) {
                aoMap.wrapS = THREE.RepeatWrapping;
                aoMap.wrapT = THREE.RepeatWrapping;
                if (materialOptions.repeat) {
                    aoMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    aoMap.repeat.set(1, 1);
                }
            }
            if (displacementMap) {
                displacementMap.wrapS = THREE.RepeatWrapping;
                displacementMap.wrapT = THREE.RepeatWrapping;
                if (materialOptions.repeat) {
                    displacementMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    displacementMap.repeat.set(1, 1);
                }
            }
            if (metalnessMap) {
                metalnessMap.wrapS = THREE.RepeatWrapping;
                metalnessMap.wrapT = THREE.RepeatWrapping;
                if (materialOptions.repeat) {
                    metalnessMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    metalnessMap.repeat.set(1, 1);
                }
            }
            if (normalMap) {
                normalMap.wrapS = THREE.RepeatWrapping;
                normalMap.wrapT = THREE.RepeatWrapping;
                if (materialOptions.repeat) {
                    normalMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    normalMap.repeat.set(1, 1);
                }
            }
            if (roughnessMap) {
                roughnessMap.wrapS = THREE.RepeatWrapping;
                roughnessMap.wrapT = THREE.RepeatWrapping;
                if (materialOptions.repeat) {
                    roughnessMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    roughnessMap.repeat.set(1, 1);
                }
            }

            model.traverse((child) => {
                if (child.isMesh && (elementNamesArr.includes(child.name) || hasAncestorWithName(child, elementNamesArr))) {
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: color !== undefined ? color : 0xffffff,
                        map: texture,
                        alphaMap: alphaMap,
                        bumpMap: bump,
                        bumpScale: 0.5,
                        aoMap: aoMap,
                        displacementMap: displacementMap,
                        displacementScale: 0,
                        metalnessMap: metalnessMap,
                        normalMap: normalMap,
                        roughnessMap: roughnessMap,
                        transparent: !!alphaMap,
                        metalness: (materialOptions.metalness !== undefined && materialOptions.metalness !== null && materialOptions.metalness !== "null")
                            ? parseFloat(materialOptions.metalness)
                            : 0.5,
                        roughness: (materialOptions.roughness !== undefined && materialOptions.roughness !== null && materialOptions.roughness !== "null")
                            ? parseFloat(materialOptions.roughness)
                            : 0.8,
                        emissive: materialOptions.emissive !== undefined ? materialOptions.emissive : new THREE.Color(0xffffff),
                        emissiveIntensity: materialOptions.emissiveIntensity !== undefined ? parseFloat(materialOptions.emissiveIntensity) : 0
                    });
                    newMaterial.needsUpdate = true;
                    child.material = newMaterial;
                }
            });
        })
        .catch((error) => {
            console.error("Ошибка загрузки текстуры или альфа-карты:", error);
        });
}


    function hasAncestorWithName(object, names) {
    let parent = object.parent;
    while (parent) {
        if (names.includes(parent.name)) return true;
        parent = parent.parent;
    }
    return false;
}


export function handleTextureClick(event) {
    const img = event.currentTarget;
    const textureId = img.getAttribute('data-texture-id');
    const textureURL = img.getAttribute('data-texture-url') || null;
    const alphaURL = img.getAttribute('data-alpha-url') || null;
    const bumpUrl = img.getAttribute('data-bump-url') || null;
    const aoURL = img.getAttribute('data-ao-url') || null;
    const displacementURL = img.getAttribute('data-displacement-url') || null;
    const metalnessURL = img.getAttribute('data-metalness-url') || null;
    const roughnessURL = img.getAttribute('data-roughness-url') || null;
    const normalURL = img.getAttribute('data-normal-url') || null;

    const bumpScale = img.getAttribute('data-bump-scale') || null;
    const metalness = img.getAttribute('data-metalness') || null;
    const roughness = img.getAttribute('data-roughness') || null;
    const emissive = img.getAttribute('data-emissive-intensity') || null;
    const color = img.getAttribute('data-color') || null;

    const texturesContainer = img.closest('.textures-container');
    const tabContainer = texturesContainer.closest('.menu-container__content');
    const textureType = texturesContainer ? texturesContainer.getAttribute('data-texture-type') : null;
    const tabId = tabContainer ? tabContainer.id : null;
    let elementNames = [];


    const allImages = texturesContainer.querySelectorAll('img');
    allImages.forEach(image => {
        image.classList.remove('active');
    });

    img.classList.add('active');

console.log(tabId)

    switch (tabId) {
        case 'WallsParametersTab':
            let activeButton = tabContainer.querySelector('.form__form-element.active');
            if (activeButton) {
                const target = activeButton.getAttribute('data-target');
                switch (target) {
                    case 'all':
                        elementNames = ['FrontWall', 'BackWall', 'LeftWall', 'RightWall','BackWall1','FrontWallСentral','BackWall1Central','FrontWallLeft','BackWall1Left'];
                        WallTextureChoice.setAllTextures(textureId);
                        break;
                    case 'front':
                        elementNames = ['FrontWall','FrontWallСentral','FrontWallLeft'];
                        WallTextureChoice.setFrontTexture(textureId);
                        break;
                    case 'back':
                        elementNames = ['BackWall','BackWall1', 'BackWall1Central','BackWall1Left'];
                        WallTextureChoice.setBackTexture(textureId);
                        break;
                    case 'left':
                        elementNames = ['LeftWall'];
                        WallTextureChoice.setLeftTexture(textureId);
                        break;
                    case 'right':
                        elementNames = ['RightWall'];
                        WallTextureChoice.setRightTexture(textureId);
                        break;
                    default:
                        console.error('Неизвестное значение data-target:', target);
                }
            } else {
                console.error('Не найдена активная кнопка выбора стены.');
                alert('Не выбрана стена, к которой необходимо применить текстуру');
            }
            break;
        case 'CeilingParametrsTab':
            if (textureType === "pattern") {
                elementNames = ['Lamp'];
                Ceiling.setCeilingPlafon(textureId);
                applyTextureToElement(
                    model,
                    elementNames,
                    color,
                    currentCeilingTextureURL ,
                    alphaURL,
                    bumpUrl,
                    aoURL,
                    displacementURL,
                    metalnessURL,
                    normalURL,
                    roughnessURL,
                    {
                        metalness: metalness,
                        roughness: roughness,
                        emissive: new THREE.Color(0xffffee),
                        emissiveIntensity: emissive,
                    });
                return;
            } else if (textureType === "material") {
                Ceiling.setCeilingMaterial(textureId);
                elementNames = ['Ceiling'];
                currentCeilingTextureURL = textureURL;
            }
            break;
        case 'FloorParametrsTab':
            elementNames = ['Floor'];
            setFloorTexture(textureId);
            break;
        case 'BoardParametrsTab':
            if (textureType === "panel") {
                Panel.setBoard(textureId);
                elementNames = ['DisplayHorisontal', 'DisplayVertical'];
            } else if (textureType === "panelColor") {
                Panel.setPanelMaterial(textureId);
                elementNames = ['ControlPanel'];
            }
            break;
        case 'DoorParametrsTab':
            elementNames = ['Door','DoorCentral','DoorLeft','Door1','Door1Central','Door1Left'];
            setDoorTexture(textureId);
            break;
        case 'OtherParametrsTab':
            elementNames = ['RightBumper','LeftBumper','BackBumper'];
            Bumper.setAllTextures(textureId);
            elementNames = ['RightBumper','LeftBumper','BackBumper'];
        break;
        case 'HandrailParametrsTab':
            elementNames = ['HandrailUnified','HandrailComposite'];
            setHandrailTexture(textureId);
             break;
        default:
            console.error("Неизвестная вкладка:", tabId);
            return;
    }

    if (!model) {
        console.error("Модель еще не загружена");
        return;
    }

    applyTextureToElement(
        model,
        elementNames,
        color,
        textureURL,
        alphaURL,
        bumpUrl,
        aoURL,
        displacementURL,
        metalnessURL,
        normalURL,
        roughnessURL,
        {
            metalness: metalness,
            roughness: roughness,
        });
}