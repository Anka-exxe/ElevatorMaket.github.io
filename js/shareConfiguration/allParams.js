import {getMainSelectedParameters, 
    setMainActiveSelections} from './mainParams.js';
import {getAllWallTextures,
    setActiveWallParameters } from './wallTexturesChoice.js';
import {getDoorState,
    setDoorTextureActive} from './doorParams.js';
import {getCeilingState, 
    setCeilingParamsActive} from './ceilingParams.js';
    import {getFloorState, 
        setFloorTextureActive} from './floorParameters.js';
import {getPanelState,
    setPanelParamsActive} from './panelParams.js';
import {getMirrorParams,
    setMirrorParamsActive} from './mirrorParams.js';
import {getHandrailParams,
    setHandrailParamsActive} from './handrailParams.js';
import {getAllBumperTextures,
    setActiveBumperParameters} from './otherParams.js';

import {showTab} from "../animation/tabFunctions.js";

const allParameters = {
    mainParameters: null,
    wallParameters: null,
    doorParameters: null,
    ceilingParameters: null,
    floorParameters: null,
    panelParameters: null,
    mirrorParameters: null,
    handrailParameters: null,
    otherParameters: null
};

export function getAllParameters() {
    allParameters.mainParameters = getMainSelectedParameters();
    allParameters.wallParameters = getAllWallTextures();
    allParameters.doorParameters = getDoorState();
    allParameters.ceilingParameters = getCeilingState();
    allParameters.floorParameters = getFloorState();
    allParameters.panelParameters = getPanelState();
    allParameters.mirrorParameters = getMirrorParams();
    allParameters.handrailParameters = getHandrailParams();
    allParameters.otherParameters = getAllBumperTextures();
    console.log(allParameters);
}

export function setAllParameters(parameters) {
    if (parameters && typeof parameters === 'object') {
        setMainActiveSelections(parameters.mainParameters); 
        setActiveWallParameters(parameters.wallParameters);
        setDoorTextureActive(parameters.doorParameters);
        setCeilingParamsActive(parameters.ceilingParameters);
        setFloorTextureActive(parameters.floorParameters);
        setPanelParamsActive(parameters.panelParameters);
        setMirrorParamsActive(parameters.mirrorParameters);
        setHandrailParamsActive(parameters.handrailParameters);
        setActiveBumperParameters(parameters.otherParameters);

        //showTab('MainParametersTab');

        const mainTabMenuTitle = document.getElementById('MainTabMenuTitle');

// Проверка на существование элемента
if (mainTabMenuTitle) {
    // Имитируем клик
    mainTabMenuTitle.click();
} else {
    console.error('Элемент с ID "MainTabMenuTitle" не найден.');
}
        
        console.log('Параметры установлены:', allParameters);
    } else {
        console.error('Неверный тип параметров. Ожидался объект.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('shareButton');
    saveButton.addEventListener('click', () => {

        const params = {
            ceilingParameters: {ceilingPlafon: 'e73d48fc-410e-4a8a-9e70-8711cbc9c584', ceilingMaterial: 'e73d48fc-410e-4a8a-9e70-8711cbc9c600', orientation: 'vertical'},
doorParameters
: 
{texture: 'e73d48fc-410e-4a8a-9e70-8711cbc9c622'},
handrailParameters: 
{back
    : 
    false,
    existence
    : 
    "noHand",
    handrailType
    : 
    "unified",
    left
    : 
    false,
    material
    : 
    "e73d48fc-410e-4a8a-9e70-8711cbc9c605",
    right
    : 
    true},
mainParameters
: 
{cabinSize: 'squereSize', cabinType: 'walk_through_cabin', openingType: 'rightOpenType', designProject: 'elite'},
mirrorParameters
: 
{existence: 'haveMirror', mirrorType: 'to_rail', back: true, left: false, right: false},
otherParameters
: 
{left: 'e73d48fc-410e-4a8a-9e70-8711cbc9c609', right: 'e73d48fc-410e-4a8a-9e70-8711cbc9c609', front: 'e73d48fc-410e-4a8a-9e70-8711cbc9c609', back: 'e73d48fc-410e-4a8a-9e70-8711cbc9c609'},
panelParameters
: 
{board: 'e73d48fc-410e-4a8a-9e70-8711cbc9c611', material: 'e73d48fc-410e-4a8a-9e70-8711cbc9c619', panelSide: 'leftPanelSide', panelLocation: 'centerPanelPosition'},
wallParameters
: 
{left: 'e73d78fc-410e-4a8a-9e70-8711cbc9c578', right: 'e73d78fc-410e-4a8a-9e70-8711cbc9c578', front: 'e73d78fc-410e-4a8a-9e70-8711cbc9c578', back: 'e73d78fc-410e-4a8a-9e70-8711cbc9c578'},
floorParameters : {texture: "e73d48fc-410e-4a8a-9e70-8711cbc9c608"}
        }

        setAllParameters(params);

        getAllParameters();
    });
});