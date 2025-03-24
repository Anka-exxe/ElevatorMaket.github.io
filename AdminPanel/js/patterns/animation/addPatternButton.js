import {getAllParameters, 
    setAllParameters, 
    hasNullValues} from "../../shareConfiguration/allParams.js"

import {urlTemplateCreateNewPattern, 
    urlTemplateUpdatePattern, getUrl} from "../../urlHelper/urls.js";

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

    // Функция для проверки наличия параметра в URL
    function isEditing() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('designProject');
    }

    saveButton.addEventListener('click', () => {
        if (checkIfProjectNameIsEmpty()) {
            alert("Название проекта не заполнено");
        } else if (checkIfPreviewImageIsEmpty()) {
            alert("Превью проекта не заполнено");
        } else {
            if (checkIfGroupIsEmpty()) {
                alert("Не выбрана группа, к которой относится дизайн проект");
            } else {
                let config = getAllParameters();

                if (hasNullValues(config) || config == undefined) {
                    alert("Не для всех элементов установлены текстуры");
                } else {
                    if (confirm("Вы уверены, что хотите сохранить все изменения?")) {
                        if (isEditing()) {
                            const urlParams = new URLSearchParams(window.location.search);
                            let designProjectId = urlParams.get('designProject');

                            // Проверка на наличие designProjectId
                            if (designProjectId) {
                                UpdatePattern(designProjectId, config, config.cabin.designProjectGroup);
                            } else {
                                alert("Идентификатор проекта не найден.");
                            }
                        } else {
                            // Если мы в режиме создания
                            CreateNewPattern(config.cabin.designProjectGroup, config);
                        }

                        alert("Изменения сохранены");
                        window.location.href = 'index.html';
                    } else {
                        alert("Шаблон не был сохранён");
                    }
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

function checkIfGroupIsEmpty() {
    const formContainer = document.querySelector('form[name="designForm"]');

    const activeElements = formContainer.querySelectorAll('.active');

    return activeElements.length <= 0;
}

function checkIfPreviewImageFormElementIsEmpty() {
    const input = document.getElementById('patternPreview');
    return input.files.length <= 0;
}

function checkIfPreviewImageIsEmpty() {
    const previewContainer = document.getElementById('preview-pattern');
    const images = previewContainer.getElementsByTagName('img');

    return images.length === 0;
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
        alert('Ошибка сети');
        throw new Error('Ошибка сети');
    }
    return response.json();
})
.then(data => {
    console.log('Успех:', data);
})
.catch(error => {
    alert('Ошибка при отправке данных:', error);
    console.error('Ошибка при отправке данных:', error);
});
}


function UpdatePattern(designProjectId, config, groupId) {
    const projectTitleInput = document.getElementById('projectTitle');
    const patternPreviewInput = document.getElementById('patternPreview');

    // Извлекаем название проекта
    const projectName = projectTitleInput.value.trim();

    // Извлекаем файл изображения, если он выбран
    const previewImageFile = patternPreviewInput.files.length > 0 ? patternPreviewInput.files[0] : null;

    // Создайте объект FormData
    const formData = new FormData();

    // Добавьте данные проекта
    formData.append('designProjectId', groupId);
    formData.append('name', projectName);
    formData.append('configuration', JSON.stringify(config));

    if (previewImageFile) {
        formData.append('previewImage', previewImageFile);
    }

    // Определите URL для обновления шаблона
    const url= getUrl(urlTemplateUpdatePattern, designProjectId); // Убедитесь, что URL корректен

    // Отправка PUT-запроса
    fetch(url, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            alert('Ошибка сети: ' + response.statusText);
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Шаблон успешно обновлён:', data);
        alert('Шаблон успешно обновлён!'); // Уведомление пользователю
    })
    .catch(error => {
        alert('Ошибка при отправке данных: ' + error);
        console.error('Ошибка при отправке данных:', error);
    });
}