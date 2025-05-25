import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLight } from 'three';
import { RectAreaLightHelper } from 'jsm/helpers/RectAreaLightHelper.js';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';
import { MODEL_BASE_PATH } from "./urlHelper/urls.js";
import { urlLightSettings, urlSaveLightSettings } from './urlHelper/urls.js';

RectAreaLightUniformsLib.init();

const container = document.getElementById('preview');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(2, 2, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

let areaLight1 = null;
let areaLight2 = null;

const loader = new FBXLoader();
loader.load(`${MODEL_BASE_PATH}wideLiftModel.fbx`, (object) => {
    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);

    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xb0b0b0,
                roughness: 0.4,
                metalness: 0.5
            });
        }
    });

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const distance = maxDim / (2 * Math.tan(fov / 2));
    camera.position.set(center.x, center.y, distance * 1.2);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();

    const lamp1 = object.getObjectByName("Lamp1");
    const lamp2 = object.getObjectByName("Lamp2");

    if (lamp1 && lamp2) {
        const box1 = new THREE.Box3().setFromObject(lamp1);
        const size1 = box1.getSize(new THREE.Vector3());
        const center1 = box1.getCenter(new THREE.Vector3());

        const box2 = new THREE.Box3().setFromObject(lamp2);
        const size2 = box2.getSize(new THREE.Vector3());
        const center2 = box2.getCenter(new THREE.Vector3());

        areaLight1 = new RectAreaLight(0xffffff, 2, size1.x, size1.z);
        areaLight1.position.set(center1.x, 0.43, center1.z);
        areaLight1.lookAt(center1.x, 0, center1.z);
        scene.add(areaLight1);
        scene.add(new RectAreaLightHelper(areaLight1)); // ✅ добавлен helper

        areaLight2 = new RectAreaLight(0xffffff, 2, size2.x, size2.z);
        areaLight2.position.set(center2.x, 0.43, center2.z);
        areaLight2.lookAt(center2.x, 0, center2.z);
        scene.add(areaLight2);
        scene.add(new RectAreaLightHelper(areaLight2)); // ✅ добавлен helper
    } else {
        console.warn("Лампы Lamp1 и Lamp2 не найдены в модели.");
    }
}, undefined, (error) => {
    console.error('Ошибка загрузки модели:', error);
});

// === UI handlers ===
const ambColor = document.getElementById('ambientColor');
const ambRange = document.getElementById('ambientIntensity');
const ambNumber = document.getElementById('ambientIntensityNumber');
const rectColor = document.getElementById('rectColor');
const rectRange = document.getElementById('rectIntensity');
const rectNumber = document.getElementById('rectIntensityNumber');

function syncAmbient(val) {
    ambientLight.intensity = parseFloat(val);
    ambRange.value = val;
    ambNumber.value = val;
}

function syncRect(val) {
    if (areaLight1) areaLight1.intensity = parseFloat(val);
    if (areaLight2) areaLight2.intensity = parseFloat(val);
    rectRange.value = val;
    rectNumber.value = val;
}

ambColor.addEventListener('input', (e) => ambientLight.color.set(e.target.value));
ambRange.addEventListener('input', (e) => syncAmbient(e.target.value));
ambNumber.addEventListener('input', (e) => syncAmbient(e.target.value));
rectColor.addEventListener('input', (e) => {
    if (areaLight1) areaLight1.color.set(e.target.value);
    if (areaLight2) areaLight2.color.set(e.target.value);
});
rectRange.addEventListener('input', (e) => syncRect(e.target.value));
rectNumber.addEventListener('input', (e) => syncRect(e.target.value));

document.getElementById('backBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('saveBtn')?.addEventListener('click', async () => {
    const body = {
        ambientColor: ambColor.value,
        ambientIntensity: parseFloat(ambRange.value),
        reactColor: rectColor.value,
        reactIntensity: parseFloat(rectRange.value)
    };

    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(urlSaveLightSettings, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    alert(res.ok ? 'Настройки сохранены!' : 'Ошибка сохранения настроек');
});

let isUpdate = false;

async function loadSettings() {
    try {
        const res = await fetch(urlLightSettings);
        if (!res.ok) return;

        const data = await res.json();
        ambColor.value = data.ambientColor;
        syncAmbient(data.ambientIntensity);
        rectColor.value = data.reactColor;
        syncRect(data.reactIntensity);

        ambientLight.color.set(data.ambientColor);
        isUpdate = true;
    } catch (err) {
        console.warn('Настройки света не найдены, используем по умолчанию');
    }
}
loadSettings();

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
