import * as THREE from 'three';
import * as WallTextureChoice from '../shareConfiguration/wallTexturesChoice.js';
import {setDoorTexture} from '../shareConfiguration/doorParams.js';
import {setFloorTexture} from '../shareConfiguration/floorParameters.js';
import * as Ceiling from '../shareConfiguration/ceilingParams.js';
import * as Panel from '../shareConfiguration/panelParams.js';
import {setHandrailTexture} from '../shareConfiguration/handrailParams.js';
import * as Bumper from '../shareConfiguration/otherParams.js';

export function applyTextureToElement(model, elementNames, textureInput, alphaMapInput = null, materialOptions = {}) {
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

    Promise.all([loadTexture(textureInput), loadTexture(alphaMapInput)])
        .then(([texture, alphaMap]) => {
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
                texture.colorSpace = THREE.SRGBColorSpace
                if (materialOptions.repeatAlpha) {
                    alphaMap.repeat.set(materialOptions.repeatAlpha.x, materialOptions.repeatAlpha.y);
                } else {
                    alphaMap.repeat.set(1, 1);
                }
            }
            model.traverse((child) => {
                if (child.isMesh && (elementNamesArr.includes(child.name) || hasAncestorWithName(child, elementNamesArr))) {
               
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        map: texture,
                        alphaMap: alphaMap,
                        // bumpMap: texture,
                        // bumpScale: 0.5,
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
    const textureURL = img.getAttribute('data-texture-url');
    const alphaURL = img.getAttribute('data-alpha-url') || null;
    const textureId = img.getAttribute('data-texture-id');

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
                    textureURL,
                    alphaURL,
                    {
                        metalness: 0,
                        roughness: 0.8,
                        emissive: new THREE.Color(0xffffee),
                        emissiveIntensity: 1
                    });
                return;
            } else if (textureType === "material") {
                Ceiling.setCeilingMaterial(textureId);
                elementNames = ['Ceiling'];
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

    applyTextureToElement(model, elementNames, textureURL, alphaURL, { metalness: 0.5, roughness: 0.8 });
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
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
        },
        {
            elementNames: ['RightWall'],
            texture: './Стены/DL89E_diffuse.jpg',
            alpha: null,
            options: { metalness: 0, roughness: 0.8 }
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
            alpha: './Потолок_Текстуры/Р17.png',
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
        applyTextureToElement(model, mapping.elementNames, mapping.texture, mapping.alpha, mapping.options);
    });

    defaultVisibility();
}

function CreateMirror()
{
    const mirrorMesh = model.getObjectByName('Mirror');
    if (mirrorMesh) {

        const reflector = new Reflector(mirrorMesh.geometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0x889999
        });

        reflector.position.copy(mirrorMesh.position);
        reflector.rotation.copy(mirrorMesh.rotation);
        reflector.scale.copy(mirrorMesh.scale);

        mirrorMesh.parent.add(reflector);
        mirrorMesh.visible = false;
    } else {
        console.error('Элемент "Mirror" не найден в модели');
    }
}

function defaultVisibility() {
    //model.getObjectByName('LeftDoor1').visible = false;
    //model.getObjectByName('RightDoor1').visible = false;
    //model.getObjectByName('BackWall11').visible = false;
    //model.getObjectByName('BackWall12').visible = false;
    //model.getObjectByName('BackWall13').visible = false;
    //model.getObjectByName('BackWall14').visible = false;
    //model.getObjectByName('RightMirror1').visible = false;
    //model.getObjectByName('RightMirror2').visible = false;
    //model.getObjectByName('Threshold1').visible = false;
    /*model.getObjectByName('RightHandrail11').visible = false;
    model.getObjectByName('RightHandrail12').visible = false;
    model.getObjectByName('RightHandrail13').visible = false;
    model.getObjectByName('RightHandrail14').visible = false;
    model.getObjectByName('RightHandrail15').visible = false;
    model.getObjectByName('RightHandrail16').visible = false;
    model.getObjectByName('RightHandrail17').visible = false;
    model.getObjectByName('RightHandrail18').visible = false;
    model.getObjectByName('BackHandrail11').visible = false;
    model.getObjectByName('BackHandrail12').visible = false;
    model.getObjectByName('BackHandrail13').visible = false;*/
    model.getObjectByName('DisplayHorisontal').visible = false;
}



