import {projectsCache, templatesCache,
     fetchDesignProjects,fetchTemplates} 
     from "../designProjectService/designProjectStorage.js";

import {selectParameterButton} from "./buttonFunctions.js"

let isDesignProjectsLoaded = false;

function selectDesignProjectButton(button) {
    selectParameterButton(button);
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
            img.src = template.imageUrl; // Предполагаем, что у шаблона есть поле imageUrl
            img.alt = template.name; // Альтернативный текст
            img.className = 'pattern-img'; // Класс изображения
            patternCard.appendChild(img);

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

async function populateForm() {
    const projects = await fetchDesignProjects();
    const form = document.forms['designForm']; // Получаем форму по имени

    if (projects && projects.length > 0) {
        projects.forEach(project => {
            const button = document.createElement('button');
            button.id = project.id; // Используем ID проекта
            button.className = 'form__form-element'; // Класс кнопки
            button.type = 'button'; // Тип кнопки
            button.innerText = project.name; // Название проекта
            button.onclick = () => selectParameterButton(button); // Обработчик клика

            // Добавляем кнопку в форму
            form.appendChild(button);
        });
    } else {
        console.log('No design projects available.');
    }
}

document.addEventListener('DOMContentLoaded', populateForm);