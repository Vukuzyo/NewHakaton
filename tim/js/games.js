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


/****************************************************** */


let currentAccountingLevel = 0;
let accountingScore = 0;
let accountingStartTime;
let accountingCompletedLevels = [];
let selectedOptions = {
    1: {1: null, 2: null, 3: null},
    2: {4: null, 5: null},
    3: {6: null}
};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectAccountingLevel(level);
});
    });
});

function selectAccountingLevel(level) {
    currentAccountingLevel = parseInt(level);
    
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
    accountingStartTime = new Date();
    
    // Сбросить сообщение
    document.getElementById(`accountingGameMessage${level}`).innerHTML = '';
    
    // Восстановить выбранные варианты
    restoreSelectedOptions(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('accountingGameComplete').classList.remove('active');
}

function selectAccountingOption(element, optionId) {
    const level = currentAccountingLevel;
    const questionNum = optionId.charAt(0);
    
    // Сбросить выделение для всех вариантов этого вопроса
    const questionOptions = element.parentElement.querySelectorAll('.option');
    questionOptions.forEach(opt => {
opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    element.classList.add('selected');
    
    // Сохранить выбор
    selectedOptions[level][questionNum] = optionId;
}

function restoreSelectedOptions(level) {
    for (const questionNum in selectedOptions[level]) {
const optionId = selectedOptions[level][questionNum];
if (optionId) {
    const optionElement = document.querySelector(`.option[onclick*="${optionId}"]`);
    if (optionElement) {
optionElement.classList.add('selected');
const radio = optionElement.querySelector('input[type="radio"]');
if (radio) radio.checked = true;
    }
}
    }
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < accountingCompletedLevels.length) {
    dot.classList.add('completed');
}

if (index === currentAccountingLevel - 1) {
    dot.classList.add('current');
}
    });
}

function checkAccountingSolution(level) {
    const message = document.getElementById(`accountingGameMessage${level}`);
    let correctAnswers = 0;
    let totalQuestions = 0;
    let feedback = '';
    
    switch(level) {
case 1:
    totalQuestions = 3;
    if (selectedOptions[1][1] === '1A') correctAnswers++;
    if (selectedOptions[1][2] === '2A') correctAnswers++;
    if (selectedOptions[1][3] === '3A') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Отлично! Все проводки верны!</div>';
highlightCorrectAnswers(1, ['1A', '2A', '3A']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Попробуйте еще раз!</div>`;
highlightAnswers(1, ['1A', '2A', '3A']);
    }
    break;
    
case 2:
    totalQuestions = 2;
    if (selectedOptions[2][4] === '4B') correctAnswers++;
    if (selectedOptions[2][5] === '5A') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Прекрасно! Все расчеты верны!</div>';
highlightCorrectAnswers(2, ['4B', '5A']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте расчеты!</div>`;
highlightAnswers(2, ['4B', '5A']);
    }
    break;
    
case 3:
    totalQuestions = 1;
    if (selectedOptions[3][6] === '6B') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Блестяще! Финансовый анализ выполнен верно!</div>';
highlightCorrectAnswers(3, ['6B']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Анализ требует корректировки. Попробуйте еще раз!</div>`;
highlightAnswers(3, ['6B']);
    }
    break;
    }
    
    message.innerHTML = feedback;
    
    if (correctAnswers === totalQuestions) {
// Начислить баллы
const points = level * 15;
accountingScore += points;

// Отметить уровень как пройденный
if (!accountingCompletedLevels.includes(level)) {
    accountingCompletedLevels.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (accountingCompletedLevels.length === 3) {
completeAccountingGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectAccountingLevel(nextLevel);
}
    }
}, 1500);
    }
}

function highlightAnswers(level, correctOptions) {
    // Сначала сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим правильные и неправильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
    
    // Подсветим выбранные неправильные ответы
    for (const questionNum in selectedOptions[level]) {
const selectedOptionId = selectedOptions[level][questionNum];
if (selectedOptionId && !correctOptions.includes(selectedOptionId)) {
    const wrongOption = document.querySelector(`.option[onclick*="${selectedOptionId}"]`);
    if (wrongOption) {
wrongOption.classList.add('wrong-answer');
    }
}
    }
}

function highlightCorrectAnswers(level, correctOptions) {
    // Сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим только правильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
}

function showAccountingHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Запомните основные проводки: Дт 08 Кт 60 - приобретение ОС, Дт 70 Кт 50 - выдача зарплаты из кассы, при реализации отражаем выручку (Дт 62 Кт 90.1), себестоимость (Дт 90.2 Кт 41) и НДС (Дт 90.3 Кт 68).';
    break;
case 2:
    hint = 'Налог на прибыль = (Выручка - Расходы) × 20%. Амортизация линейным методом = Первоначальная стоимость / Срок полезного использования в месяцах.';
    break;
case 3:
    hint = 'Рассчитайте коэффициенты: Рентабельность = Прибыль/Выручка, Ликвидность = Оборотные активы/Краткосрочные обязательства. Сравните показатели за два года.';
    break;
    }
    
    alert(hint);
}

function resetAccountingLevel(level) {
    // Сбросить выбранные варианты
    for (const questionNum in selectedOptions[level]) {
selectedOptions[level][questionNum] = null;
    }
    
    // Сбросить выделение
    const options = document.querySelectorAll(`#level${level} .option`);
    options.forEach(opt => {
opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
const radio = opt.querySelector('input[type="radio"]');
if (radio) radio.checked = false;
    });
    
    // Сбросить сообщение
    document.getElementById(`accountingGameMessage${level}`).innerHTML = '';
}

function completeAccountingGame() {
    const endTime = new Date();
    const timeDiff = (endTime - accountingStartTime) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('accountingFinalScore').textContent = accountingScore;
    document.getElementById('accountingCompletionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('accountingGameComplete').classList.add('active');
}

function restartAccountingGame() {
    currentAccountingLevel = 0;
    accountingScore = 0;
    accountingCompletedLevels = [];
    selectedOptions = {
1: {1: null, 2: null, 3: null},
2: {4: null, 5: null},
3: {6: null}
    };
    
    document.getElementById('accountingGameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetAccountingLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}


/****************************************************************** */


let currentElectricalLevel = 0;
let electricalScore = 0;
let electricalStartTime;
let electricalCompletedLevels = [];
let selectedOptionsw = {
    1: {1: null, 2: null, 3: null},
    2: {4: null, 5: null},
    3: {6: null, 7: null}
};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectElectricalLevel(level);
});
    });
});

function selectElectricalLevel(level) {
    currentElectricalLevel = parseInt(level);
    
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
    electricalStartTime = new Date();
    
    // Сбросить сообщение
    document.getElementById(`electricalGameMessage${level}`).innerHTML = '';
    
    // Восстановить выбранные варианты
    restoreSelectedOptions(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('electricalGameComplete').classList.remove('active');
}

function selectElectricalOption(element, optionId) {
    const level = currentElectricalLevel;
    const questionNum = optionId.charAt(0);
    
    // Сбросить выделение для всех вариантов этого вопроса
    const questionOptions = element.parentElement.querySelectorAll('.option');
    questionOptions.forEach(opt => {
opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    element.classList.add('selected');
    
    // Сохранить выбор
    selectedOptionsw[level][questionNum] = optionId;
}

function restoreSelectedOptions(level) {
    for (const questionNum in selectedOptionsw[level]) {
const optionId = selectedOptionsw[level][questionNum];
if (optionId) {
    const optionElement = document.querySelector(`.option[onclick*="${optionId}"]`);
    if (optionElement) {
optionElement.classList.add('selected');
const radio = optionElement.querySelector('input[type="radio"]');
if (radio) radio.checked = true;
    }
}
    }
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < electricalCompletedLevels.length) {
    dot.classList.add('completed');
}

if (index === currentElectricalLevel - 1) {
    dot.classList.add('current');
}
    });
}

