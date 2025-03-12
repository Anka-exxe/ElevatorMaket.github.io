import { setButtonActiveById,
     setActiveRadioByInputName, 
     isButtonActiveById, 
     getRadioParamByInputName } 
     from './findElementsHelper.js';

const mirrorParameters = {
    existence: null,
    mirrorType: null,
    back: null,
    left: null,
    right: null,
};


function getMirrorExistenceParam() {
    return getRadioParamByInputName('mirror_availability');
}

function getMirrorTypeParam() {
    return getRadioParamByInputName("mirror_type");
}

function getBackLocationParam() {
    return isButtonActiveById("backMirror");
}

function getRightLocationParam() {
    return isButtonActiveById("rightMirror");
}

function getLeftLocationParam() {
    return isButtonActiveById("leftMirror");
}

export function setMirrorExistenceActive(radioId) {
    setActiveRadioByInputName("mirror_availability", radioId);
}

export function setMirrorTypeActive(radioId) {
    setActiveRadioByInputName("mirror_type", radioId);
}

export function setMirrorLocation(back, left, right) {
    if (back) {
        if (!getBackLocationParam()) {
            setButtonActiveById("backMirror");
        }
    } 
    if (left) {
        if (!getLeftLocationParam()) {
            setButtonActiveById("leftMirror");
        }
    }
    if (right) {
        if (!getRightLocationParam()) {
            setButtonActiveById("rightMirror");
        }
    }
}

export function setMirrorParamsActive(parameters) {
    setMirrorExistenceActive(parameters.existence);
    setMirrorTypeActive(parameters.mirrorType);
    setMirrorLocation(parameters.back, parameters.left, parameters.right);
}

export function getMirrorParams() {
    mirrorParameters.existence = getMirrorExistenceParam();
    mirrorParameters.mirrorType = getMirrorTypeParam();
    mirrorParameters.back = getBackLocationParam();
    mirrorParameters.left = getLeftLocationParam();
    mirrorParameters.right = getRightLocationParam();

    //console.log(mirrorParameters);
    return mirrorParameters;
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {

        const params = {
            existence: 'haveMirror', 
            mirrorType: 'to_rail', 
            back: true, 
            left: true, 
            right: true
        }

        setMirrorParams(params);

        getMirrorParams();
    });
});*/