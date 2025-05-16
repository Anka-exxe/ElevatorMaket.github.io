import * as THREE from 'three';
import * as WallTextureChoice from '../shareConfiguration/wallTexturesChoice.js';
import {setDoorTexture} from '../shareConfiguration/doorParams.js';
import {setFloorTexture} from '../shareConfiguration/floorParameters.js';
import * as Ceiling from '../shareConfiguration/ceilingParams.js';
import * as Panel from '../shareConfiguration/panelParams.js';
import {setHandrailTexture} from '../shareConfiguration/handrailParams.js';
import * as Bumper from '../shareConfiguration/otherParams.js';
import {setFrameTexture} from "../shareConfiguration/hallParams.js";
import {setTextureClassActiveByContainerName} from "../shareConfiguration/findElementsHelper.js";
import {renderer} from "./loadModel.js";

let currentCeilingTextureURL = null;
export function applyTextureToElement(
    model,
    elementNames,
    color,
    textureURL,
    alphaURL = null,
    bumpURL = null,
    aoURL = null,
    dispURL = null,
    metalURL = null,
    normURL = null,
    roughURL = null,
    materialOptions = {}
) {
    const names = Array.isArray(elementNames) ? elementNames : [elementNames];
    const loader = new THREE.TextureLoader();

    // Загрузка одной карты
    const load = url => url
        ? new Promise((res, rej) =>
            loader.load(url, tex => {
                tex.colorSpace = THREE.SRGBColorSpace;
                res(tex);
            }, undefined, rej)
        )
        : Promise.resolve(null);

    // Параллельно грузим все карты
    Promise.all([
        Promise.resolve(color),
        load(textureURL),
        load(alphaURL),
        load(bumpURL),
        load(aoURL),
        load(dispURL),
        load(metalURL),
        load(normURL),
        load(roughURL)
    ]).then(([ clr, map, alphaMap, bumpMap, aoMap, dispMap, metalMap, normMap, roughMap ]) => {

        // Всё в один массив для одинаковой настройки
        const maps = [
            { tex: map,      prop: 'map' },
            { tex: alphaMap, prop: 'alphaMap' },
            { tex: bumpMap,  prop: 'bumpMap' },
            { tex: aoMap,    prop: 'aoMap' },
            { tex: dispMap,  prop: 'displacementMap' },
            { tex: metalMap, prop: 'metalnessMap' },
            { tex: normMap,  prop: 'normalMap' },
            { tex: roughMap, prop: 'roughnessMap' },
        ];

        // Опции
        const tile      = materialOptions.tileSize;  // { x: meters, y: meters }
        const repeatOpt = materialOptions.repeat;    // { x: count,  y: count }

        // Настраиваем каждую карту
        maps.forEach(({ tex, prop }) => {
            if (!tex) return;

            // кодировка
            tex.colorSpace = (prop === 'map') ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;

            // фильтры и анизотропия
            tex.generateMipmaps = true;
            tex.minFilter      = THREE.LinearMipMapLinearFilter;
            tex.magFilter      = THREE.LinearFilter;
            tex.anisotropy     = renderer.capabilities.getMaxAnisotropy();

            // повтор / тайлинг
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

            if (tile?.x > 0 && tile?.y > 0) {
                const bbox = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3(); bbox.getSize(size);
                tex.repeat.set(size.x / tile.x, size.y / tile.y);
            }
            else if (repeatOpt?.x && repeatOpt?.y) {
                tex.repeat.set(repeatOpt.x, repeatOpt.y);
            }
            else {
                tex.repeat.set(1, 1);
            }

            tex.needsUpdate = true;
        });

        // Назначаем материал
        model.traverse(child => {
            if (!child.isMesh) return;
            if (!names.includes(child.name) && !hasAncestorWithName(child, names)) return;

            const mat = new THREE.MeshStandardMaterial({
                color: clr != null ? clr : 0xffffff,
                map:            map,
                alphaMap:       alphaMap,
                bumpMap:        bumpMap,
                bumpScale:      parseFloat(materialOptions.bumpScale)    || 0.5,
                aoMap:          aoMap,
                displacementMap: dispMap,
                displacementScale: parseFloat(materialOptions.displacementScale) || 0,
                metalnessMap:   metalMap,
                metalness:      parseFloat(materialOptions.metalness)     || 0.5,
                normalMap:      normMap,
                roughnessMap:   roughMap,
                roughness:      parseFloat(materialOptions.roughness)     || 0.8,
                emissive:       materialOptions.emissive                  || new THREE.Color(0x000000),
                emissiveIntensity: parseFloat(materialOptions.emissiveIntensity) || 0,
                transparent:    !!alphaMap
            });
            mat.needsUpdate = true;
            child.material = mat;
        });

    }).catch(err => console.error("Ошибка загрузки карт:", err));
}

