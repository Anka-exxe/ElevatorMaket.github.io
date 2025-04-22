import * as THREE from 'three';
import {ChangeWallsColor, ChangeFloorColor} from "../models/hallTextureManager.js";
import * as Element from '../models/elementNames.js'; // Импортируем имена элементов

// Глобальная переменная для хранения материала стены
export let rightWallMaterial = null;

const colorPickers = document.querySelectorAll('.color-picker');
    const colorInputs = document.querySelectorAll('input[type="color"]');

    colorPickers[0].style.backgroundColor = "#4682B4";
    colorPickers[1].style.backgroundColor = "#808080";

    colorPickers.forEach((picker, index) => {
        picker.addEventListener('click', () => {
            colorInputs[index].click(); // Открываем соответствующий выбор цвета
        });
    });

    colorInputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const selectedColor = event.target.value;
            colorPickers[index].style.backgroundColor = selectedColor; // Обновляем цвет кружка

            if(index == 0) {
                ChangeWallsColor(new THREE.Color(selectedColor));
            } else {
                ChangeFloorColor(new THREE.Color(selectedColor));
            }
        });
    });

// Функция инициализации (вызывать после загрузки модели)
/*export function initColorPickers(model) {
    // Находим материал правой стены
    model.traverse(child => {
        if (child.isMesh && child.name === Element.rightHallWall) {
            rightWallMaterial = child.material;
        }
    });

    const colorPickers = document.querySelectorAll('.color-picker');
    const colorInputs = document.querySelectorAll('input[type="color"]');

    colorPickers.forEach((picker, index) => {
        picker.addEventListener('click', () => {
            colorInputs[index].click();
        });
    });

    colorInputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const selectedColor = event.target.value;
            
            // 1. Обновляем цвет кружка-превью
            colorPickers[index].style.backgroundColor = selectedColor;
            
            // 2. Обновляем материал стены (если материал найден)
            if (rightWallMaterial) {
                rightWallMaterial.color.set(new THREE.Color(selectedColor));
                
                // Если нужно обновить отражение и т.д.
                rightWallMaterial.needsUpdate = true;
            } else {
                console.warn('Материал правой стены не найден!');
            }
        });
    });
}*/