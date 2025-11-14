// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Smooth Scrolling
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
            
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Animation on Scroll
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

// Custom Background Image
function setCustomBackground() {
    const customBg = './img/background.jpg';
    const img = new Image();
    img.onload = function() {
        document.documentElement.style.setProperty('--hero-bg', `url('${customBg}')`);
    };
    img.onerror = function() {
        // Use default background if custom image doesn't exist
        document.documentElement.style.setProperty('--hero-bg', "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')");
    };
    img.src = customBg;
}

// Workshop Carousel
const workshopSlides = document.getElementById('workshopSlides');
const workshopPrev = document.getElementById('workshopPrev');
const workshopNext = document.getElementById('workshopNext');
const workshopNav = document.getElementById('workshopNav');
const workshopDots = workshopNav ? workshopNav.querySelectorAll('.workshop-dot') : [];

let currentWorkshopSlide = 0;
const workshopSlideCount = workshopSlides ? workshopSlides.children.length : 0;

// Initialize workshop images
function initializeWorkshopImages() {
    if (!workshopSlides) return;
    
    // Check which images actually exist
    const workshopImages = [
        './img/mast1.jpg',
        './img/mast2.jpg', 
        './img/mast3.jpg'
    ];
    
    // Update slides based on existing images
    for (let i = 0; i < workshopSlideCount - 1; i++) {
        const img = workshopSlides.children[i].querySelector('img');
        if (img) {
            img.onerror = function() {
                // If image doesn't exist, hide the slide
                workshopSlides.children[i].style.display = 'none';
            };
        }
    }
}

// Update workshop carousel
function updateWorkshopCarousel() {
    if (!workshopSlides) return;
    
    workshopSlides.style.transform = `translateX(-${currentWorkshopSlide * 100}%)`;
    
    // Update dots
    workshopDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentWorkshopSlide);
    });
}

// Next workshop slide
function nextWorkshopSlide() {
    if (!workshopSlides) return;
    currentWorkshopSlide = (currentWorkshopSlide + 1) % workshopSlideCount;
    updateWorkshopCarousel();
}

// Previous workshop slide
function prevWorkshopSlide() {
    if (!workshopSlides) return;
    currentWorkshopSlide = (currentWorkshopSlide - 1 + workshopSlideCount) % workshopSlideCount;
    updateWorkshopCarousel();
}

// Initialize workshop carousel if elements exist
if (workshopPrev && workshopNext) {
    workshopPrev.addEventListener('click', prevWorkshopSlide);
    workshopNext.addEventListener('click', nextWorkshopSlide);
}

// Dot navigation
workshopDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentWorkshopSlide = index;
        updateWorkshopCarousel();
    });
});

// Auto-advance workshop carousel
let workshopInterval;
if (workshopSlides) {
    workshopInterval = setInterval(nextWorkshopSlide, 5000);

    // Pause auto-advance on hover
    workshopSlides.parentElement.addEventListener('mouseenter', () => {
        clearInterval(workshopInterval);
    });

    workshopSlides.parentElement.addEventListener('mouseleave', () => {
        workshopInterval = setInterval(nextWorkshopSlide, 5000);
    });
}

// Gallery Carousel
const gallerySlides = document.getElementById('gallerySlides');
const galleryNav = document.getElementById('galleryNav');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentGallerySlide = 0;
let galleryImages = [];

// Initialize gallery with images from gallery folder
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
    ].filter(src => src); // Filter out empty strings
    
    // If no gallery images, hide the gallery section
    if (galleryImages.length === 0) {
        document.querySelector('.gallery').style.display = 'none';
        return;
    }
    
    renderGallery();
}

