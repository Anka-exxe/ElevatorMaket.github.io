import {setActiveTextureByContainerName} from "./findElementsHelper.js";

const DoorState = {
    texture: null,
};

export function getDoorState() {
    //console.log(DoorState);
    return DoorState;
}

export function setDoorTexture(textureId) {
    DoorState.texture = textureId;
}

export async  function setDoorTextureActive(parameters) {
   await setActiveTextureByContainerName('DoorParametrsTab', "doorTextures", parameters.texture);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        const param = {
            texture: "e73d48fc-410e-4a8a-9e70-8711cbc9c621",
        };

        setDoorTextureActive(param);

        getDoorState();
    });
});*/