// Переключение мобильного меню
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылки
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Закрытие мобильного меню если открыто
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Анимация при прокрутке
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if(elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Пользовательский фон
function setCustomBackground() {
    const customBg = './img/background.jpg';
    const img = new Image();
    img.onload = function() {
        document.documentElement.style.setProperty('--hero-bg', `url('${customBg}')`);
    };
    img.onerror = function() {
        // Используем стандартный фон если пользовательское изображение не существует
        document.documentElement.style.setProperty('--hero-bg', "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')");
    };
    img.src = customBg;
}

// Карусель мастерской
const workshopSlides = document.getElementById('workshopSlides');
const workshopPrev = document.getElementById('workshopPrev');
const workshopNext = document.getElementById('workshopNext');
const workshopNav = document.getElementById('workshopNav');
const workshopDots = workshopNav ? workshopNav.querySelectorAll('.workshop-dot') : [];

let currentWorkshopSlide = 0;
const workshopSlideCount = workshopSlides ? workshopSlides.children.length : 0;

// Инициализация изображений мастерской
function initializeWorkshopImages() {
    if (!workshopSlides) return;
    
    // Проверяем какие изображения действительно существуют
    for (let i = 0; i < workshopSlideCount - 1; i++) {
        const img = workshopSlides.children[i].querySelector('img');
        if (img) {
            img.onerror = function() {
                // Если изображение не существует, скрываем слайд
                workshopSlides.children[i].style.display = 'none';
            };
        }
    }
}

// Обновление карусели мастерской
function updateWorkshopCarousel() {
    if (!workshopSlides) return;
    
    workshopSlides.style.transform = `translateX(-${currentWorkshopSlide * 100}%)`;
    
    // Обновляем точки
    workshopDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentWorkshopSlide);
    });
}

// Следующий слайд мастерской
function nextWorkshopSlide() {
    if (!workshopSlides) return;
    currentWorkshopSlide = (currentWorkshopSlide + 1) % workshopSlideCount;
    updateWorkshopCarousel();
}

// Предыдущий слайд мастерской
function prevWorkshopSlide() {
    if (!workshopSlides) return;
    currentWorkshopSlide = (currentWorkshopSlide - 1 + workshopSlideCount) % workshopSlideCount;
    updateWorkshopCarousel();
}

// Инициализация карусели мастерской если элементы существуют
if (workshopPrev && workshopNext) {
    workshopPrev.addEventListener('click', prevWorkshopSlide);
    workshopNext.addEventListener('click', nextWorkshopSlide);
}

// Навигация точками
workshopDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentWorkshopSlide = index;
        updateWorkshopCarousel();
    });
});

// Автопрокрутка карусели мастерской
let workshopInterval;
if (workshopSlides) {
    workshopInterval = setInterval(nextWorkshopSlide, 5000);

    // Пауза автопрокрутки при наведении
    workshopSlides.parentElement.addEventListener('mouseenter', () => {
        clearInterval(workshopInterval);
    });

    workshopSlides.parentElement.addEventListener('mouseleave', () => {
        workshopInterval = setInterval(nextWorkshopSlide, 5000);
    });
}

// Карусель галереи
const gallerySlides = document.getElementById('gallerySlides');
const galleryNav = document.getElementById('galleryNav');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentGallerySlide = 0;
let galleryImages = [];

// Инициализация галереи с изображениями из папки gallery
function initializeGallery() {
    if (!gallerySlides) return;
    
    galleryImages = [
        './gallery/photo1.jpg',
        './gallery/photo2.jpg',
        './gallery/photo3.jpg',
        './gallery/photo4.jpg',
        './gallery/photo5.jpg',
        './gallery/photo6.jpg',
        './gallery/photo7.jpg',
        './gallery/photo8.jpg',
        './gallery/photo9.jpg'
    ].filter(src => src); // Фильтруем пустые строки
    
    // Если нет изображений галереи, скрываем секцию
    if (galleryImages.length === 0) {
        document.querySelector('.gallery').style.display = 'none';
        return;
    }
    
    renderGallery();
}

