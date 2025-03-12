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
        case 'HandrailParametrsTab':
            category = 'handrail';
            break;
        case 'OtherParametrsTab':
            category = 'floor'; 
            break;
    }


    const parentElement = document.getElementById(tabId);
    const image_container = parentElement.querySelector('.menu-container__options-menu-container-main .textures-container');


    const images = image_container.querySelectorAll('img');

    if (images.length > 0) {
    
    } else {
      showImages(category, tabId);
    }    
}

const images = {
    walls: [
        { "id": "e73d78fc-410e-4a8a-9e70-8711cbc9c578", "icon": "./Стены/5024.jpg", "texture": "./Стены/5024.jpg", "alpha": "", "bump": "" },
        { "id": "f73d48fc-410e-4a8a-9e70-8711cbc9c578", "icon": "./Стены/DL16CE_diffuse.jpg", "texture": "./Стены/DL16CE_diffuse.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-415e-4a8a-9e70-8711cbc9c578", "icon": "./Стены/DL16CE_gray.jpg", "texture": "./Стены/DL16CE_gray.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-4e70-8711cbc9c578", "icon": "./Стены/DL16CE_normal.jpg", "texture": "./Стены/DL16CE_normal.jpg", "alpha": "", "bump": "" },
        { "id": "e73d67fc-410e-4a8a-9e70-8711cbc9c578", "icon": "./Стены/DL16CE_roughness.jpg", "texture": "./Стены/DL16CE_roughness.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711gfg9c578", "icon": "./Стены/DL89E_diffuse.jpg", "texture": "./Стены_Текстуры/DL89E.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-415e-4e8a-9e70-8711cbc9c578", "icon": "./Стены/DL89E_glossiness.jpg", "texture": "./Стены/DL89E_glossiness.jpg", "alpha": "", "bump": "" },
        { "id": "f76d48fc-410e-4a8a-9e70-8711cbc9c578", "icon": "./Стены/DL89E_gray.jpg", "texture": "./Стены/DL89E_gray.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c578", "icon": "./Стены/DL89E_normal.jpg", "texture": "./Стены/DL89E_normal.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c579", "icon": "./Стены/HL Ti-Gold.jpg", "texture": "./Стены/HL Ti-Gold.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c580", "icon": "./Стены/HY-003 TI-GOLD.jpg", "texture": "./Стены/HY-003 TI-GOLD.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c581", "icon": "./Стены/HY-004 TI-GOLD.jpg", "texture": "./Стены/HY-004 TI-GOLD.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c582", "icon": "./Стены/RAL-7035-Svetlo-serii.png", "texture": "./Стены/RAL-7035-Svetlo-serii.png", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c583", "icon": "./Стены/шлифованная нержавейка.jpg", "texture": "./Стены/шлифованная нержавейка.jpg", "alpha": "", "bump": "" }
    
    
       /* { icon: './te/RAL1001.jpg', texture: './te/RAL1001.jpg', alpha: '', bump: '' },
{ icon: './te/RAL1015.jpg', texture: './te/RAL1015.jpg', alpha: '', bump: '' },
{ icon: './te/RAL1018.jpg', texture: './te/RAL1018.jpg', alpha: '', bump: '' },
{ icon: './te/RAL2008.jpg', texture: './te/RAL2008.jpg', alpha: '', bump: '' },
{ icon: './te/RAL3003.jpg', texture: './te/RAL3003.jpg', alpha: '', bump: '' },
{ icon: './te/RAL3020.jpg', texture: './te/RAL3020.jpg', alpha: '', bump: '' },
{ icon: './te/RAL5012.jpg', texture: './te/RAL5012.jpg', alpha: '', bump: '' },
{ icon: './te/RAL5017.jpg', texture: './te/RAL5017.jpg', alpha: '', bump: '' },
{ icon: './te/RAL5024.jpg', texture: './te/RAL5024.jpg', alpha: '', bump: '' },
{ icon: './te/RAL6027.jpg', texture: './te/RAL6027.jpg', alpha: '', bump: '' },
{ icon: './te/RAL7016.jpg', texture: './te/RAL7016.jpg', alpha: '', bump: '' },
{ icon: './te/RAL7021.jpg', texture: './te/RAL7021.jpg', alpha: '', bump: '' },
{ icon: './te/RAL7035.jpg', texture: './te/RAL7035.jpg', alpha: '', bump: '' },
{ icon: './te/RAL9010.jpg', texture: './te/RAL9010.jpg', alpha: '', bump: '' },
{ icon: './te/RAL9016.jpg', texture: './te/RAL9016.jpg', alpha: '', bump: '' },
{ icon: './te/RAL9022.jpg', texture: './te/RAL9022.jpg', alpha: '', bump: '' },
{ icon: './te/НЕРЖ.ЗЕРКАЛО.jpg', texture: './te/НЕРЖ.ЗЕРКАЛО.jpg', alpha: '', bump: '' },
{ icon: './te/ШЛИФ.НЕРЖ..jpg', texture: './te/ШЛИФ.НЕРЖ..jpg', alpha: '', bump: '' },
{ icon: './te/ШЛИФ.НЕРЖ.ЗОЛОТО.jpg', texture: './te/ШЛИФ.НЕРЖ.ЗОЛОТО.jpg', alpha: '', bump: '' },*/
    ],
    ceiling: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c584", "icon": "./Потолок_Иконки/Р00.png", "texture": "./Стены/RAL-7035-Svetlo-serii.png", "alpha": "./Потолок_Текстуры/Р00.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c585", "icon": "./Потолок_Иконки/P01.jpg", "texture": "./Стены/RAL-7035-Svetlo-serii.png", "alpha": "./Потолок_Текстуры/P01.jpg", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c586", "icon": "./Потолок_Иконки/P03.jpg", "texture": "./Стены/RAL-7035-Svetlo-serii.png", "alpha": "./Потолок_Текстуры/P03.jpg", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c587", "icon": "./Потолок_Иконки/P07.png", "texture": "./Стены/RAL-7035-Svetlo-serии.png", "alpha": "./Потолок_Текстуры/P07.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c588", "icon": "./Потолок_Иконки/P08.jpg", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/P08.jpg", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c589", "icon": "./Потолок_Иконки/P21.jpg", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/P21.jpg", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c590", "icon": "./Потолок_Иконки/P23.jpg", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/P23.jpg", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c591", "icon": "./Потолок_Иконки/Р02.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р02.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c592", "icon": "./Потолок_Иконки/Р04.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р04.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c593", "icon": "./Потолок_Иконки/Р06.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р06.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c594", "icon": "./Потолок_Иконки/Р14.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р14.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c595", "icon": "./Потолок_Иконки/Р16.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р16.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c596", "icon": "./Потолок_Иконки/Р17.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р17.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c597", "icon": "./Потолок_Иконки/Р20.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р20.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c598", "icon": "./Потолок_Иконки/Р22.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р22.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c599", "icon": "./Потолок_Иконки/Р24.png", "texture": "./Стены/RAL-7035-Svetlo-серии.png", "alpha": "./Потолок_Текстуры/Р24.png", "bump": "" }
    ],
    ceilingPlafon: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c600", "icon": "./Потолок_Материал/ral9016.jpg", "texture": "./Потолок_Материал/ral9016.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c601", "icon": "./Потолок_Материал/нержавеющая_сталь_текстура.jpg", "texture": "", "alpha": "./Потолок_Материал/нержавеющая_сталь_текстура.jpg", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c602", "icon": "./Потолок_Материал/шлифованная нержавейка.jpg", "texture": "", "alpha": "./Потолок_Материал/шлифованная нержавейка.jpg", "bump": "" }
    ],
    ceilingMaterial: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c603", "icon": "./Потолок/00.png", "texture": "./Потолок/00.png", "alpha": "./Потолок/00.png", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c604", "icon": "./Потолок/01.jpg", "texture": "./Потолок/01.jpg", "alpha": "./Потолок/01.jpg", "bump": "" }
    ],
    handrail: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c605", "icon": "./Поручень_Материал/хромированная_сталь.jpg", "texture": "./Поручень_Материал/хромированная_сталь.jpg", "alpha": "", "bump": "" }
    ],
    floor: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c606", "icon": "./Пол/nero marquina.jpg", "texture": "./Пол_Текстура/nero marquina.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c607", "icon": "./Пол/WoodFlooring042_COL_4K.jpg", "texture": "./Пол_Текстура/WoodFlooring042_COL_4K.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c608", "icon": "./Пол/basalt-grey.jpg", "texture": "./Пол_Текстура/basalt-grey.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c609", "icon": "./Пол/ARABISCATO ( calakata).jpeg", "texture": "./Пол_Текстура/ARABISCATO.jpeg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c610", "icon": "./Пол/WoodFlooring042_DISP_4K.jpg", "texture": "./Пол/WoodFlooring042_DISP_4K.jpg", "alpha": "", "bump": "" }
    ],
    board: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c611", "icon": "./Табло/TL-D70.png", "texture": "./Табло/TL-D70.png", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c612", "icon": "./Табло/BUTSAN TABLO.jpg", "texture": "./Табло/BUTSAN TABLO.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c613", "icon": "./Табло/BUTSAN1-01.jpg", "texture": "./Табло/BUTSAN1-01.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c614", "icon": "./Табло/BUTSAN1-01111.jpg", "texture": "./Табло/BUTSAN1-01111.jpg", "alpha": "", "bump": "" }
    ],
    board_color: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c615", "icon": "./Табло_цвет/RAL-7035-Svetlo-serii.png", "texture": "./Табло_цвет/RAL-7035-Svetlo-серии.png", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c616", "icon": "./Табло_цвет/ral9016.jpg", "texture": "./Табло_цвет/ral9016.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c617", "icon": "./Табло_цвет/зеркало_сталь.jpg", "texture": "./Табло_цвет/зеркало_сталь.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c618", "icon": "./Табло_цвет/нержавеющая_сталь_текстура.jpg", "texture": "./Табло_цвет/нержавеющая_сталь_текстура.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c619", "icon": "./Табло_цвет/черная_нержавеющая_сталь.jpg", "texture": "./Табло_цвет/черная_нержавеющая_сталь.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c620", "icon": "./Табло_цвет/шлифованная_нержавейка.jpg", "texture": "./Табло_цвет/шлифованная_нержавейка.jpg", "alpha": "", "bump": "" }
    ],
    door: [
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c621", "icon": "./Двери/HL Ti-Gold.jpg", "texture": "./Двери/HL Ti-Gold.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c622", "icon": "./Двери/HY-003 TI-GOLD.jpg", "texture": "./Двери/HY-003 TI-GOLD.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c623", "icon": "./Двери/HY-004 TI-GOLD.jpg", "texture": "./Двери/HY-004 TI-GOLD.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c624", "icon": "./Двери/RAL-7035-Svetlo-serii.png", "texture": "./Двери/RAL-7035-Svetlo-серии.png", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c625", "icon": "./Двери/ral9016.jpg", "texture": "./Двери/ral9016.jpg", "alpha": "", "bump": "" },
        { "id": "e73d48fc-410e-4a8a-9e70-8711cbc9c626", "icon": "./Двери/шлифованная нержавейка.jpg", "texture": "./Двери/шлифованная нержавейка.jpg", "alpha": "", "bump": "" }
    ]
};

