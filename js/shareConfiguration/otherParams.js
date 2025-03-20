import { setActiveTextureWithAllWalls } from './findElementsHelper.js';

const bumperState = {
    left: null,
    right: null,
    back: null
};

export function setLeftTexture(id) {
    bumperState.left = id;
}

export function setRightTexture(id) {
    bumperState.right = id;
}

export function setBackTexture(id) {
    bumperState.back = id;
}

export function setAllTextures(id) {
    setLeftTexture(id);
    setRightTexture(id);
    setBackTexture(id);
}

export function getLeftTexture() {
    return bumperState.left;
}

export function getRightTexture() {
    return bumperState.right;
}

export function getBackTexture() {
    return bumperState.back;
}

export function getAllBumperTextures() {
   //console.log(bumperState);
    return bumperState;
}

export async function setActiveBumperParameters(bumperParameters) {
    await setActiveTextureWithAllWalls('OtherParametrsTab', 
    'wallSideBumpers', "bumperTextures", bumperParameters);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {

        const params = {
left: 'e73d48fc-410e-4a8a-9e70-8711cbc9c607', 
right: 'e73d48fc-410e-4a8a-9e70-8711cbc9c607', 
front: 'e73d48fc-410e-4a8a-9e70-8711cbc9c607', 
back: 'e73d48fc-410e-4a8a-9e70-8711cbc9c607'
        }

        setActiveBumperParameters(params);

        getAllBumperTextures();
    });
});*/