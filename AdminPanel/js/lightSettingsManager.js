import { urlLightSettings, urlSaveLightSettings } from './urlHelper/urls.js';
import { applyLightSettingsFromServer } from './models/loadModel.js'; // обязательно экспортируй
import { ambientLight } from './models/loadModel.js';
import { areaLight1Ceiling, areaLight2Ceiling } from './models/loadModel.js';

const ambientColor = document.getElementById('ambientColor');
const ambientIntensityRange = document.getElementById('ambientIntensityRange');
const ambientIntensityNumber = document.getElementById('ambientIntensityNumber');
const rectColor = document.getElementById('rectColor');
const rectIntensityRange = document.getElementById('rectIntensityRange');
const rectIntensityNumber = document.getElementById('rectIntensityNumber');

ambientIntensityRange.addEventListener('input', (e) => syncAmbient(e.target.value));
ambientIntensityNumber.addEventListener('input', (e) => syncAmbient(e.target.value));

rectIntensityRange.addEventListener('input', (e) => syncRect(e.target.value));
rectIntensityNumber.addEventListener('input', (e) => syncRect(e.target.value));

export async function loadLightSettings() {
    try {
        const res = await fetch(urlLightSettings);
        if (!res.ok) throw new Error();

        const data = await res.json();

        ambientColor.value = data.ambientColor;
        syncAmbient(data.ambientIntensity);

        rectColor.value = data.reactColor;
        syncRect(data.reactIntensity);

    } catch (err) {
        console.warn('Не удалось загрузить настройки света, используются значения по умолчанию.');
    }
}

export async function saveLightSettings() {
    const body = {
        ambientColor: ambientColor.value,
        ambientIntensity: parseFloat(ambientIntensityRange.value),
        reactColor: rectColor.value,
        reactIntensity: parseFloat(rectIntensityRange.value)
    };

    const res = await fetch(urlSaveLightSettings, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert('Настройки освещения сохранены');
        await applyLightSettingsFromServer(); // <-- обновляем сцену после сохранения
    } else {
        alert('Ошибка при сохранении настроек освещения');
    }
}
ambientColor.addEventListener('input', () => {
    ambientLight.color.set(ambientColor.value);
});

ambientIntensityRange.addEventListener('input', () => {
    ambientLight.intensity = parseFloat(ambientIntensityRange.value);
});
ambientIntensityNumber.addEventListener('input', () => {
    ambientLight.intensity = parseFloat(ambientIntensityNumber.value);
});

rectColor.addEventListener('input', () => {
    if (areaLight1Ceiling) areaLight1Ceiling.color.set(rectColor.value);
    if (areaLight2Ceiling) areaLight2Ceiling.color.set(rectColor.value);
});

rectIntensityRange.addEventListener('input', () => {
    const val = parseFloat(rectIntensityRange.value);
    if (areaLight1Ceiling) areaLight1Ceiling.intensity = val;
    if (areaLight2Ceiling) areaLight2Ceiling.intensity = val;
});
rectIntensityNumber.addEventListener('input', () => {
    const val = parseFloat(rectIntensityNumber.value);
    if (areaLight1Ceiling) areaLight1Ceiling.intensity = val;
    if (areaLight2Ceiling) areaLight2Ceiling.intensity = val;
});
document.getElementById('saveLightSettingsBtn')?.addEventListener('click', () => {
    saveLightSettings();
});

export function syncAmbient(val) {
    ambientIntensityRange.value = val;
    ambientIntensityNumber.value = val;
}

export function syncRect(val) {
    rectIntensityRange.value = val;
    rectIntensityNumber.value = val;
}
