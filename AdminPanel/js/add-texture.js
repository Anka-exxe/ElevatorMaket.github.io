import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';


// Предполагается, что textureId уже получен из URL
const urlParams = new URLSearchParams(window.location.search);
const textureId = urlParams.get('id');

// Если мы в режиме редактирования, назначаем обработчик для кнопки "Изменить название"
if (textureId) {
    document.getElementById('changeNameBtn').addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        if (!name) {
            alert("Введите новое название текстуры");
            return;
        }
        // Отправляем запрос на изменение названия текстуры
        fetch(`http://localhost:8090/api/v1/textures/${textureId}/name`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Ошибка ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Название текстуры успешно изменено!');
            })
            .catch(err => {
                console.error("Ошибка при изменении названия текстуры", err);
                alert("Ошибка при изменении названия текстуры");
            });
    });
}

// Глобальные объекты для хранения старых URL (или файлов) и флагов удаления
let oldMapValues = {};
let removeFlags = {};  // например, { baseTexture: true, metalnessMap: true, ... }

// Маппинг для флагов удаления: для поля baseTexture флаг называется removeBaseTexture и т.д.
const removeMapping = {
    baseTexture: "removeBaseTexture",
    alphaMap: "removeAlphaMap",
    bumpMap: "removeBumpMap",
    normalMap: "removeNormalMap",
    metalnessMap: "removeMetalnessMap",
    roughnessMap: "removeRoughnessMap",
    aoMap: "removeAoMap",
    displacementMap: "removeDisplacementMap"
};

