import * as THREE from 'three';

export function applyTextureToElement(model,
    elementNames,
    color,
    textureInput = null,
    roughnessMap = null,
    materialOptions = {}) {
const elementNamesArr = Array.isArray(elementNames) ? elementNames : [elementNames];
const textureLoader = new THREE.TextureLoader();

const loadTexture = (input) => {
return new Promise((resolve, reject) => {
if (typeof input === 'string' && input) {
textureLoader.load(
input,
(tex) => {
tex.colorSpace = THREE.SRGBColorSpace;
resolve(tex);
},
undefined,
reject
);
} else {
resolve(input);
}
});
};

Promise.all([
color,
loadTexture(textureInput),
loadTexture(roughnessMap)
])
.then(([color, texture, roughnessMap]) => {
if (texture) {
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.colorSpace = THREE.SRGBColorSpace;
if (materialOptions.repeat) {
texture.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
} else {
texture.repeat.set(1, 1);
}
}

if (roughnessMap) {
roughnessMap.wrapS = THREE.RepeatWrapping;
roughnessMap.wrapT = THREE.RepeatWrapping;
if (materialOptions.repeat) {
roughnessMap.repeat.set(materialOptions.repeat.x, materialOptions.repeat.y);
} else {
roughnessMap.repeat.set(1, 1);
}
}

model.traverse((child) => {
if (child.isMesh && (elementNamesArr.includes(child.name) || hasAncestorWithName(child, elementNamesArr))) {
const newMaterial = new THREE.MeshStandardMaterial({
color: color !== undefined ? color : 0xffffff,
map: texture,
roughnessMap: roughnessMap,
metalness: (materialOptions.metalness !== undefined && materialOptions.metalness !== null && materialOptions.metalness !== "null")
? parseFloat(materialOptions.metalness)
: 0.5,
roughness: (materialOptions.roughness !== undefined && materialOptions.roughness !== null && materialOptions.roughness !== "null")
? parseFloat(materialOptions.roughness)
: 0.8,
emissive: materialOptions.emissive !== undefined ? materialOptions.emissive : new THREE.Color(0xffffff),
emissiveIntensity: materialOptions.emissiveIntensity !== undefined ? parseFloat(materialOptions.emissiveIntensity) : 0
});
newMaterial.needsUpdate = true;
child.material = newMaterial;
}
});
})
.catch((error) => {
console.error("Ошибка загрузки текстуры:", error);
});
}

function hasAncestorWithName(object, names) {
let parent = object.parent;
while (parent) {
if (names.includes(parent.name)) return true;
parent = parent.parent;
}
return false;
}

export function InitializeHallTextures() {
    
}