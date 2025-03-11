function setMainActiveSelections(selectedParameters) {
    // Set active cabin size
    const activeSizeButton = document.querySelector(`.menu-container__form .form__form-element#${selectedParameters.cabinSize}`);
    if (activeSizeButton) {
        // Remove active class from all size buttons and set the selected one as active
        document.querySelectorAll('.menu-container__form .form__form-element').forEach(button => {
            button.classList.remove('active');
        });
        activeSizeButton.classList.add('active');
    }

    // Set active cabin type (radio)
    const cabinTypeRadios = document.querySelectorAll('input[name="cabin_type"]');
    cabinTypeRadios.forEach(radio => {
        if (radio.id === selectedParameters.cabinType) {
            radio.checked = true; // Check the radio button
        }
    });

    // Set active opening type (radio)
    const openingTypeRadios = document.querySelectorAll('input[name="opening_type"]');
    openingTypeRadios.forEach(radio => {
        if (radio.id === selectedParameters.openingType) {
            radio.checked = true; // Check the radio button
        }
    });

    // Set active design project
    const designForm = document.forms['designForm'];
    const activeDesignButton = designForm.querySelector(`.form__form-element#${selectedParameters.designProject}`);
    if (activeDesignButton) {
        // Remove active class from all design buttons and set the selected one as active
        designForm.querySelectorAll('.form__form-element').forEach(button => {
            button.classList.remove('active');
        });
        activeDesignButton.classList.add('active');
    }
}

// Example usage
const selectedParameters = {
    cabinSize: "squereSize",
    cabinType: "walk_through_cabin",
    designProject: "modern",
    openingType: "centralOpenType"
};

setMainActiveSelections(selectedParameters);