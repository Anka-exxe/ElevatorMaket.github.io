import { Reflector } from 'jsm/objects/Reflector.js';
import * as THREE from 'three';
import {scene} from "./loadModel.js";
document.addEventListener('DOMContentLoaded', () => {
    const availabilityRadios = document.querySelectorAll('input[name="handrail_availability"]');

    setHandrailControlsEnabled(false);

    availabilityRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const has = radio.value === 'yes';
            setHandrailControlsEnabled(has);
            updateHandrailVisibility(has);
            if (has) {
                const unifiedRadio = document.getElementById('unified');
                if (unifiedRadio) {
                    unifiedRadio.checked = true;
                    updateHandrailType('unified');
                }
                updateHandrailPosition();
            }
        });
    });

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
        });
    });

    const cabinOpeningTypeRadios = document.querySelectorAll('input[name="opening_type"]');
    cabinOpeningTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            updateOpenType(selectedType);

            const noMirror = document.getElementById('noMirror');
            if (noMirror) noMirror.checked = true;
            setMirrorControlsEnabled(false);
            updateMirrorPlacement()

            const hasRails = document.querySelector('input[name="handrail_availability"]:checked').value === 'yes';
            setHandrailControlsEnabled(hasRails);
            if (hasRails) updateHandrailPosition();
        });
    });

    const cabinTypeRadios = document.querySelectorAll('input[name="cabin_type"]');
    cabinTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            updateCabinView(selectedValue);
            const hasRails = document.querySelector('input[name="handrail_availability"]:checked').value === 'yes';
            setHandrailControlsEnabled(hasRails);
            if (hasRails) updateHandrailPosition();

            const noMirrorRadio = document.getElementById('noMirror');
            if (noMirrorRadio) noMirrorRadio.checked = true;

            setMirrorControlsEnabled(false);
            updateMirrorPlacement();
        });
    });

    const panelSideRadios = document.querySelectorAll('input[name="panel_side"]');
    const panelLocationRadios = document.querySelectorAll('input[name="panel_location"]');
    const panelWallPositionsRadios = document.querySelectorAll('input[name="panel_wall_position"]');

    panelSideRadios.forEach(radio => {
        const panelSideRadios = document.querySelectorAll('input[name="panel_side"]');
        panelSideRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateControlPanelPlacement();
                updateMirrorPlacement();
            });
        });
    });

    panelLocationRadios.forEach(radio => {
        radio.addEventListener('change', updateControlPanelPlacement);
    });

    panelWallPositionsRadios.forEach(radio => {
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

    function setMirrorControlsEnabled(enabled) {
        mirrorTypeRadios.forEach(r => {
            r.disabled = !enabled;
            if (!enabled) r.checked = false;
        });
        mirrorButtons.forEach(b => {
            b.disabled = !enabled;
            b.classList.toggle('disabled', !enabled);
            if (!enabled) b.classList.remove('active');
        });
    }

    // при старте — всё заблокировано
    setMirrorControlsEnabled(false);

    // как только выбрана доступность — включаем/выключаем
    mirrorAvailabilityRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const has = radio.value === 'yes';
            setMirrorControlsEnabled(has);
            // и сразу же обновляем зеркало, чтобы убрать лишние
            updateMirrorPlacement();
        });
    });
});

function setHandrailControlsEnabled(enabled) {
    const posButtons = Array.from(document.querySelectorAll('button[name="railing_position"]'));
    posButtons.forEach(b => {
        b.disabled = !enabled;
        b.classList.toggle('disabled', !enabled);
        if (!enabled) b.classList.remove('active');
    });

    // Радиокнопки типа поручня
    const typeRadios = document.querySelectorAll('input[name="railing_type"]');
    typeRadios.forEach(radio => {
        radio.disabled = !enabled;
        if (!enabled) radio.checked = false;
    });

    // Материалы поручня
    const handrailMaterialContainer = document.querySelector('[name="handrailTextureContainer"]');
    if (handrailMaterialContainer) {
        handrailMaterialContainer.style.pointerEvents = enabled ? 'auto' : 'none';
        handrailMaterialContainer.style.opacity = enabled ? '1' : '0.5';
    }

    if (!enabled) return;

    // Сначала все кнопки разблокируем
    posButtons.forEach(b => {
        b.disabled = false;
        b.classList.remove('disabled');
    });

    // Блокируем по типу открывания
    const openingType = document.querySelector('input[name="opening_type"]:checked').value;
    if (openingType === 'left') disable("слева");
    else disable("справа");

    // Если проходная кабина — блокируем «сзади»
    const cabinType = document.querySelector('input[name="cabin_type"]:checked').value;
    if (cabinType === 'walk_through_cabin') disable("сзади");

    function disable(text) {
        const btn = posButtons.find(b => b.textContent.trim().toLowerCase() === text);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('disabled');
            btn.classList.remove('active');
        }
    }
}


