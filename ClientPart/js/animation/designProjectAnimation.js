import {projectsCache, templatesCache,
     fetchDesignProjects,fetchTemplates} 
     from "../designProjectService/designProjectStorage.js";

import { showTab } from "./tabFunctions.js";

import {setAllParameters, getCabinSize} from "../shareConfiguration/allParams.js";

import {loadModelBySize} from "../models/loadModel.js";

import {API_BASE_URL} from "../urlHelper/urls.js";
 
let activeProjectId = null;
export let isDesignProjectsLoaded = false;

function selectDesignProjectButton(button) {
    selectParameterButton(button);
    showTab('PatternsParametersTab');
    activeProjectId = button.id; 
    const projectId = button.id; // Получаем ID проекта
    fetchTemplates(projectId).then(templates => {
        displayTemplates(templates); // Отображаем шаблоны
    });
}

function displayTemplates(templates) {
    const templatesList = document.getElementById('templatesList');
    templatesList.innerHTML = ''; // Очистка предыдущих шаблонов

    // Оборачиваем шаблоны в контейнер
    const patternGrid = document.createElement('div');
    patternGrid.className = 'pattern-grid';

    if (templates && templates.length > 0) {
        templates.forEach(template => {
            // Создаем карточку шаблона
            const patternCard = document.createElement('section');
            patternCard.className = 'pattern-card';

            // Добавляем название шаблона
            const title = document.createElement('strong');
            title.textContent = template.name; // Предполагаем, что у шаблона есть поле name
            patternCard.appendChild(title);
            patternCard.appendChild(document.createElement('br')); // Перенос строки
           
            // Добавляем изображение шаблона
            const img = document.createElement('img');
            img.src =  `${API_BASE_URL}${template.previewImageUrl}`; // Предполагаем, что у шаблона есть поле previewImageUrl
            img.alt = template.name; // Альтернативный текст
            img.className = 'pattern-img'; // Класс изображения
            patternCard.appendChild(img);

            // Добавляем обработчик клика для карточки шаблона
            patternCard.onclick = () => {
                try {
                    const jsonObject = JSON.parse(template.configuration);
                    //const parameters = JSON.parse(jsonObject);
                    const idToSize = {
                        wideSize: 'wide',
                        squareSize: 'square',
                        deepSize: 'deep'
                    };

                    localStorage.setItem('templateConfiguration', JSON.stringify(template.configuration)); // Сохраняем конфигурацию как строку
                    localStorage.setItem('templateId', JSON.stringify(template.id));

                    loadModelBySize(idToSize[getCabinSize(jsonObject)]);

                    //setAllParameters(jsonObject);
                } catch (error) {
                    console.error('Ошибка при парсинге JSON:', error);
                }
            };

            // Добавляем карточку в контейнер
            patternGrid.appendChild(patternCard);
        });
    } else {
        const noTemplatesMessage = document.createElement('p');
        noTemplatesMessage.textContent = 'No templates available.';
        templatesList.appendChild(noTemplatesMessage); // Сообщение, если шаблонов нет
    }

    // Добавляем контейнер с шаблонами в список
    templatesList.appendChild(patternGrid);
}

export async function populateForm() {
    const projects = await fetchDesignProjects();
    const form = document.forms['designForm']; // Получаем форму по имени

    if (projects && projects.length > 0) {
        projects.forEach(project => {
            const button = document.createElement('button');
            button.id = project.id; // Используем ID проекта
            button.className = 'form__form-element'; // Класс кнопки
            button.type = 'button'; // Тип кнопки
            button.innerText = project.name; // Название проекта
            button.onclick = () => selectDesignProjectButton(button); // Обработчик клика

            // Добавляем кнопку в форму
            form.appendChild(button);

            isDesignProjectsLoaded = true;
        });
    } else {
        console.log('Нет доступных групп дизайн проектов');
    }
}

function selectParameterButton(button) {
    const container = button.parentNode; 
    const buttons = container.querySelectorAll('button'); 
    buttons.forEach(btn => {
        btn.classList.remove('active'); 
    });
    button.classList.add('active'); 
}