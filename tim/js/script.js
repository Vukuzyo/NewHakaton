const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    if (themeToggle.querySelector('span')) {
        themeToggle.querySelector('span').textContent = 'Светлая';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            if (themeToggle.querySelector('span')) {
                themeToggle.querySelector('span').textContent = 'Светлая';
            }
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            if (themeToggle.querySelector('span')) {
                themeToggle.querySelector('span').textContent = 'Тёмная';
            }
        }
    });
}

// Навигация между страницами
function showMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('specialtyPages').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    window.scrollTo(0, 0);
}

function showSpecialty(specialtyId) {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('specialtyPages').style.display = 'block';
    document.getElementById('backBtn').style.display = 'flex';
    
    // Загружаем контент специальности
    loadSpecialtyContent(specialtyId);
    window.scrollTo(0, 0);
}

function loadSpecialtyContent(specialtyId) {
    const specialtyPages = document.getElementById('specialtyPages');
    
    // Очищаем контейнер
    specialtyPages.innerHTML = '';
    
    // Загружаем контент в зависимости от выбранной специальности
    switch(specialtyId) {
        case 'programming':
            specialtyPages.innerHTML = getProgrammingContent();
            break;
        case 'network':
            specialtyPages.innerHTML = getNetworkContent();
            break;
        case 'electronics':
            specialtyPages.innerHTML = getElectronicsContent();
            break;
        case 'electrical':
            specialtyPages.innerHTML = getElectricalContent();
            break;
        case 'mechanical':
            specialtyPages.innerHTML = getMechanicalContent();
            break;
        case 'transport':
            specialtyPages.innerHTML = getTransportContent();
            break;
        case 'economics':
            specialtyPages.innerHTML = getEconomicsContent();
            break;
        case 'trade':
            specialtyPages.innerHTML = getTradeContent();
            break;
        case 'design':
            specialtyPages.innerHTML = getDesignContent();
            break;
        default:
            specialtyPages.innerHTML = '<div class="container"><div class="section"><h2>Специальность не найдена</h2></div></div>';
    }
    
    // Инициализируем мини-игры если они есть
    initMiniGames();
}

// Функция для плавной прокрутки
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Инициализация мини-игр
function initMiniGames() {
    // Инициализация мини-игры для программирования
    const codeInput = document.getElementById('codeInput');
    const checkCodeBtn = document.getElementById('checkCodeBtn');
    
    if (codeInput && checkCodeBtn) {
        initProgrammingGame();
    }
    
    // Инициализация мини-игры для торгового дела
    const checkScenarioBtn = document.getElementById('checkScenarioBtn');
    if (checkScenarioBtn) {
        initTradeGame();
    }
}

// Анимация появления элементов при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.info-card, .teacher-card, .achievement-card, .semester, .specialty-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

setTimeout(animateOnScroll, 100);

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    const tabs = document.querySelectorAll(`#${modalId} .modal-tab`);
        const tabContents = document.querySelectorAll(`#${modalId} .modal-tab-content`);
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openTab(evt, tabId) {
    const tabcontent = document.querySelectorAll('.modal-tab-content');
    tabcontent.forEach(tab => {
        tab.classList.remove('active');
    });

    const tablinks = document.querySelectorAll('.modal-tab');
    tablinks.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = 'none';
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
            modals[i].style.display = 'none';
        }
    }
});