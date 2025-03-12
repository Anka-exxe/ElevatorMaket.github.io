import { setActiveTextureWithAllWalls } from './findElementsHelper.js';

const WallTextureState = {
    left: null,
    right: null,
    front: null,
    back: null
};

export function setLeftTexture(id) {
    WallTextureState.left = id;
}

export function setRightTexture(id) {
    WallTextureState.right = id;
}

export function setFrontTexture(id) {
    WallTextureState.front = id;
}

export function setBackTexture(id) {
    WallTextureState.back = id;
}

export function setAllTextures(id) {
    setLeftTexture(id);
    setRightTexture(id);
    setFrontTexture(id);
    setBackTexture(id);
}

export function getLeftTexture() {
    return WallTextureState.left;
}

export function getRightTexture() {
    return WallTextureState.right;
}

export function getFrontTexture() {
    return WallTextureState.front;
}

export function getBackTexture() {
    return WallTextureState.back;
}

export function getAllWallTextures() {
    //console.log(WallTextureState);
    return WallTextureState;
}

export function setActiveWallParameters(wallParameters) {
    setActiveTextureWithAllWalls('WallsParametersTab', 'wallSideWalls', "wallTextures", wallParameters);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {

        const wallParameters = {
            left: "e73d78fc-410e-4a8a-9e70-8711cbc9c578",
            right: "f73d48fc-410e-4a8a-9e70-8711cbc9c578",
            front: "e73d67fc-410e-4a8a-9e70-8711cbc9c578",
            back: "e73d48fc-410e-4a8a-9e70-8711cbc9c578"
        }

        setActiveWallParameters(wallParameters);
    });
});*/