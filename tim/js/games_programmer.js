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