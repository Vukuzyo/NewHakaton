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