import { getRadioParamByInputName, 
    getButtonParamByFormName, setActiveCabinSizeByFormName } 
    from './findElementsHelper.js';
import { setActiveRadioByInputName, 
    setActiveButtonByFormName, setButtonActiveById } 
    from './findElementsHelper.js';

const selectedParameters = {
        size: null,
        type: null,
        openingType: null,
        designProjectGroup: null, 
        designProject: null,
    };

export function getMainSelectedParameters() {
    selectedParameters.size = getCabinSizeParam();
    selectedParameters.type = getCabinTypeParam();
    selectedParameters.openingType = getOpeningTypeParam();
    selectedParameters.designProjectGroup = getDesignProjectParam(); 
    
    //console.log(selectedParameters);
    return selectedParameters;
}

function getCabinSizeParam() {
    return getButtonParamByFormName('cabinSizeForm');
}

function getCabinTypeParam() {
    return getRadioParamByInputName("cabin_type");
}

export function getOpeningTypeParam() {
    return getRadioParamByInputName("opening_type");
}

function getDesignProjectParam() {
    return getButtonParamByFormName('designForm');
}

export function setDesignProject(designProjectId) {
    selectedParameters.designProject = designProjectId;
}

export function setCabinSize(cabinSize) {
    selectedParameters.size = cabinSize;
}

export async function setMainActiveSelections(parameters) {
    setActiveCabinSizeByFormName('cabinSizeForm', parameters.size);
    setActiveRadioByInputName("cabin_type", parameters.type);
    setActiveRadioByInputName("opening_type", parameters.openingType);
    setButtonActiveById(parameters.designProjectGroup);
}

/*document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('shareButton');
    saveButton.addEventListener('click', () => {

        getMainSelectedParameters();
    });
});*/

// Example usage
/*const selectedParameters = {
    cabinSize: "squereSize",
    cabinType: "walk_through_cabin",
    designProject: "modern",
    openingType: "centralOpenType"
};

setMainActiveSelections(selectedParameters);*/