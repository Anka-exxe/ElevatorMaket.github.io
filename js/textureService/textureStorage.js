import * as UrlHelper from "./urls.js";

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

export async function getWalls() {
    if (images.isWallsEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.WALL);
        images.walls.push(...texturePatterns);
    }
    return images.walls;
}

export async function getBumper() {
    if (images.isBumperEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.BUMPER);
        images.bumper.push(...texturePatterns);
    }
    return images.bumper;
}

export async function getCeilingPlafon() {
    if (images.isCeilingPlafonEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.CEILING);
        images.ceilingPlafon.push(...texturePatterns);
    }
    return images.ceilingPlafon;
}

export async function getCeilingMaterial() {
    if (images.isCeilingMaterialEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.CEILING_MATERIAL);
        images.ceilingMaterial.push(...texturePatterns);
    }
    return images.ceilingMaterial;
}

export async function getHandrail() {
    if (images.isHandrailEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.HANDRAIL);
        images.handrail.push(...texturePatterns);
    }
    return images.handrail;
}

export async function getFloor() {
    if (images.isFloorEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.FLOOR);
        images.floor.push(...texturePatterns);
    }
    return images.floor;
}

export async function getBoard() {
    if (images.isBoardEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.CONTROL_PANEL);
        images.board.push(...texturePatterns);
    }
    return images.board;
}

export async function getBoardColor() {
    if (images.isBoardColorEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.CONTROL_PANEL);
        images.board_color.push(...texturePatterns);
    }
    return images.board_color;
}

export async function getDoor() {
    if (images.isDoorEmpty()) {
        let texturePatterns = await fetchIcons(UrlHelper.DOOR);
        images.door.push(...texturePatterns);
    }
    return images.door;
}

async function fetchIcons(elementType) {
    const url = UrlHelper.getUrl(UrlHelper.urlTemplateGetIconsByType, elementType);

    try {
        const response = await fetch(url); 
        if (!response.ok) {
            throw new Error(`HTTP error! статус: ${response.status}`);
        }
        const data = await response.json();
      //  console.log(data);
    
        // Извлекаем нужные значения
        const icons = data.content.map(item => ({
            id: item.id,
            url: item.url
        }));
    
       // console.log(icons); // Выводим массив объектов с id и url
    
        // Получаем информацию о текстурах для каждой иконки
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
       // console.log(textures); // Массив объектов с текстурами
    
        // Собираем данные в нужный шаблон
        const texturePatterns = textures.map(texture => ({
            id: texture.id,
            icon: texture.icon.url,
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
                color: texture.baseColor // Установите нужный цвет, если нужно
            }
        }));
    
        return texturePatterns;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}