// Render gallery
function renderGallery() {
    if (!gallerySlides || !galleryNav) return;
    
    gallerySlides.innerHTML = '';
    galleryNav.innerHTML = '';
    
    galleryImages.forEach((imageSrc, index) => {
        // Skip empty or invalid URLs
        if (!imageSrc || imageSrc.trim() === '') return;
        
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Пример ремонта техники в Глазове от ПрофСервис18 - работа ${index + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openGalleryLightbox(index));
        img.onerror = function() {
            // If image fails to load, remove the slide
            slide.style.display = 'none';
        };
        
        slide.appendChild(img);
        gallerySlides.appendChild(slide);
        
        // Create thumbnail
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb';
        if (index === 0) thumb.classList.add('active');
        thumb.setAttribute('data-index', index);
        
        const thumbImg = document.createElement('img');
        thumbImg.src = imageSrc;
        thumbImg.alt = `Миниатюра примера работы ${index + 1}`;
        thumbImg.loading = 'lazy';
        
        thumb.appendChild(thumbImg);
        galleryNav.appendChild(thumb);
        
        // Thumb click event
        thumb.addEventListener('click', () => {
            currentGallerySlide = index;
            updateGalleryCarousel();
        });
    });
    
    // Update gallery carousel
    updateGalleryCarousel();
}

// Update gallery carousel
function updateGalleryCarousel() {
    if (!gallerySlides) return;
    
    gallerySlides.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
    
    // Update thumbnails
    const thumbs = galleryNav.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentGallerySlide);
    });
}

