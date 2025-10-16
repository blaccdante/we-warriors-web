/**
 * Modern Dynamic Slideshow with Advanced Features
 * Supports touch/swipe, auto-play, smooth transitions, and accessibility
 */
class ModernSlideshow {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoPlay: true,
            autoPlayInterval: 6000,
            transitionDuration: 800,
            pauseOnHover: true,
            enableTouch: true,
            enableKeyboard: true,
            showProgress: true,
            showArrows: true,
            showDots: true,
            loop: true,
            ...options
        };

        this.currentSlide = 0;
        this.slides = [];
        this.isPlaying = false;
        this.isPaused = false;
        this.progressInterval = null;
        this.autoPlayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.createSlideshow();
        this.setupEventListeners();
        this.startAutoPlay();
        
        // Preload images for better performance
        this.preloadImages();
    }

    createSlideshow() {
        const slideshowHTML = `
            <div class="slideshow-container">
                ${this.createSlides()}
                ${this.options.showArrows ? this.createArrows() : ''}
                ${this.options.showDots ? this.createDots() : ''}
                ${this.options.showProgress ? this.createProgressBar() : ''}
                <div class="slide-floating-elements">
                    <div class="floating-element"></div>
                    <div class="floating-element"></div>
                    <div class="floating-element"></div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = slideshowHTML;
        this.slides = this.container.querySelectorAll('.slide');
        this.dots = this.container.querySelectorAll('.nav-dot');
        this.progressBar = this.container.querySelector('.progress-bar');
        
        // Set first slide as active
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
            if (this.dots.length > 0) {
                this.dots[0].classList.add('active');
            }
        }
    }

    createSlides() {
        const slideData = [
            {
                type: 'image',
                src: 'assets/images/hero/AdobeStock_1132382728.jpeg',
                title: 'We Warriors',
                subtitle: 'From Pain comes Strength • Through Faith we Hope',
                description: 'Join our global community of sickle cell warriors fighting for better lives, breakthrough treatments, and a future without sickle cell disease.',
                actions: [
                    { text: 'Find Support', href: '#support', class: 'slide-btn-primary' },
                    { text: 'Learn More', href: '#about', class: 'slide-btn-secondary' }
                ]
            },
            {
                type: 'image',
                src: 'assets/images/hero/AdobeStock_1334794303.jpeg',
                title: 'Breakthrough Research',
                subtitle: 'Gene Therapy & Clinical Trials',
                description: 'Revolutionary treatments are changing lives. Stay informed about the latest research, clinical trials, and treatment options available to warriors worldwide.',
                actions: [
                    { text: 'Research Updates', href: 'information/research.html', class: 'slide-btn-primary' },
                    { text: 'Clinical Trials', href: 'information/research.html#trials', class: 'slide-btn-secondary' }
                ]
            },
            {
                type: 'image',
                src: 'assets/images/hero/AdobeStock_1623564694.jpeg',
                title: 'Warrior Stories',
                subtitle: 'Inspiring Journeys of Hope & Triumph',
                description: 'Read powerful testimonies from warriors who have transformed their pain into purpose, their struggles into strength, and their faith into unshakeable hope.',
                actions: [
                    { text: 'Read Stories', href: 'community/warrior-stories.html', class: 'slide-btn-primary' },
                    { text: 'Share Your Story', href: 'community/warrior-stories.html#submit', class: 'slide-btn-secondary' }
                ]
            },
            {
                type: 'image',
                src: 'assets/images/hero/AdobeStock_791905348.jpeg',
                title: 'Join the Movement',
                subtitle: 'Together We Are Stronger',
                description: 'Be part of the global movement to end sickle cell disease. Your voice, your story, and your support can make a difference in millions of lives.',
                actions: [
                    { text: 'Get Involved', href: 'pages/get-involved.html', class: 'slide-btn-primary' },
                    { text: 'Donate Now', href: 'pages/donate.html', class: 'slide-btn-secondary' }
                ]
            },
            {
                type: 'image',
                src: 'assets/images/hero/AdobeStock_857158545.jpeg',
                title: 'Healthcare Professionals',
                subtitle: 'Resources & Continuing Education',
                description: 'Access the latest clinical guidelines, CME courses, and professional resources to provide exceptional care for sickle cell patients.',
                actions: [
                    { text: 'Professional Hub', href: 'professionals/partnerships.html', class: 'slide-btn-primary' },
                    { text: 'Learn More', href: 'professionals/partnerships.html#resources', class: 'slide-btn-secondary' }
                ]
            },
        ];

        return slideData.map((slide, index) => {
            const actionsHTML = slide.actions.map(action => 
                `<a href="${action.href}" class="slide-btn ${action.class}">${action.text}</a>`
            ).join('');

            // All slides are now image slides
            return `
                <div class="slide" data-index="${index}">
                    <img class="slide-image" src="${slide.src}" alt="${slide.title}" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        z-index: 1;
                    ">
                    <div class="slide-content">
                        <h1 class="slide-title">${slide.title}</h1>
                        <p class="slide-subtitle">${slide.subtitle}</p>
                        <p class="slide-description">${slide.description}</p>
                        <div class="slide-actions">
                            ${actionsHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    createArrows() {
        return `
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
        `;
    }

    createDots() {
        const totalSlides = 5; // Updated after removing video slide
        return `
            <div class="slideshow-nav">
                ${Array.from({length: totalSlides}, (_, i) => 
                    `<button class="nav-dot" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
                ).join('')}
            </div>
        `;
    }

    createProgressBar() {
        return `
            <div class="slide-progress">
                <div class="progress-bar"></div>
            </div>
        `;
    }

    setupEventListeners() {
        // Arrow navigation
        const prevBtn = this.container.querySelector('.prev');
        const nextBtn = this.container.querySelector('.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch/swipe support - Don't prevent default to allow scrolling
        if (this.options.enableTouch) {
            this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
            this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        }

        // Keyboard navigation
        if (this.options.enableKeyboard) {
            document.addEventListener('keydown', (e) => this.handleKeydown(e));
        }

        // Pause on hover
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Intersection Observer for performance
        this.setupIntersectionObserver();

        // Window focus/blur events
        window.addEventListener('focus', () => this.resumeAutoPlay());
        window.addEventListener('blur', () => this.pauseAutoPlay());
        
        // Theme change listener to fix visibility
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    setTimeout(() => this.fixDarkModeVisibility(), 100);
                }
            });
        });
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resumeAutoPlay();
                } else {
                    this.pauseAutoPlay();
                }
            });
        });

        observer.observe(this.container);
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
    }
    
    handleTouchMove(e) {
        // Only prevent default for horizontal swipes, allow vertical scrolling
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const diffX = Math.abs(currentX - this.touchStartX);
        const diffY = Math.abs(currentY - this.touchStartY);
        
        // If horizontal movement is greater, it's a swipe
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Only swipe if horizontal movement is greater than vertical
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoPlay();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (index === this.currentSlide || index >= this.slides.length) return;

        // Handle video playback
        this.handleVideoPlayback(this.currentSlide, index);

        // Update slides
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[index].classList.add('active');

        // Update dots
        if (this.dots.length > 0) {
            this.dots[this.currentSlide].classList.remove('active');
            this.dots[index].classList.add('active');
        }

        this.currentSlide = index;
        this.resetProgress();
        
        // Force visibility in dark mode
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            const activeSlide = this.slides[index];
            const images = activeSlide.querySelectorAll('.slide-image, .slide-video');
            
            activeSlide.style.opacity = '1';
            activeSlide.style.visibility = 'visible';
            activeSlide.style.display = 'flex';
            
            images.forEach(img => {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.display = 'block';
            });
        }
        
        // Trigger animations
        this.triggerSlideAnimations(index);
    }

    handleVideoPlayback(oldIndex, newIndex) {
        const oldSlide = this.slides[oldIndex];
        const newSlide = this.slides[newIndex];
        
        const oldVideo = oldSlide.querySelector('video');
        const newVideo = newSlide.querySelector('video');

        if (oldVideo) {
            oldVideo.pause();
            oldVideo.currentTime = 0;
        }

        if (newVideo) {
            // Small delay to ensure smooth transition
            setTimeout(() => {
                newVideo.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            }, 400);
        }
    }

    triggerSlideAnimations(index) {
        const slide = this.slides[index];
        const content = slide.querySelector('.slide-content');
        
        // Reset animations
        const animatedElements = content.querySelectorAll('.slide-title, .slide-subtitle, .slide-description, .slide-actions');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
        });
    }

    startAutoPlay() {
        if (!this.options.autoPlay || this.isPlaying) return;

        this.isPlaying = true;
        this.autoPlayTimer = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.options.autoPlayInterval);

        this.startProgress();
    }

    pauseAutoPlay() {
        this.isPaused = true;
        this.pauseProgress();
    }

    resumeAutoPlay() {
        if (!this.options.autoPlay || !this.isPlaying) return;
        this.isPaused = false;
        this.resumeProgress();
    }

    stopAutoPlay() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        this.stopProgress();
    }

    toggleAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startProgress() {
        if (!this.options.showProgress || !this.progressBar) return;

        this.resetProgress();
        
        let startTime = Date.now();
        const duration = this.options.autoPlayInterval;

        this.progressInterval = setInterval(() => {
            if (this.isPaused) return;

            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration * 100, 100);
            
            this.progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                this.resetProgress();
                startTime = Date.now();
            }
        }, 16); // 60fps
    }

    pauseProgress() {
        // Progress pausing is handled by the isPaused flag
    }

    resumeProgress() {
        // Progress resuming is handled by the isPaused flag
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        this.resetProgress();
    }

    resetProgress() {
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
    }

    preloadImages() {
        const images = [
            'assets/images/hero/AdobeStock_1132382728.jpeg',
            'assets/images/hero/AdobeStock_1334794303.jpeg',
            'assets/images/hero/AdobeStock_1623564694.jpeg',
            'assets/images/hero/AdobeStock_791905348.jpeg',
            'assets/images/hero/AdobeStock_857158545.jpeg'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Public API methods
    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }

    refresh() {
        this.destroy();
        this.init();
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.slides.length;
    }
    
    // Fix dark mode visibility issues
    fixDarkModeVisibility() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            console.log('Fixing dark mode visibility for slideshow');
            
            const slides = this.container.querySelectorAll('.slide');
            const images = this.container.querySelectorAll('.slide-image, .slide-video');
            
            // Force all slides to be visible
            slides.forEach(slide => {
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
                slide.style.display = 'flex';
            });
            
            // Force all images/videos to be visible
            images.forEach(img => {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.display = 'block';
                img.style.filter = 'none';
            });
            
            // Ensure active slide is properly visible
            const activeSlide = this.container.querySelector('.slide.active');
            if (activeSlide) {
                activeSlide.style.opacity = '1';
                activeSlide.style.visibility = 'visible';
                activeSlide.style.zIndex = '10';
                activeSlide.style.display = 'flex';
            }
            
            // Force container visibility
            this.container.style.opacity = '1';
            this.container.style.visibility = 'visible';
        }
    }
}

// Fast slideshow initialization with performance optimizations
function initializeSlideshow() {
    const slideshowContainer = document.querySelector('.hero-slideshow');
    if (!slideshowContainer) return;
    
    // Detect device capabilities for optimization
    const isMobile = window.innerWidth <= 768;
    const isSlowDevice = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Performance-optimized options
    const options = {
        autoPlay: !isSlowDevice && !prefersReducedMotion,
        autoPlayInterval: isMobile ? 8000 : 6000, // Slower on mobile for better UX
        transitionDuration: prefersReducedMotion ? 200 : (isMobile ? 500 : 800),
        pauseOnHover: !isMobile,
        enableTouch: isMobile,
        enableKeyboard: false, // Disable for performance
        showProgress: !isSlowDevice,
        showArrows: !isMobile || !isSlowDevice,
        showDots: true,
        loop: true
    };
    
    // Create slideshow
    window.heroSlideshow = new ModernSlideshow(slideshowContainer, options);
    
    // Immediate dark mode fix
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        requestAnimationFrame(() => {
            window.heroSlideshow.fixDarkModeVisibility();
        });
    }
    
    console.log('Slideshow initialized with performance optimizations:', {
        isMobile, isSlowDevice, prefersReducedMotion
    });
}

// Use the most efficient initialization method
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSlideshow);
} else if (document.readyState === 'interactive') {
    // DOM ready but resources still loading
    if (window.requestIdleCallback) {
        requestIdleCallback(initializeSlideshow);
    } else {
        setTimeout(initializeSlideshow, 1);
    }
} else {
    // Everything is ready
    initializeSlideshow();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernSlideshow;
}