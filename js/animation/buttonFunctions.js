 
 function selectWall(button) {
    selectParameterButton(button);
}

function selectParameterButton(button) {
    const container = button.parentNode; 
    const buttons = container.querySelectorAll('button'); 
    buttons.forEach(btn => {
        btn.classList.remove('active'); 
    });
    button.classList.add('active'); 
}

function selectManyParameterButton(button) {
    button.classList.toggle('active');
}

const menuContainer = document.getElementById('menuTabs');

    menuContainer.addEventListener('wheel', (event) => {
        event.preventDefault(); // Предотвращаем стандартную вертикальную прокрутку
        menuContainer.scrollLeft += event.deltaY; // Изменяем scrollLeft
    });