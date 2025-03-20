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

import {urlTemplateGetWordFile} from "../urlHelper/urls.js"

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
    console.log(allParameters);
}

export function saveParametersToFile() {
    getAllParameters();
    const jsonContent = JSON.stringify(allParameters, null, 2); // Преобразуем объект в JSON строчку
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuration.json'; // Имя файла для сохранения
    document.body.appendChild(a);
    a.click(); // Симулируем клик для начала загрузки
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Освобождаем память, удаляя объект URL
}

export async function setAllParameters(parameters) {
    if (parameters && typeof parameters === 'object') {
        await setMainActiveSelections(parameters.cabin); 

        await setDoorTextureActive(parameters.doors);
        await setCeilingParamsActive(parameters.ceiling);
        await setFloorTextureActive(parameters.floor);
        await setPanelParamsActive(parameters.controlPanel);
        await setMirrorParamsActive(parameters.mirror);
        await setHandrailParamsActive(parameters.handrail);
        await setActiveBumperParameters(parameters.bumpers);
        await setActiveWallParameters(parameters.wall);

        //showTab('MainParametersTab');
console.log(parameters);
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

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('questionNaireBtn');
    saveButton.addEventListener('click', () => {
        getWordFileFromServer();
    });
});


async function getWordFileFromServer() {
    getAllParameters();

    try {
        const response = await fetch(urlTemplateGetWordFile, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allParameters)
        });

        // Проверка статуса ответа
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Получаем blob (файл) из ответа
        const blob = await response.blob();

        // Создаем URL для blob
        const url = window.URL.createObjectURL(blob);

        // Создаем элемент <a> для загрузки файла
        const a = document.createElement('a');
        a.href = url;
        a.download = 'опросный_лист.pdf'; // Имя файла
        document.body.appendChild(a);
        a.click();

        // Удаляем элемент <a>
        a.remove();
        window.URL.revokeObjectURL(url); // Освобождаем память
    } catch (error) {
        console.error('Error:', error);
    }
}
