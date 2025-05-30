import {handleTextureClick} from "../models/textureManager.js";
import * as TextureStorage from "../textureService/textureStorage.js";
import {loadHall} from "../models/loadModel.js";
import {SetSettingsBackFromHallToElevetor} from "../models/loadModel.js"

export let isImagesShowed = false;
export let isHallClicked = false;

const tabImageMap = new Map([
    ['MainParametersTab', 'main_parameters_icon'],
    ['PatternsParametersTab', 'main_parameters_icon'],
    ['WallsParametersTab', 'wall_icon'],
    ['DoorParametrsTab', 'doors_icon'],
    ['CeilingParametrsTab', 'ceiling_icon'],
    ['FloorParametrsTab', 'floor_icon'],
    ['BoardParametrsTab', 'board_icon'],
    ['MirrorParametrsTab', 'mirror_icon'],
    ['HandrailParametrsTab', 'handrail_icon'],
    ['OtherParametrsTab', 'other_icon'],
    ['HallParametrsTab', 'hall_icon']
]);

export const tabNames = [
    'WallsParametersTab',
    'DoorParametrsTab',
    'CeilingParametrsTab',
    'FloorParametrsTab',
    'BoardParametrsTab',
    'HandrailParametrsTab',
    'OtherParametrsTab'
];

export async function showTab(tabId) {
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

    const activeNavTab = document.querySelector(`.navigation__tab[data-tab="${tabId}"]`);
    if (activeNavTab) {
        activeNavTab.classList.add('active');
    }

    const iconId = tabImageMap.get(tabId);
    const activeIcon = document.getElementById(iconId);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }

    if(isHallClicked) {
        SetSettingsBackFromHallToElevetor();
        isHallClicked = false;
    }

    if(tabId === 'HallParametrsTab') {
        const elevatorBtns = document.getElementById("elevatorBtns");
        const hallBtns = document.getElementById("hallBtns");
        loadHall();

        isHallClicked = true;

        elevatorBtns.style.display = "none";
        hallBtns.style.display = "flex";
    } else {
        const elevatorBtns = document.getElementById("elevatorBtns");
        const hallBtns = document.getElementById("hallBtns");


        elevatorBtns.style.display = "flex";
        hallBtns.style.display = "none";
    }
}

export function getCategoryByTabId(tabId) {
    switch (tabId) {
        case 'WallsParametersTab':
            return 'walls';
        case 'CeilingParametrsTab':
            return 'ceiling';
        case 'FloorParametrsTab':
            return 'floor';
        case 'BoardParametrsTab':
            return 'board';
        case 'DoorParametrsTab':
            return 'door';
        case 'HandrailParametrsTab':
            return 'handrail';
        case 'OtherParametrsTab':
            return 'bumper'; 
        case 'HallParametrsTab':
            return 'door_hall'; 
        default:
            console.error(`Unknown tabId: ${tabId}`);
            return null; // Возвращаем null, если tabId не распознан
    }
}

const images = {
    walls: [],
    ceiling: [],
    ceilingMaterial: [],
    handrail: [],
    floor: [],
    board: [],
    board_color: [],
    door: [],
    bumper: [],
    door_hall: [],
    portal: [],
};

// Объект для отслеживания состояния каждой вкладки
const imagesFilled = {};

export async function loadImagesForAllTabs() {
    await loadAllImages();

    await Promise.all(
        tabNames.map(tabId => 
            showImages(getCategoryByTabId(tabId), tabId)
        )
    );

    // Вызов showImages для 'HallParametrsTab' должен быть вне Promise.all
    await showImages(getCategoryByTabId('HallParametrsTab'), 'HallParametrsTab');
    
    isImagesShowed = true;
}

