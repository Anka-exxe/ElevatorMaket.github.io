﻿document.addEventListener('DOMContentLoaded', () => {
    const railingRadios = document.querySelectorAll('input[name="railing_type"]');
    railingRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            updateHandrailType(selectedType);
        });
    });

    const handrailButtons = document.querySelectorAll('button[name="railing_position"]');
    handrailButtons.forEach(button => {
        button.addEventListener('click', () => {
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
    const panelWallPositionsRadios = document.querySelectorAll('input[name="panel_wall_position"]');

    panelSideRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
        window.model.getObjectByName("DisplayHorisontal").visible = false;
    });

    panelLocationRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
        window.model.getObjectByName("DisplayHorisontal").visible = false;
    });

    panelWallPositionsRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
        window.model.getObjectByName("DisplayHorisontal").visible = false;
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
    window.model.getObjectByName("DisplayHorisontal").visible = false;
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

        setVisibility("FrontWallСentral", true);
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
        console.log("Центральное");
        console.log(model.getObjectByName("FrontWall").visible);
    } else {
        setVisibility("FrontWall", true);
        setVisibility("Door", true);
        setVisibility("Threshold", true);

        setVisibility("FrontWallСentral", false);
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
        console.log(" НЕ Центральное");
        console.log(model.getObjectByName("FrontWallСentral").visible);
        const doorGroup = model.getObjectByName("Door");
        if (doorGroup) {
            doorGroup.rotation.y = (openingType === "right") ? Math.PI : 0;
        }
        const door1Group = model.getObjectByName("Door1");
        if (doorGroup) {
            door1Group.rotation.y = (openingType === "right") ? Math.PI : 0;
        }
    }
    window.model.getObjectByName("DisplayHorisontal").visible = false;
    updateControlPanelPlacement();
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

    // Получаем выбранные значения из интерфейса
    const sideRadio = document.querySelector('input[name="panel_side"]:checked');
    const locationRadio = document.querySelector('input[name="panel_location"]:checked');
    const cabinRadio = document.querySelector('input[name="cabin_type"]:checked');
    const openingRadio = document.querySelector('input[name="opening_type"]:checked');
    // Радио для выбора положения панели относительно стен (передней или задней)
    const wallPositionRadios = Array.from(document.querySelectorAll('input[name="panel_wall_position"]'));


    if (!sideRadio || !locationRadio || !cabinRadio || !openingRadio) {
        console.warn("Не удалось определить значения для panel_side, panel_location, cabin_type или opening_type");
        return;
    }

    // Исходные значения
    let selectedSide = sideRadio.value;          // "left" или "right" (из UI)
    let panelLocation = locationRadio.value;       // "closer_to_door", "center", "both_sides"
    const cabinType = cabinRadio.value;            // "walk_through_cabin" или "not_walk_through_cabin"
    const openingType = openingRadio.value;        // "central", "left", "right"

    let wallPosition = "front"; // значение по умолчанию – ближе к передней стене
    if (panelLocation === "closer_to_door" && cabinType === "walk_through_cabin") {
        // Разрешаем выбор положения относительно стен
        wallPositionRadios.forEach(radio => radio.disabled = false);
        const wallPositionRadio = document.querySelector('input[name="panel_wall_position"]:checked');
        wallPosition = wallPositionRadio ? wallPositionRadio.value : "front";
    } else {
        // Если выбор недоступен – отключаем радио для panel_wall_position и устанавливаем значение по умолчанию
        wallPositionRadios.forEach(radio => {
            radio.disabled = true;
        });
        wallPosition = "front";
    }

    // --- Определение стороны панели в зависимости от типа кабины и открывания ---
    if (cabinType !== "walk_through_cabin") {
        // Для непроходной кабины выбор стороны панели определяется автоматически:
        selectedSide = (openingType === "left") ? "left" : "right";
        // Отключаем радио-кнопки, чтобы пользователь не мог изменить выбор
        document.getElementById("leftPanelSide").disabled = true;
        document.getElementById("rightPanelSide").disabled = true;
        // Также для непроходной кабины вариант "С двух сторон" недоступен
        document.querySelectorAll('input[name="panel_location"]').forEach(radio => {
            if (radio.value === "both_sides") {
                radio.disabled = true;
            } else {
                radio.disabled = false;
            }
        });
        // По умолчанию для непроходной кабины выбираем "closer_to_door"
        if (panelLocation !== "center") {
            panelLocation = "closer_to_door";
        }
        // Для непроходной кабины всегда считаем, что панель располагается ближе к передней стене
        wallPosition = "front";
    } else {
        // Для проходной кабины пользователь может выбирать сторону панели.
        // Однако, если тип открывания не соответствует выбранной стороне, то недопустимый вариант отключается.
        if (openingType === "left") {
            // Если открывание телескопическое (левое), то разрешаем только левую сторону
            document.getElementById("leftPanelSide").disabled = false;
            document.getElementById("rightPanelSide").disabled = true;
            selectedSide = "left";
            document.getElementById("leftPanelSide").checked = true;
        } else if (openingType === "right" || openingType === "central") {
            // Если открывание телескопическое (правое) или центральное – разрешаем только правую сторону
            document.getElementById("rightPanelSide").disabled = false;
            document.getElementById("leftPanelSide").disabled = true;
            selectedSide = "right";
            document.getElementById("rightPanelSide").checked = true;
        } else {
            // Если по каким-то причинам не задано – оставляем оба варианта активными
            document.getElementById("leftPanelSide").disabled = false;
            document.getElementById("rightPanelSide").disabled = false;
            selectedSide = sideRadio.value;
        }
        // Для проходной кабины вариант "С двух сторон" доступен – никаких ограничений для panel_location здесь нет
        document.querySelectorAll('input[name="panel_location"]').forEach(radio => {
            radio.disabled = false;
        });
    }

    // --- Сброс видимости всех групп панели управления ---
    const allPanelGroups = [
        "LeftControlPanelGroup", "RightControlPanelGroup",
        "LeftControlPanelGroup1", "RightControlPanelGroup1",
        "LeftControlPanelGroupSmall", "RightControlPanelGroupSmall"
    ];
    allPanelGroups.forEach(name => {
        const obj = window.model.getObjectByName(name);
        if (obj) obj.visible = false;
    });

    // --- Обработка варианта "С двух сторон" ---
    if (panelLocation === "both_sides") {
        if (cabinType === "walk_through_cabin") {
            const leftPanel = window.model.getObjectByName("LeftControlPanelGroup");
            const leftPanel1 = window.model.getObjectByName("LeftControlPanelGroup1");
            const rightPanel = window.model.getObjectByName("RightControlPanelGroup");
            const rightPanel1 = window.model.getObjectByName("RightControlPanelGroup1");
            if (leftPanel && selectedSide === "left") {
                leftPanel.visible = true;
                leftPanel1.visible = true;
            }
            if (rightPanel && selectedSide === "right") {
                rightPanel.visible = true;
                rightPanel1.visible = true;
            }
            console.log("Отображаются панели с обеих сторон");
        } else {
            console.warn("Вариант 'С двух сторон' недоступен для непроходной кабины");
        }
        return;
    }

    // --- Определяем имя группы панели для отображения ---
    let groupName = "";
    if (panelLocation === "center") {
        // Центральное расположение – используем малую панель
        groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall" : "RightControlPanelGroupSmall";
    } else if (panelLocation === "closer_to_door") {
        // "Ближе к двери" – учитываем положение относительно стен:
        if (wallPosition === "front") {
            groupName = (selectedSide === "left") ? "LeftControlPanelGroup" : "RightControlPanelGroup";
        } else if (wallPosition === "back") {
            groupName = (selectedSide === "left") ? "LeftControlPanelGroup1" : "RightControlPanelGroup1";
        } else {
            console.warn("Неизвестное значение panel_wall_position:", wallPosition);
            return;
        }
    } else {
        console.warn("Неизвестное расположение панели:", panelLocation);
        return;
    }

    // --- Дополнительная проверка типа открывания дверей ---
    // Левая сторона допустима только при телескопическом левом открытии,
    // Правая сторона – при телескопическом правом или центральном открытии.
    if (openingType === "left" && selectedSide !== "left") {
        selectedSide = "left";
        if (panelLocation === "center") {
            groupName = "LeftControlPanelGroupSmall";
        } else if (panelLocation === "closer_to_door") {
            groupName = (wallPosition === "back") ? "LeftControlPanelGroup1" : "LeftControlPanelGroup";
        }
    } else if ((openingType === "right" || openingType === "central") && selectedSide !== "right") {
        selectedSide = "right";
        if (panelLocation === "center") {
            groupName = "RightControlPanelGroupSmall";
        } else if (panelLocation === "closer_to_door") {
            groupName = (wallPosition === "back") ? "RightControlPanelGroup1" : "RightControlPanelGroup";
        }
    }

    // --- Отображаем выбранную группу панели ---
    const panelGroup = window.model.getObjectByName(groupName);
    if (panelGroup) {
        panelGroup.visible = true;
        console.log(`Отображается группа панели: ${groupName}`);
        window.model.getObjectByName("DisplayHorisontal").visible = false;
    } else {
        console.warn(`Группа панели ${groupName} не найдена`);
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
    if (selectedSide === "left") {
        targetButtonText = "слева";
    } else if (selectedSide === "right") {
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
