import {getMainSelectedParameters, 
    setMainActiveSelections} from './mainParams.js';
import {getAllWallTextures,
    setActiveWallParameters } from './wallTexturesChoice.js';
import {getDoorState,
    setDoorTextureActive} from './doorParams.js';
import {getCeilingState, 
    setCeilingParamsActive} from './ceilingParams.js';
import {getFloorState, 
    setFloorTextureActive} from './floorParameters.js';
import {getPanelState,
    setPanelParamsActive} from './panelParams.js';
import {getMirrorParams,
    setMirrorParamsActive} from './mirrorParams.js';
import {getHandrailParams,
    setHandrailParamsActive} from './handrailParams.js';
import {getAllBumperTextures,
    setActiveBumperParameters} from './otherParams.js';
import {isImagesShowed, loadImagesForAllTabs} from "../animation/tabFunctions.js";
import {showTab} from "../animation/tabFunctions.js";
import {isDesignProjectsLoaded, populateForm} from "../animation/designProjectAnimation.js";

const allParameters = {
    cabin: null,
    wall: null,
    doors: null,
    ceiling: null,
    floor: null,
    controlPanel: null,
    mirror: null,
    handrail: null,
    bumpers: null
};

export function getAllParameters() {
    allParameters.cabin = getMainSelectedParameters();
    allParameters.wall = getAllWallTextures();
    allParameters.doors = getDoorState();
    allParameters.ceiling = getCeilingState();
    allParameters.floor = getFloorState();
    allParameters.controlPanel = getPanelState();
    allParameters.mirror = getMirrorParams();
    allParameters.handrail = getHandrailParams();
    allParameters.bumpers = getAllBumperTextures();

    return allParameters;
    //console.log(allParameters);
}

export async function reloadParamsForNewModel() {
    getAllParameters();

    console.log(allParameters); // Логирование параметров
    
    await setAllParametersReloadVersion(allParameters);
}

export function getCabinSize(parameters) {
    console.log(parameters);
    console.log(parameters.cabin);
    console.log(parameters.cabin.size);
    return parameters.cabin.size;
}

export function saveParametersToFile() {
    getAllParameters();
    const jsonContent = JSON.stringify(allParameters, null, 2); // Преобразуем объект в JSON строчку
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'parameters.json'; // Имя файла для сохранения
    document.body.appendChild(a);
    a.click(); // Симулируем клик для начала загрузки
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Освобождаем память, удаляя объект URL
}

export async function setAllParametersReloadVersion(parameters) {
    console.log(parameters); // Логирование параметров
    
    if (parameters && typeof parameters === 'object') {
        if (!isImagesShowed) {
            await loadImagesForAllTabs(); // Загружаем изображения только если они еще не загружены
        }
        if (!isDesignProjectsLoaded) {
            await populateForm(); 
        }

        const operations = [
            () => setMainActiveSelections(parameters.cabin),
            () => setDoorTextureActive(parameters.doors),
            () => setCeilingParamsActive(parameters.ceiling),
            () => setFloorTextureActive(parameters.floor),
            () => setPanelParamsActive(parameters.controlPanel),
            () => setMirrorParamsActive(parameters.mirror),
            () => setHandrailParamsActive(parameters.handrail),
            () => setActiveBumperParameters(parameters.bumpers),
            () => setActiveWallParameters(parameters.wall)
        ];
        
        for (const operation of operations) {
            try {
                await operation();
            } catch (e) {
               // console.error(`Ошибка в ${operation.name}:`, e);
                // Можно добавить дополнительную логику обработки ошибок
            }
        }

        // Проверка на существование элемента для имитации клика
        const mainTabMenuTitle = document.getElementById('MainTabMenuTitle');
        if (mainTabMenuTitle) {
            mainTabMenuTitle.click(); // Имитируем клик
        } else {
            console.error('Элемент с ID "MainTabMenuTitle" не найден.');
        }

        console.log('Параметры установлены:', parameters); // Логируем установленные параметры
    } else {
        console.error('Неверный тип параметров. Ожидался объект.');
    }
}


export async function setAllParameters(parameters) {
    console.log(parameters); // Логирование параметров
    
    if (parameters && typeof parameters === 'object') {
        if (!isImagesShowed) {
            await loadImagesForAllTabs(); // Загружаем изображения только если они еще не загружены
        }
        if (!isDesignProjectsLoaded) {
            await populateForm(); 
        }

        // Настройка параметров для разных компонентов
        await setMainActiveSelections(parameters.cabin); 
        await setDoorTextureActive(parameters.doors);
        await setCeilingParamsActive(parameters.ceiling);
        await setFloorTextureActive(parameters.floor);
        await setPanelParamsActive(parameters.controlPanel);
        await setMirrorParamsActive(parameters.mirror);
        await setHandrailParamsActive(parameters.handrail);
        await setActiveBumperParameters(parameters.bumpers);
        await setActiveWallParameters(parameters.wall);

        // Проверка на существование элемента для имитации клика
        const mainTabMenuTitle = document.getElementById('MainTabMenuTitle');
        if (mainTabMenuTitle) {
            mainTabMenuTitle.click(); // Имитируем клик
        } else {
            console.error('Элемент с ID "MainTabMenuTitle" не найден.');
        }

        console.log('Параметры установлены:', parameters); // Логируем установленные параметры
    } else {
        console.error('Неверный тип параметров. Ожидался объект.');
    }
}

export function loadParametersFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json'; // Ограничиваем выбор только JSON-файла

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parameters = JSON.parse(e.target.result); // Преобразуем содержимое файла в объект
                    setAllParameters(parameters); // Вызываем метод с загруженными параметрами
                } catch (error) {
                    console.error("Ошибка при загрузке параметров:", error);
                }
            };
            reader.readAsText(file); // Читаем файл как текст
        }
    };

    input.click(); // Автоматически открываем диалог выбора файла
}

export function hasNullValues(obj) {
    for (let key in obj) {
        console.log("key " + key);

        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null) {
                console.log("null for " + key);

                return true; // Найдено null значение
            }
            // Если значение - объект, вызываем функцию рекурсивно
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (hasNullValues(obj[key])) {
                    console.log("null for " + key);
                    return true; // Найдено null значение в вложенном объекте
                }
            }
        }
    }
    return false; // null значения не найдены
}
