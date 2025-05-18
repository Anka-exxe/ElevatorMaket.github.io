import * as THREE from 'three';
import {lamp1, lamp2} from "./elementNames.js";

export function GetLamp1Size() {
    console.log(lamp1);
    const element = window.model.getObjectByName(lamp1);
    console.log(window.model);
    console.log(element);
    const box = new THREE.Box3().setFromObject(element);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
        x: size.x,
        y: size.z
    }; 
}

export function GetLamp2Size() {
    const element = window.model.getObjectByName(lamp2);
    const box = new THREE.Box3().setFromObject(element);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
        x: size.x,
        y: size.z
    }; 
}

