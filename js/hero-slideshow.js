/**
 * Hero Slideshow Script - Modern, Interactive Homepage Hero
 * Integrates with the existing modern-slideshow component but adds hero-specific enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-slideshow');
    
    if (!heroSection) return;
    
    // Preload slide images for better performance
    const slideImages = [
        'images/hero/hero-slide-1.jpg',
        'images/hero/hero-slide-2.jpg',
        'images/hero/hero-slide-3.jpg',
        'images/hero/hero-slide-4.jpg'
    ];
    
    preloadImages(slideImages);
    
    // Create slideshow content
    const slideshowHTML = `
        <div class="slideshow-container">
            <!-- Slide 1 - Main Hero -->
            <div class="slide active" data-index="0">
                <div class="slide-background">
                    <img class="slide-image" src="images/hero/hero-slide-1.jpg" alt="Sickle Cell Warriors">
                    <div class="slide-overlay"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-title">We Warriors</h1>
                    <p class="slide-subtitle">From Pain comes Strength • Through Faith we Hope</p>
                    <p class="slide-description">Join our global community of warriors fighting for better lives, breakthrough treatments, and a future without sickle cell disease.</p>
                    <div class="slide-actions">
                        <a href="#support" class="slide-btn slide-btn-primary">Find Support</a>
                        <a href="#about" class="slide-btn slide-btn-secondary">Learn More</a>
                    </div>
                </div>
                <div class="slide-floating-elements">
                    <div class="floating-element hope"></div>
                    <div class="floating-element faith"></div>
                    <div class="floating-element strength"></div>
                </div>
            </div>
            
            <!-- Slide 2 - Research Focus -->
            <div class="slide" data-index="1">
                <div class="slide-background">
                    <img class="slide-image" src="images/hero/hero-slide-2.jpg" alt="Breakthrough Research">
                    <div class="slide-overlay"></div>
                </div>
                <div class="slide-content">
                    <h2 class="slide-title">Breakthrough Research</h2>
                    <p class="slide-subtitle">Gene Therapy & Clinical Trials</p>
                    <p class="slide-description">Revolutionary treatments are changing lives. Stay informed about the latest research, clinical trials, and treatment options.</p>
                    <div class="slide-actions">
                        <a href="information/research.html" class="slide-btn slide-btn-primary">Research Updates</a>
                        <a href="information/research.html#trials" class="slide-btn slide-btn-secondary">Clinical Trials</a>
                    </div>
                </div>
                <div class="slide-floating-elements">
                    <div class="floating-element dna"></div>
                    <div class="floating-element science"></div>
                </div>
            </div>
            
            <!-- Slide 3 - Warrior Stories -->
            <div class="slide" data-index="2">
                <div class="slide-background">
                    <img class="slide-image" src="images/hero/hero-slide-3.jpg" alt="Warrior Stories">
                    <div class="slide-overlay"></div>
                </div>
                <div class="slide-content">
                    <h2 class="slide-title">Warrior Stories</h2>
                    <p class="slide-subtitle">Inspiring Journeys of Hope & Triumph</p>
                    <p class="slide-description">Read powerful testimonies from warriors who have transformed their pain into purpose, their struggles into strength, and their faith into hope.</p>
                    <div class="slide-actions">
                        <a href="community/warrior-stories.html" class="slide-btn slide-btn-primary">Read Stories</a>
                        <a href="community/warrior-stories.html#submit" class="slide-btn slide-btn-secondary">Share Your Story</a>
                    </div>
                </div>
                <div class="slide-floating-elements">
                    <div class="floating-element story"></div>
                    <div class="floating-element community"></div>
                </div>
            </div>
            
            <!-- Slide 4 - Get Involved -->
            <div class="slide" data-index="3">
                <div class="slide-background">
                    <img class="slide-image" src="images/hero/hero-slide-4.jpg" alt="Join the Movement">
                    <div class="slide-overlay"></div>
                </div>
                <div class="slide-content">
                    <h2 class="slide-title">Join the Movement</h2>
                    <p class="slide-subtitle">Together We Are Stronger</p>
                    <p class="slide-description">Be part of the global movement to end sickle cell disease. Your voice, your story, and your support can make a difference.</p>
                    <div class="slide-actions">
                        <a href="pages/get-involved.html" class="slide-btn slide-btn-primary">Get Involved</a>
                        <a href="pages/donate.html" class="slide-btn slide-btn-secondary">Donate Now</a>
                    </div>
                </div>
                <div class="slide-floating-elements">
                    <div class="floating-element impact"></div>
                    <div class="floating-element change"></div>
                </div>
            </div>
            
            <!-- Navigation Controls -->
            <button class="slideshow-arrow prev" aria-label="Previous slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>
            <button class="slideshow-arrow next" aria-label="Next slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
            </button>
            
            <!-- Slide Indicators -->
            <div class="slideshow-nav">
                <button class="nav-dot active" data-slide="0" aria-label="Go to slide 1"></button>
                <button class="nav-dot" data-slide="1" aria-label="Go to slide 2"></button>
                <button class="nav-dot" data-slide="2" aria-label="Go to slide 3"></button>
                <button class="nav-dot" data-slide="3" aria-label="Go to slide 4"></button>
            </div>
            
            <!-- Progress Bar -->
            <div class="slide-progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    `;
    
    // Insert slideshow content
    heroSection.innerHTML = slideshowHTML;
    
    // Add slideshow styling
    addSlideshowStyles();
    
    // Initialize slideshow functionality
    initSlideshow();
    
    function preloadImages(images) {
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    function addSlideshowStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .hero-slideshow {
                position: relative;
                width: 100%;
                height: 80vh;
                min-height: 600px;
                overflow: hidden;
                background: #0f0f0f;
            }
            
            .slideshow-container {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .slide {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 1.2s ease;
                z-index: 1;
            }
            
            .slide.active {
                opacity: 1;
                z-index: 2;
            }
            
            .slide-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            .slide-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .slide-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(139, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%);
                z-index: 2;
            }
            
            .slide-content {
                position: relative;
                z-index: 3;
                padding: 0 40px;
                max-width: 1200px;
                margin: 0 auto;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: white;
                text-align: center;
            }
            
            .slide-title {
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 1rem;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 1s forwards;
                animation-delay: 0.3s;
            }
            
            .slide-subtitle {
                font-size: 1.5rem;
                font-weight: 400;
                margin-bottom: 1.5rem;
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 1s forwards;
                animation-delay: 0.5s;
            }
            
            .slide-description {
                font-size: 1.1rem;
                max-width: 700px;
                margin: 0 auto 2rem auto;
                line-height: 1.6;
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 1s forwards;
                animation-delay: 0.7s;
            }
            
            .slide-actions {
                display: flex;
                justify-content: center;
                gap: 20px;
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 1s forwards;
                animation-delay: 0.9s;
            }
            
            .slide-btn {
                padding: 12px 30px;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .slide-btn-primary {
                background: #8B0000;
                color: white;
                border: 2px solid #8B0000;
            }
            
            .slide-btn-primary:hover {
                background: #a00000;
                border-color: #a00000;
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(139, 0, 0, 0.3);
            }
            
            .slide-btn-secondary {
                background: transparent;
                color: white;
                border: 2px solid white;
            }
            
            .slide-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
            }
            
            .slideshow-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            }
            
            .slideshow-arrow:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-50%) scale(1.1);
            }
            
            .prev {
                left: 20px;
            }
            
            .next {
                right: 20px;
            }
            
            .slideshow-nav {
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                z-index: 10;
            }
            
            .nav-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .nav-dot.active {
                background: white;
                transform: scale(1.2);
            }
            
            .slide-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                z-index: 10;
            }
            
            .progress-bar {
                height: 100%;
                width: 0;
                background: #8B0000;
                transition: width 0.1s linear;
            }
            
            .slide-floating-elements {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2;
                pointer-events: none;
            }
            
            .floating-element {
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
                animation: float 10s infinite ease-in-out;
            }
            
            .floating-element.hope {
                top: 20%;
                left: 15%;
                width: 150px;
                height: 150px;
                animation-delay: 0s;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            }
            
            .floating-element.faith {
                top: 60%;
                right: 20%;
                width: 200px;
                height: 200px;
                animation-delay: -3s;
                background: radial-gradient(circle, rgba(139,0,0,0.1) 0%, rgba(139,0,0,0) 70%);
            }
            
            .floating-element.strength {
                top: 30%;
                right: 10%;
                width: 120px;
                height: 120px;
                animation-delay: -6s;
                background: radial-gradient(circle, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0) 70%);
            }
            
            .floating-element.dna,
            .floating-element.science,
            .floating-element.story,
            .floating-element.community,
            .floating-element.impact,
            .floating-element.change {
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0) translateX(0); }
                25% { transform: translateY(-15px) translateX(10px); }
                50% { transform: translateY(5px) translateX(-10px); }
                75% { transform: translateY(-5px) translateX(15px); }
            }
            
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .hero-slideshow {
                    height: 90vh;
                    min-height: 500px;
                }
                
                .slide-title {
                    font-size: 2.5rem;
                }
                
                .slide-subtitle {
                    font-size: 1.2rem;
                }
                
                .slide-description {
                    font-size: 1rem;
                }
                
                .slide-actions {
                    flex-direction: column;
                    gap: 15px;
                    align-items: center;
                }
                
                .slide-btn {
                    width: 100%;
                    max-width: 250px;
                }
                
                .slideshow-arrow {
                    width: 40px;
                    height: 40px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function initSlideshow() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.nav-dot');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const progressBar = document.querySelector('.progress-bar');
        
        let autoplayInterval;
        let progressInterval;
        const autoplayDuration = 6000; // 6 seconds per slide
        
        // Initialize
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        startAutoplay();
        
        // Event Listeners
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });
        
        // Touch swipe detection
        let touchStartX = 0;
        let touchEndX = 0;
        
        heroSection.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        heroSection.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (diff > 50) { // Swipe left
                goToSlide(currentSlide + 1);
            } else if (diff < -50) { // Swipe right
                goToSlide(currentSlide - 1);
            }
        }
        
        // Pause on hover
        heroSection.addEventListener('mouseenter', pauseAutoplay);
        heroSection.addEventListener('mouseleave', resumeAutoplay);
        
        // Function to go to a specific slide
        function goToSlide(index) {
            // Reset progress bar
            clearInterval(progressInterval);
            progressBar.style.width = '0%';
            
            // Reset autoplay
            clearInterval(autoplayInterval);
            
            // Handle index bounds
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            
            // Update slides
            slides[currentSlide].classList.remove('active');
            slides[index].classList.add('active');
            
            // Update dots
            dots[currentSlide].classList.remove('active');
            dots[index].classList.add('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Restart autoplay
            startAutoplay();
        }
        
        function startAutoplay() {
            // Start progress bar animation
            let progress = 0;
            progressBar.style.width = '0%';
            
            progressInterval = setInterval(() => {
                progress += 0.1;
                progressBar.style.width = `${progress}%`;
            }, autoplayDuration / 1000);
            
            // Set autoplay
            autoplayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, autoplayDuration);
        }
        
        function pauseAutoplay() {
            clearInterval(autoplayInterval);
            clearInterval(progressInterval);
        }
        
        function resumeAutoplay() {
            startAutoplay();
        }
    }
});