document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8090/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        // Если в ответе присутствует поле error, выводим сообщение
        if (data.error && data.error !== '' && data.error !== 'null') {
            document.getElementById('error').textContent = data.error_description || 'Ошибка авторизации.';
        } else if (data.access_token && data.access_token !== '') {
            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('refresh_token', data.refresh_token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('error').textContent = 'Неизвестная ошибка.';
        }
    } catch (err) {
        console.error(err);
        document.getElementById('error').textContent = 'Ошибка запроса к серверу.';
    }
});
