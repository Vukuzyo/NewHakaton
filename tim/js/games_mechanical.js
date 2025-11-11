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