document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('deletePatternButton');
    saveButton.addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите удалить шаблон?")) 
        {
            alert("Шаблон удалён");
        } else {
            alert("Удаление отменено");
        }    
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('savePatternButton');
    saveButton.addEventListener('click', () => {
        if(checkIfProjectNameIsEmpty()) {
            alert("Название проекта не заполнено");
        }
        else {
            if (confirm("Вы уверены, что хотите сохранить все изменения?")) 
        {
            alert("Изменения сохранены");
        } else {
            alert("Шаблон не был сохранён");
        }  
        }
    });
});

function checkIfProjectNameIsEmpty() {
    const projectTitleInput = document.getElementById('projectTitle');

    if (projectTitleInput.value.trim() === '') {
        console.log("Поле 'Название проекта' пустое.");
        return true; 
    } else {
        console.log("Поле 'Название проекта' заполнено.");
        return false;
    }
}