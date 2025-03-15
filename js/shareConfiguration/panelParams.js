import {setActiveTextureByContainerName, 
    setActiveRadioByInputName,
    getRadioParamByInputName} from "./findElementsHelper.js";

const PanelState = {
    indicationBoard: null,
    texture: null,
    side: null,
    location: null,
    locationToWall: null
};

export function getPanelState() {
    PanelState.side = getPanelSide(); 
    PanelState.location = getPanelLocation();
    PanelState.locationToWall = getPanelLocationToWall();
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
    PanelState.indicationBoard = textureId;
}

export function setPanelMaterial(textureId) {
    PanelState.texture = textureId;
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
    setBoardActive(parameters.indicationBoard);
    setPanelMaterialActive(parameters.texture);
    setPanelSideActive(parameters.side);
    setPanelLocationActive(parameters.location);
    setPanelToWallLocationActive(parameters.locationToWall);
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
