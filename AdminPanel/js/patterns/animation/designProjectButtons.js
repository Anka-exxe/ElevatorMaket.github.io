import {deleteDesignProject, 
    updateDesignProject, 
    createNewDesignProject} from "../design-projects/crud.js";

        import {projectsCache, templatesCache,
            fetchDesignProjects,fetchTemplates} 
            from "../../designProjectService/designProjectStorage.js";

import { getUrl, urlTemplateDeletePattern } from "../../urlHelper/urls.js";

let isEditMode = false; // Флаг для режима редактирования
let editedProjectId = null;

document.getElementById('addDesignProjectBtn').addEventListener('click', function() {
    isEditMode = false; // Устанавливаем режим добавления
    document.getElementById('designProjectModal').style.display = 'block';
    document.getElementById('projectNameInput').value = ''; // Очистка поля для нового проекта
});

document.querySelectorAll('.editDesignProjectBtn').forEach(button => {
    button.addEventListener('click', function() {
        isEditMode = true; // Устанавливаем режим редактирования
        const projectName = this.closest('.designProjectHeader').querySelector('.title').innerText;
        document.getElementById('designProjectModal').style.display = 'block';
        document.getElementById('projectNameInput').value = projectName; // Заполнение поля названием проекта
    });
});

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('designProjectModal').style.display = 'none';
});

document.getElementById('cancelAddProjectBtn').addEventListener('click', function() {
    document.getElementById('designProjectModal').style.display = 'none';
});

document.getElementById('confirmAddProjectBtn').addEventListener('click', async function() {
    const projectName = document.getElementById('projectNameInput').value;
    if (projectName) {
        if (isEditMode) {
            await updateDesignProject(editedProjectId, projectName);
        } else {
            await createNewDesignProject(projectName);
        }
        document.getElementById('designProjectModal').style.display = 'none';
        document.getElementById('projectNameInput').value = ''; // Очистка поля ввода

        localStorage.setItem('activeTab', 'patterns');

        location.reload();
    } else {
        alert('Пожалуйста, введите название проекта.');
    }
});

document.getElementById('designProjectSelect').addEventListener('change', function() {
    const selectedValue = this.value; // Получаем выбранное значение
    const projects = document.querySelectorAll('.designProjectCard'); // Получаем все проекты

    projects.forEach(project => {
        const projectCategory = project.getAttribute('data-category'); // Получаем категорию проекта
        // Проверяем, нужно ли показывать или скрывать проект
        if (selectedValue === 'all' || projectCategory === selectedValue) {
            project.style.display = 'block'; // Показываем проект
        } else {
            project.style.display = 'none'; // Скрываем проект
        }
    });
});

document.getElementById('addPatternBtn').addEventListener('click', function() {
    window.location.href = 'patterns.html';
});

export async function populateDesignProjects() {
    const projects = await fetchDesignProjects();
    const patternsContainer = document.getElementById('patterns');
    const designProjectSelect = document.getElementById('designProjectSelect');

    // Заполнение выпадающего списка
    designProjectSelect.innerHTML = ''; // Очистка предыдущих опций
    designProjectSelect.innerHTML += '<option value="all">Все</option>'; // Добавление опции "Все"

    projects.forEach(async (project) => {
        const projectId = project.id; // Предполагаем, что у вас есть id проекта
        const projectName = project.name; // Название проекта

        // Добавляем проект в выпадающий список
        designProjectSelect.innerHTML += `<option value="${projectId}">${projectName}</option>`;

        const templates = await fetchTemplates(projectId); // Получаем шаблоны для проекта

        // Создание секции для проекта
        const projectSection = document.createElement('section');
        projectSection.className = 'designProjectCard';
        projectSection.setAttribute('data-category', projectId); // Добавьте нужную категорию

        // Заголовок проекта
        const headerDiv = document.createElement('div');
        headerDiv.className = 'designProjectHeader';
        headerDiv.innerHTML = `
            <h3 class="title">${projectName}</h3>
            <button class="small-button editDesignProjectBtn">Изменить</button>
            <button class="small-button deleteDesignProjectBtn">Удалить</button>
        `;
        projectSection.appendChild(headerDiv);

        // Обработчик для кнопки "Изменить" (проект)
        headerDiv.querySelector('.editDesignProjectBtn').addEventListener('click', function() {
            isEditMode = true; // Устанавливаем режим редактирования
            document.getElementById('designProjectModal').style.display = 'block';
            document.getElementById('projectNameInput').value = projectName; // Заполнение поля названием проекта
            editedProjectId = projectId; // Сохраняем ID проекта для обновления
        });

        // Обработчик для кнопки "Удалить"
        headerDiv.querySelector('.deleteDesignProjectBtn').addEventListener('click', async function() {
            const confirmed = confirm('При удалении проекта "' + projectName + '" будут удалены все связанные с ним шаблоны.');
            if (confirmed) {
                const confirmation = confirm(`Вы уверены, что хотите удалить проект "${projectName}"?`);
                if (confirmation) {
                    await deleteDesignProject(projectId);
                    localStorage.setItem('activeTab', 'patterns');
                    location.reload();
                }
            }
        });

        // Создание контейнера для шаблонов
        const patternGrid = document.createElement('div');
        patternGrid.className = 'pattern-grid';

        templates.forEach(template => {
            const templateCard = document.createElement('section');
            templateCard.className = 'pattern-card';
            templateCard.setAttribute('data-id', template.id); // Сохраняем id шаблона в атрибуте data-id
            templateCard.innerHTML = `
                <strong>${template.name}</strong><br>
                <img src="${template.previewImageUrl}" alt="${template.name}" class="pattern-img"> <!-- Предполагаем, что есть поле imageUrl -->
                <div class="pattern-card__button-container">
                    <button class="small-button editPatternBtn">Изменить</button>
                    <button class="small-button deletePatternBtn">Удалить</button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки "Изменить"
            templateCard.querySelector('.editPatternBtn').addEventListener('click', function() {
                const url = `patterns.html?${designProject}=${template.id}`;

                window.location.href = url;
            });

            // Добавляем обработчик для кнопки "Удалить"
            templateCard.querySelector('.editPatternBtn').addEventListener('click', function() {
                if (projectId) {
                    const url = `patterns.html?designProj=${template.id}`;
                    console.log(url); // Проверка URL
                    window.location.href = url;
                } else {
                    console.error('designProject is undefined or empty');
                }
            });
        
            patternGrid.appendChild(templateCard);
        });

        projectSection.appendChild(patternGrid);
        patternsContainer.appendChild(projectSection);
    });
}

function deletePattern(patternId) {
    fetch(getUrl(urlTemplateDeletePattern, patternId), {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            alert('Ошибка при удалении: ' + response.statusText);
            throw new Error('Ошибка при удалении: ' + response.statusText);
        }
        // Если статус 204, ничего не возвращаем
        if (response.status === 204) {
            console.log('Успешно удалено');
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log('Успешно удалено:', data);
        }
    })
    .catch(error => {
        alert('Ошибка: ' + error);
        console.error('Ошибка:', error);
    });
}

// Вызов функции для заполнения проектов
populateDesignProjects();


