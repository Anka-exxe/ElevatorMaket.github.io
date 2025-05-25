import { setButtonActiveById,
    setActiveRadioByInputName, 
    isButtonActiveById, 
    getRadioParamByInputName,
    setActiveTextureByContainerName } 
    from './findElementsHelper.js';

const handrailParameters = {
    existence: null,
    type: null,
    back: null,
    left: null,
    right: null,
    texture: null,
};

function getHandrailExistenceParam() {
    return getRadioParamByInputName('handrail_availability');
}

function getHandrailTypeParam() {
    return getRadioParamByInputName("railing_type");
}

function getBackLocationParam() {
    return isButtonActiveById("backHandrailButton");
}

function getRightLocationParam() {
    return isButtonActiveById("rightHandrailButton");
}

function getLeftLocationParam() {
    return isButtonActiveById("leftHandrailButton");
}

function getMaterialParam() {
    return handrailParameters.texture;
}

export function setHandrailExistenceActive(radioId) {
    setActiveRadioByInputName("handrail_availability", radioId);
}

export function setHandrailTypeActive(radioId) {
    setActiveRadioByInputName("railing_type", radioId);
}

export function setHandrailLocation(back, left, right) {
    if (back) {
        if (!getBackLocationParam()) {
            setButtonActiveById("backHandrailButton");
        }
    } 
    if (left) {
        if (!getLeftLocationParam()) {
            setButtonActiveById("leftHandrailButton");
        }
    }
    if (right) {
        if (!getRightLocationParam()) {
            setButtonActiveById("rightHandrailButton");
        }
    }
}

export function setHandrailTexture(textureId) {
    handrailParameters.texture = textureId;
}

async function setHandrailTextureActive(texture) {
     await setActiveTextureByContainerName('HandrailParametrsTab', "handrailTextureContainer", texture);
}

export async  function setHandrailParamsActive(parameters) {
    setHandrailExistenceActive(parameters.existence);
    setHandrailTypeActive(parameters.type);
    setHandrailLocation(parameters.back, parameters.left, parameters.right);
    await setHandrailTextureActive(parameters.texture);
}

export function getHandrailParams() {
    handrailParameters.existence = getHandrailExistenceParam();
    handrailParameters.type = getHandrailTypeParam();
    handrailParameters.back = getBackLocationParam();
    handrailParameters.left = getLeftLocationParam();
    handrailParameters.right = getRightLocationParam();
    handrailParameters.texture = getMaterialParam();

   // console.log(handrailParameters);
    return handrailParameters;
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {

        let params = {
            back:false,
            existence: "haveHand",
            left: false,
            material: "e73d48fc-410e-4a8a-9e70-8711cbc9c605",
            handrailType: "unified",
            right: true
        }

        setHandrailParams(params)

        getHandrailParams();
    });
});*/