function showImages(category, tabId) {

    let addEventListenerToImages = function(container, category) {
        if (images[category]) {
            images[category].forEach(item => {
                const img = document.createElement('img');
                img.src = item.icon || item.texture;
                img.alt = `${category} image`;
    
                img.setAttribute('data-texture-id', item.id);
                img.setAttribute('data-texture-url', item.texture);
                img.setAttribute('data-alpha-url',  item.alpha || "");
                img.setAttribute('data-bump-url',  item.bump || "");
    
                let className = (tabId === 'BoardParametrsTab' && category == 'board') ? 'special-texture-image' : 'texture-image';
                img.className = className;
    
                img.addEventListener('click', handleTextureClick);
                container.appendChild(img);
            });
        }
    } 

    const parentElement = document.getElementById(tabId);

    if (category == 'ceiling') {
       const ceiling_pattern_container = parentElement.querySelector('.menu-container__options-menu-container-main .ceiling-pattern');

       addEventListenerToImages(ceiling_pattern_container, category);

       category = 'ceilingPlafon';

       const ceiling_material_container = parentElement.querySelector('.menu-container__options-menu-container-main .ceiling-material');
       
       addEventListenerToImages(ceiling_material_container, category);

    } else if (category == 'board') {
      const ceiling_pattern_container = parentElement.querySelector('.menu-container__options-menu-container-main .post-orders');

       addEventListenerToImages(ceiling_pattern_container, category);

       category = 'board_color';

       const ceiling_material_container = parentElement.querySelector('.menu-container__options-menu-container-main .panel-color');
       
       addEventListenerToImages(ceiling_material_container, category);
    } else {
        const container = parentElement.querySelector('.menu-container__options-menu-container-main .textures-container');

        addEventListenerToImages(container, category);
    }
    
}

window.showTab = showTab;