const colorPickers = document.querySelectorAll('.color-picker');
    const colorInputs = document.querySelectorAll('input[type="color"]');

    colorPickers.forEach((picker, index) => {
        picker.addEventListener('click', () => {
            colorInputs[index].click(); // Открываем соответствующий выбор цвета
        });
    });

    colorInputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const selectedColor = event.target.value;
            colorPickers[index].style.backgroundColor = selectedColor; // Обновляем цвет кружка
        });
    });