function hasAncestorWithName(obj, names) {
    let p = obj.parent;
    while (p) {
        if (names.includes(p.name)) return true;
        p = p.parent;
    }
    return false;
}



export function handleTextureClick(event) {
    const img = event.currentTarget;
    const textureId = img.getAttribute('data-texture-id');
    const textureURL = img.getAttribute('data-texture-url') || null;
    const alphaURL = img.getAttribute('data-alpha-url') || null;
    const bumpUrl = img.getAttribute('data-bump-url') || null;
    const aoURL = img.getAttribute('data-ao-url') || null;
    const displacementURL = img.getAttribute('data-displacement-url') || null;
    const metalnessURL = img.getAttribute('data-metalness-url') || null;
    const roughnessURL = img.getAttribute('data-roughness-url') || null;
    const normalURL = img.getAttribute('data-normal-url') || null;

    const bumpScale = img.getAttribute('data-bump-scale') || null;
    const metalness = img.getAttribute('data-metalness') || null;
    const roughness = img.getAttribute('data-roughness') || null;
    const emissive = img.getAttribute('data-emissive-intensity') || null;
    const color = img.getAttribute('data-color') || null;
    const tileSizeY = img.getAttribute('data-tile-size-y') || null;
    const tileSizeX = img.getAttribute('data-tile-size-x') || null;

    const texturesContainer = img.closest('.textures-container');
    const tabContainer = texturesContainer.closest('.menu-container__content');
    const textureType = texturesContainer ? texturesContainer.getAttribute('data-texture-type') : null;
    const tabId = tabContainer ? tabContainer.id : null;
    let elementNames = [];


    const allImages = texturesContainer.querySelectorAll('img');
    allImages.forEach(image => {
        image.classList.remove('active');
    });

    img.classList.add('active');

//console.log(tabId)

    switch (tabId) {
        case 'WallsParametersTab':
            let activeButton = tabContainer.querySelector('.form__form-element.active');
            if (activeButton) {
                const target = activeButton.getAttribute('data-target');
                switch (target) {
                    case 'all':
                        elementNames = ['FrontWall', 'BackWall', 'LeftWall', 'RightWall','BackWall1','FrontWallСentral','BackWall1Central','FrontWallLeft','BackWall1Left'];
                        WallTextureChoice.setAllTextures(textureId);
                        break;
                    case 'front':
                        elementNames = ['FrontWall','FrontWallСentral','FrontWallLeft'];
                        WallTextureChoice.setFrontTexture(textureId);
                        break;
                    case 'back':
                        elementNames = ['BackWall','BackWall1', 'BackWall1Central','BackWall1Left'];
                        WallTextureChoice.setBackTexture(textureId);
                        break;
                    case 'left':
                        elementNames = ['LeftWall'];
                        WallTextureChoice.setLeftTexture(textureId);
                        break;
                    case 'right':
                        elementNames = ['RightWall'];
                        WallTextureChoice.setRightTexture(textureId);
                        break;
                    default:
                        console.error('Неизвестное значение data-target:', target);
                }
            } else {
                console.error('Не найдена активная кнопка выбора стены.');
                alert('Не выбрана стена, к которой необходимо применить текстуру');
            }
            break;
        case 'CeilingParametrsTab':
            if (textureType === "pattern") {
                elementNames = ['Lamp'];
                Ceiling.setCeilingPlafon(textureId);
                applyTextureToElement(
                    model,
                    elementNames,
                    color,
                    currentCeilingTextureURL ,
                    alphaURL,
                    bumpUrl,
                    aoURL,
                    displacementURL,
                    metalnessURL,
                    normalURL,
                    roughnessURL,
                    {
                        tileSize: { x: tileSizeX, y: tileSizeY },
                        metalness: metalness,
                        roughness: roughness,
                        emissive: new THREE.Color(0xffffee),
                        emissiveIntensity: emissive,
                    });
                return;
            } else if (textureType === "material") {
                Ceiling.setCeilingMaterial(textureId);
                elementNames = ['Ceiling'];
                currentCeilingTextureURL = textureURL;
            }
            break;
        case 'FloorParametrsTab':
            elementNames = ['Floor'];
            setFloorTexture(textureId);
            applyTextureToElement(
                model,
                elementNames,
                color,
                textureURL,
                alphaURL,
                bumpUrl,
                aoURL,
                displacementURL,
                metalnessURL,
                normalURL,
                roughnessURL,
                {
                    tileSize: { x: tileSizeX, y: tileSizeY },
                    bumpScale: bumpScale,
                    metalness: metalness,
                    roughness: roughness,
                    emissive: new THREE.Color(0xffffee),
                    emissiveIntensity: emissive,
                }
            );
            return;
            break;
        case 'BoardParametrsTab':
            if (textureType === "panel") {
                const image = new Image();
                image.src = textureURL;

                image.onload = () => {
                    const isVertical = image.height > image.width;
                    const isHorizontal = image.width > image.height;

                    const showDisplay = (targetNameToShow) => {
                        model.traverse((child) => {
                            if (!child.isMesh) return;

                            if (child.name === 'DisplayVertical') {
                                child.visible = (targetNameToShow === 'DisplayVertical');
                            }
                            if (child.name === 'DisplayHorisontal') {
                                child.visible = (targetNameToShow === 'DisplayHorisontal');
                            }
                        });
                    };

                    const logoTexture = new THREE.TextureLoader().load('../../baseTextures/Logo1.png');
                    const logoMaterial = new THREE.MeshStandardMaterial({
                        map: logoTexture,
                        transparent: true,
                        depthWrite: false,
                    });

                    let logoCount = 0;
                    model.traverse((child) => {
                        if (child.isMesh && child.name === 'Logo') {
                            child.material = logoMaterial;
                            child.material.needsUpdate = true;
                            logoCount++;
                        }
                    });
                    if (logoCount === 0) {
                        console.warn("❗ Ни одного объекта с именем 'Logo' не найдено");
                    }

                    if (isVertical) {
                        Panel.setBoard(textureId);
                        showDisplay('DisplayVertical');
                        applyTextureToElement(
                            model,
                            ['DisplayVertical'],
                            color,
                            textureURL,
                            alphaURL,
                            bumpUrl,
                            aoURL,
                            displacementURL,
                            metalnessURL,
                            normalURL,
                            roughnessURL,
                            {
                                bumpScale: bumpScale,
                                metalness: metalness,
                                roughness: roughness,
                                emissive: new THREE.Color(0xffffee),
                                emissiveIntensity: emissive,
                            }
                        );
                    } else if (isHorizontal) {
                        Panel.setBoard(textureId);
                        showDisplay('DisplayHorisontal');
                        applyTextureToElement(
                            model,
                            ['DisplayHorisontal'],
                            color,
                            textureURL,
                            alphaURL,
                            bumpUrl,
                            aoURL,
                            displacementURL,
                            metalnessURL,
                            normalURL,
                            roughnessURL,
                            {
                                bumpScale: bumpScale,
                                metalness: metalness,
                                roughness: roughness,
                                emissive: new THREE.Color(0xffffee),
                                emissiveIntensity: emissive,
                            }
                        );
                    } else {
                        alert("Текстура для табло индикации не имеет подходящей ориентации (должна быть прямоугольной).");
                    }
                };

                image.onerror = () => {
                    console.error("Ошибка загрузки изображения для определения ориентации.");
                };

                return;
            } else if (textureType === "panelColor") {
                Panel.setPanelMaterial(textureId);
                elementNames = ['ControlPanel'];
            }
            break;
        case 'DoorParametrsTab':
            elementNames = ['Door','DoorCentral','DoorLeft','Door1','Door1Central','Door1Left'];
            setDoorTexture(textureId);
            break;
        case 'OtherParametrsTab':
            elementNames = ['RightBumper','LeftBumper','BackBumper'];
            Bumper.setAllTextures(textureId);
            elementNames = ['RightBumper','LeftBumper','BackBumper'];
        break;
        case 'HandrailParametrsTab':
            elementNames = ['HandrailUnified','HandrailComposite'];
            setHandrailTexture(textureId);
            applyTextureToElement(
                window.model,
                elementNames,
                color,
                textureURL,
                alphaURL,
                bumpUrl,
                aoURL,
                displacementURL,
                metalnessURL,
                normalURL,
                roughnessURL,
                {
                tileSize: { x: tileSizeX, y: tileSizeY },
                bumpScale: bumpScale,
                metalness: metalness,
                roughness: roughness,
                emissive: new THREE.Color(0xffffee),
                emissiveIntensity: emissive,
                });
             break;
        case 'HallParametrsTab':

        if (textureType === "doorHall") {
            elementNames = ['ElevatorDoor'];
           
            applyTextureToElement(
                window.hallModel,
                elementNames,
                color,
                textureURL,
                alphaURL,
                bumpUrl,
                aoURL,
                displacementURL,
                metalnessURL,
                normalURL,
                roughnessURL,
                {
                    tileSize: { x: tileSizeX, y: tileSizeY },
                    bumpScale: bumpScale,
                    metalness: metalness,
                    roughness: roughness,
                    emissive: new THREE.Color(0xffffee),
                    emissiveIntensity: emissive,
                });

            elementNames = ['Door','DoorCentral','DoorLeft','Door1','Door1Central','Door1Left'];

            setDoorTexture(textureId);
            setTextureClassActiveByContainerName("doorTextures", textureId);
            break;
        } else if (textureType === "portal") {
            elementNames = ['Portal'];
            setFrameTexture(textureId);

            applyTextureToElement(
                window.hallModel,
                elementNames,
                color,
                textureURL,
                alphaURL,
                bumpUrl,
                aoURL,
                displacementURL,
                metalnessURL,
                normalURL,
                roughnessURL,
                {
                    tileSize: { x: tileSizeX, y: tileSizeY },
                    bumpScale: bumpScale,
                    metalness: metalness,
                    roughness: roughness,
                    emissive: new THREE.Color(0xffffee),
                    emissiveIntensity: emissive,
                });

            return;
        }
        default:
            console.error("Неизвестная вкладка:", tabId);
            return;
    }

    if (!model) {
        console.error("Модель еще не загружена");
        return;
    }

    applyTextureToElement(
        model,
        elementNames,
        color,
        textureURL,
        alphaURL,
        bumpUrl,
        aoURL,
        displacementURL,
        metalnessURL,
        normalURL,
        roughnessURL,
        {
            tileSize: { x: tileSizeX, y: tileSizeY },
            bumpScale: bumpScale,
            metalness: metalness,
            roughness: roughness,
            emissive: new THREE.Color(0xffffee),
            emissiveIntensity: emissive,
        }
    );
}

