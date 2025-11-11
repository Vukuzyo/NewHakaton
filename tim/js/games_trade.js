const gameData = {
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
    if (!placedParts[slotId]) {
// Находим товар по ID
const part = gameData[currentLevel].parts.find(p => p.id == partId);

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
    placedParts[slotId] = partId;
    
    // Делаем товар недоступным для перетаскивания
    const partElement = document.querySelector(`#level${currentLevel} .product[data-part-id="${partId}"]`);
    partElement.style.opacity = '0.5';
    partElement.draggable = false;
}
    }
}

function checkAssembly(level) {
    const data = gameData[level];
    let correctCount = 0;
    
    // Проверяем каждый размещенный товар
    for (const slotId in placedParts) {
const partId = placedParts[slotId];
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