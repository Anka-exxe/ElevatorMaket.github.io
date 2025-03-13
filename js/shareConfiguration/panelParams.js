import {setActiveTextureByContainerName, 
    setActiveRadioByInputName,
    getRadioParamByInputName} from "./findElementsHelper.js";

const PanelState = {
    board: null,
    material: null,
    panelSide: null,
    panelLocation: null,
    panelLocationToWall: null
};

export function getPanelState() {
    PanelState.panelSide = getPanelSide(); 
    PanelState.panelLocation = getPanelLocation();
    PanelState.panelLocationToWall = getPanelLocationToWall();
    return PanelState;
}

export function getPanelSide() {
    return getRadioParamByInputName("panel_side");
}

export function getPanelLocation() {
    return getRadioParamByInputName("panel_location");
}

export function getPanelLocationToWall() {
    return getRadioParamByInputName("panel_wall_position");
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

export function setPanelToWallLocationActive(radioId) {
    setActiveRadioByInputName("panel_wall_position", radioId);
}

export function setPanelParamsActive(parameters) {
    setBoardActive(parameters.board);
    setPanelMaterialActive(parameters.material);
    setPanelSideActive(parameters.panelSide);
    setPanelLocationActive(parameters.panelLocation);
    setPanelToWallLocationActive(parameters.panelLocationToWall);
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