function checkElectricalSolution(level) {
    const message = document.getElementById(`electricalGameMessage${level}`);
    let correctAnswers = 0;
    let totalQuestions = 0;
    let feedback = '';
    
    switch(level) {
case 1:
    totalQuestions = 3;
    if (selectedOptionsw[1][1] === '1B') correctAnswers++;
    if (selectedOptionsw[1][2] === '2B') correctAnswers++;
    if (selectedOptionsw[1][3] === '3C') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Отлично! Все расчеты верны!</div>';
highlightCorrectAnswers(1, ['1B', '2B', '3C']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте расчеты!</div>`;
highlightAnswers(1, ['1B', '2B', '3C']);
    }
    break;
    
case 2:
    totalQuestions = 2;
    if (selectedOptionsw[2][4] === '4B') correctAnswers++;
    if (selectedOptionsw[2][5] === '5B') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Прекрасно! Все расчеты верны!</div>';
highlightCorrectAnswers(2, ['4B', '5B']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте расчеты!</div>`;
highlightAnswers(2, ['4B', '5B']);
    }
    break;
    
case 3:
    totalQuestions = 2;
    if (selectedOptionsw[3][6] === '6B') correctAnswers++;
    if (selectedOptionsw[3][7] === '7B') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Блестяще! Все ответы верны!</div>';
highlightCorrectAnswers(3, ['6B', '7B']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте ответы!</div>`;
highlightAnswers(3, ['6B', '7B']);
    }
    break;
    }
    
    message.innerHTML = feedback;
    
    if (correctAnswers === totalQuestions) {
// Начислить баллы
const points = level * 15;
electricalScore += points;

// Отметить уровень как пройденный
if (!electricalCompletedLevels.includes(level)) {
    electricalCompletedLevels.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (electricalCompletedLevels.length === 3) {
completeElectricalGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectElectricalLevel(nextLevel);
}
    }
}, 1500);
    }
}

function highlightAnswers(level, correctOptions) {
    // Сначала сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим правильные и неправильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
    
    // Подсветим выбранные неправильные ответы
    for (const questionNum in selectedOptionsw[level]) {
const selectedOptionId = selectedOptionsw[level][questionNum];
if (selectedOptionId && !correctOptions.includes(selectedOptionId)) {
    const wrongOption = document.querySelector(`.option[onclick*="${selectedOptionId}"]`);
    if (wrongOption) {
wrongOption.classList.add('wrong-answer');
    }
}
    }
}

function highlightCorrectAnswers(level, correctOptions) {
    // Сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим только правильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
}

function showElectricalHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Закон Ома: I = U/R (ток = напряжение / сопротивление). Мощность: P = U×I (мощность = напряжение × ток). При последовательном соединении сопротивления складываются: Rобщ = R1 + R2.';
    break;
case 2:
    hint = 'При параллельном соединении: 1/Rобщ = 1/R1 + 1/R2. В последовательной цепи ток одинаков во всех элементах, сначала найдите общее сопротивление, затем ток по закону Ома.';
    break;
case 3:
    hint = 'При поиске неисправностей всегда отключайте питание! Безопасное расстояние до токоведущих частей до 1000 В - 0.6 метра.';
    break;
    }
    
    alert(hint);
}

function resetElectricalLevel(level) {
    // Сбросить выбранные варианты
    for (const questionNum in selectedOptionsw[level]) {
selectedOptionsw[level][questionNum] = null;
    }
    
    // Сбросить выделение
    const options = document.querySelectorAll(`#level${level} .option`);
    options.forEach(opt => {
opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
const radio = opt.querySelector('input[type="radio"]');
if (radio) radio.checked = false;
    });
    
    // Сбросить сообщение
    document.getElementById(`electricalGameMessage${level}`).innerHTML = '';
}

function completeElectricalGame() {
    const endTime = new Date();
    const timeDiff = (endTime - electricalStartTime) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('electricalFinalScore').textContent = electricalScore;
    document.getElementById('electricalCompletionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('electricalGameComplete').classList.add('active');
}

function restartElectricalGame() {
    currentElectricalLevel = 0;
    electricalScore = 0;
    electricalCompletedLevels = [];
    selectedOptionsw = {
1: {1: null, 2: null, 3: null},
2: {4: null, 5: null},
3: {6: null, 7: null}
    };
    
    document.getElementById('electricalGameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetElectricalLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}


/***************************************************************************************************************** */


let currentElectronicLevel = 0;
let electronicScore = 0;
let electronicStartTime;
let electronicCompletedLevels = [];
let selectedOptionsq = {
    1: {1: null, 2: null, 3: null},
    2: {4: null, 5: null},
    3: {6: null}
};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectElectronicLevel(level);
});
    });
});

function selectElectronicLevel(level) {
    currentElectronicLevel = parseInt(level);
    
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
    electronicStartTime = new Date();
    
    // Сбросить сообщение
    document.getElementById(`electronicGameMessage${level}`).innerHTML = '';
    
    // Восстановить выбранные варианты
    restoreSelectedOptions(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('electronicGameComplete').classList.remove('active');
}

function selectElectronicOption(element, optionId) {
    const level = currentElectronicLevel;
    const questionNum = optionId.charAt(0);
    
    // Сбросить выделение для всех вариантов этого вопроса
    const questionOptions = element.parentElement.querySelectorAll('.option');
    questionOptions.forEach(opt => {
opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    element.classList.add('selected');
    
    // Сохранить выбор
    selectedOptionsq[level][questionNum] = optionId;
}

function restoreSelectedOptions(level) {
    for (const questionNum in selectedOptionsq[level]) {
const optionId = selectedOptionsq[level][questionNum];
if (optionId) {
    const optionElement = document.querySelector(`.option[onclick*="${optionId}"]`);
    if (optionElement) {
optionElement.classList.add('selected');
const radio = optionElement.querySelector('input[type="radio"]');
if (radio) radio.checked = true;
    }
}
    }
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < electronicCompletedLevels.length) {
    dot.classList.add('completed');
}

if (index === currentElectronicLevel - 1) {
    dot.classList.add('current');
}
    });
}

function checkElectronicSolution(level) {
    const message = document.getElementById(`electronicGameMessage${level}`);
    let correctAnswers = 0;
    let totalQuestions = 0;
    let feedback = '';
    
    switch(level) {
case 1:
    totalQuestions = 3;
    if (selectedOptionsq[1][1] === '1B') correctAnswers++;
    if (selectedOptionsq[1][2] === '2A') correctAnswers++;
    if (selectedOptionsq[1][3] === '3A') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Отлично! Все ответы верны!</div>';
highlightCorrectAnswers(1, ['1B', '2A', '3A']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Попробуйте еще раз!</div>`;
highlightAnswers(1, ['1B', '2A', '3A']);
    }
    break;
    
case 2:
    totalQuestions = 2;
    if (selectedOptionsq[2][4] === '4B') correctAnswers++;
    if (selectedOptionsq[2][5] === '5C') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Прекрасно! Все расчеты верны!</div>';
highlightCorrectAnswers(2, ['4B', '5C']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте расчеты!</div>`;
highlightAnswers(2, ['4B', '5C']);
    }
    break;
    
case 3:
    totalQuestions = 1;
    const code = document.getElementById('electronicCodeInput').value;
    const hasSemicolon = code.includes('int ledPin = 13;');
    const hasCorrectDelay = code.includes('delay(1000);');
    const hasSecondDelay = code.includes('delay(1000);') && (code.match(/delay\(1000\);/g) || []).length >= 2;
    
    if (hasSemicolon && hasCorrectDelay && hasSecondDelay) correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Блестяще! Код исправлен правильно!</div>' +
   '<ul><li>✓ Добавлена точка с запятой в объявлении переменной</li>' +
   '<li>✓ Исправлена опечатка в функции delay</li>' +
   '<li>✓ Добавлена вторая задержка после выключения светодиода</li></ul>';
    } else {
feedback = '<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> В коде остались ошибки. Проверьте:</div>' +
   '<ul><li>✓ Точку с запятой после int ledPin = 13</li>' +
   '<li>✓ Правильное написание delay (не dealy)</li>' +
   '<li>✓ Вторую задержку после digitalWrite(ledPin, LOW)</li></ul>';
    }
    break;
    }
    
    message.innerHTML = feedback;
    
    if (correctAnswers === totalQuestions) {
// Начислить баллы
const points = level * 15;
electronicScore += points;

// Отметить уровень как пройденный
if (!electronicCompletedLevels.includes(level)) {
    electronicCompletedLevels.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (electronicCompletedLevels.length === 3) {
completeElectronicGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectElectronicLevel(nextLevel);
}
    }
}, 1500);
    }
}

