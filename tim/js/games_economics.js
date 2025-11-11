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