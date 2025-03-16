import { setActiveTextureWithAllWalls } from './findElementsHelper.js';

const WallTextureState = {
    left: null,
    right: null,
    front: null,
    back: null
};

export function setLeftTexture(id) {
    WallTextureState.left = id;
}

export function setRightTexture(id) {
    WallTextureState.right = id;
}

export function setFrontTexture(id) {
    WallTextureState.front = id;
}

export function setBackTexture(id) {
    WallTextureState.back = id;
}

export function setAllTextures(id) {
    setLeftTexture(id);
    setRightTexture(id);
    setFrontTexture(id);
    setBackTexture(id);
}

export function getAllWallTextures() {
    //console.log(WallTextureState);
    return WallTextureState;
}

export function setActiveWallParameters(wallParameters) {
    setActiveTextureWithAllWalls('WallsParametersTab', 'wallSideWalls', "wallTextures", wallParameters);
}