function highlightAnswers(level, correctOptions) {
    // Сначала сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим правильные и неправильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
    
    // Подсветим выбранные неправильные ответы
    for (const questionNum in selectedOptionsq[level]) {
const selectedOptionId = selectedOptionsq[level][questionNum];
if (selectedOptionId && !correctOptions.includes(selectedOptionId)) {
    const wrongOption = document.querySelector(`.option[onclick*="${selectedOptionId}"]`);
    if (wrongOption) {
wrongOption.classList.add('wrong-answer');
    }
}
    }
}

function highlightCorrectAnswers(level, correctOptions) {
    // Сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим только правильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
}

function showElectronicHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Цветовая маркировка резисторов: Коричневый=1, Черный=0, Красный=×100, Золотой=±5%. Закон Ома: U = I × R. Символ −| |− обозначает конденсатор.';
    break;
case 2:
    hint = 'Для делителя напряжения: Uвых = Uвх × (R2 / (R1 + R2)). Для биполярного транзистора: Iк = β × Iб.';
    break;
case 3:
    hint = 'Основные ошибки в коде: отсутствие точки с запятой после объявления переменной, опечатка в функции delay (правильно: delay), отсутствие второй задержки после выключения светодиода.';
    break;
    }
    
    alert(hint);
}

function resetElectronicLevel(level) {
    // Сбросить выбранные варианты
    for (const questionNum in selectedOptionsq[level]) {
selectedOptionsq[level][questionNum] = null;
    }
    
    // Сбросить выделение
    const options = document.querySelectorAll(`#level${level} .option`);
    options.forEach(opt => {
opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
const radio = opt.querySelector('input[type="radio"]');
if (radio) radio.checked = false;
    });
    
    // Сбросить сообщение
    document.getElementById(`electronicGameMessage${level}`).innerHTML = '';
    
    // Для уровня 3 также сбросить код
    if (level === 3) {
document.getElementById('electronicCodeInput').value = `// Управление светодиодом
int ledPin = 13

void setup() {
    // Ошибка 1: Неправильная функция
    pinMode(ledPin, OUTPUT);
}

void loop() {
    // Включить светодиод
    digitalWrite(ledPin, HIGH);
    
    // Ошибка 2: Неправильная задержка
    dealy(1000);
    
    // Выключить светодиод
    digitalWrite(ledPin, LOW);
    
    // Ошибка 3: Отсутствует задержка
}`;
    }
}

function completeElectronicGame() {
    const endTime = new Date();
    const timeDiff = (endTime - electronicStartTime) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('electronicFinalScore').textContent = electronicScore;
    document.getElementById('electronicCompletionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('electronicGameComplete').classList.add('active');
}

function restartElectronicGame() {
    currentElectronicLevel = 0;
    electronicScore = 0;
    electronicCompletedLevels = [];
    selectedOptionsq = {
1: {1: null, 2: null, 3: null},
2: {4: null, 5: null},
3: {6: null}
    };
    
    document.getElementById('electronicGameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetElectronicLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}

function checkElectronicCode() {
    const code = document.getElementById('electronicCodeInput').value;
    const message = document.getElementById('electronicGameMessage3');
    
    // Check for solutions
    const hasSemicolon = code.includes('int ledPin = 13;');
    const hasCorrectDelay = code.includes('delay(1000);');
    const hasSecondDelay = code.includes('delay(1000);') && (code.match(/delay\(1000\);/g) || []).length >= 2;
    
    if (hasSemicolon && hasCorrectDelay && hasSecondDelay) {
message.innerHTML = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Правильно! Ошибки исправлены:</div>' +
   '<ul><li>✓ Добавлена точка с запятой в объявлении переменной</li>' +
   '<li>✓ Исправлена опечатка в функции delay</li>' +
   '<li>✓ Добавлена вторая задержка после выключения светодиода</li></ul>';
    } else {
let errors = [];
if (!hasSemicolon) errors.push('Отсутствует точка с запятой после int ledPin = 13');
if (!hasCorrectDelay) errors.push('Неправильное написание функции delay (dealy)');
if (!hasSecondDelay) errors.push('Отсутствует вторая задержка после выключения светодиода');

message.innerHTML = '<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Еще есть ошибки:</div><ul>' +
   errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
    }
}


/**************************************************************************************************************************** */


const gameData = {
    1: {
parts: [
    { id: 1, name: "Шестерня", icon: "fas fa-cog", correctSlot: 1 },
    { id: 2, name: "Вал", icon: "fas fa-grip-lines", correctSlot: 2 },
    { id: 3, name: "Корпус", icon: "fas fa-cube", correctSlot: 3 }
],
slots: [
    { id: 1, name: "Основание механизма" },
    { id: 2, name: "Вращающийся элемент" },
    { id: 3, name: "Защитный элемент" }
]
    },
    2: {
parts: [
    { id: 1, name: "Шестерня", icon: "fas fa-cog", correctSlot: 1 },
    { id: 2, name: "Вал", icon: "fas fa-grip-lines", correctSlot: 2 },
    { id: 3, name: "Подшипник", icon: "fas fa-circle", correctSlot: 3 },
    { id: 4, name: "Корпус", icon: "fas fa-cube", correctSlot: 4 },
    { id: 5, name: "Крышка", icon: "fas fa-square", correctSlot: 5 }
],
slots: [
    { id: 1, name: "Основание механизма" },
    { id: 2, name: "Вращающийся элемент" },
    { id: 3, name: "Опорный элемент" },
    { id: 4, name: "Защитный элемент" },
    { id: 5, name: "Крепежный элемент" }
]
    },
    3: {
parts: [
    { id: 1, name: "Шестерня", icon: "fas fa-cog", correctSlot: 1 },
    { id: 2, name: "Вал", icon: "fas fa-grip-lines", correctSlot: 2 },
    { id: 3, name: "Подшипник", icon: "fas fa-circle", correctSlot: 3 },
    { id: 4, name: "Корпус", icon: "fas fa-cube", correctSlot: 4 },
    { id: 5, name: "Крышка", icon: "fas fa-square", correctSlot: 5 },
    { id: 6, name: "Болт", icon: "fas fa-bolt", correctSlot: 6 }
],
slots: [
    { id: 1, name: "Основание механизма" },
    { id: 2, name: "Вращающийся элемент" },
    { id: 3, name: "Опорный элемент" },
    { id: 4, name: "Защитный элемент" },
    { id: 5, name: "Крепежный элемент" },
    { id: 6, name: "Соединительный элемент" }
]
    }
};

let currentLevel = 0;
let gameScore = 0;
let gameStartTime;
let completedLevels = [];
let placedParts = {};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectLevel(level);
});
    });
});

function selectLevel(level) {
    currentLevel = parseInt(level);
    
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
    gameStartTime = new Date();
    
    // Сбросить сообщение
    document.getElementById(`gameMessage${level}`).innerHTML = '';
    
    // Инициализировать игру
    initGame(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function initGame(level) {
    const data = gameData[level];
    
    // Сброс состояния
    placedParts = {};
    
    // Очистка контейнеров
    document.getElementById(`partsContainer${level}`).innerHTML = '';
    document.querySelector(`#level${level} .assembly-slots`).innerHTML = '';
    
    // Создание деталей
    data.parts.forEach(part => {
const partElement = document.createElement('div');
partElement.className = 'part';
partElement.draggable = true;
partElement.dataset.partId = part.id;

partElement.innerHTML = `
    <i class="${part.icon}"></i>
    <span>${part.name}</span>
`;

partElement.addEventListener('dragstart', handleDragStart);
partElement.addEventListener('dragend', handleDragEnd);

document.getElementById(`partsContainer${level}`).appendChild(partElement);
    });
    
    // Создание слотов для сборки
    data.slots.forEach(slot => {
const slotElement = document.createElement('div');
slotElement.className = 'assembly-slot';
slotElement.dataset.slotId = slot.id;

slotElement.innerHTML = `
    <div class="slot-content">
<p>${slot.name}</p>
    </div>
`;

slotElement.addEventListener('dragover', handleDragOver);
slotElement.addEventListener('dragenter', handleDragEnter);
slotElement.addEventListener('dragleave', handleDragLeave);
slotElement.addEventListener('drop', handleDrop);

document.querySelector(`#level${level} .assembly-slots`).appendChild(slotElement);
    });
}

// Обработчики событий перетаскивания
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.partId);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    
    // Убрать активный класс со всех слотов
    document.querySelectorAll('.assembly-slot').forEach(slot => {
slot.classList.remove('active');
    });
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('active');
}

