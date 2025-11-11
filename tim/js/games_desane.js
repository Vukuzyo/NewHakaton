let currentDesignLevel = 0;
let designScore = 0;
let designStartTime;
let designCompletedLevels = [];
let selectedDesignOptions = {
    1: {1: null, 2: null, 3: null},
    2: {4: null, 5: null},
    3: {6: null}
};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectDesignLevel(level);
});
    });
});

function selectDesignLevel(level) {
    currentDesignLevel = parseInt(level);
    
    // Сбросить активные классы
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    // Установить активный класс
    document.querySelector(`.level-card[data-level="${level}"]`).classList.add('active');
    document.getElementById(`level${level}`).classList.add('active');
    
    // Запустить таймер
    designStartTime = new Date();
    
    // Сбросить сообщение
    document.getElementById(`designGameMessage${level}`).innerHTML = '';
    
    // Восстановить выбранные варианты
    restoreSelectedDesignOptions(level);
    
    // Обновить индикатор прогресса
    updateDesignLevelProgress();
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('designGameComplete').classList.remove('active');
}

function selectDesignOption(element, optionId) {
    const level = currentDesignLevel;
    const questionNum = optionId.charAt(0);
    
    // Сбросить выделение для всех вариантов этого вопроса
    let parentContainer;
    if (element.classList.contains('color-swatch')) {
parentContainer = element.parentElement.parentElement;
    } else {
parentContainer = element.parentElement;
    }
    
    const questionOptions = parentContainer.querySelectorAll('.option, .color-swatch, .typography-option, .composition-option');
    questionOptions.forEach(opt => {
opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    element.classList.add('selected');
    
    // Сохранить выбор
    selectedDesignOptions[level][questionNum] = optionId;
}

function restoreSelectedDesignOptions(level) {
    for (const questionNum in selectedDesignOptions[level]) {
const optionId = selectedDesignOptions[level][questionNum];
if (optionId) {
    // Попробуем найти элемент с этим optionId в разных типах элементов
    let optionElement = document.querySelector(`.option[onclick*="${optionId}"]`);
    if (!optionElement) {
optionElement = document.querySelector(`.color-swatch[onclick*="${optionId}"]`);
    }
    if (!optionElement) {
optionElement = document.querySelector(`.typography-option[onclick*="${optionId}"]`);
    }
    if (!optionElement) {
optionElement = document.querySelector(`.composition-option[onclick*="${optionId}"]`);
    }
    
    if (optionElement) {
optionElement.classList.add('selected');
const radio = optionElement.querySelector('input[type="radio"]');
if (radio) radio.checked = true;
    }
}
    }
}

function updateDesignLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < designCompletedLevels.length) {
    dot.classList.add('completed');
}

if (index === currentDesignLevel - 1) {
    dot.classList.add('current');
}
    });
}

