import {handleTextureClick} from "../models/textureManager.js";
import * as TextureStorage from "../textureService/textureStorage.js";

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

export function showTab(tabId) {
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
            category = 'bumper'; 
            break;
    }


    if (tabId != "MainParametersTab" && tabId != "MirrorParametrsTab") {
        const parentElement = document.getElementById(tabId);
    const image_container = parentElement.querySelector('.menu-container__options-menu-container-main .textures-container');


    const images = image_container.querySelectorAll('img');

    if (images.length > 0) {
    
    } else {
      showImages(category, tabId);
    }    
    }
}


const images = {
    walls: [],
    ceiling: [],
    ceilingPlafon: [],
    handrail: [],
    floor: [],
    board: [],
    board_color: [],
    door: [],
    bumper: [],
};

async function showImages(category, tabId) {


    async function FillImages() {
        if (images.walls.length === 0) {
            // Получаем текстуры асинхронно
            images.walls = await TextureStorage.getWalls();
            images.ceiling = await TextureStorage.getCeilingMaterial();
            images.ceilingPlafon = await TextureStorage.getCeilingPlafon();
            images.handrail = await TextureStorage.getHandrail();
            images.floor = await TextureStorage.getFloor();
            images.board = await TextureStorage.getBoard();
            images.board_color = await TextureStorage.getBoardColor();
            images.door = await TextureStorage.getDoor();
            images.bumper = await TextureStorage.getBumper();
        }
    }

    await FillImages();

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
                img.setAttribute('data-ao-url', item.aoMap || "");
img.setAttribute('data-displacement-url', item.displacementMap || "");
img.setAttribute('data-metalness-url', item.metalnessMap || "");
img.setAttribute('data-roughness-url', item.roughnessMap || "");
img.setAttribute('data-normal-url', item.normalMap || "");
img.setAttribute('data-bump-scale', item.options.bumpScale || undefined);
img.setAttribute('data-metalness', item.options.metalness || undefined);
img.setAttribute('data-roughness', item.options.roughness || undefined);
img.setAttribute('data-emissive-intensity', item.options.emissiveIntensity || undefined);
img.setAttribute('data-color', item.options.color || "#ffffff");
    
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