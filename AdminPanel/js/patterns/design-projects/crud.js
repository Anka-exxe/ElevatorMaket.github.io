import {urlTemplateCreateNewDesignProject,
     urlTemplateUpdateDesignProject, 
     urlTemplateDeleteDesignProject, getUrl
    } from "../../urlHelper/urls.js"


export async function createNewDesignProject(projectName) {
    const data = {
        name: projectName
    };

    try {
        const response = await fetch(urlTemplateCreateNewDesignProject, {
            method: 'POST', // Метод запроса
            headers: {
                'Content-Type': 'application/json' // Указываем, что отправляем JSON
            },
            body: JSON.stringify(data) // Преобразуем объект в строку JSON
        });

        if (!response.ok) {
            alert(`Ошибка: ${response.status}`);
            throw new Error(`Ошибка: ${response.status}`); // Обработка ошибок
        }

        const result = await response.json(); // Получаем ответ в формате JSON
        console.log('Новый проект создан:', result);
    } catch (error) {
        alert('Ошибка при создании проекта:', error);
        console.error('Ошибка при создании проекта:', error);
    }
}

export async function updateDesignProject(projectId, projectName) {
    const data = {
        name: projectName
    };

    try {
        const response = await fetch(getUrl(urlTemplateUpdateDesignProject, projectId), {
            method: 'PUT', // Или 'PATCH', в зависимости от вашего API
            headers: {
                'Content-Type': 'application/json' // Указываем, что отправляем JSON
            },
            body: JSON.stringify(data) // Преобразуем объект в строку JSON
        });

        if (!response.ok) {
            alert(`Ошибка: ${response.status}`);
            throw new Error(`Ошибка: ${response.status}`); // Обработка ошибок
        }

        const result = await response.json(); // Получаем ответ в формате JSON
        console.log('Проект обновлен:', result);
    } catch (error) {
        alert('Ошибка при обновлении проекта:', error);
        console.error('Ошибка при обновлении проекта:', error);
    }
}

export async function deleteDesignProject(projectId) {
    try {
        const response = await fetch(getUrl(urlTemplateDeleteDesignProject, projectId), {
            method: 'DELETE' // Метод запроса для удаления
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`); // Обработка ошибок
        }

        const result = await response.json(); // Получаем ответ в формате JSON
        console.log('Проект удален:', result);
    } catch (error) {
        alert('Ошибка при удалении проекта:', error);
        console.error('Ошибка при удалении проекта:', error);
    }
}