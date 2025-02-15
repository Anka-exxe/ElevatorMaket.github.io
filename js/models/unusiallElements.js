
document.addEventListener('DOMContentLoaded', () => {
    const cabinRadios = document.querySelectorAll('input[name="cabin_type"]');
    cabinRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            updateCabinView(selectedValue);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cabinRadios = document.querySelectorAll('input[name="opening_type"]');
    cabinRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            updateOpenType(selectedType);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const lightOrientationRadios = document.querySelectorAll('input[name="light_orientation_type"]');
    lightOrientationRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedOrientation = event.target.value;
            console.log("Выбрана ориентация света:", selectedOrientation);
            updateLampRotation(selectedOrientation);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const handrailRadios = document.querySelectorAll('input[name="handrail_availability"]');
    handrailRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedValue = event.target.value; // "yes" или "no"
            console.log("Выбранное значение наличия поручня:", selectedValue);

            updateHandrailVisibility(selectedValue === "yes");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const railingRadios = document.querySelectorAll('input[name="railing_type"]');
    railingRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            console.log("Выбранный тип поручня:", selectedType);
            updateHandrailType(selectedType);
        });
    });
});

export function DefaultSettings(){
    console.log("SDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDS")
    const selectedCabinTypeRadio = document.querySelector('input[name="cabin_type"]:checked');
    if (selectedCabinTypeRadio) {
        updateCabinView(selectedCabinTypeRadio.value);
    }

    const selectedOpeningTypeRadio = document.querySelector('input[name="opening_type"]:checked');
    if (selectedOpeningTypeRadio) {
        updateOpenType(selectedOpeningTypeRadio.value);
    }

    const selectedLightRadio = document.querySelector('input[name="light_orientation_type"]:checked');
    if (selectedLightRadio) {
        updateLampRotation(selectedLightRadio.value);
    }

    const selectedHandrailAvabilityRadio = document.querySelector('input[name="handrail_availability"]:checked');
    if (selectedHandrailAvabilityRadio) {
        const selectedValue = selectedHandrailAvabilityRadio.value; // "yes" или "no"

        updateHandrailVisibility(selectedValue === "yes");
    }

    const selectedRailingTypeRadio = document.querySelector('input[name="railing_type"]:checked');
    if (selectedRailingTypeRadio) {
        updateHandrailType(selectedRailingTypeRadio.value);
    }
}


function updateCabinView(cabinType) {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    const model = window.model;

    model.traverse(child => {
        if (child.type === 'Group') {
            if (child.name === "WalkThroughGroup") {
                child.visible = (cabinType === "walk_through_cabin");
            }
            if (child.name === "NotWalkThroughGroup") {
                child.visible = (cabinType === "not_walk_through_cabin");
            }
        }
    });

    const backHandrailGroup = model.getObjectByName('BackHandrailGroup');
    if (backHandrailGroup) {
        backHandrailGroup.visible = (cabinType === "not_walk_through_cabin");
    } else {
        console.warn("BackHandrailGroup не найдена");
    }

    const threshold1 = model.getObjectByName('Threshold1');
    if (threshold1) {
        threshold1.visible = (cabinType === "walk_through_cabin");
    } else {
        console.warn("Threshold1 не найдена");
    }

    const backBumper = model.getObjectByName('BackBumper');
    if (backBumper) {
        backBumper.visible = (cabinType === "not_walk_through_cabin");
    } else {
        console.warn("BackBumper не найдена");
    }
}


function updateOpenType(openingType) {
    const doorGroup = model.getObjectByName("Door");
    const doorGroup1 = model.getObjectByName("Door1");
    if (!doorGroup) {
        console.error("Группа Door не найдена");
        return;
    }
    doorGroup.rotation.y = (openingType === "right") ? Math.PI : 0;
    doorGroup1.rotation.y = (openingType === "right") ? Math.PI : 0;
}

function updateLampRotation(orientation) {
    const lampGroup = model.getObjectByName("Lamp");
    if (!lampGroup) {
        console.error("Группа Lamp не найдена");
        return;
    }

    lampGroup.traverse(child => {
        if (child.isMesh && child.material) {
            const updateMap = (mat) => {
                if (mat.map) {
                    mat.map.center.set(0.5, 0.5);
                    mat.map.rotation = (orientation === "vertical") ? Math.PI / 2 : 0;
                    mat.map.needsUpdate = true;
                }
            };

            if (Array.isArray(child.material)) {
                child.material.forEach(mat => updateMap(mat));
            } else {
                updateMap(child.material);
            }
        }
    });
}


function updateHandrailVisibility(isVisible) {
    const handrailGroup = model.getObjectByName("HandrailsGroup");
    if (handrailGroup) {
        handrailGroup.visible = isVisible;
        console.log("Handrail group visibility:", isVisible);
    } else {
        console.error("Группа Handrail не найдена");
    }
}

function updateHandrailType(type) {
    const compositeGroup = model.getObjectByName("HandrailComposite");
    const unifiedGroup = model.getObjectByName("HandrailUnified");

    if (type === "composite") {
        if (compositeGroup) compositeGroup.visible = true;
        if (unifiedGroup) unifiedGroup.visible = false;
    } else if (type === "unified") {
        if (compositeGroup) compositeGroup.visible = false;
        if (unifiedGroup) unifiedGroup.visible = true;
    } else {
        console.warn("Неизвестный тип поручня:", type);
    }
}

