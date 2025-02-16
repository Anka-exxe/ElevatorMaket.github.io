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
        { icon: './Стены/5024.jpg', texture: './Стены/5024.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL16CE_diffuse.jpg', texture: './Стены/DL16CE_diffuse.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL16CE_gray.jpg', texture: './Стены/DL16CE_gray.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL16CE_normal.jpg', texture: './Стены/DL16CE_normal.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL16CE_roughness.jpg', texture: './Стены/DL16CE_roughness.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL89E_diffuse.jpg', texture: './Стены_Текстуры/DL89E.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL89E_glossiness.jpg', texture: './Стены/DL89E_glossiness.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL89E_gray.jpg', texture: './Стены/DL89E_gray.jpg', alpha: '', bump: '' },
        { icon: './Стены/DL89E_normal.jpg', texture: './Стены/DL89E_normal.jpg', alpha: '', bump: '' },
        { icon: './Стены/HL Ti-Gold.jpg', texture: './Стены/HL Ti-Gold.jpg', alpha: '', bump: '' },
        { icon: './Стены/HY-003 TI-GOLD.jpg', texture: './Стены/HY-003 TI-GOLD.jpg', alpha: '', bump: '' },
        { icon: './Стены/HY-004 TI-GOLD.jpg', texture: './Стены/HY-004 TI-GOLD.jpg', alpha: '', bump: '' },
        { icon: './Стены/RAL-7035-Svetlo-serii.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: '', bump: '' },
        { icon: './Стены/шлифованная нержавейка.jpg', texture: './Стены/шлифованная нержавейка.jpg', alpha: '', bump: '' }
    ],
    ceiling: [
        { icon: './Потолок_Иконки/Р00.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р00.png', bump: '' },
        { icon: './Потолок_Иконки/P01.jpg', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/P01.jpg', bump: '' },
        { icon: './Потолок_Иконки/P03.jpg', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/P03.jpg', bump: '' },
        { icon: './Потолок_Иконки/P07.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/P07.png', bump: '' },
        { icon: './Потолок_Иконки/P08.jpg', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/P08.jpg', bump: '' },
        { icon: './Потолок_Иконки/P21.jpg', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/P21.jpg', bump: '' },
        { icon: './Потолок_Иконки/P23.jpg', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/P23.jpg', bump: '' },
        { icon: './Потолок_Иконки/Р02.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р02.png', bump: '' },
        { icon: './Потолок_Иконки/Р04.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р04.png', bump: '' },
        { icon: './Потолок_Иконки/Р06.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р06.png', bump: '' },
        { icon: './Потолок_Иконки/Р14.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р14.png', bump: '' },
        { icon: './Потолок_Иконки/Р16.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р16.png', bump: '' },
        { icon: './Потолок_Иконки/Р17.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р17.png', bump: '' },
        { icon: './Потолок_Иконки/Р20.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р20.png', bump: '' },
        { icon: './Потолок_Иконки/Р22.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р22.png', bump: '' },
        { icon: './Потолок_Иконки/Р24.png', texture: './Стены/RAL-7035-Svetlo-serii.png', alpha: './Потолок_Текстуры/Р24.png', bump: '' }
    ],
    ceilingMaterial: [
        { icon: './Потолок/00.png', texture: './Потолок/00.png', alpha: '', bump: '' },
        { icon: './Потолок/01.jpg', texture: './Потолок/01.jpg', alpha: '', bump: '' }
    ],
    floor: [
        { icon: './Пол/nero marquina.jpg', texture: './Пол/nero marquina.jpg', alpha: '', bump: '' },
        { icon: './Пол/WoodFlooring042_COL_4K.jpg', texture: './Пол/WoodFlooring042_COL_4K.jpg', alpha: '', bump: '' },
        { icon: './Пол/basalt-grey.jpg', texture: './Пол/basalt-grey.jpg', alpha: '', bump: '' },
        { icon: './Пол/antik2.png', texture: './Пол/antik2.png', alpha: '', bump: '' },
        { icon: './Пол/WoodFlooring042_DISP_4K.jpg', texture: './Пол/WoodFlooring042_DISP_4K.jpg', alpha: '', bump: '' }
    ],
    board: [
        { icon: './Табло/TL-D70.png', texture: './Табло/TL-D70.png', alpha: '', bump: '' },
        { icon: './Табло/BUTSAN TABLO.jpg', texture: './Табло/BUTSAN TABLO.jpg', alpha: '', bump: '' },
        { icon: './Табло/BUTSAN1-01.jpg', texture: './Табло/BUTSAN1-01.jpg', alpha: '', bump: '' },
        { icon: './Табло/BUTSAN1-01111.jpg', texture: './Табло/BUTSAN1-01111.jpg', alpha: '', bump: '' }
    ],
    door: [
        { icon: './Двери/HL Ti-Gold.jpg', texture: './Двери/HL Ti-Gold.jpg', alpha: '', bump: '' },
        { icon: './Двери/HY-003 TI-GOLD.jpg', texture: './Двери/HY-003 TI-GOLD.jpg', alpha: '', bump: '' },
        { icon: './Двери/HY-004 TI-GOLD.jpg', texture: './Двери/HY-004 TI-GOLD.jpg', alpha: '', bump: '' },
        { icon: './Двери/RAL-7035-Svetlo-serii.png', texture: './Двери/RAL-7035-Svetlo-serii.png', alpha: '', bump: '' },
        { icon: './Двери/ral9016.jpg', texture: './Двери/ral9016.jpg', alpha: '', bump: '' },
        { icon: './Двери/шлифованная нержавейка.jpg', texture: './Двери/шлифованная нержавейка.jpg', alpha: '', bump: '' }
    ]
};



function showImages(category, tabId) {
    const parentElement = document.getElementById(tabId);
    const container = parentElement.querySelector('.menu-container__options-menu-container-main .textures-container'); 
 
    //container.innerHTML = '';

    if (images[category]) {
        images[category].forEach(item => {
            const img = document.createElement('img');
            img.src = item.icon || item.texture;
            img.alt = `${category} image`;

            img.setAttribute('data-texture-url', item.texture);
            img.setAttribute('data-alpha-url',  item.alpha || "");
            img.setAttribute('data-bump-url',  item.bump || "");

            let className = (tabId === 'BoardParametrsTab') ? 'special-texture-image' : 'texture-image';
            img.className = className;

            img.addEventListener('click', handleTextureClick);
            container.appendChild(img);
        });
    }
}
window.showTab = showTab;