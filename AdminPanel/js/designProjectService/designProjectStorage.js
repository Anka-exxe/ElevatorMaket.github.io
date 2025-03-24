import {
    urlTemplateGetDesignProjects,
    urlTemplateGetPatternsByDesignProjectId,
    urlGetTemplateById, // Импортируем новый URL
    getUrl
} from "../urlHelper/urls.js";

export const projectsCache = {};
export const templatesCache = {};

export async function fetchDesignProjects() {
    if (projectsCache.data) {
        return projectsCache.data; // Возвращаем кэшированные проекты
    }

    const url = urlTemplateGetDesignProjects;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        projectsCache.data = data.content; // Сохраняем проекты в кэш
        return projectsCache.data; // Возвращаем массив проектов
    } catch (error) {
        console.error('Error fetching design projects:', error);
    }
}

export async function fetchTemplates(projectId) {
    if (templatesCache[projectId]) {
        return templatesCache[projectId]; // Возвращаем кэшированные шаблоны
    }

    const url = getUrl(urlTemplateGetPatternsByDesignProjectId, projectId);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        templatesCache[projectId] = data.content; // Сохраняем шаблоны в кэш
        return templatesCache[projectId]; // Возвращаем массив шаблонов
    } catch (error) {
        console.error('Error fetching templates:', error);
    }
}

export async function fetchTemplateById(templateId) {
    const url = getUrl(urlGetTemplateById, templateId); // Формируем URL с ID шаблона
    console.log('Fetching template from URL:', url); // Логируем URL

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received from server:', data); // Логируем данные

        // Проверяем, что полученные данные содержат необходимые поля
        if (!data.id || !data.name || !data.configuration) {
            throw new Error('Template data is incomplete or undefined');
        }

        // Если configuration — это строка, нужно ее распарсить
        const configuration = JSON.parse(data.configuration);

        return {
            id: data.id,
            name: data.name,
            configuration: configuration,
            previewImageUrl: data.previewImageUrl
        }; // Возвращаем нужные данные
    } catch (error) {
        console.error('Error fetching template by ID:', error);
        throw error; // Пробрасываем ошибку дальше для обработки
    }
}