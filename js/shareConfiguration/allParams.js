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
import {isImagesShowed, loadImagesForAllTabs} from "../animation/tabFunctions.js";
import {urlTemplateGetWordFile, 
    urlTemplateSendFile,
getUrl} from "../urlHelper/urls.js"

import {GetImage} from "../models/loadModel.js";

import {isDesignProjectsLoaded, populateForm} from "../animation/designProjectAnimation.js";

import {loadModelBySize} from "../models/loadModel.js";
 

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

export async function reloadParamsForNewModel() {
    getAllParameters();

    console.log(allParameters); // Логирование параметров
    
    await setAllParameters(allParameters);
}

export function getCabinSize(parameters) {
    console.log(parameters);
    console.log(parameters.cabin);
    console.log(parameters.cabin.size);
    return parameters.cabin.size;
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
    (async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json'; // Ограничиваем выбор только JSON-файла

            input.onchange = async (event) => { // Сделайте этот обработчик асинхронным
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => { // Сделайте этот обработчик тоже асинхронным
                        try {
                            const parameters = JSON.parse(e.target.result); // Преобразуем содержимое файла в объект
                            localStorage.setItem('templateConfiguration', JSON.stringify(e.target.result)); // Сохраняем конфигурацию как строку
                            localStorage.setItem('templateId', JSON.stringify(JSON.stringify(parameters.cabin.designProjectGroup)));

                            const idToSize = {
                                wideSize: 'wide',
                                squareSize: 'square',
                                deepSize: 'deep'
                            };

                            // Используем await здесь
                            await loadModelBySize(idToSize[getCabinSize(parameters)]);
                            //await setAllParameters(parameters); // Вызываем метод с загруженными параметрами
                        } catch (error) {
                            console.error("Ошибка при загрузке параметров:", error);
                        }
                    };
                    reader.readAsText(file); // Читаем файл как текст
                }
            };

            input.click(); // Автоматически открываем диалог выбора файла
        } catch (error) {
            console.error('Ошибка:', error);
        }
    })();
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

//document.getElementById("saveButton").addEventListener('click', GetImage);

document.getElementById('questionNaireBtn').addEventListener('click', function() {
    document.getElementById('emailModal').style.display = 'block';
    document.getElementById('emailInput').value = ''; // Очистка поля для нового проекта
});

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('emailModal').style.display = 'none';
});

document.getElementById('cancelEmail').addEventListener('click', function() {
    document.getElementById('emailModal').style.display = 'none';
});

document.getElementById('confirmEmail').addEventListener('click', async function() {
    const email = document.getElementById('emailInput').value;
    if (email) {
        await SendFile(email); // Добавлено await для корректного вызова
        document.getElementById('emailModal').style.display = 'none';
    } else {
        alert('Пожалуйста, введите почту');
    }
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

async function SendFile(email) {  
    if (!email) {
        console.error('Email не может быть undefined или пустым');
        alert('Пожалуйста, укажите действительный адрес электронной почты.');
        return; // Выход из функции, если email некорректен
    }

    // Предполагаем, что getAllParameters возвращает или инициализирует allParameters
    getAllParameters(); // Убедитесь, что allParameters инициализирован

    // Получаем изображение в виде Blob
    const imageBlob = await GetImage();

    if (imageBlob) {
        // Здесь вы можете использовать imageBlob, например, сохранить его или отправить на сервер
        /*const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screenshot.jpg'; // Имя файла для скачивания
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Освобождаем URL*/
    } else {
        console.error("Не удалось получить изображение.");
    }
    
    // Создаем новый объект FormData
    const formData = new FormData();
    
    // Добавляем параметры в FormData
    for (const key in allParameters) {
        formData.append(key, allParameters[key]);
    }

    // Добавляем параметр request
    formData.append('request', JSON.stringify(allParameters)); // Добавлено для примера
    
    // Проверяем, что изображение успешно получено
    if (imageBlob) {
        // Добавляем изображение в FormData
        formData.append('file', imageBlob, 'screenshot.jpg'); // Укажите имя файла
    } else {
        console.error('Не удалось получить изображение.');
        return; // Выход из функции, если изображение не удалось получить
    }

    try {
        const response = await fetch(getUrl(urlTemplateSendFile, email), {
            method: 'POST',
            body: formData // Отправляем FormData
        });

        // Проверка статуса ответа
        if (!response.ok) {
            alert("Произошла ошибка");
            throw new Error('Network response was not ok');
        } else {
            alert("Опросный лист отправлен");
        }

    } catch (error) {
        console.error('Error:', error);
    }
}