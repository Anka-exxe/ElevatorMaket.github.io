export const WALL = 'WALL';
export const DOOR = 'DOOR';
export const FLOOR = 'FLOOR';
export const CEILING = 'CEILING';
export const CEILING_MATERIAL = 'CEILING_MATERIAL';
export const CONTROL_PANEL = 'CONTROL_PANEL';
export const HANDRAIL = 'HANDRAIL';
export const BUMPER = 'BUMPER';

const host = "http://localhost:8090/api/v1/";

export const urlTemplateGetIconsByType = `${host}icons/{}?page=0&size=100`;
export const urlTemplateGetTextureByIconId = `${host}textures/icon/{}`;

export function getUrl(urlTemplate, parameter) {
    return urlTemplate.replace('{}', parameter);
}