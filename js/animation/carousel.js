import {fetchDesignProjects, fetchTemplates} from '../designProjectService/designProjectStorage.js';

// Получаем кнопку по ID
const backButton = document.getElementById('backButton');

// Добавляем обработчик события клика
backButton.addEventListener('click', async function() {
  const projects = await fetchDesignProjects();
  displayProjects(projects);
});

export function displayProjects(projects) {
    const projectsList = document.getElementById('cards');
    projectsList.innerHTML = ''; // Очистка предыдущих проектов
    backButton.style.display = 'none';

    projects.forEach(project => {
        // Создаем карточку проекта
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.textContent = project.name; // Предполагаем, что у проекта есть поле name

        // Обработчик клика для карточки проекта
        projectCard.onclick = async () => {
            const templates = await fetchTemplates(project.id); // Получаем шаблоны для проекта
            displayTemplates(templates); // Отображаем шаблоны
            backButton.style.display = 'block';
        };

        // Добавляем карточку проекта в список
        projectsList.appendChild(projectCard);
    });
    initCarousel();
}

export function displayTemplates(templates) {
    const templatesList = document.getElementById('cards');
    templatesList.innerHTML = ''; // Очистка предыдущих шаблонов

    if (templates && templates.length > 0) {
        templates.forEach(template => {
            // Создаем карточку шаблона
            const patternCard = document.createElement('section');
            patternCard.className = 'pattern-card';

            const title = document.createElement('p');
            title.className = 'pattern-card__title';
            title.textContent = template.name;
            patternCard.appendChild(title);

            const img = document.createElement('img');
            img.src = template.previewImageUrl;
            img.alt = template.name;
            img.className = 'pattern-img';
            
            // Ждем загрузки изображения перед инициализацией карусели
            img.onload = function() {
                setTimeout(initCarousel, 100); // Небольшая задержка для стабилизации DOM
            };
            
            patternCard.appendChild(img);

            patternCard.onclick = () => {
                try {
                    localStorage.setItem('templateConfiguration', JSON.stringify(template.configuration));
                    localStorage.setItem('templateId', JSON.stringify(template.id));
                    console.log(template.configuration);
                    window.location.href = 'configurator.html';
                } catch (error) {
                    console.error('Ошибка при парсинге JSON:', error);
                }
            };

            templatesList.appendChild(patternCard);
        });
        
        // Инициализация карусели с задержкой на случай если изображения уже загружены
        setTimeout(initCarousel, 300);
    } else {
        const noTemplatesMessage = document.createElement('p');
        noTemplatesMessage.textContent = 'Нет доступных дизайн проектов';
        templatesList.appendChild(noTemplatesMessage);
    }
}

// Инициализация
(async function init() {
    const projects = await fetchDesignProjects();
    displayProjects(projects); // Заполняем карусель проектами

})();


function initCarousel() {
    const cards = document.getElementById('cards');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const carousel = document.getElementById('carousel');
    
    if (!cards || !prevButton || !nextButton || !carousel) return;
    cards.style.transform = 'translateX(0)';
    let offset = 0;

    // Пересчитываем ширину карточки
    const firstCard = cards.children[0];
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth + 20; // Ширина карточки с учетом отступов
    const totalCards = cards.children.length; // Общее количество карточек

    const updateButtons = () => {
        if (totalCards === 0) return;
        
        const visibleCards = Math.floor(carousel.clientWidth / cardWidth);
        const maxOffset = -((totalCards * cardWidth) - (visibleCards * cardWidth));
        
        prevButton.style.display = offset < 0 ? 'block' : 'none';
        nextButton.style.display = offset > maxOffset && visibleCards < totalCards ? 'block' : 'none';

        if (totalCards * cardWidth <= carousel.clientWidth) {
            carousel.style.justifyContent = 'center';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            carousel.style.justifyContent = 'flex-start';
        }
    };

    const scrollCards = (delta) => {
        offset += delta;
        const visibleCards = Math.floor(carousel.clientWidth / cardWidth);
        const maxOffset = -((totalCards * cardWidth) - (visibleCards * cardWidth));
        
        if (offset > 0) offset = 0;
        if (offset < maxOffset) offset = maxOffset;
        
        cards.style.transform = `translateX(${offset}px)`;
        updateButtons();
    };

    prevButton.addEventListener('click', () => scrollCards(cardWidth));
    nextButton.addEventListener('click', () => scrollCards(-cardWidth));

    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', updateButtons);

    // Инициализация состояния кнопок
    updateButtons();
    
    // Принудительно обновляем карусель после небольшой задержки
   // setTimeout(updateButtons, 100);
}
  