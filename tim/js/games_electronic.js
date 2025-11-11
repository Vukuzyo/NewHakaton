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