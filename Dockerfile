# Используем легковесный образ nginx на Alpine
FROM nginx:alpine

# Копируем файлы основного сайта (если кроме index.html есть другие файлы, они тоже попадут в образ)
COPY . /usr/share/nginx/html/

# Если нужен только index.html, можно ограничиться:
# COPY index.html /usr/share/nginx/html/index.html

# Открываем порт 80
EXPOSE 80
