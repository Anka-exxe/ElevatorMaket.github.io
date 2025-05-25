import {getAllWallTextures} 
from "../shareConfiguration/wallTexturesChoice.js";

import {setTextureClassActiveByContainerName, removeTextureClassesActiveByContainerName} 
from "../shareConfiguration/findElementsHelper.js";

function handleAllWallsClick() {
    const wallState = getAllWallTextures();
    if(isAllTexturesSame(wallState)) {
        setTextureClassActiveByContainerName("wallTextures", wallState.back);
    } else {
        removeTextureClassesActiveByContainerName("wallTextures");
    }
}

function handleFrontWallClick() {
    const wallState = getAllWallTextures();
    setTextureClassActiveByContainerName("wallTextures", wallState.front);
}

function handleBackWallClick() {
    const wallState = getAllWallTextures();
    setTextureClassActiveByContainerName("wallTextures", wallState.back);
}

function handleLeftWallClick() {
    const wallState = getAllWallTextures();
    setTextureClassActiveByContainerName("wallTextures", wallState.left);
}

function handleRightWallClick() {
    const wallState = getAllWallTextures();
    setTextureClassActiveByContainerName("wallTextures", wallState.right);
}

const allWallsBtn = document.getElementById('allWallsTextureBtn');
const frontWallBtn = document.getElementById('frontWallTextureBtn');
const backWallBtn = document.getElementById('backWallTextureBtn');
const leftWallBtn = document.getElementById('leftWallTextureBtn');
const rightWallBtn = document.getElementById('rightWallTextureBtn');

// Назначаем обработчики
allWallsBtn.addEventListener('click', handleAllWallsClick);
frontWallBtn.addEventListener('click', handleFrontWallClick);
backWallBtn.addEventListener('click', handleBackWallClick);
leftWallBtn.addEventListener('click', handleLeftWallClick);
rightWallBtn.addEventListener('click', handleRightWallClick);

function selectWall(button) {
    const wallState = getAllWallTextures();

    selectParameterButton(button);
}

function isAllTexturesSame(wallstate) {
    return wallstate.left === wallstate.right && 
    wallstate.right === wallstate.front && 
    wallstate.front === wallstate.back;
}

function selectParameterButton(button) {
    const container = button.parentNode; 
    const buttons = container.querySelectorAll('button'); 
    buttons.forEach(btn => {
        btn.classList.remove('active'); 
    });
    button.classList.add('active'); 
}