function updateHandrailVisibility(isVisible) {
    const model = window.model;
    if (!model) return;
    // все группы, которые бывают у Composite и Unified
    const names = [
        'HandrailCompositeBack','HandrailCompositeRight','HandrailCompositeLeft',
        'HandrailUnifiedBack','HandrailUnifiedRight','HandrailUnifiedLeft'
    ];
    names.forEach(name => {
        const g = model.getObjectByName(name);
        if (g) g.visible = isVisible;
    });
}


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

    updateControlPanelPlacement();
    const selectedRadio = document.querySelector('input[name="opening_type"]:checked');
    if (selectedRadio) {
        const openingType = selectedRadio.value;
        updateOpenType(openingType);
    }
    updateHandrailPosition()
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

    updateControlPanelPlacement();
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
            //console.log(`Группа ${groupName} видима: ${visible}`);
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

    // Спрятать/показать блок "Расположение относительно стен" при выборе "С двух сторон"
    const wallPositionSection = document.querySelector('[name="panel_wall_position"]').closest('.menu-container__form');
    if (panelLocation === 'both_sides') {
        wallPositionSection.style.display = 'none';
    } else {
        wallPositionSection.style.display = '';
    }

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
        // Для проходной кабины пользователь может выбир    ать сторону панели.
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
    }
    else if (panelLocation === "closer_to_door") {
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
        }
        else if (panelLocation === "closer_to_door") {
            groupName = (wallPosition === "back") ? "LeftControlPanelGroup1" : "LeftControlPanelGroup";
        }
    } else if ((openingType === "right" || openingType === "central") && selectedSide !== "right") {
        selectedSide = "right";
        if (panelLocation === "center") {
            if (wallPosition === "front") {
                groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall" : "RightControlPanelGroupSmall";
            } else if (wallPosition === "back") {
                groupName = (selectedSide === "left") ? "LeftControlPanelGroupSmall1" : "RightControlPanelGroupSmall1";
            }
        }
        else if (panelLocation === "closer_to_door") {
            groupName = (wallPosition === "back") ? "RightControlPanelGroup1" : "RightControlPanelGroup";
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
export function setupReflectors(camera, renderer) {
    const mirrorNames = [
        "MirrorBack", "MirrorRight", "MirrorLeft",
        "MirrorBackHalf", "MirrorRightHalf", "MirrorLeftHalf"
    ];

    mirrorNames.forEach(name => {
        const group = window.model.getObjectByName(name);
        if (!group) {
            console.warn(`Группа ${name} не найдена`);
            return;
        }

        const meshes = group.children.filter(child => child.isMesh);
        if (meshes.length === 0) {
            console.warn(`В группе ${name} нет мешей`);
            return;
        }

        meshes.forEach(mesh => {
            // Обновляем мир
            mesh.updateWorldMatrix(true, false);

            // Получаем габариты и центр
            mesh.geometry.computeBoundingBox();
            const bbox = mesh.geometry.boundingBox.clone();
            const size = new THREE.Vector3();
            bbox.getSize(size);

            const center = new THREE.Vector3();
            bbox.getCenter(center);

            // Переводим центр в мировые координаты
            mesh.localToWorld(center);

            // Создаём геометрию зеркала по локальным осям меша
            const width = size.x;
            const height = size.y;
            const geometry = new THREE.PlaneGeometry(width, height);

            const mirror = new Reflector(geometry, {
                textureWidth: 1024,
                textureHeight: 1024,
                clipBias: 0.003,
                color: 0x777777,
            });

            // Получаем мировые трансформации меша
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            mesh.matrixWorld.decompose(worldPos, worldQuat, worldScale);

            mirror.position.copy(worldPos);
            mirror.quaternion.copy(worldQuat);
            mirror.scale.copy(worldScale);

            // Отодвигаем немного вперёд по нормали
            const normal = new THREE.Vector3(1, 0, 0).applyQuaternion(worldQuat);
            const arrowHelper = new THREE.ArrowHelper(normal, mirror.position, 0.3, 0xff0000);
            scene.add(arrowHelper);
            mirror.position.add(normal.multiplyScalar(0.01));

            // Скрываем оригинальный меш
            mesh.visible = false;
            group.add(mirror);

            // Визуальные помощники
            const axesHelper = new THREE.AxesHelper(0.15);
            mirror.add(axesHelper);

        });
    });

    renderer.render(scene, camera);
}

function updateMirrorPlacement() {
    if (!window.model) {
        console.error("Модель еще не загружена");
        return;
    }

    // --- UI ---
    const hasMirror   = document.querySelector('input[name="mirror_availability"]:checked')?.value === 'yes';
    const mirrorType  = document.querySelector('input[name="mirror_type"]:checked')?.value;
    const cabinType   = document.querySelector('input[name="cabin_type"]:checked')?.value;
    const panelSide   = document.querySelector('input[name="panel_side"]:checked')?.value;

    const backBtn   = document.getElementById("backMirror");
    const leftBtn   = document.getElementById("leftMirror");
    const rightBtn  = document.getElementById("rightMirror");

    const userNames = [
        "MirrorBack","MirrorBackHalf",
        "MirrorLeft","MirrorLeftHalf",
        "MirrorRight","MirrorRightHalf"
    ];
    const wallNames = [
        "BackWallMirror",
        "LeftWallMirror","LeftWallMirror1",
        "RightWallMirror","RightWallMirror1"
    ];

    // --- 1) Если зеркал нет — показываем ВСЕ стены и выходим ---
    if (!hasMirror) {
        // блокируем UI
        document.querySelectorAll('.mirror-location-button').forEach(b => {
            b.disabled = true;
            b.classList.add('disabled');
            b.classList.remove('active');
        });
        document.querySelectorAll('input[name="mirror_type"]').forEach(r => {
            r.disabled = true;
            r.checked  = false;
        });
        // скрываем все зеркала, включаем все стены
        userNames.forEach(n => {
            const o = window.model.getObjectByName(n);
            if (o) o.visible = false;
        });
        wallNames.forEach(n => {
            const w = window.model.getObjectByName(n);
            if (w) w.visible = true;
        });
        return;
    }

    // --- 2) Зеркала включены — разблокируем UI ---
    document.querySelectorAll('input[name="mirror_type"]').forEach(r => r.disabled = false);
    [backBtn,leftBtn,rightBtn].forEach(b => {
        b.disabled = false;
        b.classList.remove('disabled');
    });

    // прячем пользовательские зеркала
    userNames.forEach(n => {
        const o = window.model.getObjectByName(n);
        if (o) o.visible = false;
    });
    // включаем все стеновые отражатели
    wallNames.forEach(n => {
        const w = window.model.getObjectByName(n);
        if (w) w.visible = true;
    });

    // --- 3) Блокируем кнопки по правилам кабины ---
    if (cabinType === "not_walk_through_cabin") {
        // непроходная: только «сзади»
        leftBtn.disabled  = true;
        leftBtn.classList.add('disabled');
        rightBtn.disabled = true;
        rightBtn.classList.add('disabled');
    } else {
        // проходная: блокируем «сзади» и стену с панелью
        backBtn.disabled = true;
        backBtn.classList.add('disabled');
        if (panelSide === "left") {
            leftBtn.disabled  = true;
            leftBtn.classList.add('disabled');
        }
        if (panelSide === "right") {
            rightBtn.disabled = true;
            rightBtn.classList.add('disabled');
        }
    }

    // --- 4) Показываем активное зеркало и, только для полного, скрываем стену ---
    const isHalf = mirrorType === "to_rail";
    const suffix = isHalf ? "Half" : "";

    // Задняя стена
    if (backBtn.classList.contains("active") && !backBtn.disabled) {
        const m = window.model.getObjectByName("MirrorBack" + suffix);
        if (m) {
            m.visible = true;
            // для полного зеркала прячем стену
            if (!isHalf) {
                const w = window.model.getObjectByName("BackWallMirror");
                if (w) w.visible = false;
            }
        }
    }

    // Левая стена
    if (leftBtn.classList.contains("active") && !leftBtn.disabled) {
        const m = window.model.getObjectByName("MirrorLeft" + suffix);
        if (m) {
            m.visible = true;
            if (!isHalf) {
                ["LeftWallMirror","LeftWallMirror1"].forEach(n => {
                    const w = window.model.getObjectByName(n);
                    if (w) w.visible = false;
                });
            }
        }
    }

    // Правая стена
    if (rightBtn.classList.contains("active") && !rightBtn.disabled) {
        const m = window.model.getObjectByName("MirrorRight" + suffix);
        if (m) {
            m.visible = true;
            if (!isHalf) {
                ["RightWallMirror","RightWallMirror1"].forEach(n => {
                    const w = window.model.getObjectByName(n);
                    if (w) w.visible = false;
                });
            }
        }
    }
}

