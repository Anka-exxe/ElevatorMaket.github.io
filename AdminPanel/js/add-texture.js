﻿import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import * as UrlHelper from "./urlHelper/urls.js";
import { RectAreaLightUniformsLib } from 'jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper }      from 'jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLight }            from 'three';

// В самом верху add-texture.js
const urlParams     = new URLSearchParams(window.location.search);
const textureId     = urlParams.get('id');
const nameInput     = document.getElementById('name');
const changeNameBtn = document.getElementById('changeNameBtn');

if (textureId) {
    // Сразу делаем поле readOnly и переводим кнопку в режим "edit"
    nameInput.readOnly = true;
    changeNameBtn.textContent = 'Изменить название';
    changeNameBtn.dataset.mode = 'edit';

    changeNameBtn.addEventListener('click', async () => {
        if (changeNameBtn.dataset.mode === 'edit') {
            // Переключаемся в режим редактирования
            nameInput.readOnly = false;
            nameInput.focus();
            changeNameBtn.textContent = 'Сохранить';
            changeNameBtn.dataset.mode = 'save';
            return;
        }

        // === режим save ===
        const newName = nameInput.value.trim();
        if (!newName) {
            alert('Введите новое название текстуры');
            return;
        }

        // Снова делаем поле только для чтения
        nameInput.readOnly = true;
        changeNameBtn.textContent = 'Изменить название';
        changeNameBtn.dataset.mode = 'edit';

        // Формируем multipart/form-data
        const formData = new FormData();
        formData.append('name', newName);

        try {
            const res = await fetch(
                `${UrlHelper.host}textures/${textureId}/name`,
                {
                    method: 'PUT',
                    body: formData
                }
            );
            if (!res.ok) {
                // Читаем тело ошибки (JSON или текст)
                let errBody;
                try { errBody = await res.json(); }
                catch { errBody = await res.text(); }
                throw new Error(`Ошибка ${res.status}: ${JSON.stringify(errBody)}`);
            }
            alert('Название текстуры успешно изменено!');
        } catch (err) {
            console.error('Ошибка при изменении названия текстуры', err);
            alert(err.message);
        }
    });
}


// Глобальные объекты для хранения старых URL (при редактировании) и флагов удаления
let oldMapValues = {};
let removeFlags = {}; // Например: { baseTexture: true, metalnessMap: true, ... }

// Маппинг для флагов удаления (ключи совпадают с именами, используемыми на сервере)
const removeMapping = {
    baseTexture: "removeBaseTexture",
    alphaMap: "removeAlphaMap",
    bumpMap: "removeBumpMap",
    normalMap: "removeNormalMap",
    metalnessMap: "removeMetalnessMap",
    roughnessMap: "removeRoughnessMap",
    aoMap: "removeAoMap",
    displacementMap: "removeDisplacementMap",
    icon: "removeIcon"
};

