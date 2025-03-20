import {setActiveTextureByContainerName, 
    setActiveRadioByInputName,
    getRadioParamByInputName} from "./findElementsHelper.js";

const CeilingState = {
    lamp: null,
    texture: null,
    orientation: null,
};

export function getCeilingState() {
    CeilingState.orientation = getCeilingOrientation(); 
    //console.log(CeilingState);
    return CeilingState;
}

export function getCeilingOrientation() {
    return getRadioParamByInputName("light_orientation_type");
}

export function setCeilingMaterial(textureId) {
    CeilingState.texture = textureId;
}

export function setCeilingPlafon(textureId) {
    CeilingState.lamp = textureId;
}

export function setCeilingOrientationActive(radioId) {
    setActiveRadioByInputName("light_orientation_type", radioId);
}

export async function setCeilingMaterialActive(textureId) {
    await setActiveTextureByContainerName('CeilingParametrsTab', "ceilingMaterialTextureContainer", textureId);
}

export async function setCeilingPlafonActive(textureId) {
    await setActiveTextureByContainerName('CeilingParametrsTab', "ceilingPlafonTextureContainer", textureId);
}

export async function setCeilingParamsActive(parameters) {
    await setCeilingPlafonActive(parameters.lamp);
    await setCeilingMaterialActive(parameters.texture);
    setCeilingOrientationActive(parameters.orientation);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        const parameters = {
            ceilingPlafon: 'e73d48fc-410e-4a8a-9e70-8711cbc9c584', 
            ceilingMaterial: 'e73d48fc-410e-4a8a-9e70-8711cbc9c600', 
            orientation: 'vertical'
        }

        setCeilingParamsActive(parameters);

        getCeilingState();
    });
});*/
