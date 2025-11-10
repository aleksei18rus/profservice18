// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
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
const workshopDots = workshopNav.querySelectorAll('.workshop-dot');

let currentWorkshopSlide = 0;
const workshopSlideCount = workshopSlides.children.length;

// Initialize workshop images
function initializeWorkshopImages() {
    // Check which images actually exist
    const workshopImages = [
        './img/mast1.jpg',
        './img/mast2.jpg', 
        './img/mast3.jpg',
        './img/mast4.jpg'

    ];
    
    // Update slides based on existing images
    for (let i = 0; i < workshopSlideCount - 1; i++) {
        const img = workshopSlides.children[i].querySelector('img');
        if (img && !workshopImages[i]) {
            // If image doesn't exist, hide the slide
            workshopSlides.children[i].style.display = 'none';
        }
    }
}

// Update workshop carousel
function updateWorkshopCarousel() {
    workshopSlides.style.transform = `translateX(-${currentWorkshopSlide * 100}%)`;
    
    // Update dots
    workshopDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentWorkshopSlide);
    });
}

// Next workshop slide
function nextWorkshopSlide() {
    currentWorkshopSlide = (currentWorkshopSlide + 1) % workshopSlideCount;
    updateWorkshopCarousel();
}

// Previous workshop slide
function prevWorkshopSlide() {
    currentWorkshopSlide = (currentWorkshopSlide - 1 + workshopSlideCount) % workshopSlideCount;
    updateWorkshopCarousel();
}

// Event listeners for workshop carousel
workshopPrev.addEventListener('click', prevWorkshopSlide);
workshopNext.addEventListener('click', nextWorkshopSlide);

// Dot navigation
workshopDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentWorkshopSlide = index;
        updateWorkshopCarousel();
    });
});

// Auto-advance workshop carousel
let workshopInterval = setInterval(nextWorkshopSlide, 5000);

// Pause auto-advance on hover
workshopSlides.parentElement.addEventListener('mouseenter', () => {
    clearInterval(workshopInterval);
});

workshopSlides.parentElement.addEventListener('mouseleave', () => {
    workshopInterval = setInterval(nextWorkshopSlide, 5000);
});

// Gallery Carousel
const gallerySlides = document.getElementById('gallerySlides');
const galleryNav = document.getElementById('galleryNav');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentGallerySlide = 0;
let galleryImages = [];

// Initialize gallery with images from gallery folder
function initializeGallery() {
    galleryImages = [
        './gallery/photo1.jpg',
        './gallery/photo2.jpg',
        './gallery/photo3.jpg',
        './gallery/photo4.jpg',
        './gallery/photo5.jpg',
        './gallery/photo6.jpg',
        './gallery/photo7.jpg',
        './gallery/photo8.jpg'
    ];
    
    renderGallery();
}