// Отрисовка галереи
function renderGallery() {
    if (!gallerySlides || !galleryNav) return;
    
    gallerySlides.innerHTML = '';
    galleryNav.innerHTML = '';
    
    galleryImages.forEach((imageSrc, index) => {
        // Пропускаем пустые или невалидные URL
        if (!imageSrc || imageSrc.trim() === '') return;
        
        // Создаем слайд
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Пример ремонта техники в Глазове от ПрофСервис18 - работа ${index + 1}`;
        img.loading = 'lazy';
        img.classList.add('lazy-image');
        img.addEventListener('click', () => openGalleryLightbox(index));
        img.onerror = function() {
            // Если изображение не загружается, удаляем слайд
            slide.style.display = 'none';
        };
        
        slide.appendChild(img);
        gallerySlides.appendChild(slide);
        
        // Создаем миниатюру
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb';
        if (index === 0) thumb.classList.add('active');
        thumb.setAttribute('data-index', index);
        
        const thumbImg = document.createElement('img');
        thumbImg.src = imageSrc;
        thumbImg.alt = `Миниатюра примера работы ${index + 1}`;
        thumbImg.loading = 'lazy';
        thumbImg.classList.add('lazy-image');
        
        thumb.appendChild(thumbImg);
        galleryNav.appendChild(thumb);
        
        // Событие клика на миниатюру
        thumb.addEventListener('click', () => {
            currentGallerySlide = index;
            updateGalleryCarousel();
        });
    });
    
    // Обновляем карусель галереи
    updateGalleryCarousel();
}

// Обновление карусели галереи
function updateGalleryCarousel() {
    if (!gallerySlides) return;
    
    gallerySlides.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
    
    // Обновляем миниатюры
    const thumbs = galleryNav.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentGallerySlide);
    });
}

// Следующий слайд галереи
function nextGallerySlide() {
    if (!gallerySlides || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    updateGalleryCarousel();
}

// Предыдущий слайд галереи
function prevGallerySlide() {
    if (!gallerySlides || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryCarousel();
}

// Инициализация карусели галереи если элементы существуют
if (galleryPrev && galleryNext) {
    galleryPrev.addEventListener('click', prevGallerySlide);
    galleryNext.addEventListener('click', nextGallerySlide);
}

// Автопрокрутка карусели галереи
let galleryInterval;
if (gallerySlides && galleryImages.length > 0) {
    galleryInterval = setInterval(nextGallerySlide, 4000);

    // Пауза автопрокрутки при наведении
    gallerySlides.parentElement.addEventListener('mouseenter', () => {
        clearInterval(galleryInterval);
    });

    gallerySlides.parentElement.addEventListener('mouseleave', () => {
        galleryInterval = setInterval(nextGallerySlide, 4000);
    });
}

// Модальное окно для галереи
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImage = document.getElementById('galleryLightboxImage');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxPrev = document.getElementById('galleryLightboxPrev');
const galleryLightboxNext = document.getElementById('galleryLightboxNext');

// Открытие модального окна галереи
function openGalleryLightbox(index) {
    if (!galleryLightbox || !galleryLightboxImage) return;
    
    currentGallerySlide = index;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${index + 1}`;
    galleryLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна галереи
function closeGalleryLightbox() {
    if (!galleryLightbox) return;
    
    galleryLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Следующее изображение в модальном окне
function nextGalleryLightboxImage() {
    if (!galleryLightboxImage || galleryImages.length === 0) return;
    
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${currentGallerySlide + 1}`;
    updateGalleryCarousel();
}

// Предыдущее изображение в модальном окне
function prevGalleryLightboxImage() {
    if (!galleryLightboxImage || galleryImages.length === 0) return;
    
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${currentGallerySlide + 1}`;
    updateGalleryCarousel();
}

// Инициализация модального окна если элементы существуют
if (galleryLightboxClose && galleryLightboxPrev && galleryLightboxNext) {
    galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
    galleryLightboxPrev.addEventListener('click', prevGalleryLightboxImage);
    galleryLightboxNext.addEventListener('click', nextGalleryLightboxImage);
}

// Закрытие модального окна по клику на фон
if (galleryLightbox) {
    galleryLightbox.addEventListener('click', (e) => {
        if (e.target === galleryLightbox) {
            closeGalleryLightbox();
        }
    });
}

// Навигация с клавиатуры
document.addEventListener('keydown', (e) => {
    if (galleryLightbox && galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeGalleryLightbox();
        if (e.key === 'ArrowLeft') prevGalleryLightboxImage();
        if (e.key === 'ArrowRight') nextGalleryLightboxImage();
    }
});

// Улучшение кликабельных телефонов
function enhanceClickablePhones() {
    const phones = document.querySelectorAll('#contact-phone, #footer-phone');
    phones.forEach(phone => {
        if (!phone.querySelector('a')) {
            const phoneNumber = phone.textContent.trim();
            const link = document.createElement('a');
            link.href = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
            link.className = 'clickable-phone';
            link.textContent = phoneNumber;
            phone.innerHTML = '';
            phone.appendChild(link);
        }
    });
}

// Улучшение email
function enhanceEmails() {
    const emails = document.querySelectorAll('#contact-email, #footer-email');
    emails.forEach(email => {
        if (!email.querySelector('a')) {
            const emailAddress = email.textContent.trim();
            const link = document.createElement('a');
            link.href = `mailto:${emailAddress}`;
            link.textContent = emailAddress;
            email.innerHTML = '';
            email.appendChild(link);
        }
    });
}

// Отслеживание внешних ссылок для аналитики
function trackOutboundLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.addEventListener('click', function(e) {
                // Отправляем событие в Яндекс.Метрику
                if (window.ym) {
                    ym(105213962, 'reachGoal', 'OUTBOUND_LINK');
                }
            });
        }
    });
}