export async function loadAllImages() {
   
    if (images.walls.length === 0) {
        //console.log("Loading all images...");
    images.walls = await TextureStorage.getWalls();
    images.ceiling = await TextureStorage.getCeilingPlafon();
    images.ceilingMaterial = await TextureStorage.getCeilingMaterial();
    images.handrail = await TextureStorage.getHandrail();
    images.floor = await TextureStorage.getFloor();
    images.board = await TextureStorage.getBoard();
    images.board_color = await TextureStorage.getBoardColor();
    images.door = await TextureStorage.getDoor();
    images.door_hall = await TextureStorage.getDoor();
    images.bumper = await TextureStorage.getBumper();
    images.portal = await TextureStorage.getPortal();
    //console.log("All images loaded.");
    }
}

export async function showImages(category, tabId) {
    let addEventListenerToImages = function(container, category) {
        // Проверяем, были ли изображения добавлены для этой категории
        if (imagesFilled[category]) return; 

        imagesFilled[category] = true; // Устанавливаем флаг для этой категории
        //console.log("Loading images for: " + category);

        if (images[category]) {
            images[category].forEach(item => {
                const img = document.createElement('img');
                img.src = item.icon || item.texture;
                img.alt = `${category} image`;

                img.setAttribute('title', item.name);
                img.setAttribute('data-texture-id', item.id);
                img.setAttribute('data-texture-url', item.texture || "");
                img.setAttribute('data-alpha-url',  item.alpha || "");
                img.setAttribute('data-bump-url',  item.bump || "");
                img.setAttribute('data-ao-url', item.aoMap || "");
                img.setAttribute('data-displacement-url', item.displacementMap || "");
                img.setAttribute('data-metalness-url', item.metalnessMap || "");
                img.setAttribute('data-roughness-url', item.roughnessMap || "");
                img.setAttribute('data-normal-url', item.normalMap || "");
                img.setAttribute('data-bump-scale', item.options.bumpScale || null);
                img.setAttribute('data-metalness', item.options.metalness || null);
                img.setAttribute('data-roughness', item.options.roughness || null);
                img.setAttribute('data-emissive-intensity', item.options.emissiveIntensity || null);
                img.setAttribute('data-color', item.options.color || "#ffffff");
                img.setAttribute('data-tile-size-y', item.options.tileSizeY || null);
                img.setAttribute('data-tile-size-x', item.options.tileSizeX || null);
                let className = (tabId === 'BoardParametrsTab' && category == 'board') ? 'special-texture-image' : 'texture-image';
                img.className = className;

                img.addEventListener('click', handleTextureClick);
                container.appendChild(img);
            });
        }
    };

    const parentElement = document.getElementById(tabId);

    if (category == 'ceiling') {
        const ceiling_pattern_container = parentElement.querySelector('.menu-container__options-menu-container-main .ceiling-pattern');

        addEventListenerToImages(ceiling_pattern_container, category);

        category = 'ceilingMaterial';

        const ceiling_material_container = parentElement.querySelector('.menu-container__options-menu-container-main .ceiling-material');
        
        addEventListenerToImages(ceiling_material_container, category);

    } else if (category == 'board') {
        const ceiling_pattern_container = parentElement.querySelector('.menu-container__options-menu-container-main .post-orders');

        addEventListenerToImages(ceiling_pattern_container, category);

        category = 'board_color';

        const ceiling_material_container = parentElement.querySelector('.menu-container__options-menu-container-main .panel-color');
        
        addEventListenerToImages(ceiling_material_container, category);
    } else if (category == 'door_hall') {
        category = 'door_hall';

        const door_hall_container = parentElement.querySelector('.menu-container__options-menu-container-main .door-material');
        
        addEventListenerToImages(door_hall_container, category);

        category = 'portal';

        const portal_container = parentElement.querySelector('.menu-container__options-menu-container-main .portal-material');

        addEventListenerToImages(portal_container, category);
    } else {
        const container = parentElement.querySelector('.menu-container__options-menu-container-main .textures-container');

        addEventListenerToImages(container, category);
    }
}

window.showTab = showTab;