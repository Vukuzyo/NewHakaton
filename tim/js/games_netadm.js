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