// Всплывающее окно скидки
const discountPopup = document.getElementById('discountPopup');
const popupClose = document.getElementById('popupClose');
const popupAction = document.getElementById('popupAction');

// Проверяем существование элементов перед работой с ними
if (discountPopup && popupClose && popupAction) {
    // Показываем попап через 3 секунды после загрузки
    setTimeout(() => {
        // Проверяем, не показывали ли уже попап в этой сессии
        if (!sessionStorage.getItem('popupShown')) {
            discountPopup.classList.add('active');
            sessionStorage.setItem('popupShown', 'true');
        }
    }, 3000);

    // Закрытие попапа
    popupClose.addEventListener('click', () => {
        discountPopup.classList.remove('active');
    });

    // Действие при нажатии на кнопку
    popupAction.addEventListener('click', () => {
        // Переход к контактам
        window.location.href = '#contact';
        discountPopup.classList.remove('active');
    });

    // Закрытие по клику на фон
    discountPopup.addEventListener('click', (e) => {
        if (e.target === discountPopup) {
            discountPopup.classList.remove('active');
        }
    });
}

// Яндекс Карта
function initYandexMap() {
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function () {
            const map = new ymaps.Map('yandex-map', {
                center: [58.135923, 52.661643],
                zoom: 17,
                controls: ['zoomControl', 'fullscreenControl']
            });
            
            const placemark = new ymaps.Placemark([58.135461,52.661849], {
                hintContent: 'ПрофСервис18',
                balloonContent: `
                    <div style="padding: 10px;">
                        <strong>ПрофСервис18</strong><br>
                        Сервисный центр в Глазове<br>
                        ул. Динамо, д. 2<br>
                        <a href="tel:+79120107884">+7 (912) 010-78-84</a>
                    </div>
                `
            }, {
                preset: 'islands#redIcon'
            });
            
            map.geoObjects.add(placemark);
        });
    } else {
        console.log('API Яндекс.Карт не загружен');
    }
}

// Ленивая загрузка для изображений
function initLazyLoading() {
    const images = document.querySelectorAll('img.lazy-image');
    
    // Если браузер поддерживает IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        images.forEach(img => {
            // Сохраняем оригинальный src в data-src
            if (!img.dataset.src && img.src) {
                img.dataset.src = img.src;
            }
            imageObserver.observe(img);
        });
    } else {
        // Fallback для старых браузеров
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Виджеты ВКонтакте
function initVKWidgets() {
    // Просто ждем и пробуем инициализировать
    setTimeout(() => {
        if (typeof VK !== 'undefined') {
            try {
                // Комментарии
                if (document.getElementById('vk_comments')) {
                    VK.Widgets.Comments("vk_comments", { 
                        limit: 50, 
                        attach: "*" 
                    });
                }
                
                // Посты
                const posts = [
                    { id: 'vk_post_407958737_70', owner: 407958737, post: 70, hash: 'LqQCwgVri0cVdpQuao1fcNO4_lRZ' },
                    { id: 'vk_post_407958737_61', owner: 407958737, post: 61, hash: 'VnZGVvYvsrOe_wSa0xoWSYDn5fwg' },
                    { id: 'vk_post_407958737_56', owner: 407958737, post: 56, hash: 'ZAOZ6_Qj4WRj_HFutxVZhPwyLCFH' }
                ];
                
                posts.forEach(post => {
                    if (document.getElementById(post.id)) {
                        VK.Widgets.Post(post.id, post.owner, post.post, post.hash);
                    }
                });
                
            } catch (error) {
                console.log('VK виджеты не загрузились, но сайт продолжает работать');
            }
        }
    }, 3000);
}

// Управление контактной информацией
function updateContactInfo() {
    // Простая функция для проверки контактных данных
    console.log('Контактная информация проверена');
    
    // Убеждаемся, что телефоны и email кликабельны
    enhanceClickablePhones();
    enhanceEmails();
}

// Инициализация всего при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setCustomBackground();
    initializeWorkshopImages();
    initializeGallery();
    updateContactInfo(); // Теперь эта функция определена
    enhanceClickablePhones();
    enhanceEmails();
    trackOutboundLinks();
    initYandexMap();
    initLazyLoading();
    initVKWidgets();
    
    // Первоначальная проверка анимации
    animateOnScroll();
});

// Регистрация Service Worker для PWA (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Регистрация ServiceWorker успешна');
            })
            .catch(function(err) {
                console.log('Регистрация ServiceWorker не удалась: ', err);
            });
    });
}