import * as THREE from 'three';
import * as Element from "./elementNames.js";

function applyTextures(objectName, color, albedoTextureURL  = null, normalTextureURL = null, 
    roughnessTextureURL = null, roughnessProp = null, metalnessProp = null) {
    const textureLoader = new THREE.TextureLoader();

    // Загрузка текстур с Promise для асинхронной обработки
    const loadTexture = (url) => {
        return new Promise((resolve) => {
            if (!url) return resolve(null);
            textureLoader.load(url, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                resolve(texture);
            }, undefined, (error) => {
                console.error(`Error loading texture: ${url}`, error);
                resolve(null);
            });
        });
    };

    Promise.all([
        loadTexture(albedoTextureURL),
        loadTexture(normalTextureURL),
        loadTexture(roughnessTextureURL)
    ]).then(([albedoTexture, normalTexture, roughnessTexture]) => {
        // Создание материала
        const material = new THREE.MeshStandardMaterial({
            color: color !== undefined ? color : 0xffffff,
            map: albedoTexture,
            normalMap: normalTexture,
            roughnessMap: roughnessTexture,
            roughness: (roughnessProp !== undefined && roughnessProp !== null && roughnessProp !== "null")
                ? parseFloat(roughnessProp)
                : 0.5,
            metalness: (metalnessProp !== undefined && metalnessProp !== null && metalnessProp !== "null")
                ? parseFloat(metalnessProp)
                : 0.5,
        });

        // Функция для рекурсивного применения материала
        const applyMaterialToObject = (obj) => {
            if (obj.isMesh) {
                obj.material = material;
            }
            if (obj.children && obj.children.length > 0) {
                obj.children.forEach(child => applyMaterialToObject(child));
            }
        };

        // Поиск объекта/группы в модели
        const findAndApply = (model) => {
            let found = false;
            model.traverse((child) => {
                if (child.name === objectName) {
                    found = true;
                    applyMaterialToObject(child);
                }
            });
            return found;
        };

        // Применяем к основной модели (замените 'yourModel' на вашу модель)
        if (!findAndApply(window.hallModel)) {
            console.warn(`Object/group "${objectName}" not found in Hall model`);
        }
    });
}

export function applyColorToElements() {
    // Цвета для разных групп элементов
    const colorSettings = [
        // Одиночные объекты
        { name: Element.portalGroup, color: 0xFFA500, albedoTexture: null, 
            normalTexture: null, roughnessTextureURL: null,
        roughness: null, metallness: null },
        { name: Element.rightHallWall, color: 0x4682B4, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: "../../hallModels/hallTextures/WallPaint.jpg",
            roughness: 1, metallness: 0.8  },
        { name: Element.frontHallWall, color: 0x4682B4, albedoTexture: null,
             normalTexture: null, 
             roughnessTextureURL: "../../hallModels/hallTextures/WallPaint.jpg",
             roughness: 1, metallness: 0.8 },
        { name: Element.leftHallWall, color: 0x4682B4, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: "../../hallModels/hallTextures/WallPaint.jpg",
            roughness: 1, metallness: 0.8  },
        { name: Element.backHallWall, color: 0x556B2F, albedoTexture: null,  normalTexture: "../../hallModels/hallTextures/WallPaint.jpg", 
        roughnessTextureURL: "../../hallModels/hallTextures/WallPaint.jpg",
        roughness: null, metallness: null },
        { name: Element.ceilingHall, color: 0xF0F0F0, albedoTexture: null,
         normalTexture: null, roughnessTextureURL: "../../hallModels/hallTextures/sofa.png",
         roughness: null, metallness: null },
        { name: Element.sofaHall, color: 0xF5F5DC, albedoTexture: "../../hallModels/hallTextures/sofa.png",
        normalTexture: null, roughnessTextureURL: "../../hallModels/hallTextures/sofa.png",
        roughness: null, metallness: null },
        { name: Element.circleVaseHall, color:  0x000000, albedoTexture: null, 
            normalTexture: null, roughnessTextureURL: null,
            roughness: 0.3, metallness: 0.8 },
        { name: Element.circleVaseTableHall, color: 0x000000, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.tableGlassHall, color: 0xADD8E6, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.sofaTableSupportHall, color: 0x808080, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.plintus, color: 0xffffff, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.ceilingLampHall, color: 0xffffff,
             albedoTexture: null, normalTexture: null, roughnessTextureURL: null ,
             roughness: null, metallness: null},
        { name: Element.coverfrontPanel, color: 0xffffff, albedoTexture: "../../hallModels/hallTextures/FrontCover.png",
         normalTexture: "../../hallModels/hallTextures/FrontCover.png",
          roughnessTextureURL: "../../hallModels/hallTextures/FrontCover.png",
          roughness: null, metallness: null },
        
        // Группы объектов
        /*{ names: Element.squareVasesHall, color: 0x9370DB },
        { names: Element.squareVasesTablesHall, color: 0xDEB887 },
        { names: Element.leavesGroupsHall, color: 0x2E8B57 },
        { names: Element.callPostsHall, color: 0xDC143C },
        { names: Element.indicationBoardHall, color: 0x1E90FF }*/
    ];

    // Применяем цвета ко всем элементам
    colorSettings.forEach(setting => {
        if (setting.name) {
            // Для одиночных объектов
            applyTextures(setting.name, setting.color, setting.albedoTexture, 
                setting.normalTexture, setting.roughnessTextureURL,
                setting.roughness, setting.metallness);
        } else if (setting.names) {
            // Для массивов объектов
            setting.names.forEach(objName => {
                applyTextures(objName, setting.color);
            });
        }
    });
}