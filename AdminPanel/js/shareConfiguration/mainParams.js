import { getRadioParamByInputName, 
    getButtonParamByFormName } 
    from './findElementsHelper.js';
import { setActiveRadioByInputName, 
    setActiveButtonByFormName, setButtonActiveById } 
    from './findElementsHelper.js';

export function getMainSelectedParameters() {
    const selectedParameters = {
        size: getCabinSizeParam(),
        type: getCabinTypeParam(),
        openingType: getOpeningTypeParam(),
        designProjectGroup: getDesignProjectParam()
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
    setActiveButtonByFormName('cabinSizeForm', selectedParameters.size);
    setActiveRadioByInputName("cabin_type", selectedParameters.type);
    setActiveRadioByInputName("opening_type", selectedParameters.openingType);
    setButtonActiveById(selectedParameters.designProjectGroup);
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