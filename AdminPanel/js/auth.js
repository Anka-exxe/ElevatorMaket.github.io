
const originalFetch = window.fetch;

async function refreshAccessToken() {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error("Refresh token отсутствует");
        window.location.href = 'login.html';
        return null;
    }

    try {
        const response = await originalFetch('http://localhost:8090/api/v1/auth/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('refresh_token', data.refresh_token);
            return data.access_token;
        } else {
            console.error("Обновление токена завершилось неудачно");
            window.location.href = 'login.html';
            return null;
        }
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
        window.location.href = 'login.html';
        return null;
    }
}

// Функция для клонирования FormData
function cloneFormData(formData) {
    const newFormData = new FormData();
    for (let [key, value] of formData.entries()) {
        newFormData.append(key, value);
    }
    return newFormData;
}

    window.fetch = async function(url, options = {}) {
    options.headers = options.headers || {};

    // Добавляем access_token, если он есть
    const token = sessionStorage.getItem('access_token');
    if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
    }

    // Сохраняем оригинальное тело запроса
    const originalBody = options.body;

    let response;
    try {
        response = await originalFetch(url, options);
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        throw error;
    }

    // Если получили 401, пробуем обновить токен и повторить запрос
    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            options.headers['Authorization'] = 'Bearer ' + newToken;
            // Если тело запроса является FormData, создаем его копию для повторного использования
            if (originalBody instanceof FormData) {
                options.body = cloneFormData(originalBody);
            }
            response = await originalFetch(url, options);
        }
    }

    return response;
};

if (!sessionStorage.getItem('access_token')) {
    window.location.href = 'login.html';
}