// Next gallery slide
function nextGallerySlide() {
    if (!gallerySlides || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    updateGalleryCarousel();
}

// Previous gallery slide
function prevGallerySlide() {
    if (!gallerySlides || galleryImages.length === 0) return;
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryCarousel();
}

// Initialize gallery carousel if elements exist
if (galleryPrev && galleryNext) {
    galleryPrev.addEventListener('click', prevGallerySlide);
    galleryNext.addEventListener('click', nextGallerySlide);
}

// Auto-advance gallery carousel
let galleryInterval;
if (gallerySlides && galleryImages.length > 0) {
    galleryInterval = setInterval(nextGallerySlide, 4000);

    // Pause auto-advance on hover
    gallerySlides.parentElement.addEventListener('mouseenter', () => {
        clearInterval(galleryInterval);
    });

    gallerySlides.parentElement.addEventListener('mouseleave', () => {
        galleryInterval = setInterval(nextGallerySlide, 4000);
    });
}

// Lightbox Modal for Gallery
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImage = document.getElementById('galleryLightboxImage');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxPrev = document.getElementById('galleryLightboxPrev');
const galleryLightboxNext = document.getElementById('galleryLightboxNext');

// Open gallery lightbox
function openGalleryLightbox(index) {
    if (!galleryLightbox || !galleryLightboxImage) return;
    
    currentGallerySlide = index;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${index + 1}`;
    galleryLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close gallery lightbox
function closeGalleryLightbox() {
    if (!galleryLightbox) return;
    
    galleryLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Next gallery image in lightbox
function nextGalleryLightboxImage() {
    if (!galleryLightboxImage || galleryImages.length === 0) return;
    
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${currentGallerySlide + 1}`;
    updateGalleryCarousel();
}

// Previous gallery image in lightbox
function prevGalleryLightboxImage() {
    if (!galleryLightboxImage || galleryImages.length === 0) return;
    
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightboxImage.alt = `Пример ремонта техники в Глазове - работа ${currentGallerySlide + 1}`;
    updateGalleryCarousel();
}

// Initialize lightbox if elements exist
if (galleryLightboxClose && galleryLightboxPrev && galleryLightboxNext) {
    galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
    galleryLightboxPrev.addEventListener('click', prevGalleryLightboxImage);
    galleryLightboxNext.addEventListener('click', nextGalleryLightboxImage);
}

// Close lightbox on background click
if (galleryLightbox) {
    galleryLightbox.addEventListener('click', (e) => {
        if (e.target === galleryLightbox) {
            closeGalleryLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (galleryLightbox && galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeGalleryLightbox();
        if (e.key === 'ArrowLeft') prevGalleryLightboxImage();
        if (e.key === 'ArrowRight') nextGalleryLightboxImage();
    }
});

// Reviews Management with JSON
const reviewsContainer = document.getElementById('reviewsContainer');
const hiddenReviews = document.getElementById('hiddenReviews');
const toggleReviewsBtn = document.getElementById('toggleReviewsBtn');
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');
let currentRating = 0;
let reviewsExpanded = false;
let reviews = [];

// Load reviews from JSON file
async function loadReviews() {
    try {
        const response = await fetch('./reviews.json');
        const data = await response.json();
        reviews = data.reviews;
        
        // Merge with local storage reviews
        const localReviews = JSON.parse(localStorage.getItem('profservice18_reviews')) || [];
        reviews = [...reviews, ...localReviews];
        
        renderReviews();
    } catch (error) {
        console.error('Error loading reviews:', error);
        // Fallback to local storage
        reviews = JSON.parse(localStorage.getItem('profservice18_reviews')) || [];
        renderReviews();
    }
}

// Save new review to local storage
function saveReviewToLocal(review) {
    const localReviews = JSON.parse(localStorage.getItem('profservice18_reviews')) || [];
    localReviews.push({
        ...review,
        id: Date.now(), // Unique ID
        city: 'Глазов'
    });
    localStorage.setItem('profservice18_reviews', JSON.stringify(localReviews));
}

// Function to render reviews
function renderReviews() {
    if (!reviewsContainer || !hiddenReviews) return;
    
    reviewsContainer.innerHTML = '';
    hiddenReviews.innerHTML = '';
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show last 3 reviews
    const visibleReviews = sortedReviews.slice(0, 3);
    const hiddenReviewsList = sortedReviews.slice(3);
    
    visibleReviews.forEach((review) => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });
    
    hiddenReviewsList.forEach((review) => {
        const reviewCard = createReviewCard(review);
        hiddenReviews.appendChild(reviewCard);
    });
    
    // Update toggle button text
    if (toggleReviewsBtn) {
        toggleReviewsBtn.textContent = hiddenReviewsList.length > 0 ? 
            `Показать все отзывы (${hiddenReviewsList.length}+)` : 
            'Показать все отзывы';
            
        // Show/hide toggle button based on reviews count
        toggleReviewsBtn.style.display = hiddenReviewsList.length > 0 ? 'block' : 'none';
    }
}

// Function to create review card
function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card animate-on-scroll animated';
    reviewCard.setAttribute('itemscope', '');
    reviewCard.setAttribute('itemtype', 'https://schema.org/Review');
    
    const reviewHeader = document.createElement('div');
    reviewHeader.className = 'review-header';
    
    const avatar = document.createElement('div');
    avatar.className = 'review-avatar';
    avatar.textContent = review.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    
    const reviewInfo = document.createElement('div');
    reviewInfo.className = 'review-info';
    
    const name = document.createElement('h4');
    name.textContent = review.name;
    name.setAttribute('itemprop', 'author');
    
    const date = document.createElement('div');
    date.className = 'review-date';
    date.textContent = formatDate(review.date);
    date.setAttribute('itemprop', 'datePublished');
    date.setAttribute('content', review.date);
    
    reviewInfo.appendChild(name);
    reviewInfo.appendChild(date);
    
    // Service type if available
    if (review.service) {
        const service = document.createElement('div');
        service.className = 'review-service';
        service.textContent = review.service;
        reviewInfo.appendChild(service);
    }
    
    reviewHeader.appendChild(avatar);
    reviewHeader.appendChild(reviewInfo);
    
    const stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.setAttribute('itemprop', 'reviewRating');
    stars.setAttribute('itemscope', '');
    stars.setAttribute('itemtype', 'https://schema.org/Rating');
    stars.innerHTML = `
        <span itemprop="ratingValue" style="display: none;">${review.rating}</span>
        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
    `;
    
    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = review.text;
    text.setAttribute('itemprop', 'reviewBody');
    
    reviewCard.appendChild(reviewHeader);
    reviewCard.appendChild(stars);
    reviewCard.appendChild(text);
    
    return reviewCard;
}

// Toggle reviews visibility
if (toggleReviewsBtn) {
    toggleReviewsBtn.addEventListener('click', () => {
        reviewsExpanded = !reviewsExpanded;
        if (hiddenReviews) {
            hiddenReviews.classList.toggle('active', reviewsExpanded);
        }
        toggleReviewsBtn.textContent = reviewsExpanded ? 
            'Скрыть отзывы' : 
            `Показать все отзывы (${reviews.length - 3}+)`;
    });
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Star rating functionality
if (starRating) {
    starRating.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            
            starRating.querySelectorAll('.star').forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            starRating.querySelectorAll('.star').forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.style.color = '#f1c40f';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            starRating.querySelectorAll('.star').forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) > currentRating) {
                    s.style.color = '#ddd';
                }
            });
        });
    });
}

