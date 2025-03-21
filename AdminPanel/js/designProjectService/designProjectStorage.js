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

// Новая функция для получения шаблона по ID
export async function fetchTemplateById(templateId) {
    const url = getUrl(urlGetTemplateById, templateId); // Формируем URL с ID шаблона

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.content; // Возвращаем информацию о шаблоне
    } catch (error) {
        console.error('Error fetching template by ID:', error);
    }
}