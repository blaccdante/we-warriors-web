// We Warriors - Modern & Beautiful JavaScript
// Sophisticated animations, interactions, and user experience enhancements

class ModernWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHeaderEffects();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupProgressiveEnhancement();
        this.setupInteractiveElements();
        this.setupPerformanceOptimizations();
        
        console.log('🎉 Modern We Warriors website initialized');
    }

    // Sophisticated scroll-triggered animations
    setupScrollAnimations() {
        // Intersection Observer for performance-optimized animations
        const observerOptions = {
            threshold: [0, 0.1, 0.5],
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const ratio = entry.intersectionRatio;

                if (entry.isIntersecting) {
                    // Add staggered animation delays for child elements
                    const children = element.querySelectorAll(':scope > *');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0) scale(1)';
                        }, index * 100);
                    });

                    element.classList.add('animate-in');
                    
                    // Special animations for specific elements
                    if (element.classList.contains('progression-timeline')) {
                        this.animateProgression(element);
                    }
                    
                    if (element.classList.contains('stats-grid')) {
                        this.animateNumbers(element);
                    }
                } else if (ratio < 0.1) {
                    // Optional: fade out when scrolling away
                    element.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.content-card, .progression-timeline, .stats-grid, .comparison-grid').forEach(el => {
            // Prepare elements for animation
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) scale(0.95)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            observer.observe(el);
        });
    }

    // Dynamic header effects based on scroll
    setupHeaderEffects() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const header = document.querySelector('.site-header');
        const navbar = document.querySelector('.navbar');

        const updateHeader = () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            
            // Add scrolled class for styling
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Auto-hide header on scroll down (optional)
            if (scrollY > 200 && scrollDirection === 'down') {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            // Adjust navbar padding based on scroll
            const paddingFactor = Math.max(0.5, 1 - scrollY / 500);
            navbar.style.padding = `${16 * paddingFactor}px 0`;

            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Enhanced mobile menu with smooth animations
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        const overlay = document.createElement('div');
        
        overlay.classList.add('mobile-menu-overlay');
        document.body.appendChild(overlay);

        if (!toggle || !menu) return;

        const toggleMenu = (show) => {
            const isExpanded = show !== undefined ? show : toggle.getAttribute('aria-expanded') !== 'true';
            
            toggle.setAttribute('aria-expanded', isExpanded);
            
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
                overlay.classList.add('active');
                menu.classList.add('mobile-active');
                
                // Animate menu items in
                const menuItems = menu.querySelectorAll('.nav-item');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 50);
                });
            } else {
                document.body.style.overflow = '';
                overlay.classList.remove('active');
                menu.classList.remove('mobile-active');
            }
        };

        toggle.addEventListener('click', () => toggleMenu());
        overlay.addEventListener('click', () => toggleMenu(false));

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('mobile-active')) {
                toggleMenu(false);
            }
        });
    }

    // Buttery smooth scrolling with easing
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    // Custom smooth scroll with easing
                    this.smoothScrollTo(targetPosition, 800);
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    // Custom smooth scroll implementation
    smoothScrollTo(targetY, duration) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const scrollStep = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startY + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        };

        requestAnimationFrame(scrollStep);
    }

    // Progressive enhancement for advanced features
    setupProgressiveEnhancement() {
        // Check for advanced browser features
        const supportsIntersectionObserver = 'IntersectionObserver' in window;
        const supportsWebGL = this.checkWebGLSupport();
        const supportsAdvancedCSS = CSS.supports('backdrop-filter', 'blur(10px)');

        document.documentElement.classList.add(
            supportsIntersectionObserver ? 'supports-intersection-observer' : 'no-intersection-observer',
            supportsWebGL ? 'supports-webgl' : 'no-webgl',
            supportsAdvancedCSS ? 'supports-backdrop-filter' : 'no-backdrop-filter'
        );

        // Fallbacks for older browsers
        if (!supportsIntersectionObserver) {
            this.setupScrollFallback();
        }
    }

    // Interactive elements enhancements
    setupInteractiveElements() {
        // Enhanced button interactions
        document.querySelectorAll('.btn, .nav-link, .card').forEach(element => {
            let ripple;

            element.addEventListener('mouseenter', (e) => {
                element.style.transform = element.classList.contains('btn') 
                    ? 'translateY(-2px) scale(1.02)' 
                    : 'translateY(-1px)';
            });

            element.addEventListener('mouseleave', (e) => {
                element.style.transform = '';
            });

            // Ripple effect for buttons
            if (element.classList.contains('btn')) {
                element.addEventListener('click', (e) => {
                    const rect = element.getBoundingClientRect();
                    const rippleSize = Math.max(rect.width, rect.height);
                    const rippleX = e.clientX - rect.left - rippleSize / 2;
                    const rippleY = e.clientY - rect.top - rippleSize / 2;

                    ripple = document.createElement('span');
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${rippleSize}px;
                        height: ${rippleSize}px;
                        left: ${rippleX}px;
                        top: ${rippleY}px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    `;

                    element.style.position = 'relative';
                    element.style.overflow = 'hidden';
                    element.appendChild(ripple);

                    setTimeout(() => {
                        if (ripple) ripple.remove();
                    }, 600);
                });
            }
        });

        // Add CSS for ripple animation
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Preload critical resources
        this.preloadCriticalResources();

        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // Animate progression timeline
    animateProgression(timeline) {
        const steps = timeline.querySelectorAll('.progression-step');
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
                
                // Add a subtle pulse effect
                step.style.animation = `pulse 0.6s ease-out ${index * 0.2}s`;
            }, index * 200);
        });

        // Add connecting line animation
        const connector = document.createElement('div');
        connector.classList.add('progression-connector');
        connector.style.cssText = `
            position: absolute;
            top: 30px;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 0;
            transition: width 2s ease-in-out;
            z-index: -1;
        `;
        
        timeline.style.position = 'relative';
        timeline.appendChild(connector);
        
        setTimeout(() => {
            connector.style.width = '100%';
        }, 500);
    }

    // Animate number counting
    animateNumbers(container) {
        const numbers = container.querySelectorAll('[data-count]');
        
        numbers.forEach(numberEl => {
            const finalNumber = parseInt(numberEl.dataset.count) || parseInt(numberEl.textContent);
            const duration = 2000;
            const steps = 60;
            const increment = finalNumber / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                current += increment;
                step++;
                
                if (step >= steps) {
                    current = finalNumber;
                    clearInterval(timer);
                }
                
                numberEl.textContent = Math.floor(current).toLocaleString();
            }, duration / steps);
        });
    }

    // Utility functions
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    setupScrollFallback() {
        // Fallback for browsers without Intersection Observer
        let ticking = false;
        
        const checkScroll = () => {
            const elements = document.querySelectorAll('.content-card:not(.animate-in)');
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight * 0.8) {
                    element.classList.add('animate-in');
                }
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(checkScroll);
                ticking = true;
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        fontUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth < 768;
        
        document.documentElement.classList.toggle('mobile', isMobile);
        document.documentElement.classList.toggle('desktop', !isMobile);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernWebsite();
    });
} else {
    new ModernWebsite();
}

// Add additional CSS for enhanced animations
const enhancedStyles = `
    .progression-timeline {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }

    .progression-step {
        text-align: center;
        padding: 1.5rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(30px);
    }

    .progression-step.active {
        opacity: 1;
        transform: translateY(0);
    }

    .progression-step:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .step-indicator {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        margin: 0 auto 1rem;
        box-shadow: 0 4px 15px rgba(139, 0, 0, 0.3);
    }

    .step-content h4 {
        font-family: var(--font-display);
        color: var(--primary);
        margin-bottom: 0.5rem;
    }

    .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    }

    .mobile-menu-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    @media (max-width: 1023px) {
        .nav-menu.mobile-active {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
        }

        .nav-menu.mobile-active .nav-item {
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.3s ease;
        }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }

    .comparison-item {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .comparison-item:hover {
        border-color: var(--secondary);
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .comparison-item h4 {
        font-family: var(--font-display);
        font-size: 1.3rem;
        margin-bottom: 1rem;
        color: var(--primary);
    }

    .comparison-item ul {
        list-style: none;
        padding: 0;
    }

    .comparison-item li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-light);
        position: relative;
        padding-left: 1.5rem;
    }

    .comparison-item li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--secondary);
        font-weight: bold;
    }

    .comparison-item li:last-child {
        border-bottom: none;
    }
`;

// Add the enhanced styles to the document
if (!document.getElementById('enhanced-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'enhanced-styles';
    styleSheet.textContent = enhancedStyles;
    document.head.appendChild(styleSheet);
}

export default ModernWebsite;