// Review form submission
if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (currentRating === 0) {
            alert('Пожалуйста, поставьте оценку');
            return;
        }
        
        const name = document.getElementById('reviewName').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        
        if (!name || !text) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        const newReview = {
            name: name,
            rating: currentRating,
            text: text,
            date: new Date().toISOString().split('T')[0],
            service: 'Ремонт техники',
            city: 'Глазов'
        };
        
        // Save to local storage
        saveReviewToLocal(newReview);
        
        // Add to current reviews and re-render
        reviews.push(newReview);
        renderReviews();
        
        alert('Спасибо за ваш отзыв о нашем сервисе в Глазове!');
        reviewForm.reset();
        
        // Reset stars
        starRating.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
            star.style.color = '';
        });
        currentRating = 0;
        
        // Collapse reviews if expanded
        if (reviewsExpanded && hiddenReviews) {
            hiddenReviews.classList.remove('active');
            reviewsExpanded = false;
            if (toggleReviewsBtn) {
                toggleReviewsBtn.textContent = `Показать все отзывы (${reviews.length - 3}+)`;
            }
        }
    });
}

// Contact information management
function updateContactInfo() {
    const savedContacts = JSON.parse(localStorage.getItem('profservice18_contacts'));
    if (savedContacts) {
        // Update contact section
        const contactPhone = document.getElementById('contact-phone');
        const contactEmail = document.getElementById('contact-email');
        const contactAddress = document.getElementById('contact-address');
        const contactHours = document.getElementById('contact-hours');
        
        // Footer elements
        const footerPhone = document.getElementById('footer-phone');
        const footerEmail = document.getElementById('footer-email');
        const footerAddress = document.getElementById('footer-address');
        
        if (contactPhone) contactPhone.textContent = savedContacts.phone || '+7 (912) 010-78-84';
        if (contactEmail) contactEmail.textContent = savedContacts.email || 'aleksei18rus@gmail.com';
        if (contactAddress) contactAddress.textContent = savedContacts.address || 'г. Глазов, ул. Динамо, д. 2 (магазин "Инструменты и точка")';
        if (contactHours) contactHours.innerHTML = (savedContacts.hours || 'Пн-Пт: 10:00 - 18:00<br>Сб: 10:00 - 16:00<br>Вс: выходной').replace(/, /g, '<br>');
        
        // Update footer
        if (footerPhone) footerPhone.textContent = savedContacts.phone || '+7 (912) 010-78-84';
        if (footerEmail) footerEmail.textContent = savedContacts.email || 'aleksei18rus@gmail.com';
        if (footerAddress) footerAddress.textContent = savedContacts.address || 'г. Глазов, ул. Динамо, д. 2';
    }
}

// Clickable phone numbers enhancement
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

// Email enhancement
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

// Track outbound links for analytics
function trackOutboundLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.addEventListener('click', function(e) {
                // Send event to Yandex.Metrika
                if (window.ym) {
                    ym(105213962, 'reachGoal', 'OUTBOUND_LINK');
                }
            });
        }
    });
}

// Popup скидки
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
        // Можно добавить переход к контактам или другому действию
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

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function() {
    setCustomBackground();
    initializeWorkshopImages();
    initializeGallery();
    loadReviews();
    updateContactInfo();
    enhanceClickablePhones();
    enhanceEmails();
    trackOutboundLinks();
    initYandexMap();
    // Initial animation check
    animateOnScroll();
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
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
        console.log('Yandex Maps API not loaded');
    }
}