function handleDragLeave() {
    this.classList.remove('active');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('active');
    
    const partId = e.dataTransfer.getData('text/plain');
    const slotId = this.dataset.slotId;
    
    // Проверяем, можно ли разместить деталь в этом слоте
    if (!placedParts[slotId]) {
// Находим деталь по ID
const part = gameData[currentLevel].parts.find(p => p.id == partId);

if (part) {
    // Добавляем деталь в слот
    this.innerHTML = `
<div class="slot-content">
    <i class="${part.icon}"></i>
    <p>${part.name}</p>
</div>
    `;
    
    // Сохраняем информацию о размещенной детали
    placedParts[slotId] = partId;
    
    // Делаем деталь недоступной для перетаскивания
    const partElement = document.querySelector(`#level${currentLevel} .part[data-part-id="${partId}"]`);
    partElement.style.opacity = '0.5';
    partElement.draggable = false;
}
    }
}

function checkAssembly(level) {
    const data = gameData[level];
    let correctCount = 0;
    
    // Проверяем каждую размещенную деталь
    for (const slotId in placedParts) {
const partId = placedParts[slotId];
const part = data.parts.find(p => p.id == partId);

if (part && part.correctSlot == slotId) {
    correctCount++;
    // Подсвечиваем правильные слоты
    const slotElement = document.querySelector(`#level${level} .assembly-slot[data-slot-id="${slotId}"]`);
    slotElement.classList.add('correct');
} else {
    // Подсвечиваем неправильные слоты
    const slotElement = document.querySelector(`#level${level} .assembly-slot[data-slot-id="${slotId}"]`);
    slotElement.classList.add('incorrect');
}
    }
    
    const message = document.getElementById(`gameMessage${level}`);
    const totalParts = data.parts.length;
    
    if (correctCount === totalParts) {
message.innerHTML = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Поздравляем! Механизм собран правильно!</div>';

// Начислить баллы
const points = level * 15;
gameScore += points;

// Отметить уровень как пройденный
if (!completedLevels.includes(level)) {
    completedLevels.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (completedLevels.length === 3) {
completeGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectLevel(nextLevel);
}
    }
}, 1500);
    } else {
message.innerHTML = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно собрано ${correctCount} из ${totalParts} деталей. Попробуйте еще раз!</div>`;
    }
}

function showHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Основание механизма обычно является самой большой деталью. Вращающийся элемент соединяется с основанием. Защитный элемент закрывает механизм.';
    break;
case 2:
    hint = 'Обратите внимание на последовательность: основание -> опорный элемент -> вращающийся элемент -> защитный элемент -> крепежный элемент.';
    break;
case 3:
    hint = 'Сложные механизмы требуют точной последовательности сборки. Начните с основания, затем установите опорные элементы, вращающиеся детали и только потом крепежные.';
    break;
    }
    
    alert(hint);
}

function resetLevel(level) {
    // Сбросить размещенные детали
    placedParts = {};
    
    // Сбросить сообщение
    document.getElementById(`gameMessage${level}`).innerHTML = '';
    
    // Переинициализировать игру
    initGame(level);
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.remove('active');
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < completedLevels.length) {
    dot.classList.add('completed');
}

if (index === currentLevel - 1) {
    dot.classList.add('current');
}
    });
}

function completeGame() {
    const endTime = new Date();
    const timeDiff = (endTime - gameStartTime) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('finalScore').textContent = gameScore;
    document.getElementById('completionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.add('active');
}

function restartGame() {
    currentLevel = 0;
    gameScore = 0;
    completedLevels = [];
    placedParts = {};
    
    document.getElementById('gameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}

// Функция для прокрутки к разделу
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}


/*************************************************************************************************************************** */


let currentNetworkLevel = 0;
let networkScore = 0;
let networkStartTime;
let networkCompletedLevels = [];
let selectedOptionsd = {
    1: {1: null, 2: null, 3: null},
    2: {4: null, 5: null},
    3: {6: null}
};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectNetworkLevel(level);
});
    });
});

function selectNetworkLevel(level) {
    currentNetworkLevel = parseInt(level);
    
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
    networkStartTime = new Date();
    
    // Сбросить сообщение
    document.getElementById(`networkGameMessage${level}`).innerHTML = '';
    
    // Восстановить выбранные варианты
    restoreSelectedOptions(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('networkGameComplete').classList.remove('active');
}

function selectNetworkOption(element, optionId) {
    const level = currentNetworkLevel;
    const questionNum = optionId.charAt(0);
    
    // Сбросить выделение для всех вариантов этого вопроса
    const questionOptions = element.parentElement.querySelectorAll('.option');
    questionOptions.forEach(opt => {
opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    element.classList.add('selected');
    
    // Сохранить выбор
    selectedOptionsd[level][questionNum] = optionId;
}

function restoreSelectedOptions(level) {
    for (const questionNum in selectedOptionsd[level]) {
const optionId = selectedOptionsd[level][questionNum];
if (optionId) {
    const optionElement = document.querySelector(`.option[onclick*="${optionId}"]`);
    if (optionElement) {
optionElement.classList.add('selected');
const radio = optionElement.querySelector('input[type="radio"]');
if (radio) radio.checked = true;
    }
}
    }
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < networkCompletedLevels.length) {
    dot.classList.add('completed');
}

if (index === currentNetworkLevel - 1) {
    dot.classList.add('current');
}
    });
}

function checkNetworkSolution(level) {
    const message = document.getElementById(`networkGameMessage${level}`);
    let correctAnswers = 0;
    let totalQuestions = 0;
    let feedback = '';
    
    switch(level) {
case 1:
    totalQuestions = 3;
    if (selectedOptionsd[1][1] === '1B') correctAnswers++;
    if (selectedOptionsd[1][2] === '2B') correctAnswers++;
    if (selectedOptionsd[1][3] === '3B') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Отлично! Все ответы верны!</div>';
highlightCorrectAnswers(1, ['1B', '2B', '3B']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Попробуйте еще раз!</div>`;
highlightAnswers(1, ['1B', '2B', '3B']);
    }
    break;
    
case 2:
    totalQuestions = 2;
    if (selectedOptionsd[2][4] === '4A') correctAnswers++;
    if (selectedOptionsd[2][5] === '5B') correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Прекрасно! Все ответы верны!</div>';
highlightCorrectAnswers(2, ['4A', '5B']);
    } else {
feedback = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно ${correctAnswers} из ${totalQuestions}. Проверьте ответы!</div>`;
highlightAnswers(2, ['4A', '5B']);
    }
    break;
    
case 3:
    totalQuestions = 1;
    const code = document.getElementById('networkCodeInput').value;
    const hasAction = code.includes('-Action Allow') || code.includes('-Action Block');
    const hasCorrectAction = code.includes('-Action Allow');
    const hasCorrectSyntax = code.includes('New-NetFirewallRule -DisplayName "Allow DNS" -Direction Outbound -Protocol UDP -LocalPort 53 -Action Allow');
    
    if (hasAction && hasCorrectAction && hasCorrectSyntax) correctAnswers++;
    
    if (correctAnswers === totalQuestions) {
feedback = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Блестяще! Код исправлен правильно!</div>' +
   '<ul><li>✓ Добавлен параметр -Action в команду Allow Web</li>' +
   '<li>✓ Исправлено значение параметра -Action для правила Allow DNS</li>' +
   '<li>✓ Убедитесь, что все правила имеют правильные значения параметров</li></ul>';
    } else {
feedback = '<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> В коде остались ошибки. Проверьте:</div>' +
   '<ul><li>✓ Все команды должны иметь параметр -Action</li>' +
   '<li>✓ Для правил разрешения должно быть значение Allow</li>' +
   '<li>✓ Для правил блокировки должно быть значение Block</li></ul>';
    }
    break;
    }
    
    message.innerHTML = feedback;
    
    if (correctAnswers === totalQuestions) {
// Начислить баллы
const points = level * 15;
networkScore += points;

// Отметить уровень как пройденный
if (!networkCompletedLevels.includes(level)) {
    networkCompletedLevels.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (networkCompletedLevels.length === 3) {
completeNetworkGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectNetworkLevel(nextLevel);
}
    }
}, 1500);
    }
}

function highlightAnswers(level, correctOptions) {
    // Сначала сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим правильные и неправильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
    
    // Подсветим выбранные неправильные ответы
    for (const questionNum in selectedOptionsd[level]) {
const selectedOptionId = selectedOptionsd[level][questionNum];
if (selectedOptionId && !correctOptions.includes(selectedOptionId)) {
    const wrongOption = document.querySelector(`.option[onclick*="${selectedOptionId}"]`);
    if (wrongOption) {
wrongOption.classList.add('wrong-answer');
    }
}
    }
}

function highlightCorrectAnswers(level, correctOptions) {
    // Сбросим все выделения
    const allOptions = document.querySelectorAll(`#level${level} .option`);
    allOptions.forEach(opt => {
opt.classList.remove('correct-answer', 'wrong-answer');
    });
    
    // Подсветим только правильные ответы
    for (const optionId of correctOptions) {
const correctOption = document.querySelector(`.option[onclick*="${optionId}"]`);
if (correctOption) {
    correctOption.classList.add('correct-answer');
}
    }
}

function showNetworkHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'DNS преобразует доменные имена в IP-адреса. Маршрутизаторы соединяют сети. HTTPS использует порт 443 для безопасного соединения.';
    break;
case 2:
    hint = 'Приватные IP-адреса: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Команда ping проверяет доступность хоста в сети.';
    break;
case 3:
    hint = 'Основные ошибки в коде: отсутствие параметра -Action в команде Allow Web, неправильное значение -Action для правила Allow DNS (должно быть Allow, а не Deny).';
    break;
    }
    
    alert(hint);
}

function resetNetworkLevel(level) {
    // Сбросить выбранные варианты
    for (const questionNum in selectedOptionsd[level]) {
        selectedOptionsd[level][questionNum] = null;
    }
    
    // Сбросить выделение
    const options = document.querySelectorAll(`#level${level} .option`);
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });
    
    // Сбросить сообщение
    document.getElementById(`networkGameMessage${level}`).innerHTML = '';
    
    // Для уровня 3 также сбросить код
    if (level === 3) {
document.getElementById('networkCodeInput').value = `# Настройка правил брандмауэра Windows
# Ошибка 1: Неправильный синтаксис команды
New-NetFirewallRule -DisplayName "Block RDP" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Block

# Ошибка 2: Отсутствует ключевой параметр
New-NetFirewallRule -DisplayName "Allow Web" -Direction Inbound -Protocol TCP -LocalPort 80

# Ошибка 3: Неправильное значение параметра
New-NetFirewallRule -DisplayName "Allow DNS" -Direction Outbound -Protocol UDP -LocalPort 53 -Action Deny`;
    }
}

function completeNetworkGame() {
    const endTime = new Date();
    const timeDiff = (endTime - networkStartTime) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('networkFinalScore').textContent = networkScore;
    document.getElementById('networkCompletionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('networkGameComplete').classList.add('active');
}

function restartNetworkGame() {
    currentNetworkLevel = 0;
    networkScore = 0;
    networkCompletedLevels = [];
    selectedOptionsd = {
1: {1: null, 2: null, 3: null},
2: {4: null, 5: null},
3: {6: null}
    };
    
    document.getElementById('networkGameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetNetworkLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}

function checkNetworkCode() {
    const code = document.getElementById('networkCodeInput').value;
    const message = document.getElementById('networkGameMessage3');
    
    // Check for solutions
    const hasAction = code.includes('-Action Allow') || code.includes('-Action Block');
    const hasCorrectAction = code.includes('-Action Allow');
    const hasCorrectSyntax = code.includes('New-NetFirewallRule -DisplayName "Allow DNS" -Direction Outbound -Protocol UDP -LocalPort 53 -Action Allow');
    
    if (hasAction && hasCorrectAction && hasCorrectSyntax) {
message.innerHTML = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Правильно! Ошибки исправлены:</div>' +
   '<ul><li>✓ Добавлен параметр -Action в команду Allow Web</li>' +
   '<li>✓ Исправлено значение параметра -Action для правила Allow DNS</li>' +
   '<li>✓ Убедитесь, что все правила имеют правильные значения параметров</li></ul>';
    } else {
let errors = [];
if (!hasAction) errors.push('Отсутствует параметр -Action в команде Allow Web');
if (!hasCorrectAction) errors.push('Неправильное значение параметра -Action для правила Allow DNS');

message.innerHTML = '<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Еще есть ошибки:</div><ul>' +
   errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
    }
}

// Функция для прокрутки к разделу
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}


/******************************************************************************************************************************************************************************* */


let currentLevelr = 0;
let score = 0;
let startTime;
let completedLevelsr = [];
let selectedAnswers = {
    1: {1: null, 2: null, 3: null},
    2: {1: null, 2: null},
    3: {1: null, 2: null}
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карточек уровней
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = parseInt(this.getAttribute('data-level'));
    selectLevel(level);
});
    });

    // Инициализация кнопок проверки решений
    for (let i = 1; i <= 3; i++) {
const checkBtn = document.getElementById(`checkBtn${i}`);
if (checkBtn) {
    checkBtn.addEventListener('click', () => checkSolution(i));
}

const hintBtn = document.getElementById(`hintBtn${i}`);
if (hintBtn) {
    hintBtn.addEventListener('click', () => showHint(i));
}

const resetBtn = document.getElementById(`resetBtn${i}`);
if (resetBtn) {
    resetBtn.addEventListener('click', () => resetLevel(i));
}

const backBtn = document.getElementById(`backBtn${i}`);
if (backBtn) {
    backBtn.addEventListener('click', backToLevelSelection);
}
    }

    // Инициализация кнопок завершения игры
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
restartBtn.addEventListener('click', restartGame);
    }

    const backToLevelsBtn = document.getElementById('backToLevelsBtn');
    if (backToLevelsBtn) {
backToLevelsBtn.addEventListener('click', backToLevelSelection);
    }

    // Инициализация выбора ответов
    initializeQuizOptions();
});

function initializeQuizOptions() {
    // Обработчики для вариантов ответов
    document.querySelectorAll('.quiz-option').forEach(option => {
option.addEventListener('click', function() {
    // Найти родительский контейнер вопроса
    let questionContainer = this.closest('.quiz-card') || this.closest('.scenario');
    if (!questionContainer) return;
    
    // Найти все вопросы в текущем уровне
    const levelContainer = this.closest('.game-content');
    if (!levelContainer) return;
    
    // Найти индекс вопроса
    const questions = levelContainer.querySelectorAll('.quiz-card, .scenario');
    const questionIndex = Array.from(questions).indexOf(questionContainer);
    
    // Снять выделение с других вариантов в этом вопросе
    questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    this.classList.add('selected');
    
    // Сохранить выбор
    const level = currentLevelr;
    selectedAnswers[level][questionIndex + 1] = this.getAttribute('data-correct') === 'true';
});
    });
}

function selectLevel(level) {
    currentLevelr = level;
    
    // Скрыть все уровни
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    // Снять выделение со всех карточек
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Показать выбранный уровень
    const levelElement = document.getElementById(`level${level}`);
    if (levelElement) {
levelElement.classList.add('active');
    }
    
    // Выделить выбранную карточку
    const selectedCard = document.querySelector(`.level-card[data-level="${level}"]`);
    if (selectedCard) {
selectedCard.classList.add('active');
    }
    
    // Запустить таймер
    startTime = new Date();
    
    // Сбросить сообщения
    for (let i = 1; i <= 3; i++) {
const message = document.getElementById(`gameMessage${i}`);
if (message) {
    message.innerHTML = '';
    message.className = 'game-message';
}
    }
    
    // Обновить прогресс
    updateLevelProgress();
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.remove('active');
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < completedLevelsr.length) {
    dot.classList.add('completed');
}

if (index === currentLevelr - 1) {
    dot.classList.add('current');
}
    });
}