(function() {
    // Создаем сцену предпросмотра
    const previewContainer = document.getElementById('preview');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
        75,
        previewContainer.clientWidth / previewContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(previewContainer.clientWidth, previewContainer.clientHeight);
    previewContainer.appendChild(renderer.domElement);

    // Настройка OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Источники света
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const topLight = new THREE.DirectionalLight(0xffffff, 0.7);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    // Создаем материал и базовую геометрию
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

    // Функция обновления превью картинки для конкретного поля
    function updateFilePreview(inputId, url) {
        const previewDiv = document.getElementById("preview-" + inputId);
        if (previewDiv) {
            previewDiv.innerHTML = `<img src="${url}" alt="Preview" class="preview-thumb">`;
        }
    }

    // Функция обновления текстуры материала по файловому input.
    // После загрузки файла вызывается updateFilePreview и сохраняется URL в oldMapValues.
    function updateMaterialMap(inputId, mapType, oldKey) {
        const input = document.getElementById(inputId);
        if (input.files && input.files[0]) {
            // Если пользователь выбирает новый файл, сбрасываем флаг удаления
            removeFlags[oldKey] = false;
            const file = input.files[0];
            const url = URL.createObjectURL(file);
            const loader = new THREE.TextureLoader();
            loader.load(url, (texture) => {
                texture.needsUpdate = true;
                switch(mapType) {
                    case 'baseTexture':
                        texture.encoding = THREE.sRGBEncoding;
                        material.map = texture;
                        break;
                    case 'aoMap':
                        material.aoMap = texture;
                        break;
                    case 'displacementMap':
                        material.displacementMap = texture;
                        break;
                    case 'metalMap':
                        material.metalnessMap = texture;
                        break;
                    case 'normalMapDX':
                        material.normalMap = texture;
                        break;
                    case 'roughnessMap':
                        material.roughnessMap = texture;
                        break;
                    case 'alphaMap':
                        material.alphaMap = texture;
                        material.transparent = true;
                        material.alphaTest = 0.5;
                        break;
                    case 'bumpMap':
                        material.bumpMap = texture;
                        break;
                    case 'icon': // Для иконки обновляем только превью
                        break;
                    default:
                        break;
                }
                material.needsUpdate = true;
                updateFilePreview(inputId, url);
                if (oldKey) {
                    oldMapValues[oldKey] = url;
                }
            });
        }
    }

    // Массив файловых инпутов с типами и ключами (oldKey соответствует ключу, который используется в oldMapValues и на сервере)
    const fileInputs = [
        { id: 'icon.icon', type: 'icon', oldKey: 'icon' },
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
                case 'icon.icon':
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
                // Устанавливаем флаг удаления для этого поля
                removeFlags[mapKey] = true;
            }
            const previewDiv = document.getElementById("preview-" + targetId);
            if (previewDiv) previewDiv.innerHTML = "";
        });
    });

    // Режим редактирования: если есть параметр id в URL, заполняем форму и сохраняем старые URL в oldMapValues
    const urlParams = new URLSearchParams(window.location.search);
    const textureId = urlParams.get('id');
    const pageTitle = document.getElementById('pageTitle');
    const submitButton = document.querySelector('button[type="submit"]');

    if (textureId) {
        pageTitle.textContent = "Редактирование текстуры";
        submitButton.textContent = "Сохранить изменения";
        // Для иконки убираем обязательность
        document.getElementById('icon.icon').removeAttribute('required');
        fetch(`http://localhost:8090/api/v1/textures/${textureId}`)
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
                document.getElementById('icon.type').value = data.icon.type;
                document.getElementById('icon.name').value = data.icon.name;
                if (data.baseColor) {
                    let baseColor = data.baseColor;
                    if (!baseColor.startsWith("#")) {
                        baseColor = "#" + baseColor;
                    }
                    document.getElementById('baseColor').value = baseColor;
                    material.color = new THREE.Color(baseColor);
                }
                // Сохраняем старые URL для карт в oldMapValues, включая иконку
                oldMapValues = {
                    baseTexture: data.baseTextureUrl,
                    aoMap: data.aoMapUrl,
                    displacementMap: data.displacementMapUrl,
                    metalnessMap: data.metalnessMapUrl,
                    normalMap: data.normalMapUrl,
                    roughnessMap: data.roughnessMapUrl,
                    alphaMap: data.alphaMapUrl,
                    bumpMap: data.bumpMapUrl,
                    icon: data.icon.icon  // URL для иконки
                };

                // Функция для загрузки текстуры и назначения свойству материала
                function loadTexture(url, assignFn) {
                    new THREE.TextureLoader().load(url, (tex) => {
                        tex.needsUpdate = true;
                        assignFn(tex);
                        material.needsUpdate = true;
                    });
                }

                // Загружаем и применяем текстурные карты, если URL присутствует
                if (oldMapValues.baseTexture) {
                    loadTexture(oldMapValues.baseTexture, (tex) => {
                        tex.encoding = THREE.sRGBEncoding;
                        material.map = tex;
                    });
                    updateFilePreview('baseTexture', oldMapValues.baseTexture);
                }
                if (oldMapValues.aoMap) {
                    loadTexture(oldMapValues.aoMap, (tex) => { material.aoMap = tex; });
                    updateFilePreview('aoMap', oldMapValues.aoMap);
                }
                if (oldMapValues.displacementMap) {
                    loadTexture(oldMapValues.displacementMap, (tex) => { material.displacementMap = tex; });
                    updateFilePreview('displacementMap', oldMapValues.displacementMap);
                }
                if (oldMapValues.metalnessMap) {
                    loadTexture(oldMapValues.metalnessMap, (tex) => { material.metalnessMap = tex; });
                    updateFilePreview('metalMap', oldMapValues.metalnessMap);
                }
                if (oldMapValues.normalMap) {
                    loadTexture(oldMapValues.normalMap, (tex) => { material.normalMap = tex; });
                    updateFilePreview('normalMapDX', oldMapValues.normalMap);
                }
                if (oldMapValues.roughnessMap) {
                    loadTexture(oldMapValues.roughnessMap, (tex) => { material.roughnessMap = tex; });
                    updateFilePreview('roughGlossMap', oldMapValues.roughnessMap);
                }
                if (oldMapValues.alphaMap) {
                    loadTexture(oldMapValues.alphaMap, (tex) => {
                        material.alphaMap = tex;
                        material.transparent = true;
                        material.alphaTest = 0.5;
                    });
                    updateFilePreview('alphaMap', oldMapValues.alphaMap);
                }
                if (oldMapValues.bumpMap) {
                    loadTexture(oldMapValues.bumpMap, (tex) => { material.bumpMap = tex; });
                    updateFilePreview('bumpMap', oldMapValues.bumpMap);
                }
                // Для иконки – обновляем только превью, материал не меняем
                if (oldMapValues.icon) {
                    updateFilePreview('icon.icon', oldMapValues.icon);
                }
            })
            .catch(err => {
                console.error("Ошибка загрузки данных текстуры", err);
                alert("Ошибка загрузки данных текстуры");
            });
    }


    // Обработчик отправки формы – асинхронный, чтобы для опциональных полей, если новый файл не выбран, загрузить файл по старому URL,
    // а если пользователь удалил файл (removeFlags установлен), добавить соответствующий флаг.
    document.getElementById('textureForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Для отладки: выводим все пары key/value
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
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
            // Если пользователь не выбрал новый файл (поле пустое)
            if (!file || (file instanceof File && file.size === 0)) {
                // Если пользователь удалил файл – добавляем флаг удаления
                if (removeFlags[key]) {
                    const flagName = removeMapping[key];
                    formData.append(flagName, "true");
                }
                // Если поле не заполнено, просто удаляем его – на сервере его отсутствие можно трактовать как null.
                formData.delete(key);
            }
        }

        const url = textureId
            ? `http://localhost:8090/api/v1/textures/${textureId}`
            : 'http://localhost:8090/api/v1/textures';
        const method = textureId ? 'PUT' : 'POST';
        fetch(url, {
            method: method,
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Ошибка ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(textureId ? 'Текстура успешно обновлена!' : 'Текстура успешно добавлена!');
            })
            .catch(err => {
                console.error("Ошибка при сохранении текстуры", err);
                alert("Ошибка при сохранении текстуры");
            });
    });
})();
