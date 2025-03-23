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

import {showTab} from "../animation/tabFunctions.js";


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

export function setAllParameters(parameters) {
    if (parameters && typeof parameters === 'object') {

        setMainActiveSelections(parameters.cabin); 
        setActiveWallParameters(parameters.wall);
        setDoorTextureActive(parameters.doors);
        setCeilingParamsActive(parameters.ceiling);
        setFloorTextureActive(parameters.floor);
        setPanelParamsActive(parameters.controlPanel);
        setMirrorParamsActive(parameters.mirror);
        setHandrailParamsActive(parameters.handrail);
        setActiveBumperParameters(parameters.bumpers);

        //showTab('MainParametersTab');

        const mainTabMenuTitle = document.getElementById('MainTabMenuTitle');

        // Проверка на существование элемента
        if (mainTabMenuTitle) {
            // Имитируем клик
            mainTabMenuTitle.click();
        } else {
            console.error('Элемент с ID "MainTabMenuTitle" не найден.');
        }
        
        console.log('Параметры установлены:', allParameters);
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
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null) {
                return true; // Найдено null значение
            }
            // Если значение - объект, вызываем функцию рекурсивно
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (hasNullValues(obj[key])) {
                    return true; // Найдено null значение в вложенном объекте
                }
            }
        }
    }
    return false; // null значения не найдены
}