function checkSolution(level) {
    const message = document.getElementById(`gameMessage${level}`);
    if (!message) return;
    
    let correctAnswersCount = 0;
    let totalQuestions = 0;
    let feedback = '';
    
    // Проверяем ответы для каждого уровня
    switch(level) {
case 1:
    totalQuestions = 3;
    for (let i = 1; i <= totalQuestions; i++) {
if (selectedAnswers[level][i] === true) {
    correctAnswersCount++;
}
    }
    
    // Подсветить правильные/неправильные ответы
    highlightAnswers(level);
    
    if (correctAnswersCount === totalQuestions) {
feedback = '<div class="message-success"><i class="fas fa-check-circle"></i> Отлично! Все ответы правильные!</div>';
    } else {
feedback = `<div class="message-error"><i class="fas fa-times-circle"></i> Правильных ответов: ${correctAnswersCount} из ${totalQuestions}. Попробуйте еще раз!</div>`;
    }
    break;
    
case 2:
    totalQuestions = 2;
    for (let i = 1; i <= totalQuestions; i++) {
if (selectedAnswers[level][i] === true) {
    correctAnswersCount++;
}
    }
    
    // Подсветить правильные/неправильные ответы
    highlightAnswers(level);
    
    if (correctAnswersCount === totalQuestions) {
feedback = '<div class="message-success"><i class="fas fa-check-circle"></i> Прекрасно! Все задачи решены правильно!</div>';
    } else {
feedback = `<div class="message-error"><i class="fas fa-times-circle"></i> Правильно решено: ${correctAnswersCount} из ${totalQuestions} задач. Попробуйте еще раз!</div>`;
    }
    break;
    
case 3:
    totalQuestions = 2;
    for (let i = 1; i <= totalQuestions; i++) {
if (selectedAnswers[level][i] === true) {
    correctAnswersCount++;
}
    }
    
    // Подсветить правильные/неправильные ответы
    highlightAnswers(level);
    
    if (correctAnswersCount === totalQuestions) {
feedback = '<div class="message-success"><i class="fas fa-check-circle"></i> Блестяще! Все сложные задачи решены!</div>';
    } else {
feedback = `<div class="message-error"><i class="fas fa-times-circle"></i> Правильных ответов: ${correctAnswersCount} из ${totalQuestions}. Это сложный уровень!</div>`;
    }
    break;
    }
    
    message.innerHTML = feedback;
    
    if (correctAnswersCount === totalQuestions) {
const points = level * 15;
score += points;

if (!completedLevelsr.includes(level)) {
    completedLevelsr.push(level);
}

updateLevelProgress();

setTimeout(() => {
    if (completedLevelsr.length === 3) {
completeGame();
    } else {
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectLevel(nextLevel);
}
    }
}, 2000);
    }
}

function highlightAnswers(level) {
    const levelElement = document.getElementById(`level${level}`);
    if (!levelElement) return;
    
    // Подсветить все варианты ответов
    levelElement.querySelectorAll('.quiz-option').forEach(option => {
if (option.getAttribute('data-correct') === 'true') {
    option.classList.add('correct');
} else if (option.classList.contains('selected')) {
    option.classList.add('incorrect');
}
    });
}

function showHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Уровень 1:\n- В JavaScript оператор + может использоваться для сложения чисел и конкатенации строк\n- Строгое сравнение учитывает тип данных\n- HTML определяет структуру веб-страницы';
    break;
case 2:
    hint = 'Уровень 2:\n- Быстрая сортировка имеет среднюю сложность O(n log n)\n- Линейный поиск проверяет каждый элемент массива по порядку, для числа 9 потребуется 6 сравнений';
    break;
case 3:
    hint = 'Уровень 3:\n- Pre-order обход бинарного дерева: корень, левое поддерево, правое поддерево\n- Функция поиска максимума уже оптимальна, так как имеет сложность O(n)';
    break;
    }
    
    alert(hint);
}

function resetLevel(level) {
    // Сбросить выбор ответов
    const levelElement = document.getElementById(`level${level}`);
    if (levelElement) {
levelElement.querySelectorAll('.quiz-option').forEach(option => {
    option.classList.remove('selected', 'correct', 'incorrect');
});
    }
    
    // Сбросить сообщение
    const message = document.getElementById(`gameMessage${level}`);
    if (message) {
message.innerHTML = '';
message.className = 'game-message';
    }
    
    // Сбросить сохраненные ответы для этого уровня
    for (let key in selectedAnswers[level]) {
selectedAnswers[level][key] = null;
    }
}

function completeGame() {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000 / 60;
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('completionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.add('active');
}

function restartGame() {
    currentLevelr = 0;
    score = 0;
    completedLevelsr = [];
    selectedAnswers = {
1: {1: null, 2: null, 3: null},
2: {1: null, 2: null},
3: {1: null, 2: null}
    };
    
    document.getElementById('gameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetLevel(i);
    }
    
    updateLevelProgress();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
element.scrollIntoView({ behavior: 'smooth' });
    }
}


/********************************************************************************************************************************************* */


const gameDataf = {
    1: {
parts: [
    { id: 1, name: "Молоко", icon: "fas fa-wine-bottle", price: "85 руб", correctSlot: 1 },
    { id: 2, name: "Хлеб", icon: "fas fa-bread-slice", price: "45 руб", correctSlot: 2 },
    { id: 3, name: "Яблоки", icon: "fas fa-apple-alt", price: "120 руб/кг", correctSlot: 3 },
    { id: 4, name: "Мясо", icon: "fas fa-drumstick-bite", price: "350 руб/кг", correctSlot: 4 }
],
slots: [
    { id: 1, name: "Молочный отдел" },
    { id: 2, name: "Хлебный отдел" },
    { id: 3, name: "Фруктовый отдел" },
    { id: 4, name: "Мясной отдел" }
]
    },
    2: {
parts: [
    { id: 1, name: "Кофе", icon: "fas fa-coffee", price: "450 руб", discount: "10%", correctSlot: 1 },
    { id: 2, name: "Чай", icon: "fas fa-mug-hot", price: "280 руб", discount: "15%", correctSlot: 2 },
    { id: 3, name: "Печенье", icon: "fas fa-cookie", price: "120 руб", discount: "20%", correctSlot: 3 },
    { id: 4, name: "Шоколад", icon: "fas fa-candy-cane", price: "85 руб", discount: "5%", correctSlot: 4 },
    { id: 5, name: "Сок", icon: "fas fa-wine-bottle", price: "110 руб", discount: "25%", correctSlot: 5 }
],
slots: [
    { id: 1, name: "Цена со скидкой: 405 руб" },
    { id: 2, name: "Цена со скидкой: 238 руб" },
    { id: 3, name: "Цена со скидкой: 96 руб" },
    { id: 4, name: "Цена со скидкой: 81 руб" },
    { id: 5, name: "Цена со скидкой: 83 руб" }
]
    },
    3: {
parts: [
    { id: 1, name: "Овощи/Фрукты", icon: "fas fa-carrot", correctSlot: 1 },
    { id: 2, name: "Молочные продукты", icon: "fas fa-cheese", correctSlot: 2 },
    { id: 3, name: "Мясо/Рыба", icon: "fas fa-fish", correctSlot: 3 },
    { id: 4, name: "Бакалея", icon: "fas fa-wine-bottle", correctSlot: 4 },
    { id: 5, name: "Хлеб", icon: "fas fa-bread-slice", correctSlot: 5 },
    { id: 6, name: "Касса", icon: "fas fa-cash-register", correctSlot: 6 }
],
slots: [
    { id: 1, name: "Левый дальний угол" },
    { id: 2, name: "Правый дальний угол" },
    { id: 3, name: "Центральная стена" },
    { id: 4, name: "Левая боковая стена" },
    { id: 5, name: "Правая боковая стена" },
    { id: 6, name: "Выход из магазина" }
]
    }
};

let currentLevelf = 0;
let gameScoref = 0;
let gameStartTimef;
let completedLevelsf = [];
let placedPartsf = {};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectLevel(level);
});
    });
});

