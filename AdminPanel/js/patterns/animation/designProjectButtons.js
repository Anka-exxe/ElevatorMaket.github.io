let isEditMode = false; // Флаг для режима редактирования

document.getElementById('addDesignProjectBtn').addEventListener('click', function() {
    isEditMode = false; // Устанавливаем режим добавления
    document.getElementById('designProjectModal').style.display = 'block';
    document.getElementById('projectNameInput').value = ''; // Очистка поля для нового проекта
});

document.querySelectorAll('.editDesignProjectBtn').forEach(button => {
    button.addEventListener('click', function() {
        isEditMode = true; // Устанавливаем режим редактирования
        const projectName = this.closest('.designProjectHeader').querySelector('.title').innerText;
        document.getElementById('designProjectModal').style.display = 'block';
        document.getElementById('projectNameInput').value = projectName; // Заполнение поля названием проекта
    });
});

/*document.querySelectorAll('.editPatternBtn').forEach(button => {
    button.addEventListener('click', function() {
        isEditMode = true; // Устанавливаем режим редактирования
        const patternName = this.closest('.pattern-card').querySelector('strong').innerText;
        document.getElementById('modal').style.display = 'block';
        document.getElementById('projectNameInput').value = patternName; // Заполнение поля названием паттерна
    });
});*/

// Обработчик для удаления дизайн-проекта
document.querySelectorAll('.deleteDesignProjectBtn').forEach(button => {
    button.addEventListener('click', function() {
        const projectName = this.closest('.designProjectHeader').querySelector('.title').innerText;
        const confirmation = confirm('При удалении проекта "' + projectName + '" будут удалены все связанные с ним шаблоны.');
        if (confirmation) {
            // Здесь можно добавить логику для удаления проекта
           let confirmationDelete = confirm('Вы уверены, что хотите удалить весь дизайн проект?');

           if(confirmationDelete) {
            alert('Дизайн-проект "' + projectName + '" удален.');
            // Логика для удаления элемента из DOM или из базы данных
           }
        }
    });
});

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('designProjectModal').style.display = 'none';
});

document.getElementById('cancelAddProjectBtn').addEventListener('click', function() {
    document.getElementById('designProjectModal').style.display = 'none';
});

document.getElementById('confirmAddProjectBtn').addEventListener('click', function() {
    const projectName = document.getElementById('projectNameInput').value;
    if (projectName) {
        if (isEditMode) {
            alert('Дизайн-проект "' + projectName + '" изменен.');
        } else {
            alert('Дизайн-проект "' + projectName + '" добавлен.');
        }
        document.getElementById('designProjectModal').style.display = 'none';
        document.getElementById('projectNameInput').value = ''; // Очистка поля ввода
    } else {
        alert('Пожалуйста, введите название проекта.');
    }
});

//Поиск по проекту
document.getElementById('designProjectSelect').addEventListener('change', function() {
    const selectedValue = this.value;
    const projects = document.querySelectorAll('.designProjectCard');

    projects.forEach(project => {
        if (selectedValue === 'all' || project.getAttribute('data-category') === selectedValue) {
            project.style.display = 'block'; // Показываем проект
        } else {
            project.style.display = 'none'; // Скрываем проект
        }
    });
});