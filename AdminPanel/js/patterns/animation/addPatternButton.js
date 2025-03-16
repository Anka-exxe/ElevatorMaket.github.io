document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('deletePatternButton');
    saveButton.addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите отменить изменения и вернуться в административную панель?")) 
        {
            alert("Изменения отменены");
        } else {
            alert("Продолжайте работать");
        }    
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('savePatternButton');
    saveButton.addEventListener('click', () => {
        if(checkIfProjectNameIsEmpty()) {
            alert("Название проекта не заполнено");
        } else if (checkIfPreviewImageIsEmpty()){
            alert("Превью проекта не заполнено");
        } else {
            if (confirm("Вы уверены, что хотите сохранить все изменения?")) {
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

function checkIfPreviewImageIsEmpty() {
    const input = document.getElementById('patternPreview');
    return input.files.length <= 0;
}

document.getElementById('patternPreview').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview-pattern');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="pattern-img">`;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector('.clear-file-btn').addEventListener('click', function() {
    document.getElementById('patternPreview').value = '';
    document.getElementById('preview-pattern').innerHTML = '';
});