function selectLevel(level) {
    currentLevelf = parseInt(level);
    
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
    gameStartTimef = new Date();
    
    // Сбросить сообщение
    document.getElementById(`gameMessage${level}`).innerHTML = '';
    
    // Инициализировать игру
    initGame(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function initGame(level) {
    const data = gameDataf[level];
    
    // Сброс состояния
    placedPartsf = {};
    
    // Очистка контейнеров
    document.getElementById(`productsContainer${level}`).innerHTML = '';
    document.querySelector(`#level${level} .shelves-slots`).innerHTML = '';
    
    // Создание товаров/отделов
    data.parts.forEach(part => {
const partElement = document.createElement('div');
partElement.className = 'product';
partElement.draggable = true;
partElement.dataset.partId = part.id;

let priceHtml = '';
if (part.price) {
    priceHtml = `<div class="product-price">${part.price}</div>`;
}
if (part.discount) {
    priceHtml += `<div class="price-tag">-${part.discount}</div>`;
}

partElement.innerHTML = `
    <i class="${part.icon}"></i>
    <span>${part.name}</span>
    ${priceHtml}
`;

partElement.addEventListener('dragstart', handleDragStart);
partElement.addEventListener('dragend', handleDragEnd);

document.getElementById(`productsContainer${level}`).appendChild(partElement);
    });
    
    // Создание слотов для полок/отделов
    data.slots.forEach(slot => {
const slotElement = document.createElement('div');
slotElement.className = 'shelf-slot';
slotElement.dataset.slotId = slot.id;

slotElement.innerHTML = `
    <div class="slot-content">
<p>${slot.name}</p>
    </div>
`;

slotElement.addEventListener('dragover', handleDragOver);
slotElement.addEventListener('dragenter', handleDragEnter);
slotElement.addEventListener('dragleave', handleDragLeave);
slotElement.addEventListener('drop', handleDrop);

document.querySelector(`#level${level} .shelves-slots`).appendChild(slotElement);
    });
}

// Обработчики событий перетаскивания
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.partId);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    
    // Убрать активный класс со всех слотов
    document.querySelectorAll('.shelf-slot').forEach(slot => {
slot.classList.remove('active');
    });
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('active');
}

function handleDragLeave() {
    this.classList.remove('active');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('active');
    
    const partId = e.dataTransfer.getData('text/plain');
    const slotId = this.dataset.slotId;
    
    // Проверяем, можно ли разместить товар в этом слоте
    if (!placedPartsf[slotId]) {
// Находим товар по ID
const part = gameDataf[currentLevelf].parts.find(p => p.id == partId);

if (part) {
    let priceHtml = '';
    if (part.price) {
priceHtml = `<div class="product-price">${part.price}</div>`;
    }
    if (part.discount) {
priceHtml += `<div class="price-tag">-${part.discount}</div>`;
    }
    
    // Добавляем товар в слот
    this.innerHTML = `
<div class="slot-content">
    <i class="${part.icon}"></i>
    <p>${part.name}</p>
    ${priceHtml}
</div>
    `;
    
    // Сохраняем информацию о размещенном товаре
    placedPartsf[slotId] = partId;
    
    // Делаем товар недоступным для перетаскивания
    const partElement = document.querySelector(`#level${currentLevelf} .product[data-part-id="${partId}"]`);
    partElement.style.opacity = '0.5';
    partElement.draggable = false;
}
    }
}

function checkAssembly(level) {
    const data = gameDataf[level];
    let correctCount = 0;
    
    // Проверяем каждый размещенный товар
    for (const slotId in placedPartsf) {
const partId = placedPartsf[slotId];
const part = data.parts.find(p => p.id == partId);

if (part && part.correctSlot == slotId) {
    correctCount++;
    // Подсвечиваем правильные слоты
    const slotElement = document.querySelector(`#level${level} .shelf-slot[data-slot-id="${slotId}"]`);
    slotElement.classList.add('correct');
} else {
    // Подсвечиваем неправильные слоты
    const slotElement = document.querySelector(`#level${level} .shelf-slot[data-slot-id="${slotId}"]`);
    slotElement.classList.add('incorrect');
}
    }
    
    const message = document.getElementById(`gameMessage${level}`);
    const totalParts = data.parts.length;
    
    if (correctCount === totalParts) {
message.innerHTML = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Поздравляем! Задание выполнено правильно!</div>';

// Начислить баллы
const points = level * 15;
gameScoref += points;

// Отметить уровень как пройденный
if (!completedLevelsf.includes(level)) {
    completedLevelsf.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (completedLevelsf.length === 3) {
completeGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectLevel(nextLevel);
}
    }
}, 1500);
    } else {
message.innerHTML = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно размещено ${correctCount} из ${totalParts} товаров. Попробуйте еще раз!</div>`;
    }
}

function showHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Учитывайте товарное соседство: молочные продукты не должны соседствовать с сильно пахнущими товарами. Хлеб обычно размещают в дальнем углу магазина, чтобы покупатели прошли через весь торговый зал.';
    break;
case 2:
    hint = 'Для расчета цены со скидкой умножьте исходную цену на (100 - процент скидки) и разделите на 100. Например, товар за 450 руб со скидкой 10%: 450 * (100-10)/100 = 405 руб.';
    break;
case 3:
    hint = 'Согласно правилам мерчандайзинга, овощи и фрукты размещают при входе, чтобы создать впечатление свежести. Хлеб и молоко - в дальних углах для увеличения времени пребывания в магазине. Кассы располагают у выхода.';
    break;
    }
    
    alert(hint);
}

function resetLevel(level) {
    // Сбросить размещенные товары
    placedPartsf = {};
    
    // Сбросить сообщение
    document.getElementById(`gameMessage${level}`).innerHTML = '';
    
    // Переинициализировать игру
    initGame(level);
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.remove('active');
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < completedLevelsf.length) {
    dot.classList.add('completed');
}

if (index === currentLevelf - 1) {
    dot.classList.add('current');
}
    });
}

function completeGame() {
    const endTime = new Date();
    const timeDiff = (endTime - gameStartTimef) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('finalScore').textContent = gameScoref;
    document.getElementById('completionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.add('active');
}

function restartGame() {
    currentLevelf = 0;
    gameScoref = 0;
    completedLevelsf = [];
    placedPartsf = {};
    
    document.getElementById('gameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}

// Функция для прокрутки к разделу
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}


/************************************************************************************************************************************************************************** */


const gameDatag = {
    1: {
parts: [
    { id: 1, name: "Грузовик", icon: "fas fa-truck", capacity: "10 тонн", correctSlot: 1 },
    { id: 2, name: "Фургон", icon: "fas fa-shuttle-van", capacity: "3 тонны", correctSlot: 2 },
    { id: 3, name: "Рефрижератор", icon: "fas fa-temperature-low", capacity: "8 тонн", correctSlot: 3 },
    { id: 4, name: "Контейнеровоз", icon: "fas fa-box", capacity: "20 тонн", correctSlot: 4 }
],
slots: [
    { id: 1, name: "Маршрут: Строительные материалы (тяжелые)" },
    { id: 2, name: "Маршрут: Мелкие партии товаров" },
    { id: 3, name: "Маршрут: Скоропортящиеся продукты" },
    { id: 4, name: "Маршрут: Международные контейнеры" }
]
    },
    2: {
parts: [
    { id: 1, name: "Хрупкий груз", icon: "fas fa-wine-glass", requirements: "Аккуратная перевозка", correctSlot: 1 },
    { id: 2, name: "Опасный груз", icon: "fas fa-radiation", requirements: "Специальный транспорт", correctSlot: 2 },
    { id: 3, name: "Скоропортящийся", icon: "fas fa-ice-cream", requirements: "Рефрижератор", correctSlot: 3 },
    { id: 4, name: "Крупногабаритный", icon: "fas fa-cube", requirements: "Тяжелый транспорт", correctSlot: 4 },
    { id: 5, name: "Срочная доставка", icon: "fas fa-clock", requirements: "Быстрый транспорт", correctSlot: 5 }
],
slots: [
    { id: 1, name: "Транспорт: Фургон с амортизацией" },
    { id: 2, name: "Транспорт: Специализированный автомобиль" },
    { id: 3, name: "Транспорт: Рефрижератор" },
    { id: 4, name: "Транспорт: Тяжелый грузовик" },
    { id: 5, name: "Транспорт: Экспресс-доставка" }
]
    },
    3: {
parts: [
    { id: 1, name: "Производство", icon: "fas fa-industry", correctSlot: 1 },
    { id: 2, name: "Склад сырья", icon: "fas fa-warehouse", correctSlot: 2 },
    { id: 3, name: "Сборка", icon: "fas fa-cogs", correctSlot: 3 },
    { id: 4, name: "Распределительный центр", icon: "fas fa-map-marked-alt", correctSlot: 4 },
    { id: 5, name: "Розничный магазин", icon: "fas fa-store", correctSlot: 5 },
    { id: 6, name: "Клиент", icon: "fas fa-user", correctSlot: 6 }
],
slots: [
    { id: 1, name: "Начало цепи: Добыча сырья" },
    { id: 2, name: "Промежуточный этап: Хранение" },
    { id: 3, name: "Промежуточный этап: Обработка" },
    { id: 4, name: "Промежуточный этап: Распределение" },
    { id: 5, name: "Промежуточный этап: Реализация" },
    { id: 6, name: "Конец цепи: Потребление" }
]
    }
};

let currentLevelg = 0;
let gameScoreg = 0;
let gameStartTimeg;
let completedLevelsg = [];
let placedPartsg = {};

document.addEventListener('DOMContentLoaded', function() {
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
card.addEventListener('click', function() {
    const level = this.getAttribute('data-level');
    selectLevel(level);
});
    });
});

function selectLevel(level) {
    currentLevelg = parseInt(level);
    
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
    gameStartTimeg = new Date();
    
    // Сбросить сообщение
    document.getElementById(`gameMessage${level}`).innerHTML = '';
    
    // Инициализировать игру
    initGame(level);
    
    // Обновить индикатор прогресса
    updateLevelProgress();
}

function initGame(level) {
    const data = gameDatag[level];
    
    // Сброс состояния
    placedPartsg = {};
    
    // Очистка контейнеров
    document.getElementById(`vehiclesContainer${level}`).innerHTML = '';
    document.querySelector(`#level${level} .routes-slots`).innerHTML = '';
    
    // Создание транспорта/грузов/элементов цепи
    data.parts.forEach(part => {
const partElement = document.createElement('div');
partElement.className = 'vehicle';
partElement.draggable = true;
partElement.dataset.partId = part.id;

let capacityHtml = '';
if (part.capacity) {
    capacityHtml = `<div class="vehicle-capacity">${part.capacity}</div>`;
}
if (part.requirements) {
    capacityHtml = `<div class="route-tag">${part.requirements}</div>`;
}

partElement.innerHTML = `
    <i class="${part.icon}"></i>
    <span>${part.name}</span>
    ${capacityHtml}
`;

partElement.addEventListener('dragstart', handleDragStart);
partElement.addEventListener('dragend', handleDragEnd);

document.getElementById(`vehiclesContainer${level}`).appendChild(partElement);
    });
    
    // Создание слотов для маршрутов/грузов/цепи
    data.slots.forEach(slot => {
const slotElement = document.createElement('div');
slotElement.className = 'route-slot';
slotElement.dataset.slotId = slot.id;

slotElement.innerHTML = `
    <div class="slot-content">
<p>${slot.name}</p>
    </div>
`;

slotElement.addEventListener('dragover', handleDragOver);
slotElement.addEventListener('dragenter', handleDragEnter);
slotElement.addEventListener('dragleave', handleDragLeave);
slotElement.addEventListener('drop', handleDrop);

document.querySelector(`#level${level} .routes-slots`).appendChild(slotElement);
    });
}

