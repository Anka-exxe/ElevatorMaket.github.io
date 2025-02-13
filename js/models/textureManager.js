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
            model.traverse((child) => {
                if (child.isMesh && elementNamesArr.includes(child.name)) {
                    let newMaterial = child.material && child.material.isMaterial
                        ? child.material.clone()
                        : new THREE.MeshStandardMaterial();
                    newMaterial.map = texture;
                    if (alphaMap) {
                        newMaterial.alphaMap = alphaMap;
                        newMaterial.transparent = true;
                    }
                    Object.assign(newMaterial, materialOptions);
                    newMaterial.needsUpdate = true;
                    child.material = newMaterial;
                }
            });
        })
        .catch((error) => {
            console.error("Ошибка загрузки текстуры или альфа-карты:", error);
        });
}


export function handleTextureClick(event) {
    const img = event.currentTarget;
    const textureURL = img.getAttribute('data-texture-url');
    const alphaURL = img.getAttribute('data-alpha-url') || null;

    // Определяем категорию по ближайшей вкладке
    const texturesContainer = img.closest('.textures-container');
    const tabContainer = texturesContainer.closest('.menu-container__content');
    const tabId = tabContainer ? tabContainer.id : null;
    let elementNames = [];

    switch (tabId) {
        case 'WallsParametersTab':
            // Пример: если в модели имена для стен – 'FrontWall1', 'FrontWall2', 'BackWall1', 'BackWall2' и т.д.
            elementNames = ['FrontWall1', 'FrontWall2', 'BackWall1', 'BackWall2', 'LeftWall', 'RightWall'];
            break;
        case 'CeilingParametrsTab':
            elementNames = ['Ceiling'];
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
        default:
            console.error("Неизвестная вкладка:", tabId);
            return;
    }

    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }
    // Применяем текстуру с дополнительными опциями (при необходимости)
    applyTextureToElement(window.model, elementNames, textureURL, alphaURL, { metalness: 0.5, roughness: 0.8 });
}
