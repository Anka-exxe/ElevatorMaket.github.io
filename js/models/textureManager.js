import * as THREE from 'three';

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
                if (materialOptions.repeat) {
                    texture.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
                } else {
                    texture.repeat.set(1, 1);
                }
            }
            if (alphaMap) {
                alphaMap.wrapS = THREE.RepeatWrapping;
                alphaMap.wrapT = THREE.RepeatWrapping;
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
                        transparent: alphaMap ? true : false,
                        metalness: materialOptions.metalness !== undefined ? materialOptions.metalness : 0.5,
                        roughness: materialOptions.roughness !== undefined ? materialOptions.roughness : 0.8,
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

    const texturesContainer = img.closest('.textures-container');
    const tabContainer = texturesContainer.closest('.menu-container__content');
    const tabId = tabContainer ? tabContainer.id : null;
    let elementNames = [];

console.log(tabId)

    switch (tabId) {
        case 'WallsParametersTab':
            let activeButton = tabContainer.querySelector('.form__form-element.active');
            if (activeButton) {
                const target = activeButton.getAttribute('data-target');
                switch (target) {
                    case 'all':
                        elementNames = ['FrontWall', 'BackWall', 'LeftWall', 'RightWall'];
                        break;
                    case 'front':
                        elementNames = ['FrontWall'];
                        break;
                    case 'back':
                        elementNames = ['BackWall'];
                        break;
                    case 'left':
                        elementNames = ['LeftWall'];
                        break;
                    case 'right':
                        elementNames = ['RightWall'];
                        break;
                    default:
                        console.error('Неизвестное значение data-target:', target);
                }
            } else {
                console.error('Не найдена активная кнопка выбора стены.');
            }
            break;
        case 'CeilingParametrsTab':
            elementNames = ['Lamp'];
            break;
        case 'FloorParametrsTab':
            elementNames = ['Floor'];
            break;
        case 'BoardParametrsTab':
            elementNames = ['ControlPanel'];
            break;
        case 'DoorParametrsTab':
            elementNames = ['Door'];
            break;
        case 'OtherParametrsTab':
            elementNames = ['RightBumper','LeftBumper','BackBumper'];
            break;
        default:
            console.error("Неизвестная вкладка:", tabId);
            return;
    }

    if (!model) {
        console.error("Модель еще не загружена");
        return;
    }
    defaultVisibility();
    // Применяем текстуру с дополнительными опциями (при необходимости)
    applyTextureToElement(model, elementNames, textureURL, alphaURL, { metalness: 0.5, roughness: 0.8 });
}

export function defaultMaterial(){

    /*applyTextureToElement(model,
        ['FrontWall', 'BackWall', 'LeftWall', 'RightWall'],
        './Стены/DL89E_diffuse.jpg',
        "",
        { metalness: 0, roughness: 0.8 });

    defaultVisibility();*/

}

function defaultVisibility() {
    model.getObjectByName('LeftDoor1').visible = false;
    model.getObjectByName('RightDoor1').visible = false;
    model.getObjectByName('BackWall11').visible = false;
    model.getObjectByName('BackWall12').visible = false;
    model.getObjectByName('BackWall13').visible = false;
    model.getObjectByName('BackWall14').visible = false;
    model.getObjectByName('RightMirror1').visible = false;
    model.getObjectByName('RightMirror2').visible = false;
    model.getObjectByName('Threshold1').visible = false;
    model.getObjectByName('RightHandrail11').visible = false;
    model.getObjectByName('RightHandrail12').visible = false;
    model.getObjectByName('RightHandrail13').visible = false;
    model.getObjectByName('RightHandrail14').visible = false;
    model.getObjectByName('RightHandrail15').visible = false;
    model.getObjectByName('RightHandrail16').visible = false;
    model.getObjectByName('RightHandrail17').visible = false;
    model.getObjectByName('RightHandrail18').visible = false;
    model.getObjectByName('BackHandrail11').visible = false;
    model.getObjectByName('BackHandrail12').visible = false;
    model.getObjectByName('BackHandrail13').visible = false;
    model.getObjectByName('BackWall1').visible = false;
}



