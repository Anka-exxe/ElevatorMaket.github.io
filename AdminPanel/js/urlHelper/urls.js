export const WALL = 'WALL';
export const DOOR = 'DOOR';
export const FLOOR = 'FLOOR';
export const CEILING = 'CEILING';
export const CEILING_MATERIAL = 'CEILING_MATERIAL';
export const CONTROL_PANEL = 'CONTROL_PANEL';
export const INDICATION_BOARD = 'INDICATION_BOARD';
export const HANDRAIL = 'HANDRAIL';
export const BUMPER = 'BUMPER';

const host = "http://localhost:8090/api/v1/";

export const urlTemplateGetIconsByType = `${host}icons/{}?page=0&size=100`;
export const urlTemplateGetTextureByIconId = `${host}textures/icon/{}`;

export const urlTemplateGetDesignProjects = `${host}design-projects?page=0&size=100`;
export const urlTemplateGetPatternsByDesignProjectId = `${host}design-projects/{}/templates?page=0&size=40`;
export const urlTemplateCreateNewDesignProject = `${host}design-projects`;
export const urlTemplateUpdateDesignProject = `${host}design-projects/{}`;
export const urlTemplateDeleteDesignProject = `${host}design-projects/{}`;
export const urlTemplateCreateNewPattern = `${host}project-templates`;
export const urlTemplateDeletePattern = `${host}project-templates/{}`;
export const urlGetTemplateById= `${host}project-templates/{}`;

export function getUrl(urlTemplate, parameter) {
    return urlTemplate.replace('{}', parameter);
}