// Обработчики событий перетаскивания
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.partId);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    
    // Убрать активный класс со всех слотов
    document.querySelectorAll('.route-slot').forEach(slot => {
slot.classList.remove('active');
    });
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('active');
}

function handleDragLeave() {
    this.classList.remove('active');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('active');
    
    const partId = e.dataTransfer.getData('text/plain');
    const slotId = this.dataset.slotId;
    
    // Проверяем, можно ли разместить элемент в этом слоте
    if (!placedPartsg[slotId]) {
// Находим элемент по ID
const part = gameDatag[currentLevelg].parts.find(p => p.id == partId);

if (part) {
    let capacityHtml = '';
    if (part.capacity) {
capacityHtml = `<div class="vehicle-capacity">${part.capacity}</div>`;
    }
    if (part.requirements) {
capacityHtml = `<div class="route-tag">${part.requirements}</div>`;
    }
    
    // Добавляем элемент в слот
    this.innerHTML = `
<div class="slot-content">
    <i class="${part.icon}"></i>
    <p>${part.name}</p>
    ${capacityHtml}
</div>
    `;
    
    // Сохраняем информацию о размещенном элементе
    placedPartsg[slotId] = partId;
    
    // Делаем элемент недоступным для перетаскивания
    const partElement = document.querySelector(`#level${currentLevelg} .vehicle[data-part-id="${partId}"]`);
    partElement.style.opacity = '0.5';
    partElement.draggable = false;
}
    }
}

function checkAssembly(level) {
    const data = gameDatag[level];
    let correctCount = 0;
    
    // Проверяем каждый размещенный элемент
    for (const slotId in placedPartsg) {
const partId = placedPartsg[slotId];
const part = data.parts.find(p => p.id == partId);

if (part && part.correctSlot == slotId) {
    correctCount++;
    // Подсвечиваем правильные слоты
    const slotElement = document.querySelector(`#level${level} .route-slot[data-slot-id="${slotId}"]`);
    slotElement.classList.add('correct');
} else {
    // Подсвечиваем неправильные слоты
    const slotElement = document.querySelector(`#level${level} .route-slot[data-slot-id="${slotId}"]`);
    slotElement.classList.add('incorrect');
}
    }
    
    const message = document.getElementById(`gameMessage${level}`);
    const totalParts = data.parts.length;
    
    if (correctCount === totalParts) {
message.innerHTML = '<div style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Поздравляем! Логистическая задача решена правильно!</div>';

// Начислить баллы
const points = level * 15;
gameScoreg += points;

// Отметить уровень как пройденный
if (!completedLevelsg.includes(level)) {
    completedLevelsg.push(level);
}

// Обновить прогресс
updateLevelProgress();

// Проверить, все ли уровни пройдены
setTimeout(() => {
    if (completedLevelsg.length === 3) {
completeGame();
    } else {
// Предложить следующий уровень
const nextLevel = level < 3 ? level + 1 : 1;
if (confirm(`Уровень ${level} пройден! Хотите перейти к уровню ${nextLevel}?`)) {
    selectLevel(nextLevel);
}
    }
}, 1500);
    } else {
message.innerHTML = `<div style="color: var(--accent-color);"><i class="fas fa-times-circle"></i> Правильно размещено ${correctCount} из ${totalParts} элементов. Попробуйте еще раз!</div>`;
    }
}

function showHint(level) {
    let hint = '';
    
    switch(level) {
case 1:
    hint = 'Учитывайте грузоподъемность транспорта и специфику маршрутов. Тяжелые грузы требуют мощных грузовиков, скоропортящиеся продукты - рефрижераторов, а международные перевозки - специализированного транспорта.';
    break;
case 2:
    hint = 'Каждый тип груза требует особых условий перевозки. Хрупкие грузы нуждаются в бережной транспортировке, опасные - в специальных разрешениях и транспорте, скоропортящиеся - в поддержании температуры.';
    break;
case 3:
    hint = 'Цепь поставок должна быть выстроена логически: от добычи сырья через производство и распределение до конечного потребителя. Каждое звено цепи выполняет определенную функцию в логистическом процессе.';
    break;
    }
    
    alert(hint);
}

function resetLevel(level) {
    // Сбросить размещенные элементы
    placedPartsg = {};
    
    // Сбросить сообщение
    document.getElementById(`gameMessage${level}`).innerHTML = '';
    
    // Переинициализировать игру
    initGame(level);
}

function backToLevelSelection() {
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.remove('active');
}

function updateLevelProgress() {
    const dots = document.querySelectorAll('.level-dot');
    dots.forEach((dot, index) => {
dot.classList.remove('completed', 'current');

if (index < completedLevelsg.length) {
    dot.classList.add('completed');
}

if (index === currentLevelg - 1) {
    dot.classList.add('current');
}
    });
}

function completeGame() {
    const endTime = new Date();
    const timeDiff = (endTime - gameStartTimeg) / 1000 / 60; // в минутах
    const completionTime = Math.round(timeDiff * 10) / 10;
    
    document.getElementById('finalScore').textContent = gameScoreg;
    document.getElementById('completionTime').textContent = completionTime;
    
    document.querySelectorAll('.game-content').forEach(content => {
content.classList.remove('active');
    });
    
    document.getElementById('gameComplete').classList.add('active');
}

function restartGame() {
    currentLevel = 0;
    gameScoreg = 0;
    completedLevelsg = [];
    placedParts = {};
    
    document.getElementById('gameComplete').classList.remove('active');
    document.querySelectorAll('.level-card').forEach(card => {
card.classList.remove('active');
    });
    
    // Сбросить все уровни
    for (let i = 1; i <= 3; i++) {
resetLevel(i);
    }
    
    // Обновить прогресс
    updateLevelProgress();
}

// Функция для прокрутки к разделу
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}