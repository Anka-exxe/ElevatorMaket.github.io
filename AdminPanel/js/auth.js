const _fetch = window.fetch.bind(window);

async function refreshAccessToken() {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error("Refresh token отсутствует");
        window.location.href = 'login.html';
        return null;
    }
    try {
        const res = await _fetch('http://localhost:8090/api/v1/auth/refresh-token', {
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
    // создаём Request, чтобы можно было .clone()
    let req = new Request(input, init);

    // вешаем токен, если есть
    const token = sessionStorage.getItem('access_token');
    if (token) {
        req.headers.set('Authorization', 'Bearer ' + token);
    }

    // первый запрос
    let res = await _fetch(req.clone());

    // если 401 — попробуем обновить и повторить
    if (res.status === 401 && !req.url.endsWith('/refresh-token')) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            req.headers.set('Authorization', 'Bearer ' + newToken);
            res = await _fetch(req.clone());
        }
    }

    return res;
};


if (!sessionStorage.getItem('access_token')) {
    window.location.href = 'login.html';
}
