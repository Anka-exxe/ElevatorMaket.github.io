import * as THREE from 'three';
import {setDoorOpen} from "../models/setVisibilityManager.js";

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    toggleSwitch.addEventListener('change', toggleDoor);
});

function toggleDoor() {
    const checkbox = document.getElementById('toggleSwitch');
    setDoorOpen(checkbox.checked);
}