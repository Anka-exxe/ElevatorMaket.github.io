import {setActiveTextureByContainerName, 
    setActiveRadioByInputName,
    getRadioParamByInputName} from "./findElementsHelper.js";

export let isHallSettingsSet = false;

export function setHallSettings(value) {
    isHallSettingsSet = value;
}

const HallState = {
    frameExistence: "have_portal",
    frameTexture: null,
    callPostType: "call_post_case1",
    indicationBoardType: "ind_board_case1",
};

export function setFrameTexture(textureId) {
    HallState.frameTexture = textureId;
}

export function getHallState() {
    return HallState;
}

export function setCallPostType(value) {
    HallState.callPostType = value;
}

export function setIndicationBoardType(value) {
    HallState.indicationBoardType = value;
}

export function setFrameExistence(value) {
    HallState.frameExistence = value;
}

export function setCallPostTypeActive(radioId) {
    setActiveRadioByInputName("call_post_type", radioId);

}

export function setIndicationBoardTypeActive(radioId) {
    setActiveRadioByInputName("ind_board_type", radioId);
}

export function setFrameExistenceActive(radioId) {
    setActiveRadioByInputName("availability_portal", radioId);
}

export async function setFrameMaterialActive(textureId) {
    await setActiveTextureByContainerName('HallParametrsTab', 
    "portalTextures", textureId);
}

export async function setHallParamsActive() {
    console.log(HallState);
    setCallPostTypeActive(HallState.callPostType);
    setIndicationBoardTypeActive(HallState.indicationBoardType);
    setFrameExistenceActive(HallState.frameExistence);
    await setFrameMaterialActive(HallState.frameTexture);
}

export async function setHallParams(parameters) {
    console.log(parameters);
    HallState.frameTexture = parameters.frameTexture;
    HallState.callPostType = parameters.callPostType;
    HallState.indicationBoardType = parameters.indicationBoardType;
    HallState.frameExistence  = parameters.frameExistence;
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
