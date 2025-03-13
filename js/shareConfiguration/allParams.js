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
    mainParameters: null,
    wallParameters: null,
    doorParameters: null,
    ceilingParameters: null,
    floorParameters: null,
    panelParameters: null,
    mirrorParameters: null,
    handrailParameters: null,
    otherParameters: null
};

export function getAllParameters() {
    allParameters.mainParameters = getMainSelectedParameters();
    allParameters.wallParameters = getAllWallTextures();
    allParameters.doorParameters = getDoorState();
    allParameters.ceilingParameters = getCeilingState();
    allParameters.floorParameters = getFloorState();
    allParameters.panelParameters = getPanelState();
    allParameters.mirrorParameters = getMirrorParams();
    allParameters.handrailParameters = getHandrailParams();
    allParameters.otherParameters = getAllBumperTextures();
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
        setMainActiveSelections(parameters.mainParameters); 
        setActiveWallParameters(parameters.wallParameters);
        setDoorTextureActive(parameters.doorParameters);
        setCeilingParamsActive(parameters.ceilingParameters);
        setFloorTextureActive(parameters.floorParameters);
        setPanelParamsActive(parameters.panelParameters);
        setMirrorParamsActive(parameters.mirrorParameters);
        setHandrailParamsActive(parameters.handrailParameters);
        setActiveBumperParameters(parameters.otherParameters);

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

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('shareButton');
    saveButton.addEventListener('click', () => {
        if (confirm("Будет скачан файл конфигурации. Файлом можно поделиться с другими пользователями. Скачать файл?")) 
        {
            saveParametersToFile();
        } else {
            alert("Скачивание файла отменено");
        }        
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        loadParametersFromFile();
    });
});