import {showTab} from "../animation/tabFunctions.js";

export function findImageByTextureId(textureId) {
    const imgElement = document.querySelector(`img[data-texture-id="${textureId}"]`);
    return imgElement;
}

export function setTextureActiveById(textureId) {
    const texture = findImageByTextureId(textureId);
    texture.click();
}

export function getRadioParamByInputName(inputName) {
    const radios = document.querySelectorAll(`input[name="${inputName}"]`);
    for (const radio of radios) {
        if (radio.checked) {
            return radio.id;
        }
    }
    return '';
}

export function getButtonParamByFormName(formName) {
    const form = document.forms[formName];
    const activeButton = form.querySelector('.form__form-element.active');
    return activeButton ? activeButton.id : '';
}

export function setActiveRadioByInputName(inputName, radioId) {
    const radios = document.querySelectorAll(`input[name="${inputName}"]`);

    if(!radios) {
        console.error(' radios not found.');
        throw new Error('radios  not found.');
    }

    radios.forEach(radio => {
        if (radio.id === radioId) {
            radio.click(); 
            radio.checked = true;
        }
    });
}

export function setActiveButtonByFormName(formName, buttonId) {
    const form = document.forms[formName];
    const activeButton = form.querySelector(`.form__form-element#${buttonId}`);
    activeButton.click();
}

export function setActiveCabinSizeByFormName(formName, buttonId) {
    const form = document.forms[formName];
    const activeButton = form.querySelector(`.form__form-element#${buttonId}`);
    
    // Убираем класс .active у всех элементов формы
    const allButtons = form.querySelectorAll('.form__form-element');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Добавляем класс .active к активной кнопке
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

export async function setActiveTextureWithAllWalls(tabName, formName, textureContainerName, parameters) {
    await showTab(tabName);

    const form = document.forms[formName];

    if (!form) {
        console.error('Form with name "wallSideWalls" not found.');
        return; 
    }

    let wallSides;

  
    wallSides = ['left', 'right', 'front', 'back'];
    

    wallSides.forEach(side => {
        const button = form.querySelector(`button[data-target="${side}"]`);
        if (button) {
            button.classList.remove('active');
        }
    });

    const texturesContainer = document.querySelector(`div[name="${textureContainerName}"]`);
    if (!texturesContainer) {
        console.error('Textures container not found.');
        return;
    }

    wallSides.forEach(side => {
        const textureId = parameters[side];

        const button = form.querySelector(`button[data-target="${side}"]`);
        if (button) {
            button.click();
        }

        if (textureId) {
            const texture = texturesContainer.querySelector(`img[data-texture-id="${textureId}"]`);
            texture.click();
        }

        button.classList.remove('active');
    });

    const button = form.querySelector(`button[data-target=all]`);
        if (button) {
            button.classList.add('active');
        }
}

export async function setActiveFirstTextureByContainerName(textureContainerName) {
    const texturesContainer = document.querySelector(`div[name="${textureContainerName}"]`);
    if (!texturesContainer) {
        console.error('Textures container not found.');
        throw new Error('Textures container not found.');
    }

    // Находим первую текстуру в контейнере
    const firstTexture = texturesContainer.querySelector('img[data-texture-id]');
    if (firstTexture) {
        firstTexture.click(); // Вызываем событие клика на первой текстуре
    } else {
        console.warn('No textures found in the container.');
    }
}

export async function setActiveTextureByContainerName(tabName, textureContainerName, textureId) {
    await showTab(tabName);

    const texturesContainer = document.querySelector(`div[name="${textureContainerName}"]`);
    if (!texturesContainer) {
        console.error('Textures container not found.');
        throw new Error('Textures container not found.');
       
        return;
    }

    if (textureId) {
        const texture = texturesContainer.querySelector(`img[data-texture-id="${textureId}"]`);
        //console.log(texture);
        texture.click();
    }
}


export async function setActiveTextureByContainerNameHallVersion(textureContainerName, textureId) {
    const texturesContainer = document.querySelector(`div[name="${textureContainerName}"]`);
    if (!texturesContainer) {
        console.error('Textures container not found.');
        throw new Error('Textures container not found.');
       
        return;
    }

    if (textureId) {
        const texture = texturesContainer.querySelector(`img[data-texture-id="${textureId}"]`);
        //console.log(texture);
        texture.click();
    }
}

export async function removeTextureClassesActiveByContainerName(textureContainerName) {
    const texturesContainer = document.querySelector(`div[name="${textureContainerName}"]`);
    if (!texturesContainer) {
        console.error('Textures container not found.');
        throw new Error('Textures container not found.');
    }
    
     // Удаляем класс 'active' у всех текстур
    const allTextures = texturesContainer.querySelectorAll('img[data-texture-id]');
    allTextures.forEach(texture => {
        texture.classList.remove('active');
    });
}

export async function setTextureClassActiveByContainerName(textureContainerName, textureId) {
    const texturesContainer = document.querySelector(`div[name="${textureContainerName}"]`);
    if (!texturesContainer) {
        console.error('Textures container not found.');
        throw new Error('Textures container not found.');
    }
    
    if (textureId) {
        // Находим выбранную текстуру
        const activeTexture = texturesContainer.querySelector(`img[data-texture-id="${textureId}"]`);
        
        // Удаляем класс 'active' у всех текстур
        const allTextures = texturesContainer.querySelectorAll('img[data-texture-id]');
        allTextures.forEach(texture => {
            if (texture !== activeTexture) {
                texture.classList.remove('active');
            }
        });
    
        // Добавляем класс 'active' к текущей текстуре
        activeTexture.classList.add('active');
    }
}

export function isButtonActiveById(id) {
    const button = document.getElementById(id);

    return button.classList.contains('active');
}

export function setButtonActiveById(id) {
    const button = document.getElementById(id);
    button.click();
}