(function() {
    const previewContainer = document.getElementById('preview');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);

    const camera = new THREE.PerspectiveCamera(
        75,
        previewContainer.clientWidth / previewContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(previewContainer.clientWidth, previewContainer.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    previewContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    RectAreaLightUniformsLib.init();

    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const areaLightCeiling = new RectAreaLight(0xffffff, 2, 20, 20);
   areaLightCeiling.position.set(0, 30, 0);
   areaLightCeiling.lookAt(0, 0, 0);
   scene.add(areaLightCeiling);

    const areaLightCeiling1 = new RectAreaLight(0xffffff, 2, 20, 20);
    areaLightCeiling1.position.set(-30, 0, 30);
    areaLightCeiling1.lookAt(0, 0, 0);
    scene.add(areaLightCeiling1);


    let material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Функция обновления предпросмотра файла для конкретного поля
    function updateFilePreview(inputId, url) {
        const previewDiv = document.getElementById("preview-" + inputId);
        if (previewDiv) {
            previewDiv.innerHTML = `<img src="${url}" alt="Preview" class="preview-thumb">`;
        }
    }

    // Функция обновления текстуры материала по файловому input
    function updateMaterialMap(inputId, mapType, oldKey) {
        const input = document.getElementById(inputId);
        if (!input.files?.length) return;

        removeFlags[oldKey] = false;
        const file = input.files[0];
        const url  = URL.createObjectURL(file);

        // Считываем необязательные размеры плитки из формы
        const tx = parseFloat(document.getElementById('tileSizeX').value);
        const ty = parseFloat(document.getElementById('tileSizeY').value);
        //const useTile = !isNaN(tx) && tx > 0 && !isNaN(ty) && ty > 0;

        new THREE.TextureLoader().load(url, texture => {
            // Цветовая карта — sRGB, остальные — Linear
            texture.colorSpace  = (mapType === 'baseTexture')
                ? THREE.SRGBColorSpace
                : THREE.LinearSRGBColorSpace;

            // Повтор и фильтры
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            /*if (useTile) {
                // если заданы tileSizeX/Y — считаем 1м / размер_плитки
                texture.repeat.set(1 / tx, 1 / ty);
            } else {
                texture.repeat.set(1, 1);
            }*/

            // Присваиваем нужному полю материала
            switch(mapType) {
                case 'baseTexture':
                    material.color.set(0xffffff);
                    material.map = texture; break;
                case 'aoMap':
                    material.aoMap = texture; break;
                case 'displacementMap':
                    material.displacementMap = texture; break;
                case 'metalMap':
                    material.metalnessMap = texture; break;
                case 'normalMapDX':
                    material.normalMap = texture; break;
                case 'roughnessMap':
                    material.roughnessMap = texture; break;
                case 'alphaMap':
                    material.alphaMap = texture;
                    material.transparent = true;
                    material.alphaTest = 0.5;
                    break;
                case 'bumpMap':
                    material.bumpMap = texture; break;
                // 'icon' не трогаем
            }

            material.needsUpdate = true;
            updateFilePreview(inputId, url);
            oldMapValues[oldKey] = url;
        });
    }


    // Массив файловых инпутов с типами и ключами (oldKey – ключ для хранения старого URL)
    const fileInputs = [
        { id: 'icon.url', type: 'icon', oldKey: 'icon' },
        { id: 'baseTexture', type: 'baseTexture', oldKey: 'baseTexture' },
        { id: 'aoMap', type: 'aoMap', oldKey: 'aoMap' },
        { id: 'displacementMap', type: 'displacementMap', oldKey: 'displacementMap' },
        { id: 'metalMap', type: 'metalMap', oldKey: 'metalnessMap' },
        { id: 'normalMapDX', type: 'normalMapDX', oldKey: 'normalMap' },
        { id: 'roughGlossMap', type: 'roughnessMap', oldKey: 'roughnessMap' },
        { id: 'alphaMap', type: 'alphaMap', oldKey: 'alphaMap' },
        { id: 'bumpMap', type: 'bumpMap', oldKey: 'bumpMap' }
    ];
    fileInputs.forEach(item => {
        const inputEl = document.getElementById(item.id);
        if (inputEl) {
            inputEl.addEventListener('change', () => {
                if (!inputEl.files || inputEl.files.length === 0) {
                    if (!textureId) {
                        const previewDiv = document.getElementById("preview-" + item.id);
                        if (previewDiv) previewDiv.innerHTML = "";
                    }
                    return;
                }

                updateMaterialMap(item.id, item.type, item.oldKey);
            });
        }
    });

    // Обновление числовых параметров материала
    document.getElementById('bumpScale').addEventListener('input', (e) => {
        material.bumpScale = parseFloat(e.target.value);
    });
    document.getElementById('metalness').addEventListener('input', (e) => {
        material.metalness = parseFloat(e.target.value);
    });
    document.getElementById('roughness').addEventListener('input', (e) => {
        material.roughness = parseFloat(e.target.value);
    });
    document.getElementById('emissiveIntensity').addEventListener('input', (e) => {
        material.emissive = new THREE.Color(0xffffff);
        material.emissiveIntensity = parseFloat(e.target.value);
    });
    document.getElementById('baseColor').addEventListener('input', (e) => {
        material.color = new THREE.Color(e.target.value);
    });

    // Изменение геометрии по выбору фигуры
    document.getElementById('shapeSelect').addEventListener('change', (e) => {
        const shape = e.target.value;
        let newGeometry;
        switch (shape) {
            case 'cube':
                newGeometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            case 'sphere':
                newGeometry = new THREE.SphereGeometry(0.75, 32, 32);
                break;
            case 'plane':
                newGeometry = new THREE.PlaneGeometry(2, 2);
                break;
            case 'cylinder':
                newGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
                break;
            default:
                newGeometry = new THREE.BoxGeometry(1, 1, 1);
        }
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh = new THREE.Mesh(newGeometry, material);
        scene.add(mesh);
    });

    // Обработчик кнопок удаления файлов: очищает input, сбрасывает свойство материала и устанавливает флаг удаления
    document.querySelectorAll('.clear-file-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const fileInput = document.getElementById(targetId);
            fileInput.value = "";
            let mapKey = null;
            switch(targetId) {
                case 'icon.url':
                    mapKey = 'icon';
                    break;
                case 'baseTexture':
                    mapKey = 'baseTexture';
                    material.map = null;
                    break;
                case 'aoMap':
                    mapKey = 'aoMap';
                    material.aoMap = null;
                    break;
                case 'displacementMap':
                    mapKey = 'displacementMap';
                    material.displacementMap = null;
                    break;
                case 'metalMap':
                    mapKey = 'metalnessMap';
                    material.metalnessMap = null;
                    break;
                case 'normalMapDX':
                    mapKey = 'normalMap';
                    material.normalMap = null;
                    break;
                case 'roughGlossMap':
                    mapKey = 'roughnessMap';
                    material.roughnessMap = null;
                    break;
                case 'alphaMap':
                    mapKey = 'alphaMap';
                    material.alphaMap = null;
                    material.transparent = false;
                    break;
                case 'bumpMap':
                    mapKey = 'bumpMap';
                    material.bumpMap = null;
                    break;
            }
            if (mapKey) {
                material.needsUpdate = true;
                oldMapValues[mapKey] = null;
                removeFlags[mapKey] = true;
            }
            const previewDiv = document.getElementById("preview-" + targetId);
            if (previewDiv) previewDiv.innerHTML = "";
        });
    });

    // Режим редактирования: если textureId присутствует, заполняем форму и сохраняем старые URL
    if (textureId) {
        document.getElementById('pageTitle').textContent = "Редактирование текстуры";
        document.querySelector('button[type="submit"]').textContent = "Сохранить изменения";
        // Для иконки убираем обязательность
        document.getElementById('icon.icon').removeAttribute('required');
        fetch(`${UrlHelper.host}textures/${textureId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Не удалось загрузить данные текстуры");
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('name').value = data.name;
                document.getElementById('bumpScale').value = data.properties.bumpScale;
                document.getElementById('metalness').value = data.properties.metalness;
                document.getElementById('roughness').value = data.properties.roughness;
                document.getElementById('emissiveIntensity').value = data.properties.emissiveIntensity;
                document.getElementById('tileSizeX').value = data.properties.tileSizeX ?? '';
                document.getElementById('tileSizeY').value = data.properties.tileSizeY ?? '';

                material.bumpScale = parseFloat(data.properties.bumpScale);
                material.metalness = parseFloat(data.properties.metalness);
                material.roughness = parseFloat(data.properties.roughness);
                material.emissive = new THREE.Color(0xffffff);      // или из data, если сохранили цвет
                material.emissiveIntensity= parseFloat(data.properties.emissiveIntensity);
                material.needsUpdate = true;

                // Заполняем группу чекбоксов для icon.type
                if (data.icon) {
                    // Сначала сбросим все
                    document.querySelectorAll('input[name="icon.type"]').forEach(cb => {
                        cb.checked = false;
                    });
                    // Отмечаем согласно флагам из data.icon
                    if (data.icon.isDoor)             document.querySelector('input[value="DOOR"]').checked = true;
                    if (data.icon.isWall)             document.querySelector('input[value="WALL"]').checked = true;
                    if (data.icon.isFloor)            document.querySelector('input[value="FLOOR"]').checked = true;
                    if (data.icon.isCeilingMaterial)  document.querySelector('input[value="CEILING_MATERIAL"]').checked = true;
                    if (data.icon.isCeiling)          document.querySelector('input[value="CEILING"]').checked = true;
                    if (data.icon.isControlPanel)     document.querySelector('input[value="CONTROL_PANEL"]').checked = true;
                    if (data.icon.isIndicationBoard)  document.querySelector('input[value="INDICATION_BOARD"]').checked = true;
                    if (data.icon.isBumper)           document.querySelector('input[value="BUMPER"]').checked = true;
                    if (data.icon.isHandrail)         document.querySelector('input[value="HANDRAIL"]').checked = true;
                    if (data.icon.isFrame)            document.querySelector('input[value="FRAME"]').checked = true;

                    document.getElementById('icon.name').value = data.icon.name;
                }
                if (data.baseColor) {
                    let baseColor = data.baseColor.trim().toLowerCase();
                    if (!baseColor.startsWith("#")) baseColor = "#" + baseColor;
                    document.getElementById('baseColor').value = baseColor;
                    material.color = new THREE.Color(baseColor);
                }
                // Сохраняем старые URL для текстур и иконки
                oldMapValues = {
                    baseTexture: data.baseTextureUrl,
                    aoMap: data.aoMapUrl,
                    displacementMap: data.displacementMapUrl,
                    metalnessMap: data.metalnessMapUrl,
                    normalMap: data.normalMapUrl,
                    roughnessMap: data.roughnessMapUrl,
                    alphaMap: data.alphaMapUrl,
                    bumpMap: data.bumpMapUrl,
                    icon: data.icon ? data.icon.url : null
                };

                function loadTexture(url, assignFn, mapType) {
                    new THREE.TextureLoader().load(url, (tex) => {
                        // Устанавливаем правильный colorSpace
                        tex.colorSpace = (mapType === 'baseTexture')
                            ? THREE.SRGBColorSpace
                            : THREE.LinearSRGBColorSpace;

                        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                        tex.generateMipmaps = true;
                        tex.minFilter = THREE.LinearMipMapLinearFilter;
                        tex.magFilter = THREE.LinearFilter;
                        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

                        // Применяем tile size, если указано
                        const tx = parseFloat(document.getElementById('tileSizeX').value);
                        const ty = parseFloat(document.getElementById('tileSizeY').value);
                        /*const useTile = !isNaN(tx) && tx > 0 && !isNaN(ty) && ty > 0;
                        tex.repeat.set(
                            useTile ? 1 / tx : 1,
                            useTile ? 1 / ty : 1
                        );*/

                        assignFn(tex);
                        material.needsUpdate = true;
                        renderer.compile(scene, camera);
                    });
                }

                if (oldMapValues.baseTexture) {
                    loadTexture(oldMapValues.baseTexture, (tex) => {
                        material.color.set(0xffffff);
                        material.map = tex;
                        material.needsUpdate = true;
                        renderer.compile(scene, camera);
                    }, 'baseTexture');
                    updateFilePreview('baseTexture', oldMapValues.baseTexture);
                }

                if (oldMapValues.aoMap) {
                    loadTexture(oldMapValues.aoMap, (tex) => {
                        material.aoMap = tex;
                        material.needsUpdate = true;
                    }, 'aoMap');
                    updateFilePreview('aoMap', oldMapValues.aoMap);
                }

                if (oldMapValues.displacementMap) {
                    loadTexture(oldMapValues.displacementMap, (tex) => {
                        material.displacementMap = tex;
                        material.needsUpdate = true;
                    }, 'displacementMap');
                    updateFilePreview('displacementMap', oldMapValues.displacementMap);
                }

                if (oldMapValues.metalnessMap) {
                    loadTexture(oldMapValues.metalnessMap, (tex) => {
                        material.metalnessMap = tex;
                        material.needsUpdate = true;
                    }, 'metalnessMap');
                    updateFilePreview('metalMap', oldMapValues.metalnessMap);
                }

                if (oldMapValues.normalMap) {
                    loadTexture(oldMapValues.normalMap, (tex) => {
                        material.normalMap = tex;
                        material.needsUpdate = true;
                    }, 'normalMap');
                    updateFilePreview('normalMapDX', oldMapValues.normalMap);
                }

                if (oldMapValues.roughnessMap) {
                    loadTexture(oldMapValues.roughnessMap, (tex) => {
                        material.roughnessMap = tex;
                        material.needsUpdate = true;
                    }, 'roughnessMap');
                    updateFilePreview('roughGlossMap', oldMapValues.roughnessMap);
                }

                if (oldMapValues.alphaMap) {
                    loadTexture(oldMapValues.alphaMap, (tex) => {
                        material.alphaMap = tex;
                        material.transparent = true;
                        material.alphaTest = 0.5;
                        material.needsUpdate = true;
                    }, 'alphaMap');
                    updateFilePreview('alphaMap', oldMapValues.alphaMap);
                }

                if (oldMapValues.bumpMap) {
                    loadTexture(oldMapValues.bumpMap, (tex) => {
                        material.bumpMap = tex;
                        material.needsUpdate = true;
                    }, 'bumpMap');
                    updateFilePreview('bumpMap', oldMapValues.bumpMap);
                }
                if (oldMapValues.icon) {
                    updateFilePreview('icon.icon', oldMapValues.icon);
                }
            })
            .catch(err => {
                console.error("Ошибка загрузки данных текстуры", err);
                alert("Ошибка загрузки данных текстуры");
            });
    }
    const textureForm = document.getElementById('textureForm');
    const nameInput   = document.getElementById('name');
    const submitBtn   = textureForm.querySelector('button[type="submit"]');


    textureForm.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            if (document.activeElement !== submitBtn) {
                e.preventDefault();
            }
        }
    });

    document.getElementById('textureForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedTypes = Array.from(
            document.querySelectorAll('input[name="icon.type"]:checked')
        ).map(cb => cb.value);

        if (selectedTypes.length === 0) {
            alert('Пожалуйста, выберите хотя бы один элемент, к которому будет применяться текстура');
            return;
        }
        const action = textureId ? 'обновить' : 'добавить';
        const name   = nameInput.value.trim() || '<без названия>';
        if (!window.confirm(`Вы уверены, что хотите ${action} текстуру "${name}"?`)) {
            return;
        }

        const form = document.getElementById('textureForm');
        const formData = new FormData(form);

        const iconField = formData.get('icon.icon');
        if (!iconField || (iconField instanceof File && iconField.size === 0)) {
            // удаляем пустое поле
            formData.delete('icon.icon');
            // если кликнули "Удалить файл" — подставим флаг removeIcon
            if (removeFlags.icon) {
                formData.append('removeIcon', 'true');
            }
        }


        const optionalKeys = [
            'baseTexture',
            'aoMap',
            'displacementMap',
            'metalnessMap',
            'normalMap',
            'roughnessMap',
            'alphaMap',
            'bumpMap'
        ];

        for (const key of optionalKeys) {
            const file = formData.get(key);
            if (!file || (file instanceof File && file.size === 0)) {
                if (removeFlags[key]) {
                    formData.append(removeMapping[key], 'true');
                }
                formData.delete(key);
            }
        }

        selectedTypes.map(cb => cb.value);
        formData.append('icon.isDoor', selectedTypes.includes('DOOR'));
        formData.append('icon.isWall', selectedTypes.includes('WALL'));
        formData.append('icon.isFloor', selectedTypes.includes('FLOOR'));
        formData.append('icon.isCeiling', selectedTypes.includes('CEILING'));
        formData.append('icon.isCeilingMaterial', selectedTypes.includes('CEILING_MATERIAL'));
        formData.append('icon.isControlPanel', selectedTypes.includes('CONTROL_PANEL'));
        formData.append('icon.isHandrail', selectedTypes.includes('HANDRAIL'));
        formData.append('icon.isBumper', selectedTypes.includes('BUMPER'));
        formData.append('icon.isFrame', selectedTypes.includes('FRAME'));
        formData.append('icon.isIndicationBoard', selectedTypes.includes('INDICATION_BOARD'));

        const url = textureId
            ? `${UrlHelper.host}textures/${textureId}`
            : `${UrlHelper.host}textures`;
        const method = textureId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            body: formData
        })
            .then(res => {
                if (!res.ok) return res.text().then(t => { throw new Error(`Ошибка ${res.status}: ${t}`); });
                return res.json();
            })
            .then(() => alert(textureId ? 'Текстура успешно обновлена!' : 'Текстура успешно добавлена!'))
            .catch(err => {
                console.error('Ошибка при сохранении текстуры', err);
                alert(err.message);
            });
    });
})();
