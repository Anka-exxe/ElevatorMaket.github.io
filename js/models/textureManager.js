import * as THREE from 'three';
import * as WallTextureChoice from '../shareConfiguration/wallTexturesChoice.js';
import {setDoorTexture} from '../shareConfiguration/doorParams.js';
import {setFloorTexture} from '../shareConfiguration/floorParameters.js';
import * as Ceiling from '../shareConfiguration/ceilingParams.js';
import * as Panel from '../shareConfiguration/panelParams.js';
import {setHandrailTexture} from '../shareConfiguration/handrailParams.js';
import * as Bumper from '../shareConfiguration/otherParams.js';

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
                        tex.encoding = THREE.sRGBEncoding;
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
            }
            if (bump) {
                bump.wrapS = THREE.RepeatWrapping;
                bump.wrapT = THREE.RepeatWrapping;
                //bump.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    bump.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    bump.repeat.set(1, 1);
                }
            }
            if (aoMap) {
                aoMap.wrapS = THREE.RepeatWrapping;
                aoMap.wrapT = THREE.RepeatWrapping;
                //aoMap.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    aoMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    aoMap.repeat.set(1, 1);
                }
            }
            if (displacementMap) {
                displacementMap.wrapS = THREE.RepeatWrapping;
                displacementMap.wrapT = THREE.RepeatWrapping;
                //displacementMap.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    displacementMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    displacementMap.repeat.set(1, 1);
                }
            }
            if (metalnessMap) {
                metalnessMap.wrapS = THREE.RepeatWrapping;
                metalnessMap.wrapT = THREE.RepeatWrapping;
                //metalnessMap.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    metalnessMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    metalnessMap.repeat.set(1, 1);
                }
            }
            if (normalMap) {
                normalMap.wrapS = THREE.RepeatWrapping;
                normalMap.wrapT = THREE.RepeatWrapping;
                //normalMap.colorSpace = THREE.SRGBColorSpace;
                if (materialOptions.repeat) {
                    normalMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    normalMap.repeat.set(1, 1);
                }
            }
            if (roughnessMap) {
                roughnessMap.wrapS = THREE.RepeatWrapping;
                roughnessMap.wrapT = THREE.RepeatWrapping;
                //normalMap.colorSpace = THREE.SRGBColorSpace;
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
                        transparent: alphaMap ? true : false,
                        metalness: materialOptions.metalness !== undefined ? materialOptions.metalness : 0.5,
                        roughness: materialOptions.roughness !== undefined ? materialOptions.roughness : 0.8,
                        emissive: materialOptions.emissive !== undefined ? materialOptions.emissive : new THREE.Color(0xffffee),
                        emissiveIntensity: materialOptions.emissiveIntensity !== undefined ? materialOptions.emissiveIntensity : 0
                    });
                    newMaterial.needsUpdate = true;
                    child.material = newMaterial;
                }
            });
        ццццц})
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


    // Remove 'active' class from all images in the same container
    const allImages = texturesContainer.querySelectorAll('img');
    allImages.forEach(image => {
        image.classList.remove('active');
    });

    // Add 'active' class to the clicked image
    img.classList.add('active');

