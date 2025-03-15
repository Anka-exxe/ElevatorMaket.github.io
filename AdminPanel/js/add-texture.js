import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

// Глобальный объект для хранения старых URL карт
let oldMapValues = {};

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

    // Настройка OrbitControls для вращения модели
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

    // Функция обновления превью картинки для конкретного файлового поля
    function updateFilePreview(inputId, url) {
        const previewDiv = document.getElementById("preview-" + inputId);
        if (previewDiv) {
            previewDiv.innerHTML = `<img src="${url}" alt="Preview" class="preview-thumb">`;
        }
    }

    // Функция обновления текстуры материала по файловому input с сохранением URL в oldMapValues
    function updateMaterialMap(inputId, mapType, oldKey) {
        const input = document.getElementById(inputId);
        if (input.files && input.files[0]) {
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
                    default:
                        break;
                }
                material.needsUpdate = true;
                updateFilePreview(inputId, url);
                // Сохраняем новый URL в oldMapValues
                if(oldKey) {
                    oldMapValues[oldKey] = url;
                }
            });
        }
    }

    // Массив файловых инпутов с типами и ключами для oldMapValues
    const fileInputs = [
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
    // Новый параметр: базовый цвет текстуры
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

    // Обработчик очистки файловых инпутов, сброса карт и обновления oldMapValues
    document.querySelectorAll('.clear-file-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const fileInput = document.getElementById(targetId);
            fileInput.value = "";
            let mapKey = null;
            // Определяем oldKey в зависимости от targetId
            switch(targetId) {
                case 'baseTexture':
                    mapKey = 'baseTexture';
                    break;
                case 'aoMap':
                    mapKey = 'aoMap';
                    break;
                case 'displacementMap':
                    mapKey = 'displacementMap';
                    break;
                case 'metalMap':
                    mapKey = 'metalnessMap';
                    break;
                case 'normalMapDX':
                    mapKey = 'normalMap';
                    break;
                case 'roughGlossMap':
                    mapKey = 'roughnessMap';
                    break;
                case 'alphaMap':
                    mapKey = 'alphaMap';
                    material.transparent = false;
                    break;
                case 'bumpMap':
                    mapKey = 'bumpMap';
                    break;
            }
            if (mapKey) {
                material[mapKey] = null;
                material.needsUpdate = true;
                // Удаляем соответствующее значение из oldMapValues
                oldMapValues[mapKey] = null;
            }
            const previewDiv = document.getElementById("preview-" + targetId);
            if (previewDiv) previewDiv.innerHTML = "";
        });
    });

    // Режим редактирования: если есть параметр id в URL, заполняем форму
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
                // Сохраняем старые URL для карт в oldMapValues
                oldMapValues = {
                    baseTexture: data.baseTextureUrl,
                    aoMap: data.aoMapUrl,
                    displacementMap: data.displacementMapUrl,
                    metalnessMap: data.metalnessMapUrl,
                    normalMap: data.normalMapUrl,
                    roughnessMap: data.roughnessMapUrl,
                    alphaMap: data.alphaMapUrl,
                    bumpMap: data.bumpMapUrl
                };
                // Отображаем превью для каждого поля, если URL присутствует
                if (oldMapValues.baseTexture) updateFilePreview('baseTexture', oldMapValues.baseTexture);
                if (oldMapValues.aoMap) updateFilePreview('aoMap', oldMapValues.aoMap);
                if (oldMapValues.displacementMap) updateFilePreview('displacementMap', oldMapValues.displacementMap);
                if (oldMapValues.metalnessMap) updateFilePreview('metalMap', oldMapValues.metalnessMap);
                if (oldMapValues.normalMap) updateFilePreview('normalMapDX', oldMapValues.normalMap);
                if (oldMapValues.roughnessMap) updateFilePreview('roughGlossMap', oldMapValues.roughnessMap);
                if (oldMapValues.alphaMap) updateFilePreview('alphaMap', oldMapValues.alphaMap);
                if (oldMapValues.bumpMap) updateFilePreview('bumpMap', oldMapValues.bumpMap);
            })
            .catch(err => {
                console.error("Ошибка загрузки данных текстуры", err);
                alert("Ошибка загрузки данных текстуры");
            });
    }

    document.getElementById('textureForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const optionalKeys = [
            'aoMap',
            'displacementMap',
            'metalnessMap',
            'normalMap',
            'roughnessMap',
            'alphaMap',
            'bumpMap'
        ];
        optionalKeys.forEach(key => {
            const file = formData.get(key);
            if (!file || (file instanceof File && file.size === 0)) {
                // Если в режиме редактирования и для этого поля существует старое значение, добавляем его
                if (textureId && oldMapValues && oldMapValues[key]) {
                    formData.append(key, oldMapValues[key]);
                } else {
                    formData.delete(key);
                }
            }
        });

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
                    throw new Error("Ошибка при сохранении текстуры");
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
