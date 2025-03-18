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
                method: 'POST', // Request method
                headers: {
                    'Content-Type': 'application/json' // Indicate that we are sending JSON
                },
                body: JSON.stringify(data) // Convert object to JSON string
            });
    
            if (!response.ok) {
                alert(`Ошибка: ${response.status}`);
                throw new Error(`Ошибка: ${response.status}`); // Error handling
            }
    
            const result = await response.json(); // Get the response in JSON format
            console.log('Новый проект создан:', result);
        } catch (error) {
            alert('Ошибка при создании проекта: ' + error.message); // Concatenate the error message correctly
            console.error('Ошибка при создании проекта:', error);
        }
    }

export async function updateDesignProject(projectId, projectName) {
    const data = {
        name: projectName
    };

    try {
        const response = await fetch(getUrl(urlTemplateUpdateDesignProject, projectId), {
            method: 'PUT', // Or 'PATCH', depending on your API
            headers: {
                'Content-Type': 'application/json' // Indicate that we are sending JSON
            },
            body: JSON.stringify(data) // Convert object to JSON string
        });

        if (!response.ok) {
            alert(`Ошибка: ${response.status}`);
            throw new Error(`Ошибка: ${response.status}`); // Error handling
        }
        
        const result = await response.json(); // Get the response in JSON format
        console.log('Проект обновлен:', result); // Log the result after it's defined

    } catch (error) {
        console.error('Ошибка при обновлении проекта:', error);
        alert('Ошибка при обновлении проекта: ' + error.message); // Concatenate the error message
    }
}

export async function deleteDesignProject(projectId) {
    try {
        const response = await fetch(getUrl(urlTemplateDeleteDesignProject, projectId), {
            method: 'DELETE' // Request method for deletion
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        // Check if the response body is empty
        const result = response.status === 204 ? null : await response.json(); // Handle 204 No Content
        
        if (result) {
            console.log('Проект удален:', result);
        } else {
            console.log('Проект удален, но нет данных для отображения.');
        }
    } catch (error) {
        alert('Ошибка при удалении проекта: ' + error.message);
        console.error('Ошибка при удалении проекта:', error);
    }
}