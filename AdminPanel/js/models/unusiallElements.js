document.addEventListener('DOMContentLoaded', () => {
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
        //window.model.getObjectByName("DisplayHorisontal").visible = false;
    });

    panelLocationRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
        //window.model.getObjectByName("DisplayHorisontal").visible = false;
    });

    panelWallPositionsRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
        //window.model.getObjectByName("DisplayHorisontal").visible = false;
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
    //window.model.getObjectByName("DisplayHorisontal").visible = false;
}


function updateCabinView(cabinType) {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    // Обновляем доступность кнопок для зеркал
    const backMirrorButton = document.getElementById("backMirror");
    const rightMirrorButton = document.getElementById("rightMirror");
    const leftMirrorButton = document.getElementById("leftMirror");

    if (cabinType === "not_walk_through_cabin") {
        // Непроходная: запрещаем зеркала на боковых стенах (справа и слева)
        if (rightMirrorButton) {
            rightMirrorButton.disabled = true;
            rightMirrorButton.classList.remove('active');
            rightMirrorButton.classList.add('disabled');
        }
        if (leftMirrorButton) {
            leftMirrorButton.disabled = true;
            leftMirrorButton.classList.remove('active');
            leftMirrorButton.classList.add('disabled');
        }
        // Для непроходной кабины заднее зеркало можно использовать
        if (backMirrorButton) {
            backMirrorButton.disabled = false;
            backMirrorButton.classList.remove('disabled');
        }
    } else if (cabinType === "walk_through_cabin") {
        // Проходная: запрещаем размещать зеркало на задней стене
        if (backMirrorButton) {
            backMirrorButton.disabled = true;
            backMirrorButton.classList.remove('active');
            backMirrorButton.classList.add('disabled');
        }
        // Боковые зеркала доступны
        if (rightMirrorButton) {
            rightMirrorButton.disabled = false;
            rightMirrorButton.classList.remove('disabled');
        }
        if (leftMirrorButton) {
            leftMirrorButton.disabled = false;
            leftMirrorButton.classList.remove('disabled');
        }
    }

    // Далее обновляем видимость групп в модели
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
            updateHandrailPosition();
        }
    }

    updateControlPanelPlacement();
    const selectedRadio = document.querySelector('input[name="opening_type"]:checked');
    if (selectedRadio) {
        const openingType = selectedRadio.value;
        updateOpenType(openingType);
    }
}

function updateOpenType(openingType) {
    if (!window.model) {
        console.error("Модель ещё не загружена");
        return;
    }

    const model = window.model;

    const setVisibility = (name, visible) => {
        const obj = model.getObjectByName(name);
        if (obj) obj.visible = visible;
    };

    const isWalkThrough = document.querySelector('input[name="cabin_type"]:checked')?.value === "walk_through_cabin";

    // Скрываем все возможные группы
    const allGroups = [
        // Передняя часть
        "FrontWall", "Door", "Threshold",
        "FrontWallLeft", "DoorLeft", "ThresholdLeft",
        "FrontWallСentral", "DoorCentral", "ThresholdCentral",
        // Задняя часть
        "BackWall1", "Door1", "Threshold1",
        "BackWall1Left", "Door1Left", "Threshold1Left",
        "BackWall1Central", "Door1Central", "Threshold1Central"
    ];

    allGroups.forEach(name => setVisibility(name, false));

    // Показываем нужные передние группы
    if (openingType === "left") {
        setVisibility("FrontWallLeft", true);
        setVisibility("DoorLeft", true);
        setVisibility("ThresholdLeft", true);
    } else if (openingType === "right") {
        setVisibility("FrontWall", true);
        setVisibility("Door", true);
        setVisibility("Threshold", true);
    } else if (openingType === "central" || openingType === "Центральное") {
        setVisibility("FrontWallСentral", true);
        setVisibility("DoorCentral", true);
        setVisibility("ThresholdCentral", true);
    }

    // Показываем нужные задние группы, если кабина проходная
    if (isWalkThrough) {
        if (openingType === "left") {
            setVisibility("BackWall1Left", true);
            setVisibility("Door1Left", true);
            setVisibility("Threshold1Left", true);
        } else if (openingType === "right") {
            setVisibility("BackWall1", true);
            setVisibility("Door1", true);
            setVisibility("Threshold1", true);
        } else if (openingType === "central" || openingType === "Центральное") {
            setVisibility("BackWall1Central", true);
            setVisibility("Door1Central", true);
            setVisibility("Threshold1Central", true);
        }
    }

    // Поворот только для телескопического правого открывания
    const doorGroup = model.getObjectByName("Door");
    if (doorGroup) {
        doorGroup.rotation.y = (openingType === "right") ? Math.PI : 0;
    }

    const door1Group = model.getObjectByName("Door1");
    if (door1Group) {
        door1Group.rotation.y = (openingType === "right") ? Math.PI : 0;
    }

    updateControlPanelPlacement();
}

function updateHandrailVisibility(isVisible) {
    const handrailGroup = model.getObjectByName("HandrailsGroup");
    if (handrailGroup) {
        handrailGroup.visible = isVisible;
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
            let visible = isActive;

            if (handrailType === "composite" &&
                (window.currentCabinSize === 'wide' || window.currentCabinSize === 'square') &&
                (
                    (englishSuffix === "Left" && isMirrorOnSide('left')) ||
                    (englishSuffix === "Right" && isMirrorOnSide('right'))
                )) {
                visible = false;
            }

            group.visible = visible;
        } else {
            console.warn(`Группа ${groupName} не найдена`);
        }
    }
}

