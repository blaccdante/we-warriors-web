/**
 * Modern Interactive Elements and Animations
 * Includes scroll animations, parallax effects, counters, and interactive backgrounds
 */

class ModernInteractions {
    constructor() {
        this.observers = [];
        this.parallaxElements = [];
        this.counters = [];
        this.particles = [];
        
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupParallax();
        this.setupCounters();
        this.setupInteractiveBackground();
        this.setupSmoothScroll();
        this.setupMouseEffects();
        this.setupLazyLoading();
        
        // Performance optimization
        this.throttle = this.createThrottle(16); // 60fps
        this.setupPerformanceOptimizations();
    }

    // Scroll Reveal Animations
    setupScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    // Parallax Scrolling
    setupParallax() {
        this.parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrollY = window.pageYOffset;
                
                this.parallaxElements.forEach(el => {
                    const speed = el.dataset.parallaxSpeed || 0.5;
                    const yPos = -(scrollY * speed);
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            }));
        }
    }

    // Animated Counters
    setupCounters() {
        const counterElements = document.querySelectorAll('.stats-counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => counterObserver.observe(el));
        this.observers.push(counterObserver);
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count) || 0;
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOutCubic);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Interactive Background Particles
    setupInteractiveBackground() {
        const bgContainer = document.querySelector('.interactive-bg');
        if (!bgContainer) {
            // Create background container
            const container = document.createElement('div');
            container.className = 'interactive-bg';
            document.body.appendChild(container);
            
            this.createFloatingParticles(container);
            this.setupMouseTracker(container);
        }
    }

    createFloatingParticles(container) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        container.appendChild(particlesContainer);

        // Create particles with staggered animation
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const leftPos = Math.random() * 100;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 20;
            
            particle.style.cssText = `
                left: ${leftPos}%;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    setupMouseTracker(container) {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Create mouse follower elements
        for (let i = 0; i < 3; i++) {
            const follower = document.createElement('div');
            follower.className = 'mouse-follower';
            follower.style.cssText = `
                position: fixed;
                width: ${20 - i * 5}px;
                height: ${20 - i * 5}px;
                background: rgba(139, 69, 19, ${0.1 - i * 0.02});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.${2 + i}s ease-out;
            `;
            container.appendChild(follower);
            
            // Animate followers
            const updateFollower = () => {
                follower.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
                requestAnimationFrame(updateFollower);
            };
            setTimeout(updateFollower, i * 100);
        }
    }

    // Smooth Scrolling
    setupSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // Mouse Effects
    setupMouseEffects() {
        const cards = document.querySelectorAll('.modern-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale3d(1.02, 1.02, 1.02)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // Lazy Loading for Images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
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
        this.observers.push(imageObserver);
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Reduce animations on low-performance devices
        if (navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            document.documentElement.classList.add('reduced-animations');
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.classList.add('paused-animations');
            } else {
                document.documentElement.classList.remove('paused-animations');
            }
        });

        // Battery status optimization
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 || !battery.charging) {
                    document.documentElement.classList.add('power-save-mode');
                }
            });
        }
    }

    // Utility Functions
    createThrottle(delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function(callback) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                callback();
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    callback();
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Advanced Text Animations
    setupTextAnimations() {
        const textElements = document.querySelectorAll('.animate-text');
        
        textElements.forEach(el => {
            const text = el.textContent;
            const letters = text.split('');
            el.innerHTML = '';
            
            letters.forEach((letter, i) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter;
                span.style.animationDelay = `${i * 0.05}s`;
                span.classList.add('letter-animate');
                el.appendChild(span);
            });
        });
    }

    // Magnetic Effect for Buttons
    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-modern, .slide-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #8B4513 0%, #D2691E 100%);
            z-index: 10000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }));
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        // Remove event listeners
        window.removeEventListener('scroll', this.parallaxHandler);
        window.removeEventListener('mousemove', this.mouseHandler);
    }
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modern interactions
    window.modernInteractions = new ModernInteractions();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernInteractions };
}
