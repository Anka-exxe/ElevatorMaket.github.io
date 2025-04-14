window.selectParameterButton = function(button) {
    const container = button.parentNode;
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    console.log("Selected button: " + button);
    const idToSize = {
        wideSize: 'wide',
        squareSize: 'square',
        deepSize: 'deep'
    };

    if (idToSize[button.id]) {
        import('../models/loadModel.js').then(module => {
           // module.loadModelBySize(idToSize[button.id]);
        });
    }
};

window.selectWall = function(button) {
    window.selectParameterButton(button);
};
