import * as UrlHelper from "../urlHelper/urls.js";

export let allTextures = null; 
let iconsLoadedPromise = null;

export const texturePattern = {
    "id": "",
    "icon": "",
    "texture": "",
    "alpha": "",
    "bump": "",
    "aoMap": "",
    "displacementMap": "",
    "metalnessMap": "",
    "roughnessMap": "",
    "normalMap": "",
    "options": {
        "bumpScale": undefined,
        "metalness": undefined,
        "roughness": undefined,
        "emissiveIntensity": undefined,
        "color": "#ffffff"
    }
}

const images = {
    walls: [],
    ceilingPlafon: [],
    ceilingMaterial: [],
    handrail: [],
    floor: [],
    board: [],
    board_color: [],
    door: [],
    bumper: [],
    

    isWallsEmpty() {
        return this.walls.length === 0;
    },
    isBumperEmpty() {
        return this.bumper.length === 0;
    },
    isCeilingPlafonEmpty() {
        return this.ceilingPlafon.length === 0;
    },
    isCeilingMaterialEmpty() {
        return this.ceilingMaterial.length === 0;
    },
    isHandrailEmpty() {
        return this.handrail.length === 0;
    },
    isFloorEmpty() {
        return this.floor.length === 0;
    },
    isBoardEmpty() {
        return this.board.length === 0;
    },
    isBoardColorEmpty() {
        return this.board_color.length === 0;
    },
    isDoorEmpty() {
        return this.door.length === 0;
    }
};

async function loadTextures(imageArray, filterFn) {
    if (imageArray.length === 0) {
        await getAllIcons(); // Ждём завершения загрузки иконок
        //console.log('All textures before filtering:', allTextures); // Лог всех текстур

        const filteredTextures = allTextures.filter(filterFn);
       // console.log('Filtered textures:', filteredTextures); // Лог отфильтрованных текстур

        imageArray.push(...filteredTextures);
        //console.log('Updated imageArray:', imageArray); // Лог обновлённого массива
    }
    return imageArray;
}

export async function getWalls() {
    return await loadTextures(images.walls, texture => texture.isWall);
}

export async function getBumper() {
    return await loadTextures(images.bumper, texture => texture.isBumper);
}

export async function getCeilingPlafon() {
    return await loadTextures(images.ceilingPlafon, texture => texture.isCeiling);
}

export async function getCeilingMaterial() {
    return await loadTextures(images.ceilingMaterial, texture => texture.isCeilingMaterial);
}

export async function getHandrail() {
    return await loadTextures(images.handrail, texture => texture.isHandrail);
}

export async function getFloor() {
    return await loadTextures(images.floor, texture => texture.isFloor);
}

export async function getBoard() {
    return await loadTextures(images.board, texture => texture.isIndicationBoard);
}

export async function getBoardColor() {
    return await loadTextures(images.board_color, texture => texture.isControlPanel);
}

export async function getDoor() {
    return await loadTextures(images.door, texture => texture.isDoor);
}

export async function getAllIcons() {
    if (!iconsLoadedPromise) { // Если загрузка ещё не начата
        iconsLoadedPromise = fetchIcons().then(textures => {
            allTextures = textures;
            //console.log(allTextures);
        });
    }
    return iconsLoadedPromise; // Возвращаем Promise загрузки
}

async function fetchIcons() {
    const url = UrlHelper.urlTemplateGetIcons;

    try {
        const response = await fetch(url); 
        if (!response.ok) {
            throw new Error(`HTTP error! статус: ${response.status}`);
        }
        const data = await response.json();
    
        const icons = data.content.map(item => ({
            id: item.id,
            url: item.url,
            isDoor: item.isDoor,
            isWall: item.isWall,
            isFloor: item.isFloor,
            isCeiling: item.isCeiling,
            isCeilingMaterial: item.isCeilingMaterial,
            isControlPanel: item.isControlPanel,
            isHandrail: item.isHandrail,
            isBumper: item.isBumper,
            isFrame: item.isFrame,
            isIndicationBoard: item.isIndicationBoard,
        }));
    
        const texturePromises = icons.map(icon => 
            fetch(UrlHelper.getUrl(UrlHelper.urlTemplateGetTextureByIconId, icon.id))
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка при получении текстуры для иконки ${icon.id}: ${response.status}`);
                    }
                    return response.json();
                })
        );
    
        const textures = await Promise.all(texturePromises);
    
        return textures.map(texture => ({
            id: texture.id,
            name: texture.name,
            icon: texture.icon.url,
            isDoor: texture.icon.isDoor,
            isWall: texture.icon.isWall,
            isFloor: texture.icon.isFloor,
            isCeiling: texture.icon.isCeiling,
            isCeilingMaterial: texture.icon.isCeilingMaterial,
            isControlPanel: texture.icon.isControlPanel,
            isHandrail: texture.icon.isHandrail,
            isBumper: texture.icon.isBumper,
            isIndicationBoard: texture.icon.isIndicationBoard,
            texture: texture.baseTextureUrl,
            alpha: texture.alphaMapUrl || "",
            bump: texture.bumpMapUrl || "",
            aoMap: texture.aoMapUrl || "",
            displacementMap: texture.displacementMapUrl || "",
            metalnessMap: texture.metalnessMapUrl || "",
            roughnessMap: texture.roughnessMapUrl || "",
            normalMap: texture.normalMapUrl || "",
            options: {
                bumpScale: texture.properties.bumpScale,
                metalness: texture.properties.metalness,
                roughness: texture.properties.roughness,
                emissiveIntensity: texture.properties.emissiveIntensity,
                color: texture.baseColor
            }
        }));
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return []; // Возвращаем пустой массив при ошибке
    }
}