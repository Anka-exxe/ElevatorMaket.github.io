import {handleTextureClick} from "../models/textureManager.js";

const tabImageMap = new Map([
    ['MainParametersTab', 'main_parameters_icon'],
    ['WallsParametersTab', 'wall_icon'],
    ['DoorParametrsTab', 'doors_icon'],
    ['CeilingParametrsTab', 'ceiling_icon'],
    ['FloorParametrsTab', 'floor_icon'],
    ['BoardParametrsTab', 'board_icon'],
    ['MirrorParametrsTab', 'mirror_icon'],
    ['HandrailParametrsTab', 'handrail_icon'],
    ['OtherParametrsTab', 'other_icon']
]);

function showTab(tabId) {
    const tabs = document.querySelectorAll('.menu-container__content');
    const navigationTabs = document.querySelectorAll('.navigation__tab');
    const icons = document.querySelectorAll('.navigation--with-animation__animation-picture');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    navigationTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    icons.forEach(icon => {
        icon.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');

    const activeTab = Array.from(navigationTabs).find(tab => tab.innerText === document.getElementById(tabId).querySelector('.menu-container__options-menu-title').innerText);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    const iconId = tabImageMap.get(tabId);
    const activeIcon = document.getElementById(iconId);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }

    let category = '';
    switch (tabId) {
        case 'WallsParametersTab':
            category = 'walls';
            break;
        case 'CeilingParametrsTab':
            category = 'ceiling';
            break;
        case 'FloorParametrsTab':
            category = 'floor';
            break;
        case 'BoardParametrsTab':
            category = 'board';
            break;
        case 'DoorParametrsTab':
            category = 'door';
            break;
        case 'OtherParametrsTab':
            category = 'floor'; // Добавьте нужную категорию
            break;
    }

    // Показываем изображения для выбранной категории
    showImages(category, tabId);
}

const images = {
    walls: [
        './Стены/5024.jpg', 
        './Стены/DL16CE_diffuse.jpg',
        './Стены/DL16CE_gray.jpg',
        './Стены/DL16CE_normal.jpg',
        './Стены/DL16CE_roughness.jpg',
        './Стены/DL89E_diffuse.jpg',
        './Стены/DL89E_glossiness.jpg',
        './Стены/DL89E_gray.jpg',
        './Стены/DL89E_normal.jpg',
        './Стены/HL Ti-Gold.jpg',
        './Стены/HY-003 TI-GOLD.jpg',
        './Стены/HY-004 TI-GOLD.jpg',
        './Стены/RAL-7035-Svetlo-serii.png',
        './Стены/шлифованная нержавейка.jpg',
    ],
    ceiling: [
        './Потолок/00.png', 
        './Потолок/01.jpg', 
        './Потолок/1.jpg', 
        './Потолок/2.jpg',
        './Потолок/6.png',
        './Потолок/07.jpg',
        './Потолок/7.png',
        './Потолок/8.png',
        './Потолок/9.png',
        './Потолок/11.png',
        './Потолок/21.jpg',
        './Потолок/P23.jpg',
        './Потолок/Безымянный-2.png',
        './Потолок/Р04.jpg',
    ],
    floor: [
        './Пол/nero marquina.jpg', 
        './Пол/WoodFlooring042_COL_4K.jpg',  
        './Пол/basalt-grey.jpg',  
        './Пол/antik2.png', 
        './Пол/WoodFlooring042_DISP_4K.jpg',
    ],
    board: [
        './Табло/TL-D70.png', 
        './Табло/BUTSAN TABLO.jpg',
        './Табло/BUTSAN1-01.jpg', 
        './Табло/BUTSAN1-01111.jpg',        
    ],
    door: [
        './Двери/HL Ti-Gold.jpg',
        './Двери/HY-003 TI-GOLD.jpg', 
        './Двери/HY-004 TI-GOLD.jpg',
        './Двери/RAL-7035-Svetlo-serii.png',
        './Двери/ral9016.jpg',
        './Двери/шлифованная нержавейка.jpg',
    ]
};

function showImages(category, tabId) {
    const parentElement = document.getElementById(tabId);
    const container = parentElement.querySelector('.menu-container__options-menu-container-main .textures-container'); 
 
    container.innerHTML = '';

    if (images[category]) {
        images[category].forEach(imagePath => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `${category} image`;

            img.setAttribute('data-texture-url', imagePath);
            img.setAttribute('data-alpha-url',  "");
            img.setAttribute('data-bump-url',  "");
            let className;

            if(tabId == 'BoardParametrsTab' || tabId == 'CeilingParametrsTab') {
                className = 'special-texture-image'
            } else {
                className = 'texture-image';
            }

            img.className = className;
            img.addEventListener('click', handleTextureClick);
            container.appendChild(img);
        });
    }
}
window.showTab = showTab;