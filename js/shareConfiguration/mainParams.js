import { getRadioParamByInputName, 
    getButtonParamByFormName } 
    from './findElementsHelper.js';
import { setActiveRadioByInputName, 
    setActiveButtonByFormName } 
    from './findElementsHelper.js';

export function getMainSelectedParameters() {
    const selectedParameters = {
        cabinSize: getCabinSizeParam(),
        cabinType: getCabinTypeParam(),
        openingType: getOpeningTypeParam(),
        designProject: getDesignProjectParam()
    };

    //console.log(selectedParameters);
    return selectedParameters;
}

function getCabinSizeParam() {
    return getButtonParamByFormName('cabinSizeForm');
}

function getCabinTypeParam() {
    return getRadioParamByInputName("cabin_type");
}

function getOpeningTypeParam() {
    return getRadioParamByInputName("opening_type");
}

function getDesignProjectParam() {
    return getButtonParamByFormName('designForm');
}

export function setMainActiveSelections(selectedParameters) {
    setActiveButtonByFormName('cabinSizeForm', selectedParameters.cabinSize);
    setActiveRadioByInputName("cabin_type", selectedParameters.cabinType);
    setActiveRadioByInputName("opening_type", selectedParameters.openingType);
    setActiveButtonByFormName('designForm', selectedParameters.designProject);
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