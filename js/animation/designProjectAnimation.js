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

    if (templates && templates.length > 0) {
        templates.forEach(template => {
            const listItem = document.createElement('li');
            listItem.textContent = template.name; // Предполагаем, что у шаблона есть поле name
            templatesList.appendChild(listItem);
        });
    } else {
        templatesList.innerHTML = '<li>No templates available.</li>'; // Сообщение, если шаблонов нет
    }
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