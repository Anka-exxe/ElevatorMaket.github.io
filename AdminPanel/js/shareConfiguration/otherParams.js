import { setActiveTextureByContainerName } from './findElementsHelper.js';

const bumperState = {
    texture: null,
};

export function setAllTextures(id) {
    bumperState.texture = id;
}

export function getAllBumperTextures() {
   //console.log(bumperState);
    return bumperState;
}

export async function setActiveBumperParameters(bumperParameters) {
    await setActiveTextureByContainerName('OtherParametrsTab', "bumperTextures", bumperParameters.texture);
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