import * as THREE from 'three';

export function GetExtremeZPoint() {
    const element = window.model.getObjectByName('Floor');
    const box = new THREE.Box3().setFromObject(element);
    const size = new THREE.Vector3();
    box.getSize(size);
    return Math.ceil(size.z / 2); 
}

export function GetExtremeXPoint() {
    const element = window.model.getObjectByName('Floor');
    const box = new THREE.Box3().setFromObject(element);
    const size = new THREE.Vector3();
    box.getSize(size);
    return Math.ceil(size.x / 2); 
}

export function GetExtremeYPoint() {
    const element = window.model.getObjectByName('LeftWall4');
    const box = new THREE.Box3().setFromObject(element);
    const size = new THREE.Vector3();
    box.getSize(size);
    return Math.ceil(size.y); 
}
