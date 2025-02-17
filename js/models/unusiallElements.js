document.addEventListener('DOMContentLoaded', () => {
    const railingRadios = document.querySelectorAll('input[name="railing_type"]');
    railingRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            console.log("Выбранный тип поручня:", selectedType);
            updateHandrailType(selectedType);
        });
    });

    const handrailButtons = document.querySelectorAll('button[name="railing_position"]');
    handrailButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("Выбранный  поручня:");
            button.classList.toggle('active');
            updateHandrailPosition();
        });
    });

    const handrailRadios = document.querySelectorAll('input[name="handrail_availability"]');
    handrailRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            updateHandrailVisibility(selectedValue === "yes");
        });
    });

    const lightOrientationRadios = document.querySelectorAll('input[name="light_orientation_type"]');
    lightOrientationRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedOrientation = event.target.value;
            console.log("Выбрана ориентация света:", selectedOrientation);
            updateLampRotation(selectedOrientation);
        });
    });

    const cabinOpeningTypeRadios = document.querySelectorAll('input[name="opening_type"]');
    cabinOpeningTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            updateOpenType(selectedType);
        });
    });

    const cabinTypeRadios = document.querySelectorAll('input[name="cabin_type"]');
    cabinTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            updateCabinView(selectedValue);
        });
    });

    const panelSideRadios = document.querySelectorAll('input[name="panel_side"]');
    const panelLocationRadios = document.querySelectorAll('input[name="panel_location"]');

    panelSideRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
    });

    panelLocationRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
    });

    const mirrorAvailabilityRadios = document.querySelectorAll('input[name="mirror_availability"]');
    mirrorAvailabilityRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateMirrorPlacement();
        });
    });

    const mirrorButtons = document.querySelectorAll('.mirror-location-button');
    mirrorButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            updateMirrorPlacement();
        });
    });
});


