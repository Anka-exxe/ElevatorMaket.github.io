import * as Element from "./elementNames.js";

export function setCeilingVisibility(isVisible) {
    let group = window.model.getObjectByName(Element.ceilingGroup);
    group.visible = isVisible;
    group = window.model.getObjectByName(Element.lampGroup);
    group.visible = isVisible;
}

export function isCeilingVisible() {
    let group = window.model.getObjectByName(Element.ceilingGroup);
    return group.visible;
}

export function setFrontVisible(isVisible) {
    const group = window.model.getObjectByName(Element.frontGroup);
    group.visible = isVisible;
}

export function isFrontVisible() {
    let group = window.model.getObjectByName(Element.frontGroup);
    return group.visible;
}

export function setWallVisibleByGroupName(groupName, isGroupVisible) {
    switch (groupName) {
        case Element.leftGroup:
            SetWallWithHandrailVisible('leftHandrailButton', groupName,
            isGroupVisible, Element.leftBumper,
            Element.compositeHandrails.leftSide, Element.unifiedHandrails.leftSide);
            break;
        case Element.rightGroup:
            SetWallWithHandrailVisible('rightHandrailButton', groupName,
            isGroupVisible, Element.rightBumper,
            Element.compositeHandrails.rightSide, Element.unifiedHandrails.rightSide);
            break;
        case Element.frontGroup:
            setWallVisible(groupName, isGroupVisible);
            break;
        case Element.backGroup:
            
            let isWalkThrough = document.getElementById('walk_through_cabin');

            if(isWalkThrough.checked) {
                setWallVisible(groupName, isGroupVisible);
            } else {
                SetWallWithHandrailVisible('backHandrailButton', groupName,
                isGroupVisible, Element.backBumper,
                Element.compositeHandrails.backSide, Element.unifiedHandrails.backSide);
            }

            break;
    }
}

export function SetWallWithHandrailVisible (
    handrailButtonName, groupName, 
    isGroupVisible, bumperName, 
    compositeHandrailName, unifiedHandrailName) {
    let handrailButton = document.getElementById(handrailButtonName);
    let handrailIsActive = handrailButton.classList.contains('active')

    if (handrailIsActive) {
        let isHandrailComposite = document.getElementById('composite');

        if (isHandrailComposite.checked) {
            setWallVisible(groupName, isGroupVisible, 
                bumperName, 
                compositeHandrailName);
        } else {
            setWallVisible(groupName, isGroupVisible, 
                bumperName, 
                unifiedHandrailName);
        }
    } else {
        setWallVisible(groupName, isGroupVisible, bumperName);
    }
}

export function setWallVisible(
    groupName, isGroupVisible,
    bumperName = "", handrailName = "") {
    let group = window.model.getObjectByName(groupName);
    group.visible = isGroupVisible;

    if(bumperName) {
        let bumper = window.model.getObjectByName(bumperName);
        bumper.visible = isGroupVisible;
    }  
    if(handrailName) {
        let handrail = window.model.getObjectByName(handrailName);
        handrail.visible = isGroupVisible;
    }
}


const doorNames = ['Door', 'DoorCentral', 'DoorLeft'];
let hiddenDoorName = null;

export function setDoorOpen(isOpen) {
        if(isOpen) {
            doorNames.forEach(name => {
                const object = window.model.getObjectByName(name);
                if (object && object.visible) {
                    hiddenDoorName = name;
                    object.visible = false;
                }
            });
        } else {
            if(hiddenDoorName) {
                let element = window.model.getObjectByName(hiddenDoorName);
                element.visible = true;
            }
        }
}

export function setPortalVisible(isVisible) {
    const portalGroup = window.hallModel.getObjectByName(Element.portalGroup);
    portalGroup.visible = isVisible;
}