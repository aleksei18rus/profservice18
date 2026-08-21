// ============================================
// 1. МОБИЛЬНОЕ МЕНЮ
// ============================================
const mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// ============================================
// 2. ПЛАВНАЯ ПРОКРУТКА
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
        }
    });
});

// ============================================
// 3. АНИМАЦИЯ ПРИ ПРОКРУТКЕ
// ============================================
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ============================================
// 4. КАРУСЕЛЬ МАСТЕРСКОЙ
// ============================================
const workshopSlides = document.getElementById('workshopSlides');
const workshopPrev = document.getElementById('workshopPrev');
const workshopNext = document.getElementById('workshopNext');
const workshopNav = document.getElementById('workshopNav');
const workshopDots = workshopNav ? workshopNav.querySelectorAll('.workshop-dot') : [];

let currentWorkshopSlide = 0;
const workshopSlideCount = workshopSlides ? workshopSlides.children.length : 0;

function updateWorkshopCarousel() {
    if (!workshopSlides) return;
    workshopSlides.style.transform = `translateX(-${currentWorkshopSlide * 100}%)`;
    workshopDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentWorkshopSlide);
    });
}

function nextWorkshopSlide() {
    if (!workshopSlides || workshopSlideCount === 0) return;
    currentWorkshopSlide = (currentWorkshopSlide + 1) % workshopSlideCount;
    updateWorkshopCarousel();
}

function prevWorkshopSlide() {
    if (!workshopSlides || workshopSlideCount === 0) return;
    currentWorkshopSlide = (currentWorkshopSlide - 1 + workshopSlideCount) % workshopSlideCount;
    updateWorkshopCarousel();
}

if (workshopPrev && workshopNext) {
    workshopPrev.addEventListener('click', prevWorkshopSlide);
    workshopNext.addEventListener('click', nextWorkshopSlide);
}

workshopDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentWorkshopSlide = index;
        updateWorkshopCarousel();
    });
});

let workshopInterval;
if (workshopSlides && workshopSlideCount > 0) {
    const workshopCarousel = workshopSlides.parentElement;
    workshopInterval = setInterval(nextWorkshopSlide, 5000);
    if (workshopCarousel) {
        workshopCarousel.addEventListener('mouseenter', () => {
            clearInterval(workshopInterval);
        });
        workshopCarousel.addEventListener('mouseleave', () => {
            workshopInterval = setInterval(nextWorkshopSlide, 5000);
        });
    }
}

// ============================================
// 5. ГАЛЕРЕЯ РАБОТ
// ============================================
const gallerySlides = document.getElementById('gallerySlides');
const galleryNav = document.getElementById('galleryNav');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentGallerySlide = 0;
let galleryImages = [];

function initializeGallery() {
    if (!gallerySlides) return;

    // Список фото берём из статичной разметки index.html (единственный источник).
    // Чтобы добавить фото: положить файл в папку gallery/ и добавить слайд+миниатюру в index.html.
    const imgs = gallerySlides.querySelectorAll('.gallery-slide img');
    galleryImages = Array.prototype.map.call(imgs, function(img) {
        return img.getAttribute('src');
    }).filter(function(src) {
        return src && src.trim() !== '';
    });

    // Если изображений нет — показываем заглушку
    if (galleryImages.length === 0) {
        gallerySlides.innerHTML = `
            <div class="gallery-slide" style="display:flex;align-items:center;justify-content:center;background:#f5f5f5;">
                <div style="text-align:center;padding:40px;color:#999;">
                    <i class="fas fa-images" style="font-size:3rem;display:block;margin-bottom:15px;"></i>
                    <p>Добавьте фотографии в папку <strong>gallery/</strong></p>
                    <p style="font-size:0.85rem;margin-top:5px;">photo1.jpg, photo2.jpg, ...</p>
                </div>
            </div>
        `;
        return;
    }

    renderGallery();
    startGalleryAutoplay();
}

