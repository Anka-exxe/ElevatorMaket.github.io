export const WALL = 'WALL';
export const DOOR = 'DOOR';
export const FLOOR = 'FLOOR';
export const CEILING = 'CEILING';
export const CEILING_MATERIAL = 'CEILING_MATERIAL';
export const CONTROL_PANEL = 'CONTROL_PANEL';
export const INDICATION_BOARD = 'INDICATION_BOARD';
export const HANDRAIL = 'HANDRAIL';
export const BUMPER = 'BUMPER';

const host = "http://configurator-service/api/v1/";

export const urlTemplateGetIcons = `${host}icons?page=0&size=1000`;
export const urlTemplateGetTextureByIconId = `${host}textures/icon/{}`;
export const urlTemplateGetWordFile = `${host}elevators/documents`;
export const urlTemplateGetDesignProjects = `${host}design-projects?page=0&size=100`;
export const urlTemplateGetPatternsByDesignProjectId = `${host}design-projects/{}/templates?page=0&size=40`;
export const urlTemplateSendFile = `${host}elevators/documents/email?email={}`;

export function getUrl(urlTemplate, parameter) {
    return urlTemplate.replace('{}', parameter);
}