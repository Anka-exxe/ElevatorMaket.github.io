window.markParameterButton = function(button) {
    //Если кнопка уже активна — выходим
    if (button.classList.contains('active')) {
        console.log('Кнопка уже активна, действие не требуется:', button.id);
        return;
    }

    const container = button.parentNode;
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    console.log("Выбрана кнопка: " + button.id);

    const idToSize = {
        wideSize: 'wide',
        squareSize: 'square',
        deepSize: 'deep'
    };

    if (idToSize[button.id]) {
        import('../models/loadModel.js').then(module => {
            module.loadModelBySize(idToSize[button.id]);
        });
    }
};


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[name="cabinSizeForm"] button').forEach(btn => {
        btn.addEventListener('click', () => {
            window.markParameterButton(btn);
        });
    });
});
