import {setActiveTextureByContainerName, 
    setActiveRadioByInputName,
    getRadioParamByInputName} from "./findElementsHelper.js";

const PanelState = {
    board: null,
    material: null,
    panelSide: null,
    panelLocation: null,
};

export function getPanelState() {
    PanelState.panelSide = getPanelSide(); 
    PanelState.panelLocation = getPanelLocation();
    return PanelState;
}

export function getPanelSide() {
    return getRadioParamByInputName("panel_side");
}

export function getPanelLocation() {
    return getRadioParamByInputName("panel_location");
}

export function setBoard(textureId) {
    PanelState.board = textureId;
}

export function setPanelMaterial(textureId) {
    PanelState.material = textureId;
}

export function setPanelSideActive(radioId) {
    setActiveRadioByInputName("panel_side", radioId);
}

export function setPanelLocationActive(radioId) {
    setActiveRadioByInputName("panel_location", radioId);
}

export function setPanelMaterialActive(textureId) {
    setActiveTextureByContainerName('BoardParametrsTab', "panelMaterialTextureContainer", textureId);
}

export function setBoardActive(textureId) {
    setActiveTextureByContainerName('BoardParametrsTab', "boardTextureContainer", textureId);
}

export function setPanelParamsActive(parameters) {
    setBoardActive(parameters.board);
    setPanelMaterialActive(parameters.material);
    setPanelSideActive(parameters.panelSide);
    setPanelLocationActive(parameters.panelLocation);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        const parameters = {
            board: 'e73d48fc-410e-4a8a-9e70-8711cbc9c611',
            material: 'e73d48fc-410e-4a8a-9e70-8711cbc9c619', 
            panelSide: 'leftPanelSide', 
            panelLocation: 'closerToDoorPanelPosition'
        }
        setPanelParamsActive(parameters)

        getPanelState();
    });
});*/