// Render gallery
function renderGallery() {
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
        img.alt = `Пример работы ${index + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openGalleryLightbox(index));
        img.onerror = function() {
            // If image fails to load, remove the item
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
        thumbImg.alt = `Пример работы ${index + 1}`;
        
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
    gallerySlides.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
    
    // Update thumbnails
    const thumbs = galleryNav.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentGallerySlide);
    });
}

// Next gallery slide
function nextGallerySlide() {
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    updateGalleryCarousel();
}

// Previous gallery slide
function prevGallerySlide() {
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryCarousel();
}

// Event listeners for gallery carousel
galleryPrev.addEventListener('click', prevGallerySlide);
galleryNext.addEventListener('click', nextGallerySlide);

// Auto-advance gallery carousel
let galleryInterval = setInterval(nextGallerySlide, 4000);

// Pause auto-advance on hover
gallerySlides.parentElement.addEventListener('mouseenter', () => {
    clearInterval(galleryInterval);
});

gallerySlides.parentElement.addEventListener('mouseleave', () => {
    galleryInterval = setInterval(nextGallerySlide, 4000);
});

// Lightbox Modal for Gallery
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImage = document.getElementById('galleryLightboxImage');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxPrev = document.getElementById('galleryLightboxPrev');
const galleryLightboxNext = document.getElementById('galleryLightboxNext');

// Open gallery lightbox
function openGalleryLightbox(index) {
    currentGallerySlide = index;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    galleryLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close gallery lightbox
function closeGalleryLightbox() {
    galleryLightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Next gallery image in lightbox
function nextGalleryLightboxImage() {
    currentGallerySlide = (currentGallerySlide + 1) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    updateGalleryCarousel();
}

// Previous gallery image in lightbox
function prevGalleryLightboxImage() {
    currentGallerySlide = (currentGallerySlide - 1 + galleryImages.length) % galleryImages.length;
    galleryLightboxImage.src = galleryImages[currentGallerySlide];
    updateGalleryCarousel();
}

// Event listeners for gallery lightbox
galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
galleryLightboxPrev.addEventListener('click', prevGalleryLightboxImage);
galleryLightboxNext.addEventListener('click', nextGalleryLightboxImage);

// Close lightbox on background click
galleryLightbox.addEventListener('click', (e) => {
    if (e.target === galleryLightbox) {
        closeGalleryLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeGalleryLightbox();
        if (e.key === 'ArrowLeft') prevGalleryLightboxImage();
        if (e.key === 'ArrowRight') nextGalleryLightboxImage();
    }
});

// Reviews Management with Collapsible
const reviewsContainer = document.getElementById('reviewsContainer');
const hiddenReviews = document.getElementById('hiddenReviews');
const toggleReviewsBtn = document.getElementById('toggleReviewsBtn');
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');
let currentRating = 0;
let reviewsExpanded = false;

// Initialize reviews
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    {
        name: 'Иван К.',
        rating: 5,
        text: 'Отличный сервис! Починили ноутбук за один день, хотя в других местах говорили, что ремонт займет неделю. Цены адекватные, мастер все объяснил и показал. Рекомендую!',
        date: '2024-10-15'
    },
    {
        name: 'Мария С.',
        rating: 5,
        text: 'Разбила экран телефона, думала, что придется покупать новый. В ПрофСервис18 заменили дисплей за разумные деньги, телефон как новый. Спасибо за качественную работу!',
        date: '2024-09-28'
    },
    {
        name: 'Алексей П.',
        rating: 4,
        text: 'Починили игровую консоль, которая не включалась. Сделали быстро, дали гарантию. Единственное - пришлось немного подождать запчасть, но это мелочи. В целом все отлично!',
        date: '2024-08-12'
    },
    {
        name: 'Ольга В.',
        rating: 5,
        text: 'Заказывала 3D-печать детали для старого пылесоса. Напечатали быстро, качественно, деталь идеально подошла. Очень довольна сервисом!',
        date: '2024-07-05'
    },
    {
        name: 'Дмитрий Н.',
        rating: 5,
        text: 'Ремонтировал телевизор. Мастер приехал на дом, быстро нашел проблему и починил. Очень вежливый и профессиональный. Буду рекомендовать знакомым!',
        date: '2024-06-18'
    },
    {
        name: 'Сергей',
        rating: 5,
        text: 'Пользуюсь услугами с 2018 года. Всегда качественный ремонт по адекватным ценам. Особенно хочу отметить ремонт PlayStation 4 - сделали быстро и недорого.',
        date: '2023-11-05'
    },
    {
        name: 'Анна Петрова',
        rating: 5,
        text: 'Обратилась в 2019 году с разбитым экраном телефона. С тех пор все ремонты только здесь. Ни разу не подводили! Спасибо за честность и профессионализм.',
        date: '2023-08-20'
    },
    {
        name: 'Михаил',
        rating: 4,
        text: 'Делали 3D-печать детали для автомобиля в 2020 году. Качество печати отличное, деталь служит до сих пор. Цены reasonable.',
        date: '2023-05-15'
    }
];

// Function to render reviews
function renderReviews() {
    reviewsContainer.innerHTML = '';
    hiddenReviews.innerHTML = '';
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show last 3 reviews
    const visibleReviews = sortedReviews.slice(0, 3);
    const hiddenReviewsList = sortedReviews.slice(3);
    
    visibleReviews.forEach((review, index) => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });
    
    hiddenReviewsList.forEach((review, index) => {
        const reviewCard = createReviewCard(review);
        hiddenReviews.appendChild(reviewCard);
    });
    
    // Update toggle button text
    toggleReviewsBtn.textContent = hiddenReviewsList.length > 0 ? 
        `Показать все отзывы (${hiddenReviewsList.length}+)` : 
        'Показать все отзывы';
}

// Function to create review card
function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card animate-on-scroll animated';
    
    const reviewHeader = document.createElement('div');
    reviewHeader.className = 'review-header';
    
    const avatar = document.createElement('div');
    avatar.className = 'review-avatar';
    avatar.textContent = review.name.split(' ').map(n => n[0]).join('');
    
    const reviewInfo = document.createElement('div');
    reviewInfo.className = 'review-info';
    
    const name = document.createElement('h4');
    name.textContent = review.name;
    
    const date = document.createElement('div');
    date.className = 'review-date';
    date.textContent = formatDate(review.date);
    
    reviewInfo.appendChild(name);
    reviewInfo.appendChild(date);
    reviewHeader.appendChild(avatar);
    reviewHeader.appendChild(reviewInfo);
    
    const stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.innerHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = review.text;
    
    reviewCard.appendChild(reviewHeader);
    reviewCard.appendChild(stars);
    reviewCard.appendChild(text);
    
    return reviewCard;
}

// Toggle reviews visibility
toggleReviewsBtn.addEventListener('click', () => {
    reviewsExpanded = !reviewsExpanded;
    hiddenReviews.classList.toggle('active', reviewsExpanded);
    toggleReviewsBtn.textContent = reviewsExpanded ? 
        'Скрыть отзывы' : 
        `Показать все отзывы (${reviews.length - 3}+)`;
});

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Star rating functionality
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
});

// Review form submission
reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (currentRating === 0) {
        alert('Пожалуйста, поставьте оценку');
        return;
    }
    
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;
    
    const newReview = {
        name: name,
        rating: currentRating,
        text: text,
        date: new Date().toISOString().split('T')[0]
    };
    
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    renderReviews();
    
    alert('Спасибо за ваш отзыв!');
    reviewForm.reset();
    
    // Reset stars
    starRating.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
    });
    currentRating = 0;
    
    // Collapse reviews if expanded
    if (reviewsExpanded) {
        hiddenReviews.classList.remove('active');
        reviewsExpanded = false;
        toggleReviewsBtn.textContent = `Показать все отзывы (${reviews.length - 3}+)`;
    }
});

// Contact information management
const savedContacts = JSON.parse(localStorage.getItem('contactInfo'));
if (savedContacts) {
    // Update contact info on the page
    updateContactInfo();
}

// Function to update contact information on the page
function updateContactInfo() {
    const savedContacts = JSON.parse(localStorage.getItem('contactInfo'));
    if (savedContacts) {
        // Update contact section
        document.getElementById('contact-phone').textContent = savedContacts.phone || '+7 (912) 010-78-84';
        document.getElementById('contact-email').textContent = savedContacts.email || 'aleksei18rus@gmail.com';
        document.getElementById('contact-address').textContent = savedContacts.address || 'г. Глазов, ул. Динамо, д. 2 (магазин "Инструменты и точка")';
        
        // Safely handle hours with fallback
        const hours = savedContacts.hours || 'Пн-Пт: 10:00 - 18:00, Сб: 10:00 - 16:00, Вс: выходной';
        document.getElementById('contact-hours').innerHTML = hours.replace ? hours.replace(', ', '<br>') : hours;
        
        // Update footer
        document.getElementById('footer-phone').textContent = savedContacts.phone || '+7 (912) 010-78-84';
        document.getElementById('footer-email').textContent = savedContacts.email || 'aleksei18rus@gmail.com';
        document.getElementById('footer-address').textContent = savedContacts.address || 'г. Глазов, ул. Динамо, д. 2';
    }
}

// Initialize everything on page load
setCustomBackground();
initializeWorkshopImages();
initializeGallery();
renderReviews();