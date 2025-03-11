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

export function getLeftTexture() {
    return WallTextureState.left;
}

export function getRightTexture() {
    return WallTextureState.right;
}

export function getFrontTexture() {
    return WallTextureState.front;
}

export function getBackTexture() {
    return WallTextureState.back;
}

export function getAllWallTextures() {
    console.log(WallTextureState);
    return WallTextureState;
}