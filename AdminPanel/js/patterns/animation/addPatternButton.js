import {getAllParameters, 
    setAllParameters, 
    hasNullValues} from "../../shareConfiguration/allParams.js"

import {urlTemplateCreateNewPattern} from "../../urlHelper/urls.js";

import {templateId} from "../../models/loadModel.js";

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('deletePatternButton');
    saveButton.addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите отменить изменения и вернуться в административную панель?")) 
        {
            alert("Изменения отменены");
            window.location.href = 'index.html';
        } else {
            alert("Продолжайте работать");
        }    
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('savePatternButton');
    saveButton.addEventListener('click', () => {
        if(checkIfProjectNameIsEmpty()) {
            alert("Название проекта не заполнено");
        } else if (checkIfPreviewImageIsEmpty()){
            alert("Превью проекта не заполнено");
        } else {
            let config = getAllParameters();

            if(hasNullValues(config) || config == undefined) {
                alert("Не выбран дизайн проект или не для всех элементов установлены текстуры");
            } else {
                if (confirm("Вы уверены, что хотите сохранить все изменения?")) {
                    if(!templateId) {
                        localStorage.removeItem('templateId');
                        localStorage.removeItem('templateName');
                        localStorage.removeItem('templatePreviewImageUrl');
                        localStorage.removeItem('templateConfiguration');

                        CreateNewPattern(config.cabin.designProject, config);
                    }

                    localStorage.removeItem('templateId');
localStorage.removeItem('templateName');
localStorage.removeItem('templatePreviewImageUrl');
localStorage.removeItem('templateConfiguration');
                  
                    alert("Изменения сохранены");
                    window.location.href = 'index.html';
                } else {

                    alert("Шаблон не был сохранён");
                }  
            }
        }  
    });
});

function checkIfProjectNameIsEmpty() {
    const projectTitleInput = document.getElementById('projectTitle');

    if (projectTitleInput.value.trim() === '') {
        return true; 
    } else {
        return false;
    }
}

function checkIfPreviewImageIsEmpty() {
    const input = document.getElementById('patternPreview');
    return input.files.length <= 0;
}

document.getElementById('patternPreview').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview-pattern');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="pattern-img">`;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector('.clear-file-btn').addEventListener('click', function() {
    document.getElementById('patternPreview').value = '';
    document.getElementById('preview-pattern').innerHTML = '';
});

function CreateNewPattern(designProjectId, config) {
    const urlTemplateCreateNewDesignProject = urlTemplateCreateNewPattern;

    const projectTitleInput = document.getElementById('projectTitle');
    const patternPreviewInput = document.getElementById('patternPreview');

    // Извлекаем название проекта
    const projectName = projectTitleInput.value.trim();

    // Извлекаем файл изображения, если он выбран
    const previewImageFile = patternPreviewInput.files.length > 0 ? patternPreviewInput.files[0] : null;
    // Создайте объект FormData
const formData = new FormData();

// Добавьте данные проекта
formData.append('designProjectId', designProjectId);
formData.append('name', projectName);
formData.append('configuration',  JSON.stringify(config));

const imageFile = previewImageFile; 
formData.append('previewImage', imageFile);

// Отправка POST-запроса
fetch(urlTemplateCreateNewDesignProject, {
    method: 'POST',
    body: formData
})
.then(response => {
    if (!response.ok) {
        throw new Error('Ошибка сети');
    }
    return response.json();
})
.then(data => {
    console.log('Успех:', data);
})
.catch(error => {
    console.error('Ошибка при отправке данных:', error);
});
}