console.log(tabId)

    switch (tabId) {
        case 'WallsParametersTab':
            let activeButton = tabContainer.querySelector('.form__form-element.active');
            if (activeButton) {
                const target = activeButton.getAttribute('data-target');
                switch (target) {
                    case 'all':
                        elementNames = ['FrontWall', 'BackWall', 'LeftWall', 'RightWall','BackWall1','FrontWallСentral','BackWall1Central'];
                        WallTextureChoice.setAllTextures(textureId);
                        break;
                    case 'front':
                        elementNames = ['FrontWall','FrontWallСentral'];
                        WallTextureChoice.setFrontTexture(textureId);
                        break;
                    case 'back':
                        elementNames = ['BackWall','BackWall1', 'BackWall1Central'];
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
            elementNames = ['Floor','BackThreshold','FrontThreshold'];
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
            elementNames = ['Door','DoorCentral','Door1','Door1Central'];
            setDoorTexture(textureId);
            break;
        case 'OtherParametrsTab':
            var active = tabContainer.querySelector('.form__form-element.active');
            const target = active.getAttribute('data-target');
            switch (target) {
                case 'all':
                    elementNames = ['RightBumper','LeftBumper','BackBumper'];
                    Bumper.setAllTextures(textureId);
                    break;
                case 'back':
                    elementNames = ['BackBumper'];
                    Bumper.setBackTexture(textureId);
                    break;
                case 'left':
                    elementNames = ['LeftBumper'];
                    Bumper.setLeftTexture(textureId);
                    break;
                case 'right':
                    elementNames = ['RightBumper'];
                    Bumper.setRightTexture(textureId);
                    break;
                default:
                    console.error('Неизвестное значение data-target:', target);
            elementNames = ['RightBumper','LeftBumper','BackBumper'];
            return;
        }
        break;
        case 'HandrailParametrsTab':
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

export function applyDefaultElevatorTextures() {
    if (!model) {
        console.error("Модель еще не загружена");
        return;
    }

    const defaultTexturesMapping = [
        {
            elementNames: ['FrontWall'],
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['FrontWallСentral'],
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['BackWall'],
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['BackWall1'],
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['BackWall1Central'],
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['LeftWall'],
            texture: './Textures/base.jpg',
            alpha: null,
            bump:null,
            aoMap: './Textures/ao.png',
            displacementMap: './Textures/displacement.png',
            metalnessMap: './Textures/metalic.png',
            normalMap: './Textures/normal.png',
            options: {
                metalness: 0.8,
                roughness: 0.4,
                color: 0x7C7C7C,
            }
        },
        {
            elementNames: ['RightWall'],
            texture: './TextureWall/brushed.jpg',
            alpha: null,
            bump:null,
            aoMap: './TextureWall/DisplacementMap1.png',
            displacementMap:'./TextureWall/DisplacementMap1.png',
            metalnessMap: './TextureWall/DisplacementMap2.png',
            normalMap: './TextureWall/NormalMap.png',
            options: { metalness: 0.6, roughness: 0.5, color: 0x7C7C7C}
        },
        {
            elementNames: ['Floor'],
            texture: './Пол_Текстура/nero marquina.jpg',
            alpha: null,
            options: { metalness: 0.2, roughness: 0.8 }
        },
        {
            elementNames: ['Threshold'],
            texture: './Пол_Текстура/nero marquina.jpg',
            alpha: null,
            options: { metalness: 0.2, roughness: 0.8 }
        },
        {
            elementNames: ['ThresholdCentral'],
            texture: './Пол_Текстура/nero marquina.jpg',
            alpha: null,
            options: { metalness: 0.2, roughness: 0.8 }
        },
        {
            elementNames: ['Threshold1'],
            texture: './Пол_Текстура/nero marquina.jpg',
            alpha: null,
            options: { metalness: 0.2, roughness: 0.8 }
        },
        {
            elementNames: ['Threshold1Central'],
            texture: './Пол_Текстура/nero marquina.jpg',
            alpha: null,
            options: { metalness: 0.2, roughness: 0.8 }
        },
        {
            elementNames: ['Ceiling'],
            texture: './Потолок/RAL-7035-Svetlo-serii.png',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['Lamp'],
            texture: './Потолок/RAL-7035-Svetlo-serii.png',
            alpha: './Потолок_Текстуры/Р04.png',
            options: {
                metalness: 0,
                roughness: 0.8,
                emissive: new THREE.Color(0xffffee),
                emissiveIntensity: 1
            }
        },
        {
            elementNames: ['Door'],
            texture: './Двери/RAL-7035-Svetlo-serii.png',
            alpha: null,
            options: { metalness: 0.8, roughness: 0.8 }
        },
        {
            elementNames: ['Door1'],
            texture: './Двери/RAL-7035-Svetlo-serii.png',
            alpha: null,
            options: { metalness: 0.8, roughness: 0.8 }
        },
        {
            elementNames: ['ControlPanel'],
            texture: './Двери/RAL-7035-Svetlo-serii.png',
            alpha: null,
            options: { metalness: 0.3, roughness: 0.7 }
        },
        {
            elementNames: ['DisplayVertical'],
            texture: './Табло/TL-D70.png',
            alpha: null,
            options: { metalness: 0.3, roughness: 0.7 }
        },
        {
            elementNames: ['buttons(ControlPanel)'],
            texture: './Стены_Текстуры/DL89E_glossiness.jpg',
            alpha: null,
            options: { metalness: 0.3, roughness: 0.7 }
        },
        {
            elementNames: ['HandrailsGroup'],
            texture: './Стены/шлифованная нержавейка.jpg',
            alpha: null,
            options: { metalness: 1, roughness: 0.7 }
        },
        {
            elementNames: ['BumperGroup'],
            texture: './Стены/шлифованная нержавейка.jpg',
            alpha: null,
            options: { metalness: 1, roughness: 0.7 }
        },
    ];

    // Для каждого набора настроек применяем текстуру к соответствующим объектам
    defaultTexturesMapping.forEach(mapping => {
        applyTextureToElement(model,
            mapping.elementNames,
            '#ffffff',
            mapping.texture,
            mapping.alpha,
            mapping.bump,
            mapping.aoMap,
            mapping.displacementMap,
            mapping.metalnessMap,
            mapping.normalMap,
            mapping.roughnessMap,
            mapping.options);
    });
}