function isMirrorOnSide(side) {
    if (!window.model) return false;
    const activeClass = 'active';

    const sideButton = document.getElementById(side + "Mirror");
    return sideButton && sideButton.classList.contains(activeClass);
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

    if (window.currentCabinSize === 'wide') {
        const bothSidesRadio = document.getElementById('bothSidesPanelPosition');
        if (bothSidesRadio) {
            bothSidesRadio.disabled = true;
            if (bothSidesRadio.checked) {
                document.getElementById('closerToDoorPanelPosition').checked = true;
            }
        }
    } else {
        const bothSidesRadio = document.getElementById('bothSidesPanelPosition');
        if (bothSidesRadio) {
            bothSidesRadio.disabled = false;
        }
    }

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
    if ((panelLocation === "closer_to_door" || panelLocation === "center") && cabinType === "walk_through_cabin") {
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
    let selectedCabinSize = window.currentCabinSize || "wide";
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
                if (selectedCabinSize === "wide") {
                    radio.disabled = true;
                    if (radio.checked) {
                        document.getElementById('closerToDoorPanelPosition').checked = true;
                    }
                } else if (cabinType !== "walk_through_cabin") {
                    radio.disabled = true;
                } else {
                    radio.disabled = false;
                }
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
        "LeftControlPanelGroupSmall", "RightControlPanelGroupSmall",
        "LeftControlPanelGroupSmall1", "RightControlPanelGroupSmall1"
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
        } else {
            console.warn("Вариант 'С двух сторон' недоступен для непроходной кабины");
        }
        return;
    }

    // --- Определяем имя группы панели для отображения ---
    let groupName = "";
    if (panelLocation === "center") {
        if (wallPosition === "front") {
            groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall" : "RightControlPanelGroupSmall";
        } else if (wallPosition === "back") {
            groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall1" : "RightControlPanelGroupSmall1";
        }
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
            if (wallPosition === "front") {
                groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall" : "RightControlPanelGroupSmall";
            } else if (wallPosition === "back") {
                groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall1" : "RightControlPanelGroupSmall1";
            }
        } else if ((openingType === "right" || openingType === "central") && selectedSide !== "right") {
            selectedSide = "right";
            if (panelLocation === "center") {
                if (wallPosition === "front") {
                    groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall" : "RightControlPanelGroupSmall";
                } else if (wallPosition === "back") {
                    groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall1" : "RightControlPanelGroupSmall1";
                }
            } else if (panelLocation === "closer_to_door") {
                groupName = (wallPosition === "back") ? "RightControlPanelGroup1" : "RightControlPanelGroup";
            }
        }
    }

        // --- Отображаем выбранную группу панели ---
        const panelGroup = window.model.getObjectByName(groupName);
        if (panelGroup) {
            panelGroup.visible = true;
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

        // Получаем тип кабины: "walk_through_cabin" или "not_walk_through_cabin"
        const cabinTypeRadio = document.querySelector('input[name="cabin_type"]:checked');
        const cabinType = cabinTypeRadio ? cabinTypeRadio.value : null;

        // Получаем кнопки зеркал
        const backButton = document.getElementById("backMirror");
        const rightButton = document.getElementById("rightMirror");
        const leftButton = document.getElementById("leftMirror");

        // Если кабина непроходная, отключаем кнопки для боковых зеркал
        if (cabinType === "not_walk_through_cabin") {
            if (rightButton) {
                rightButton.disabled = true;
                rightButton.classList.remove('active');
                rightButton.classList.add('disabled'); // для оформления неактивного состояния
            }
            if (leftButton) {
                leftButton.disabled = true;
                leftButton.classList.remove('active');
                leftButton.classList.add('disabled');
            }
        } else {
            // Если кабина проходная – убедимся, что кнопки активны
            if (rightButton) {
                rightButton.disabled = false;
                rightButton.classList.remove('disabled');
            }
            if (leftButton) {
                leftButton.disabled = false;
                leftButton.classList.remove('disabled');
            }
        }

        // Далее – логика обновления видимости зеркал
        // 1. Скрываем все зеркала (полные и "half" варианты)
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

        // Если зеркала не включены – дальше обновлять не нужно
        const availabilityRadio = document.querySelector('input[name="mirror_availability"]:checked');
        const isMirrorEnabled = (availabilityRadio && availabilityRadio.value === "yes");
        if (!isMirrorEnabled) return;

        // 3. Определяем выбранный тип зеркал
        const mirrorTypeRadio = document.querySelector('input[name="mirror_type"]:checked');
        const mirrorType = mirrorTypeRadio ? mirrorTypeRadio.value : null;

        // 4. Выбираем объекты зеркал в зависимости от типа
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

        // 5. Обновляем видимость зеркала "Сзади"
        if (mirrorBack) {
            if (backButton.classList.contains('active')) {
                mirrorBack.visible = true;
                if (mirrorType !== "to_rail") {
                    const mirrorWall = window.model.getObjectByName("BackWallMirror");
                    if (mirrorWall) mirrorWall.visible = false;
                }
            }
        }

        // 6. Для боковых зеркал обновляем видимость только если кабина проходная
        if (cabinType === "walk_through_cabin") {
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
        } else {
            // Для непроходной кабины боковые зеркала гарантированно скрыты
            if (mirrorRight) mirrorRight.visible = false;
            if (mirrorLeft) mirrorLeft.visible = false;
        }
    }

