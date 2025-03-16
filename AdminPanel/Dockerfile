FROM nginx:alpine

# Копируем все файлы из папки AdminPanel в директорию, обслуживаемую nginx
COPY . /usr/share/nginx/html/

# Если нужен только index.html, можно указать:
# COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80
