function getMainSelectedParameters() {
    const selectedParameters = {
        cabinSize: getCabinSizeParam(),
        cabinType: getCabinTypeParam(),
        openingType: getOpeningTypeParam(),
        designProject: getDesignProjectParam()
    };

    console.log(selectedParameters);
    return selectedParameters;
}

function getCabinSizeParam() {
    const activeSizeButton = document.querySelector('.menu-container__form .form__form-element.active');
    return activeSizeButton ? activeSizeButton.id : '';
}

function getCabinTypeParam() {
    const cabinTypeRadios = document.querySelectorAll('input[name="cabin_type"]');
    for (const radio of cabinTypeRadios) {
        if (radio.checked) {
            return radio.id;
        }
    }
    return '';
}

function getOpeningTypeParam() {
    const openingTypeRadios = document.querySelectorAll('input[name="opening_type"]');
    for (const radio of openingTypeRadios) {
        if (radio.checked) {
            return radio.id;
        }
    }
    return '';
}

function getDesignProjectParam() {
    const designForm = document.forms['designForm'];
    const activeDesignButton = designForm.querySelector('.form__form-element.active');
    return activeDesignButton ? activeDesignButton.id : '';
}