export function DefaultSettings(){
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

    updateControlPanelPlacement();

    updateMirrorPlacement();
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

    const handrailUnifiedBack = model.getObjectByName('HandrailUnifiedBack');
    const handrailCompositeBack = model.getObjectByName('HandrailCompositeBack');
    if (handrailUnifiedBack) {
        handrailUnifiedBack.visible = (cabinType === "not_walk_through_cabin");
    }
    if (handrailCompositeBack) {
        handrailCompositeBack.visible = (cabinType === "not_walk_through_cabin");
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

    const backHandrailButton = document.getElementById("backHandrailButton");
    if (backHandrailButton) {
        if (cabinType === "walk_through_cabin") {
            backHandrailButton.disabled = true;
            backHandrailButton.classList.remove('active');
        } else {
            backHandrailButton.disabled = false;
            updateHandrailPosition()
        }
    }

    updateControlPanelPlacement()
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
    updateHandrailPosition()
}

export function updateHandrailPosition() {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    const mapping = {
        "сзади": "Back",
        "справа": "Right",
        "слева": "Left"
    };

    const typeRadio = document.querySelector('input[name="railing_type"]:checked');
    const handrailType = typeRadio ? typeRadio.value : 'composite';
    const prefix = (handrailType === "composite") ? "HandrailComposite" : "HandrailUnified";

    for (const [russianText, englishSuffix] of Object.entries(mapping)) {

        const button = Array.from(document.querySelectorAll('button[name="railing_position"]'))
            .find(btn => btn.textContent.trim().toLowerCase() === russianText);
        const isActive = button ? button.classList.contains('active') : false;

        const groupName = prefix + englishSuffix;
        const group = window.model.getObjectByName(groupName);
        if (group) {
            group.visible = isActive;
            console.log(`Группа ${groupName} видима: ${isActive}`);
        } else {
            console.warn(`Группа ${groupName} не найдена`);
        }
    }
}

function updateControlPanelPlacement() {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    const sideRadio = document.querySelector('input[name="panel_side"]:checked');
    const locationRadio = document.querySelector('input[name="panel_location"]:checked');
    const cabinRadio = document.querySelector('input[name="cabin_type"]:checked');

    if (!sideRadio || !locationRadio || !cabinRadio) {
        console.warn("Не удалось определить значения для panel_side, panel_location или cabin_type");
        return;
    }

    const side = sideRadio.value;
    let location = locationRadio.value;
    const cabinType = cabinRadio.value;

    if (cabinType !== "walk_through_cabin") {
        location = "closer_to_door";

        const panelLocationRadios = document.querySelectorAll('input[name="panel_location"]');
        panelLocationRadios.forEach(radio => {
            if (radio.value !== "closer_to_door") {
                radio.disabled = true;
            } else {
                radio.disabled = false;
                radio.checked = true;
            }
        });
    } else {
        const panelLocationRadios = document.querySelectorAll('input[name="panel_location"]');
        panelLocationRadios.forEach(radio => {
            radio.disabled = false;
        });
    }


    let sideGroupName, panelGroupName, centerGroupName;
    if (side === "left") {
        sideGroupName = "LeftControls";
        panelGroupName = "LeftControlPanelGroup1";
        centerGroupName = "LeftControlPanelCenter";
    } else if (side === "right") {
        sideGroupName = "RightControls";
        panelGroupName = "RightControlPanelGroup1";
        centerGroupName = "RightControlPanelCenter";
    }


    const leftGroup = window.model.getObjectByName("LeftControls");
    const rightGroup = window.model.getObjectByName("RightControls");
    if (leftGroup) leftGroup.visible = false;
    if (rightGroup) rightGroup.visible = false;

    if (location === "both_sides") {
        const sideGroup = window.model.getObjectByName(sideGroupName);
        if (sideGroup) {
            sideGroup.visible = true;
            sideGroup.traverse(child => { child.visible = true; });
        } else {
            console.warn(`Группа ${sideGroupName} не найдена`);
        }
    } else {
        let targetGroupName;
        if (location === "closer_to_door") {
            const sideGroup = window.model.getObjectByName(sideGroupName);
            targetGroupName = panelGroupName;
            sideGroup.visible = true;
        } else if (location === "center") {
            targetGroupName = centerGroupName;
        } else {
            console.warn("Неизвестное расположение:", location);
            return;
        }

        const targetGroup = window.model.getObjectByName(targetGroupName);
        if (targetGroup) {
            targetGroup.visible = false;
            console.log(`Группа ${targetGroupName} отображается`);
        } else {
            console.warn(`Группа ${targetGroupName} не найдена`);
        }
    }
    window.model.traverse(child => {
        if (child.name === 'DisplayHorisontal') {
            child.visible = false;
        }
    });
}

function updateMirrorPlacement() {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    const availabilityRadio = document.querySelector('input[name="mirror_availability"]:checked');
    const isMirrorEnabled = (availabilityRadio && availabilityRadio.value === "yes");

    const mirrorBack = window.model.getObjectByName("MirrorBack");
    const mirrorRight = window.model.getObjectByName("MirrorRight");
    const mirrorLeft = window.model.getObjectByName("MirrorLeft");

    if (!isMirrorEnabled) {
        if (mirrorBack) {
            mirrorBack.visible = false;
            const mirrorWall = window.model.getObjectByName("BackWallMirror");
            mirrorWall.visible = true;
        }
        if (mirrorRight) {
            mirrorRight.visible = false;
            const mirrorWall = window.model.getObjectByName("RightWallMirror");
            const mirrorWall1 = window.model.getObjectByName("RightWallMirror1");
            mirrorWall.visible = true;
            mirrorWall1.visible = true;
        }
        if (mirrorLeft) {
            mirrorLeft.visible = false;
            const mirrorWall = window.model.getObjectByName("LeftWallMirror");
            const mirrorWall1 = window.model.getObjectByName("LeftWallMirror1");
            mirrorWall.visible = true;
            mirrorWall1.visible = true;
        }
        return;
    }

    const backButton = document.getElementById("backMirror");
    const rightButton = document.getElementById("rightMirror");
    const leftButton = document.getElementById("leftMirror");

    if (mirrorBack ) {
        mirrorBack.visible = backButton.classList.contains('active');

        if (backButton.classList.contains('active')) {
            const mirrorWall = window.model.getObjectByName("BackWallMirror");
            mirrorWall.visible = false;
        }
        else {
            const mirrorWall = window.model.getObjectByName("BackWallMirror");
            mirrorWall.visible = true;
        }
    }
    if (mirrorRight ) {
        mirrorRight.traverse(child => { child.visible = rightButton.classList.contains('active'); });

        if (rightButton.classList.contains('active')) {
            const mirrorWall = window.model.getObjectByName("RightWallMirror");
            const mirrorWall1 = window.model.getObjectByName("RightWallMirror1");
            mirrorWall.visible = false;
            mirrorWall1.visible = false;
        }
        else {
            const mirrorWall = window.model.getObjectByName("RightWallMirror");
            const mirrorWall1 = window.model.getObjectByName("RightWallMirror1");
            mirrorWall.visible = true;
            mirrorWall1.visible = true;
        }
    }
    if (mirrorLeft) {
        mirrorLeft.traverse(child => { child.visible = leftButton.classList.contains('active'); });

        if (leftButton.classList.contains('active')) {
            const mirrorWall = window.model.getObjectByName("LeftWallMirror");
            const mirrorWall1 = window.model.getObjectByName("LeftWallMirror1");
            mirrorWall.visible = false;
            mirrorWall1.visible = false;
        }
        else {
            const mirrorWall = window.model.getObjectByName("LeftWallMirror");
            const mirrorWall1 = window.model.getObjectByName("LeftWallMirror1");
            mirrorWall.visible = true;
            mirrorWall1.visible = true;
        }
    }

    console.log("Mirror placement updated:",
        "Back:", mirrorBack ? mirrorBack.visible : "not found",
        "Right:", mirrorRight ? mirrorRight.visible : "not found",
        "Left:", mirrorLeft ? mirrorLeft.visible : "not found"
    );
}





