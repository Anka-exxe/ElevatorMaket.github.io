// Маппинг id вкладок к типам, используемым в API
const tabTypeMapping = {
    door: 'DOOR',
    walls: 'WALL',
    floor: 'FLOOR',
    bumper: 'BUMPER',
    ceilingPattern: 'CEILING_MATERIAL',
    ceiling: 'CEILING',
    controlPanel: 'CONTROL_PANEL',
    indicationBoard: 'INDICATION_BOARD',
    handrails: 'HANDRAIL'
};

document.getElementById('addTextureBtn').addEventListener('click', () => {
    window.location.href = "add-texture.html";
});

document.getElementById('editTextureBtn').addEventListener('click', () => {
    if (currentTextureId) {
        window.location.href = "add-texture.html?id=" + currentTextureId;
    } else {
        alert("Текстура не выбрана для редактирования");
    }
});

let currentTextureId = null;
let currentIconElement = null;

// Функция для отображения модального окна с деталями текстуры
function showTextureModal(textureData, iconElement) {
    const modal = document.getElementById('textureModal');
    const detailsDiv = document.getElementById('textureDetails');

    // Сохраняем текущий id текстуры и элемент иконки для возможного удаления или редактирования
    currentTextureId = textureData.id;
    currentIconElement = iconElement;

    // Функция для формирования блока с картой
    function mapSection(label, mapUrl) {
        if (mapUrl && mapUrl.trim() !== "") {
            return `<div class="map-preview">
                <strong>${label}:</strong><br>
                <img src="${mapUrl}" alt="${label}" class="modal-map-img">
              </div>`;
        } else {
            return `<p><strong>${label}:</strong> Нет</p>`;
        }
    }

    let html = `<h3>Основная информация</h3>`;
    html += `<p><strong>Название:</strong> ${textureData.name || 'Нет данных'}</p>`;
    html += `<p><strong>Базовый цвет:</strong> ${textureData.baseColor || 'Нет данных'}</p>`;

    html += `<h3>Карты текстуры</h3>`;
    html += mapSection("Diffuse (Base)", textureData.baseTextureUrl);
    html += mapSection("AO", textureData.aoMapUrl);
    html += mapSection("Displacement", textureData.displacementMapUrl);
    html += mapSection("Metal", textureData.metalnessMapUrl);
    html += mapSection("Normal", textureData.normalMapUrl);
    html += mapSection("Rough Gloss", textureData.roughnessMapUrl);
    html += mapSection("Alpha", textureData.alphaMapUrl);
    html += mapSection("Bump", textureData.bumpMapUrl);

    html += `<h3>Свойства текстуры</h3>`;
    if (textureData.properties) {
        html += `<p><strong>Bump Scale:</strong> ${textureData.properties.bumpScale}</p>`;
        html += `<p><strong>Metalness:</strong> ${textureData.properties.metalness}</p>`;
        html += `<p><strong>Roughness:</strong> ${textureData.properties.roughness}</p>`;
        html += `<p><strong>Emissive Intensity:</strong> ${textureData.properties.emissiveIntensity}</p>`;
    } else {
        html += `<p>Нет свойств</p>`;
    }

    html += `<h3>Иконка</h3>`;
    if (textureData.icon) {
        html += `<p><strong>Название иконки:</strong> ${textureData.icon.name || 'Нет'}</p>`;
        html += `<p><strong>Тип:</strong> ${textureData.icon.type || 'Нет'}</p>`;
        html += mapSection("Файл иконки", textureData.icon.icon);
    } else {
        html += `<p>Нет иконки</p>`;
    }

    detailsDiv.innerHTML = html;
    modal.style.display = 'block';
}


// Функция закрытия модального окна
function closeModal() {
    document.getElementById('textureModal').style.display = 'none';
    currentTextureId = null;
    currentIconElement = null;
}

// Обработчик нажатия на кнопку закрытия модального окна
document.querySelector('.close').addEventListener('click', closeModal);

// Закрытие модального окна при клике вне его содержимого
window.addEventListener('click', (event) => {
    const modal = document.getElementById('textureModal');
    if (event.target == modal) {
        closeModal();
    }
});

// Обработчик нажатия на кнопку удаления текстуры с подтверждением
document.getElementById('deleteTextureBtn').addEventListener('click', () => {
    if (!confirm("Вы уверены, что хотите удалить текстуру?")) {
        return;
    }

    if (currentTextureId) {
        fetch(`http://localhost:8090/api/v1/textures/${currentTextureId}`, {
            method: 'DELETE'
        })
            .then(response => {
                // Если сервер возвращает 204 или 200, считаем операцию успешной
                if (response.status === 200 || response.status === 204) {
                    return response;
                } else {
                    throw new Error("Ошибка при удалении");
                }
            })
            .then(() => {
                alert('Текстура успешно удалена');
                // Удаляем элемент иконки из UI
                if (currentIconElement) {
                    currentIconElement.remove();
                }
                closeModal();
            })
            .catch(err => {
                console.error('Ошибка удаления текстуры', err);
                alert('Ошибка удаления текстуры');
            });
    }
});


// Функция загрузки иконок для заданного tabId
function loadIconsForTab(tabId) {
    const tabElement = document.getElementById(tabId);
    if (tabElement.dataset.loaded === "true") return;

    const apiType = tabTypeMapping[tabId];
    const grid = tabElement.querySelector('.texture-grid');
    grid.innerHTML = 'Загрузка...';

    fetch(`http://localhost:8090/api/v1/icons/${apiType}?page=0&size=10`)
        .then(response => response.json())
        .then(data => {
            grid.innerHTML = '';
            if (data.content && data.content.length > 0) {
                data.content.forEach(icon => {
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'texture-item';

                    const img = document.createElement('img');
                    img.src = icon.url;
                    img.alt = icon.name;
                    iconDiv.appendChild(img);

                    const p = document.createElement('p');
                    p.textContent = icon.name;
                    iconDiv.appendChild(p);

                    // При клике на иконку запрашиваем детали текстуры и отображаем модальное окно
                    iconDiv.addEventListener('click', () => {
                        fetch(`http://localhost:8090/api/v1/textures/icon/${icon.id}`)
                            .then(response => response.json())
                            .then(textureData => {
                                showTextureModal(textureData, iconDiv);
                            })
                            .catch(err => {
                                console.error('Ошибка загрузки деталей текстуры', err);
                            });
                    });

                    grid.appendChild(iconDiv);
                });
            } else {
                grid.innerHTML = 'Нет иконок для отображения';
            }
            tabElement.dataset.loaded = "true";
        })
        .catch(err => {
            console.error('Ошибка загрузки иконок:', err);
            grid.innerHTML = 'Ошибка загрузки иконок';
        });
}

// Переключение вкладок
document.querySelectorAll('.tab-link').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        // Убираем активный класс у всех кнопок и блоков
        document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');

        // Загружаем иконки для выбранной вкладки, если они ещё не загружены

        if(tabId != 'patterns') {
            loadIconsForTab(tabId);
        } else {
            //alert("Hi");
        }
    });
});

// При загрузке страницы загружаем иконки для активной вкладки
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = document.querySelector('.tab-content.active').id;
    loadIconsForTab(activeTab);
});

document.addEventListener('DOMContentLoaded', function() {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        const tabButton = document.querySelector(`.tab-link[data-tab="${activeTab}"]`);
        if (tabButton) {
            tabButton.click(); // Симулируем клик на кнопке
        }
        // Удаляем значение из localStorage, чтобы не возвращаться к этой вкладке при следующей загрузке
        localStorage.removeItem('activeTab');
    }
});