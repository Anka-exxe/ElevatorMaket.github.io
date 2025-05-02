import * as UrlHelper from "./urlHelper/urls.js";
import {API_BASE_URL, urlTemplateGetIcons} from "./urlHelper/urls.js";
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
                <img src="${API_BASE_URL}/${mapUrl}" alt="${label}" class="modal-map-img">
              </div>`;
        } else {
            return `<p><strong>${label}:</strong> Нет</p>`;
        }
    }

    let html = `<h3>Основная информация</h3>`;
    html += `<p><strong>Название:</strong> ${textureData.name || 'Нет данных'}</p>`;
    html += `<p><strong>Базовый цвет:</strong> ${textureData.baseColor || 'Нет данных'}</p>`;

    html += `<h3>Карты текстуры</h3>`;
    html += mapSection("Diffuse (Base)", `${API_BASE_URL}/${textureData.baseTextureUrl}`);
    html += mapSection("AO", `${API_BASE_URL}/${textureData.aoMapUrl}`);
    html += mapSection("Displacement", `${API_BASE_URL}/${textureData.displacementMapUrl}`);
    html += mapSection("Metal", `${API_BASE_URL}/${textureData.metalnessMapUrl}`);
    html += mapSection("Normal", `${API_BASE_URL}/${textureData.normalMapUrl}`);
    html += mapSection("Rough Gloss", `${API_BASE_URL}/${textureData.roughnessMapUrl}`);
    html += mapSection("Alpha", `${API_BASE_URL}/${textureData.alphaMapUrl}`);
    html += mapSection("Bump", `${API_BASE_URL}/${textureData.bumpMapUrl}`);

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
        // Вычисляем тип(ы) иконки по булевым полям
        let iconTypes = [];
        if (textureData.icon.isDoor) iconTypes.push('Door');
        if (textureData.icon.isWall) iconTypes.push('Wall');
        if (textureData.icon.isFloor) iconTypes.push('Floor');
        if (textureData.icon.isCeiling) iconTypes.push('Ceiling');
        if (textureData.icon.isCeilingMaterial) iconTypes.push('Ceiling Material');
        if (textureData.icon.isControlPanel) iconTypes.push('Control Panel');
        if (textureData.icon.isHandrail) iconTypes.push('Handrail');
        if (textureData.icon.isBumper) iconTypes.push('Bumper');
        if (textureData.icon.isIndicationBoard) iconTypes.push('Indication Board');
        let iconTypesStr = iconTypes.join(', ') || 'Нет';
        html += `<p><strong>Тип:</strong> ${iconTypesStr}</p>`;
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
        fetch(`${UrlHelper.host}textures/${currentTextureId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                    return response;
                } else {
                    throw new Error("Ошибка при удалении");
                }
            })
            .then(() => {
                alert('Текстура успешно удалена');
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

// Функция фильтрации иконок по типу (на основе булевых флагов)
function iconMatchesTab(icon, tabId) {
    switch(tabId) {
        case 'door': return icon.isDoor;
        case 'walls': return icon.isWall;
        case 'floor': return icon.isFloor;
        case 'bumper': return icon.isBumper;
        case 'ceilingPattern': return icon.isCeiling;
        case 'ceiling': return icon.isCeilingMaterial;
        case 'controlPanel': return icon.isControlPanel;
        case 'indicationBoard': return icon.isIndicationBoard;
        case 'handrails': return icon.isHandrail;
        case 'frame': return icon.isFrame;
        default: return false;
    }
}

// Функция загрузки иконок для заданного tabId
function loadIconsForTab(tabId) {
    const tabElement = document.getElementById(tabId);
    if (tabElement.dataset.loaded === "true") return;

    const grid = tabElement.querySelector('.texture-grid');
    grid.innerHTML = 'Загрузка...';

    // Запрашиваем все иконки и затем фильтруем их по нужному флагу
    fetch(UrlHelper.urlTemplateGetIcons)
        .then(response => response.json())
        .then(data => {
            grid.innerHTML = '';
            if (data.content && data.content.length > 0) {
                const filteredIcons = data.content.filter(icon => iconMatchesTab(icon, tabId));

                if (filteredIcons.length > 0) {
                    filteredIcons.forEach(icon => {
                        const iconDiv = document.createElement('div');
                        iconDiv.className = 'texture-item';

                        const img = document.createElement('img');
                        img.src = `${API_BASE_URL}/${icon.url}`;
                        img.alt = icon.name;
                        iconDiv.appendChild(img);

                        const p = document.createElement('p');
                        p.textContent = icon.name;
                        iconDiv.appendChild(p);

                        // При клике на иконку загружаем детали текстуры и показываем модальное окно
                        iconDiv.addEventListener('click', () => {
                            fetch(`${UrlHelper.host}textures/icon/${icon.id}`)
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

        document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');

        if(tabId !== 'patterns') {
            loadIconsForTab(tabId);
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
            tabButton.click();
        }
        localStorage.removeItem('activeTab');
    }
});