// Автопрокрутка галереи (запускается после загрузки списка фото)
function startGalleryAutoplay() {
    if (!gallerySlides || galleryImages.length === 0) return;
    const galleryCarousel = gallerySlides.parentElement;
    galleryInterval = setInterval(nextGallerySlide, 4000);
    if (galleryCarousel) {
        galleryCarousel.addEventListener('mouseenter', function() {
            clearInterval(galleryInterval);
        });
        galleryCarousel.addEventListener('mouseleave', function() {
            galleryInterval = setInterval(nextGallerySlide, 4000);
        });
    }
}

function renderGallery() {
    if (!gallerySlides || !galleryNav) return;

    gallerySlides.innerHTML = '';
    galleryNav.innerHTML = '';

    galleryImages.forEach((imageSrc, index) => {
        if (!imageSrc || imageSrc.trim() === '') return;

        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Пример ремонта техники в Глазове - работа ${index + 1}`;
        img.loading = 'lazy';
        img.onerror = function() { slide.style.display = 'none'; };
        img.addEventListener('click', () => openGalleryLightbox(index));
        slide.appendChild(img);
        gallerySlides.appendChild(slide);

        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb';
        if (index === 0) thumb.classList.add('active');
        thumb.setAttribute('data-index', index);
        const thumbImg = document.createElement('img');
        thumbImg.src = imageSrc;
        thumbImg.alt = `Миниатюра работы ${index + 1}`;
        thumbImg.loading = 'lazy';
        thumb.appendChild(thumbImg);
        galleryNav.appendChild(thumb);

        thumb.addEventListener('click', () => {
            currentGallerySlide = index;
            updateGalleryCarousel();
        });
    });

    updateGalleryCarousel();
}

function updateGalleryCarousel() {
    if (!gallerySlides) return;
    gallerySlides.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
    const thumbs = galleryNav.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentGallerySlide);
    });
}

function nextGallerySlide() {
    if (!gallerySlides || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    updateGalleryCarousel();
}

function prevGallerySlide() {
    if (!gallerySlides || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryCarousel();
}

if (galleryPrev && galleryNext) {
    galleryPrev.addEventListener('click', prevGallerySlide);
    galleryNext.addEventListener('click', nextGallerySlide);
}

let galleryInterval;

// ============================================
// 6. МОДАЛЬНОЕ ОКНО ГАЛЕРЕИ (ЛАЙТБОКС)
// ============================================
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImage = document.getElementById('galleryLightboxImage');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxPrev = document.getElementById('galleryLightboxPrev');
const galleryLightboxNext = document.getElementById('galleryLightboxNext');

function openGalleryLightbox(index) {
    if (!galleryLightbox || !galleryLightboxImage) return;
    currentGallerySlide = index;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${index + 1}`;
    galleryLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox() {
    if (!galleryLightbox) return;
    galleryLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextGalleryLightboxImage() {
    if (!galleryLightboxImage || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    updateGalleryCarousel();
}

function prevGalleryLightboxImage() {
    if (!galleryLightboxImage || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    updateGalleryCarousel();
}

if (galleryLightboxClose && galleryLightboxPrev && galleryLightboxNext) {
    galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
    galleryLightboxPrev.addEventListener('click', prevGalleryLightboxImage);
    galleryLightboxNext.addEventListener('click', nextGalleryLightboxImage);
}

if (galleryLightbox) {
    galleryLightbox.addEventListener('click', (e) => {
        if (e.target === galleryLightbox) closeGalleryLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (galleryLightbox && galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeGalleryLightbox();
        if (e.key === 'ArrowLeft') prevGalleryLightboxImage();
        if (e.key === 'ArrowRight') nextGalleryLightboxImage();
    }
});

// ============================================
// 7. ОТЗЫВЫ: ПОКАЗЫВАЕМ ПО 3 + КНОПКА "ПОКАЗАТЬ ЕЩЁ"
// ============================================

let allReviews = [];
let visibleCount = 3; // ПОКАЗЫВАЕМ 3 ОТЗЫВА
const loadMoreCount = 3; // ДОБАВЛЯЕМ ПО 3

function loadReviews(filterService = null) {
    fetch('reviews.json')
        .then(response => {
            if (!response.ok) throw new Error('Отзывы не найдены');
            return response.json();
        })
        .then(data => {
            allReviews = data.reviews || [];

            if (filterService) {
                allReviews = allReviews.filter(r => r.service === filterService);
            }

            // Сортировка: новые сверху
            allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Сводка рейтинга и счётчик на вкладке
            updateReviewsSummary();
            const tabCount = document.getElementById('tabCount');
            if (tabCount) tabCount.textContent = allReviews.length > 0 ? '(' + allReviews.length + ')' : '';

            if (allReviews.length === 0) {
                document.getElementById('reviewsContainer').innerHTML = `
                    <p style="text-align:center;color:#666;padding:40px 0;grid-column:1/-1;">
                        Пока нет отзывов. Будьте первым!
                    </p>
                `;
                document.getElementById('loadMoreBtn').style.display = 'none';
                document.getElementById('reviewsCounter').textContent = 'Всего отзывов: 0';
                return;
            }

            // Обновляем счётчик
            document.getElementById('reviewsCounter').textContent = `Всего отзывов: ${allReviews.length}`;

            // Показываем первые 3
            visibleCount = Math.min(3, allReviews.length);
            renderReviews();
            updateLoadMoreButton();
        })
        .catch(err => {
            console.error('Ошибка загрузки отзывов:', err);
            document.getElementById('reviewsContainer').innerHTML = `
                <p style="text-align:center;color:#999;padding:40px 0;grid-column:1/-1;">
                    ⚠️ Отзывы временно недоступны
                </p>
            `;
            document.getElementById('loadMoreBtn').style.display = 'none';
            const summaryCount = document.getElementById('summaryCount');
            if (summaryCount) summaryCount.textContent = 'Отзывы временно недоступны';
        });
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    const visibleReviews = allReviews.slice(0, visibleCount);

    container.innerHTML = visibleReviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const initial = (r.name || '?').trim().charAt(0).toUpperCase();
        const cityHtml = r.city
            ? '<span class="review-city"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(r.city) + '</span>'
            : '';
        return `
            <div class="review-card">
                <div class="review-card-top">
                    <div class="review-avatar">${escapeHtml(initial)}</div>
                    <div class="review-head">
                        <div class="review-author">${escapeHtml(r.name || 'Аноним')}</div>
                        <div class="review-meta">
                            <span>${formatReviewDate(r.date)}</span>
                            ${cityHtml}
                        </div>
                    </div>
                    <div class="rating" title="Оценка: ${r.rating} из 5">${stars}</div>
                </div>
                <div class="review-text">«${escapeHtml(r.text)}»</div>
                <div class="review-service">${escapeHtml(r.service || 'Общее')}</div>
            </div>
        `;
    }).join('');
}

// Сводка: средний балл, звёзды, количество
function updateReviewsSummary() {
    const summaryValue = document.getElementById('summaryValue');
    const summaryStars = document.getElementById('summaryStars');
    const summaryCount = document.getElementById('summaryCount');
    if (!summaryValue || !summaryStars || !summaryCount) return;

    if (allReviews.length === 0) {
        summaryValue.textContent = '—';
        summaryStars.textContent = '☆☆☆☆☆';
        summaryCount.textContent = 'Отзывов пока нет — будьте первым!';
        return;
    }

    const total = allReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    const avg = total / allReviews.length;
    summaryValue.textContent = avg.toFixed(1);
    summaryStars.textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
    summaryCount.textContent = 'На основе ' + allReviews.length + ' ' + pluralize(allReviews.length);
}

function pluralize(n) {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'отзыв';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'отзыва';
    return 'отзывов';
}

// Дата в русском формате: "15 ноября 2025"
function formatReviewDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function updateLoadMoreButton() {
    const btn = document.getElementById('loadMoreBtn');
    if (visibleCount >= allReviews.length) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'inline-block';
        const remaining = allReviews.length - visibleCount;
        const nextBatch = Math.min(loadMoreCount, remaining);
        btn.textContent = `Показать ещё ${nextBatch} отзыва (${visibleCount}/${allReviews.length})`;
    }
}

// ============================================
// 8. ПЕРЕКЛЮЧЕНИЕ ТАБОВ
// ============================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        const tabId = this.dataset.tab;
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// ============================================
// 9. ФОРМА ОТЗЫВА → EMAIL
// ============================================
function initReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    const YOUR_EMAIL = 'aleksei18rus@gmail.com';

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const service = formData.get('service') || 'Не указана';
        const rating = formData.get('rating') || '5';
        const name = formData.get('name') || 'Аноним';
        const text = formData.get('text') || '';

        if (!text.trim()) {
            alert('❌ Пожалуйста, напишите текст отзыва');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        const stars = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));

        const subject = encodeURIComponent(`Новый отзыв для ${service}`);
        const body = encodeURIComponent(
            `Новый отзыв для сайта ПрофСервис18\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📋 Услуга: ${service}\n` +
            `⭐ Оценка: ${stars} (${rating}/5)\n` +
            `👤 Имя: ${name}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `📄 Текст отзыва:\n` +
            `${text}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📅 Дата: ${new Date().toLocaleDateString('ru-RU')}\n\n` +
            `⬇️ Чтобы опубликовать отзыв, добавьте его в файл reviews.json:\n` +
            `{\n` +
            `  "id": НОВЫЙ_НОМЕР,\n` +
            `  "name": "${name}",\n` +
            `  "rating": ${rating},\n` +
            `  "text": "${text.replace(/"/g, '\\"')}",\n` +
            `  "date": "${new Date().toISOString().split('T')[0]}",\n` +
            `  "service": "${service}",\n` +
            `  "city": "Глазов"\n` +
            `}`
        );

        window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;

        document.getElementById('reviewSuccess').style.display = 'block';
        form.reset();

        submitBtn.innerHTML = '✅ Отправлено!';
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);

        if (typeof ym !== 'undefined') {
            ym(105213962, 'reachGoal', 'REVIEW_SUBMIT');
        }

        document.getElementById('reviewSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// ============================================
// 10. ФОРМА ЗАЯВКИ (AJAX)
// ============================================
function initCallbackForm() {
    const form = document.getElementById('callbackForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('formSuccess').style.display = 'block';
                form.reset();
                if (typeof ym !== 'undefined') {
                    ym(105213962, 'reachGoal', 'FORM_SUBMIT');
                }
                submitBtn.textContent = '✅ Отправлено!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Ошибка сервера');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('❌ Произошла ошибка. Пожалуйста, свяжитесь с нами по телефону: +7 (912) 010-78-84');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ============================================
// 11. КЛИКАБЕЛЬНЫЕ ТЕЛЕФОНЫ И EMAIL
// ============================================
function enhanceClickablePhones() {
    document.querySelectorAll('#contact-phone, #footer-phone').forEach(phone => {
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

function enhanceEmails() {
    document.querySelectorAll('#contact-email, #footer-email').forEach(email => {
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

// ============================================
// 12. ОТСЛЕЖИВАНИЕ ВНЕШНИХ ССЫЛОК
// ============================================
function trackOutboundLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.addEventListener('click', function() {
                if (typeof ym !== 'undefined') {
                    ym(105213962, 'reachGoal', 'OUTBOUND_LINK');
                }
            });
        }
    });
}

// ============================================
// 13. ВСПЛЫВАЮЩЕЕ ОКНО СКИДКИ
// ============================================
const discountPopup = document.getElementById('discountPopup');
const popupClose = document.getElementById('popupClose');
const popupAction = document.getElementById('popupAction');

if (discountPopup && popupClose && popupAction) {
    // Показываем попап не сразу, а через 30 секунд (ранний показ увеличивает отказы и ухудшает поведенческие факторы для Яндекса)
    setTimeout(() => {
        if (!sessionStorage.getItem('popupShown')) {
            discountPopup.classList.add('active');
            sessionStorage.setItem('popupShown', 'true');
        }
    }, 30000);

    popupClose.addEventListener('click', () => {
        discountPopup.classList.remove('active');
    });

    popupAction.addEventListener('click', () => {
        window.location.href = '#contact';
        discountPopup.classList.remove('active');
    });

    discountPopup.addEventListener('click', (e) => {
        if (e.target === discountPopup) {
            discountPopup.classList.remove('active');
        }
    });
}

// ============================================
// 14. ЯНДЕКС КАРТА
// ============================================
function initYandexMap() {
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function() {
            const mapElement = document.getElementById('yandex-map');
            if (!mapElement) return;

            const map = new ymaps.Map('yandex-map', {
                center: [58.135923, 52.661643],
                zoom: 17,
                controls: ['zoomControl', 'fullscreenControl']
            });

            const placemark = new ymaps.Placemark([58.135461, 52.661849], {
                hintContent: 'ПрофСервис18',
                balloonContent: `
                    <div style="padding:10px;">
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
    }
}

// ============================================
// 15. ПОЛЬЗОВАТЕЛЬСКИЙ ФОН
// ============================================
function setCustomBackground() {
    const customBg = './img/background.jpg';
    const img = new Image();
    img.onload = function() {
        document.documentElement.style.setProperty('--hero-bg', `url('${customBg}')`);
    };
    img.onerror = function() {
        document.documentElement.style.setProperty('--hero-bg', "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')");
    };
    img.src = customBg;
}

// ============================================
// 15.1 ОТСЛЕЖИВАНИЕ РЕМОНТА (ps18.cloudpub.ru)
// Цепочка: fetch (CORS) → JSONP → запасная ссылка
// ============================================
function initTrackWidget() {
    const form = document.getElementById('trackForm');
    const input = document.getElementById('trackPhone');
    const results = document.getElementById('trackResults');
    if (!form || !input || !results) return;

    // Маска ввода телефона +7 (XXX) XXX-XX-XX
    input.addEventListener('input', function() {
        let digits = this.value.replace(/\D/g, '');
        if (digits.length === 0) { this.value = ''; return; }
        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] !== '7') digits = '7' + digits;
        digits = digits.slice(0, 11);
        let out = '+7';
        if (digits.length > 1) out += ' (' + digits.slice(1, 4);
        if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
        if (digits.length >= 7) out += '-' + digits.slice(7, 9);
        if (digits.length >= 9) out += '-' + digits.slice(9, 11);
        this.value = out;
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const digits = input.value.replace(/\D/g, '');
        if (digits.length < 11) {
            results.innerHTML = '<div class="track-error">Пожалуйста, введите номер телефона полностью.</div>';
            return;
        }
        results.innerHTML = '<div class="track-loading">⏳ Ищем ваш заказ…</div>';
        searchOrders('+' + digits);
    });

    // 1) Обычный запрос (работает, если CRM разрешила CORS)
    function searchOrders(phone) {
        const apiUrl = 'https://ps18.cloudpub.ru/track/api?phone=' + encodeURIComponent(phone);
        fetch(apiUrl)
            .then(function(r) { return r.json(); })
            .then(function(data) { renderTrackData(data); })
            .catch(function() { tryJsonp(apiUrl); });
    }

    // 2) JSONP через <script> (работает, если API поддерживает параметр callback)
    function tryJsonp(apiUrl) {
        let done = false;
        const cbName = 'ps18TrackCb_' + Date.now();
        window[cbName] = function(data) {
            done = true;
            cleanup();
            renderTrackData(data);
        };
        const script = document.createElement('script');
        script.src = apiUrl + '&callback=' + cbName;
        script.onerror = cleanup;
        document.head.appendChild(script);
        setTimeout(cleanup, 7000);

        function cleanup() {
            if (window[cbName]) { delete window[cbName]; }
            if (script.parentNode) { script.parentNode.removeChild(script); }
            if (!done) showLinkFallback();
        }
    }

    // 3) Запасной вариант: ссылка на страницу отслеживания
    function showLinkFallback() {
        results.innerHTML = '<div class="track-error">CRM не разрешает показывать заказ прямо на сайте. ' +
            '<a href="https://ps18.cloudpub.ru/track/" target="_blank" rel="noopener">Откройте страницу отслеживания</a> ' +
            'или позвоните нам: <a href="tel:+79120107884">+7 (912) 010-78-84</a>.</div>';
    }

    function renderTrackData(data) {
        if (data.error) {
            results.innerHTML = '<div class="track-error">' + escapeHtml(data.error) + '</div>';
            return;
        }
        if (!data.orders || data.orders.length === 0) {
            results.innerHTML = '<div class="track-empty">По этому номеру заказы не найдены. Проверьте номер или позвоните нам: <a href="tel:+79120107884">+7 (912) 010-78-84</a>.</div>';
            return;
        }
        results.innerHTML = data.orders.map(function(order) {
            const statusClass = statusClassFor(order.status);
            const cost = order.total_cost ? '<div class="track-cost">' + escapeHtml(order.total_cost) + ' ₽</div>' : '';
            return '<div class="track-order">' +
                '<div class="order-info">' +
                    '<strong>Заказ №' + escapeHtml(order.order_number || '—') + '</strong>' +
                    '<span>' + escapeHtml(order.brand || '') + ' ' + escapeHtml(order.model || '') + '</span>' +
                '</div>' +
                '<div class="order-meta">' +
                    '<span class="track-status ' + statusClass + '">' + escapeHtml(order.status_label || '—') + '</span>' +
                    cost +
                '</div>' +
            '</div>';
        }).join('');
    }
}

function statusClassFor(status) {
    const map = {
        'done': 'ok', 'ready': 'ok', 'completed': 'ok', 'finished': 'ok', 'выдан': 'ok', 'готов': 'ok', 'завершен': 'ok',
        'in_repair': 'work', 'repair': 'work', 'in_work': 'work', 'в_ремонте': 'work', 'в ремонте': 'work', 'ремонт': 'work',
        'waiting_parts': 'wait', 'awaiting_parts': 'wait', 'wait': 'wait', 'ждет_запчасти': 'wait', 'ожидание': 'wait',
        'received': 'new', 'new': 'new', 'принят': 'new', 'принято': 'new',
        'issue': 'bad', 'cancelled': 'bad', 'canceled': 'bad', 'отменен': 'bad', 'отменён': 'bad'
    };
    return map[String(status).toLowerCase()] || 'default';
}

function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

// ============================================
// 16. ИНИЦИАЛИЗАЦИЯ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Фон
    setCustomBackground();

    // Галерея
    initializeGallery();

    // Отзывы
    loadReviews();

    // Кнопка "Показать ещё" (+3)
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCount = Math.min(visibleCount + loadMoreCount, allReviews.length);
            renderReviews();
            updateLoadMoreButton();

            const container = document.getElementById('reviewsContainer');
            const lastCard = container.lastElementChild;
            if (lastCard) {
                setTimeout(() => {
                    lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    }

    // Формы
    initReviewForm();
    initCallbackForm();

    // Отслеживание ремонта
    initTrackWidget();

    // Контакты
    enhanceClickablePhones();
    enhanceEmails();

    // Ссылки
    trackOutboundLinks();

    // Карта
    initYandexMap();

    // Анимация
    animateOnScroll();
});

// ============================================
// 17. SERVICE WORKER (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker зарегистрирован успешно');
            })
            .catch(function(err) {
                console.log('Ошибка регистрации ServiceWorker: ', err);
            });
    });
}

console.log('✅ ПрофСервис18 – сайт полностью загружен!');