import {setActiveTextureByContainerName} from "./findElementsHelper.js";

const FloorState = {
    texture: null,
};

export function getFloorState() {
    //console.log(FloorState);
    return FloorState;
}

export function setFloorTexture(textureId) {
    FloorState.texture = textureId;
}

export async  function setFloorTextureActive(parameters) {
    await setActiveTextureByContainerName('FloorParametrsTab', "floorTextureContainer", parameters.texture);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        const param = {
            texture: "e73d48fc-410e-4a8a-9e70-8711cbc9c606",
        };

        setFloorTextureActive(param);

        getFloorState();
    });
});*/