import * as THREE from 'three';
import * as Element from "./elementNames.js";
import {HALLTEXTURES_BASE_PATH} from "../urlHelper/urls.js"; 

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

export function ChangeWallsColor(colorProp) {
    const colorSettings = [
        { name: Element.rightHallWall, color: colorProp, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
            roughness: 1, metallness: 0.8  },
        { name: Element.frontHallWall, color: colorProp, albedoTexture: null,
             normalTexture: null, 
             roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
             roughness: 1, metallness: 0.8 },
        { name: Element.leftHallWall, color: colorProp, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
            roughness: 1, metallness: 0.8  },
        { name: Element.backHallWall, color: colorProp, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
            roughness: 1, metallness: 0.8 },
    ];

    // Применяем цвета ко всем стенам
    colorSettings.forEach(setting => {
        applyTextures(setting.name, setting.color, setting.albedoTexture, 
            setting.normalTexture, setting.roughnessTextureURL,
            setting.roughness, setting.metallness);

    });
}

export function ChangeFloorColor(colorProp) {
    const colorSettings = [
        { name: Element.floorHall, color: colorProp, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}Floor.jpg`,
            roughness: 2, metallness: 0 },
    ];

    // Применяем цвета к полу
    colorSettings.forEach(setting => {
        applyTextures(setting.name, setting.color, setting.albedoTexture, 
            setting.normalTexture, setting.roughnessTextureURL,
            setting.roughness, setting.metallness);

    });
}

export function applyColorToElements() {
    const processGroup = (group, defaultColor, albedoTextureUrl = null,
         normalTextureUrl = null, roughnessTexture = null, rough = null, metal = null) => 
    group.map(name => ({
        name,
        color: defaultColor,
        albedoTexture: albedoTextureUrl,
        normalTexture: normalTextureUrl,
        roughnessTextureURL: roughnessTexture,
        roughness: rough,
        metalness: metal
    }));
 
    // Цвета для разных групп элементов
    const colorSettings = [
        // Одиночные объекты
        { name: Element.portalGroup, color: 0x808080, albedoTexture: null, 
            normalTexture: null, roughnessTextureURL: null,
        roughness: null, metallness: null },
        { name: Element.rightHallWall, color: 0x4682B4, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
            roughness: 1, metallness: 0.8  },
        { name: Element.frontHallWall, color: 0x4682B4, albedoTexture: null,
             normalTexture: null, 
             roughnessTextureURL:  `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
             roughness: 1, metallness: 0.8 },
        { name: Element.leftHallWall, color: 0x4682B4, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL:    `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
            roughness: 1, metallness: 0.8  },
        { name: Element.backHallWall, color: 0x4682B4, albedoTexture: null,
            normalTexture: null, 
            roughnessTextureURL:   `${HALLTEXTURES_BASE_PATH}WallPaint.jpg`,
            roughness: 1, metallness: 0.8 },
        { name: Element.ceilingHall, color: 0xF0F0F0, albedoTexture: null,   
         normalTexture: null, roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}sofa.png`,
         roughness: null, metallness: null },
        { name: Element.sofaHall, color: 0xF5F5DC, albedoTexture: `${HALLTEXTURES_BASE_PATH}sofa.png`,
        normalTexture: null, roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}sofa.png`,
        roughness: 1, metallness: 0.2 },
        { name: Element.circleVaseHall, color:  0x000000, albedoTexture: null, 
            normalTexture: null, roughnessTextureURL: null,
            roughness: 0.3, metallness: 0.8 },
        { name: Element.circleVaseTableHall, color: 0x808080, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.tableGlassHall, color: 0x808080, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.sofaTableSupportHall, color: 0xffffff, albedoTexture: null,
             normalTexture: null, roughnessTextureURL: null,
             roughness: null, metallness: null },
        { name: Element.ceilingLampHall, color: 0xffffff,
             albedoTexture: null, normalTexture: null, roughnessTextureURL: null ,
             roughness: null, metallness: null},
             { name: Element.floorHall, color: 0x808080, albedoTexture: null,
                normalTexture: null, 
                roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}Floor.jpg`,
                roughness: 2, metallness: 0},
        { name: Element.coverFrontPanel, color: 0xffffff, albedoTexture: `${HALLTEXTURES_BASE_PATH}FrontCover.png`,
         normalTexture: `${HALLTEXTURES_BASE_PATH}FrontCover.png`,
          roughnessTextureURL: `${HALLTEXTURES_BASE_PATH}FrontCover.png`,
          roughness: null, metallness: null },
          ...processGroup(Element.squareVasesHall, 0xffffff, `${HALLTEXTURES_BASE_PATH}Vazon.png`),
          ...processGroup(Element.squareVasesTablesHall, 0x808080),
          ...processGroup(Element.leavesGroupsHall, 0x556B2F),
          ...processGroup(Element.callPostsHall, 0xB7B7B7, null, null, null, 0.4, 0.9),
          ...processGroup(Element.indicationBoardHall, 0xB7B7B7, null, null, null, 0.4, 0.9),
          ...processGroup(Element.arrowsCallPosts, 0x000000, null, null, null, 0.4, 0.9),
          ...processGroup(Element.indBoardNails, 0x000000, null, null, null, 0.4, 0.9),
          ...processGroup(Element.strokeCallPosts, 0x556B2F, null, null, null, 0.9, 0.2),
          ...processGroup(Element.callPostsDisplayFlorans, 0xffffff, `${HALLTEXTURES_BASE_PATH}florence.jpg`),
          ...processGroup(Element.callPostsDisplayMovel, 0xffffff, `${HALLTEXTURES_BASE_PATH}movel.jpg`),
          ...processGroup(Element.indBoardDisplay, 0xffffff,`${HALLTEXTURES_BASE_PATH}ind_board1.jpg`),

        // Группы объектов 0x808080
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

document.querySelectorAll('.form__radio[name="ind_board_display"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const processGroup = (group, defaultColor, albedoTextureUrl = null,
            normalTextureUrl = null, roughnessTexture = null, rough = null, metal = null) => 
       group.map(name => ({
           name,
           color: defaultColor,
           albedoTexture: albedoTextureUrl,
           normalTexture: normalTextureUrl,
           roughnessTextureURL: roughnessTexture,
           roughness: rough,
           metalness: metal
       }));

        // Определяем какая текстура должна быть применена
        const texturePath = this.value === 'case1' 
            ? `${HALLTEXTURES_BASE_PATH}ind_board1.jpg` 
            : `${HALLTEXTURES_BASE_PATH}ind_board2.jpg`;
      
        // Применяем текстуру к индикационной доске
        const colorSettings = [
            ...processGroup(Element.indBoardDisplay, 0xffffff, texturePath)
        ];
        
        // Здесь должен быть код для применения colorSettings к вашей сцене
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
    });
});
