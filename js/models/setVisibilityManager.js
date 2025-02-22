import * as THREE from 'three';

export function setCeilingVisibility(isVisible) {
    let group = window.model.getObjectByName('Ceiling');
    group.visible = isVisible;
    group = window.model.getObjectByName('Lamp');
    group.visible = isVisible;
}

export function isCeilingVisible() {
    let group = window.model.getObjectByName('Ceiling');
    return group.visible;
}

export function setFrontVisible(isVisible) {
    const group = window.model.getObjectByName('AllFrontWallGroup');
    group.visible = isVisible;
}

export function isFrontVisible() {
    let group = window.model.getObjectByName('AllFrontWallGroup');
    return group.visible;
}