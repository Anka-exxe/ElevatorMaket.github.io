const _fetch = window.fetch.bind(window);

async function refreshAccessToken() {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error("Refresh token отсутствует");
        window.location.href = 'login.html';
        return null;
    }
    try {
        const res = await _fetch(`http://localhost:8090/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) throw new Error(`Refresh failed ${res.status}`);
        const data = await res.json();
        sessionStorage.setItem('access_token', data.access_token);
        sessionStorage.setItem('refresh_token', data.refresh_token);
        console.log("Токен обновлён");
        return data.access_token;
    } catch (e) {
        console.error("Ошибка при обновлении токена:", e);
        window.location.href = 'login.html';
        return null;
    }
}

window.fetch = async function(input, init = {}) {
    const originalRequest = new Request(input, init);
    const token = sessionStorage.getItem('access_token');
    if (token) {
        originalRequest.headers.set('Authorization', 'Bearer ' + token);
    }

    let response = await _fetch(originalRequest.clone());

    // Если 401 и это не запрос на рефреш
    if (response.status === 401 && !originalRequest.url.includes('/api/v1/auth/refresh-token')) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            // подтягиваем новый токен в заголовок
            originalRequest.headers.set('Authorization', 'Bearer ' + newToken);
            // повторяем запрос
            response = await _fetch(originalRequest.clone());
        }
    }

    return response;
};



if (!sessionStorage.getItem('access_token')) {
    window.location.href = 'login.html';
}
