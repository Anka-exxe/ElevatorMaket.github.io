﻿document.addEventListener('DOMContentLoaded', () => {
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

    const mirrorTypeRadios = document.querySelectorAll('input[name="mirror_type"]');
    mirrorTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateMirrorPlacement);
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

    updateControlPanelPlacement();
    updateOpenType();
}

function updateOpenType(openingType) {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    const model = window.model;

    const setVisibility = (name, visible) => {
        const obj = model.getObjectByName(name);
        if (obj) obj.visible = visible;
    };

    const cabinRadio = document.querySelector('input[name="cabin_type"]:checked');
    const isWalkThrough = (cabinRadio && cabinRadio.value === "walk_through_cabin");

    if (openingType === "central" || openingType === "Центральное") {

        setVisibility("FrontWall", false);
        setVisibility("Door", false);
        setVisibility("Threshold", false);

        setVisibility("FrontWallCentral", true);
        setVisibility("DoorCentral", true);
        setVisibility("ThresholdCentral", true);

        if (isWalkThrough) {
            setVisibility("BackWall1", false);
            setVisibility("Threshold1", false);
            setVisibility("Door1", false);

            setVisibility("BackWall1Central", true);
            setVisibility("Threshold1Central", true);
            setVisibility("Door1Central", true);
        } else {
            setVisibility("BackWall1", true);
            setVisibility("Threshold1", true);
            setVisibility("Door1", true);
            setVisibility("BackWall1Central", false);
            setVisibility("Threshold1Central", false);
            setVisibility("Door1Central", false);
        }

        const doorGroup = model.getObjectByName("Door");
        if (doorGroup) doorGroup.rotation.y = 0;
    } else {
        setVisibility("FrontWall", true);
        setVisibility("Door", true);
        setVisibility("Threshold", true);

        setVisibility("FrontWallCentral", false);
        setVisibility("DoorCentral", false);
        setVisibility("ThresholdCentral", false);
        if (isWalkThrough) {
            setVisibility("BackWall1", true);
            setVisibility("Threshold1", true);
            setVisibility("Door1", true);

            setVisibility("BackWall1Central", false);
            setVisibility("Threshold1Central", false);
            setVisibility("Door1Central", false);
        }

        const doorGroup = model.getObjectByName("Door");
        if (doorGroup) {
            doorGroup.rotation.y = (openingType === "right") ? Math.PI : 0;
        }
        const door1Group = model.getObjectByName("Door1");
        if (doorGroup) {
            door1Group.rotation.y = (openingType === "right") ? Math.PI : 0;
        }
    }
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

    if (!cabinRadio) {
        console.warn("Не удалось определить тип кабины");
        return;
    }

    const handrailButtons = document.querySelectorAll('button[name="railing_position"]');

    handrailButtons.forEach(button => {
        if (button.id === "backHandrailButton" && cabinType === "walk_through_cabin") {
            return;
        }

        button.disabled = false;
        button.classList.remove('disabled');
    });

    let targetButtonText = "";
    if (side === "left") {
        targetButtonText = "слева";
    } else if (side === "right") {
        targetButtonText = "справа";
    }

    if (targetButtonText) {
        const buttonToDisable = Array.from(handrailButtons).find(btn => btn.textContent.trim().toLowerCase() === targetButtonText);
        if (buttonToDisable) {
            buttonToDisable.disabled = true;
            buttonToDisable.classList.remove('active');
            buttonToDisable.classList.add('disabled');
            updateHandrailPosition();
        }
    }
}

function updateMirrorPlacement() {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    // 1. Скрываем все зеркала сразу (как полные, так и "half" варианты)
    const allMirrorNames = [
        "MirrorBack", "MirrorRight", "MirrorLeft",
        "MirrorBackHalf", "MirrorRightHalf", "MirrorLeftHalf"
    ];
    allMirrorNames.forEach(name => {
        const mirror = window.model.getObjectByName(name);
        if (mirror) {
            mirror.visible = false;
        }
    });

    // 2. Показываем зеркала на стенах по умолчанию
    const mirrorWallNames = [
        "BackWallMirror", "RightWallMirror", "RightWallMirror1",
        "LeftWallMirror", "LeftWallMirror1"
    ];
    mirrorWallNames.forEach(name => {
        const wall = window.model.getObjectByName(name);
        if (wall) wall.visible = true;
    });

    // 3. Проверяем, включены ли зеркала
    const availabilityRadio = document.querySelector('input[name="mirror_availability"]:checked');
    const isMirrorEnabled = (availabilityRadio && availabilityRadio.value === "yes");
    if (!isMirrorEnabled) return;

    // 4. Определяем выбранный тип зеркал
    const mirrorTypeRadio = document.querySelector('input[name="mirror_type"]:checked');
    const mirrorType = mirrorTypeRadio ? mirrorTypeRadio.value : null;

    // 5. Выбираем объекты зеркал в зависимости от выбранного типа
    let mirrorBack, mirrorRight, mirrorLeft;
    if (mirrorType === "to_rail") {
        mirrorBack = window.model.getObjectByName("MirrorBackHalf");
        mirrorRight = window.model.getObjectByName("MirrorRightHalf");
        mirrorLeft = window.model.getObjectByName("MirrorLeftHalf");
    } else {
        mirrorBack = window.model.getObjectByName("MirrorBack");
        mirrorRight = window.model.getObjectByName("MirrorRight");
        mirrorLeft = window.model.getObjectByName("MirrorLeft");
    }

    // 6. Получаем кнопки, управляющие зеркалами
    const backButton = document.getElementById("backMirror");
    const rightButton = document.getElementById("rightMirror");
    const leftButton = document.getElementById("leftMirror");

    // 7. Обновляем состояние зеркал
    if (mirrorBack) {
        if (backButton.classList.contains('active')) {
            mirrorBack.visible = true;
            // Для типов, отличных от "до поручня", скрываем стеновое зеркало
            if (mirrorType !== "to_rail") {
                const mirrorWall = window.model.getObjectByName("BackWallMirror");
                if (mirrorWall) mirrorWall.visible = false;
            }
        }
    }
    if (mirrorRight) {
        if (rightButton.classList.contains('active')) {
            mirrorRight.visible = true;
            if (mirrorType !== "to_rail") {
                const mirrorWall = window.model.getObjectByName("RightWallMirror");
                const mirrorWall1 = window.model.getObjectByName("RightWallMirror1");
                if (mirrorWall) mirrorWall.visible = false;
                if (mirrorWall1) mirrorWall1.visible = false;
            }
        }
    }
    if (mirrorLeft) {
        if (leftButton.classList.contains('active')) {
            mirrorLeft.visible = true;
            if (mirrorType !== "to_rail") {
                const mirrorWall = window.model.getObjectByName("LeftWallMirror");
                const mirrorWall1 = window.model.getObjectByName("LeftWallMirror1");
                if (mirrorWall) mirrorWall.visible = false;
                if (mirrorWall1) mirrorWall1.visible = false;
            }
        }
    }

    console.log("Mirror placement updated:",
        "Back:", mirrorBack ? mirrorBack.visible : "not found",
        "Right:", mirrorRight ? mirrorRight.visible : "not found",
        "Left:", mirrorLeft ? mirrorLeft.visible : "not found"
    );
}