function checkDesignSolution(level) {
    const message = document.getElementById(`designGameMessage${level}`);
    let correctAnswers = 0;
    let totalQuestions = 0;
    let feedback = '';
    
    switch(level) {
case 1:
    totalQuestions = 3;
    if (selectedDesignOptions[1][1] === '1A') correctAnswers++;
    if (selectedDesignOptions[1][2] === '2A') correctAnswers++;
    if (selectedDesignOptions[1][3] === '3A') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Отлично! Все цветовые решения верны!</div>';
highlightCorrectDesignAnswers(1, ['1A', '2A', '3A']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Попробуйте еще раз!</div>`;
highlightDesignAnswers(1, ['1A', '2A', '3A']);
    }
    break;
    
case 2:
    totalQuestions = 2;
    if (selectedDesignOptions[2][4] === '4A') correctAnswers++;
    if (selectedDesignOptions[2][5] === '5A') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Прекрасно! Все типографические и композиционные решения верны!</div>';
highlightCorrectDesignAnswers(2, ['4A', '5A']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте решения!</div>`;
highlightDesignAnswers(2, ['4A', '5A']);
    }
    break;
    
case 3:
    totalQuestions = 1;
    if (selectedDesignOptions[3][6] === '6B') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Блестяще! Анализ UX/UI выполнен верно!</div>';
highlightCorrectDesignAnswers(3, ['6B']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Анализ требует корректировки. Попробуйте еще раз!</div>`;
highlightDesignAnswers(3, ['6B']);
    }
    break;
    }
    
    message.innerHTML = feedback;
    
    if (correctAnswers === totalQuestions) {
// Начислить баллы
const points = level * 15;
designScore += points;

// Отметить уровень как пройденный
if (!designCompletedLevels.includes(level)) {
    designCompletedLevels.push(level);
}

// Обновить прогресс
updateDesignLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (designCompletedLevels.length === 3) {
completeDesignGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectDesignLevel(nextLevel);
}
    }
}, 1500);
    }
}

function highlightDesignAnswers(level, correctOptions) {
    // Сначала сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option, #level${level} .color-swatch, #level${level} .typography-option, #level${level} .composition-option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим правильные и неправильные ответы
    for (const optionId of correctOptions) {
let correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (!correctOption) {
    correctOption = document.querySelector(`.color-swatch[onclick*="${optionId}"]`);
}
if (!correctOption) {
    correctOption = document.querySelector(`.typography-option[onclick*="${optionId}"]`);
}
if (!correctOption) {
    correctOption = document.querySelector(`.composition-option[onclick*="${optionId}"]`);
}

if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
    
    // Подсветим выбранные неправильные ответы
    for (const questionNum in selectedDesignOptions[level]) {
const selectedOptionId = selectedDesignOptions[level][questionNum];
if (selectedOptionId && !correctOptions.includes(selectedOptionId)) {
    let wrongOption = document.querySelector(`.option[onclick*="${selectedOptionId}"]`);
    if (!wrongOption) {
wrongOption = document.querySelector(`.color-swatch[onclick*="${selectedOptionId}"]`);
    }
    if (!wrongOption) {
wrongOption = document.querySelector(`.typography-option[onclick*="${selectedOptionId}"]`);
    }
    if (!wrongOption) {
wrongOption = document.querySelector(`.composition-option[onclick*="${selectedOptionId}"]`);
    }
    
    if (wrongOption) {
wrongOption.classList.add('wrong-answer');
    }
}
    }
}

function highlightCorrectDesignAnswers(level, correctOptions) {
    // Сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option, #level${level} .color-swatch, #level${level} .typography-option, #level${level} .composition-option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим только правильные ответы
    for (const optionId of correctOptions) {
let correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (!correctOption) {
    correctOption = document.querySelector(`.color-swatch[onclick*="${optionId}"]`);
}
if (!correctOption) {
    correctOption = document.querySelector(`.typography-option[onclick*="${optionId}"]`);
}
if (!correctOption) {
    correctOption = document.querySelector(`.composition-option[onclick*="${optionId}"]`);
}

if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
}

function showDesignHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Для экологических организаций подходят природные тона: зеленый, коричневый, бежевый. Для медитации - спокойные холодные тона: синий, голубой, бирюзовый. Для детских центров - яркие, но не агрессивные цвета.';
    break;
case 2:
    hint = 'Для корпоративных сайтов выбирайте классические, читаемые шрифты. Для посадочных страниц важна четкая иерархия и акцент на призыв к действию.';
    break;
case 3:
    hint = 'Высокий рейтинг и короткое время заказа говорят об удобстве интерфейса. Цветовая схема должна соответствовать тематике приложения.';
    break;
    }
    
    alert(hint);
}

function resetDesignLevel(level) {
    // Сбросить выбранные варианты
    for (const questionNum in selectedDesignOptions[level]) {
selectedDesignOptions[level][questionNum] = null;
    }
    
    // Сбросить выделение
    const options = document.querySelectorAll(`#level${level} .option, #level${level} .color-swatch, #level${level} .typography-option, #level${level} .composition-option`);
    options.forEach(opt => {
opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
const radio = opt.querySelector('input[type="radio"]');
if (radio) radio.checked = false;
    });
    
    // Сбросить сообщение
    document.getElementById(`designGameMessage${level}`).innerHTML = '';
}

function completeDesignGame() {
    const endTime = new Date();
    const timeDiff = (endTime - designStartTime) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('designFinalScore').textContent = designScore;
    document.getElementById('designCompletionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('designGameComplete').classList.add('active');
}

function restartDesignGame() {
    currentDesignLevel = 0;
    designScore = 0;
    designCompletedLevels = [];
    selectedDesignOptions = {
1: {1: null, 2: null, 3: null},
2: {4: null, 5: null},
3: {6: null}
    };
    
    document.getElementById('designGameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetDesignLevel(i);
    }
    
    // Обновить прогресс
    updateDesignLevelProgress();
}