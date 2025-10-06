// We Warriors Website - Animations
// Journey-themed animations representing the path from Pain to Strength through Faith and Hope

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize animations if user hasn't requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        initJourneyAnimations();
        initScrollAnimations();
        initHoverEffects();
    }
    
    // Listen for changes in motion preference
    prefersReducedMotion.addListener((e) => {
        if (e.matches) {
            disableAllAnimations();
        } else {
            initJourneyAnimations();
            initScrollAnimations();
            initHoverEffects();
        }
    });
});

// Initialize Journey-themed Animations
function initJourneyAnimations() {
    animateJourneySteps();
    animateHeroText();
    animateProgressiveDisclosure();
}

// Animate Journey Steps in Hero Section
function animateJourneySteps() {
    const journeySteps = document.querySelectorAll('.journey-step');
    const connectors = document.querySelectorAll('.journey-connector');
    
    if (!journeySteps.length) return;
    
    // Reset all animations
    journeySteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'scale(0.5) translateY(20px)';
        step.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
    });
    
    connectors.forEach(connector => {
        connector.style.opacity = '0';
        connector.style.transform = 'scaleY(0)';
        connector.style.transition = 'all 0.4s ease-in-out';
        connector.style.transformOrigin = 'top';
    });
    
    // Animate steps in sequence
    const animationDelay = 300; // ms between each step
    
    journeySteps.forEach((step, index) => {
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'scale(1) translateY(0)';
            
            // Add a subtle bounce effect
            setTimeout(() => {
                step.style.transform = 'scale(1.05) translateY(0)';
                setTimeout(() => {
                    step.style.transform = 'scale(1) translateY(0)';
                }, 150);
            }, 200);
            
            // Animate connector after step
            if (index < connectors.length) {
                setTimeout(() => {
                    connectors[index].style.opacity = '1';
                    connectors[index].style.transform = 'scaleY(1)';
                }, 200);
            }
            
        }, index * animationDelay + 500); // Initial delay
    });
    
    // Add continuous subtle animation to represent the ongoing journey
    setTimeout(() => {
        journeySteps.forEach((step, index) => {
            const pulseDelay = index * 1000;
            setInterval(() => {
                if (!document.hidden && !prefersReducedMotion.matches) {
                    step.style.transform = 'scale(1.02)';
                    step.style.boxShadow = '0 8px 25px rgba(139, 0, 0, 0.3)';
                    
                    setTimeout(() => {
                        step.style.transform = 'scale(1)';
                        step.style.boxShadow = '0 4px 15px rgba(139, 0, 0, 0.2)';
                    }, 300);
                }
            }, 4000 + pulseDelay);
        });
    }, 2000);
}

// Animate Hero Text
function animateHeroText() {
    const heroWe = document.querySelector('.hero-we');
    const heroWarriors = document.querySelector('.hero-warriors');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroDescription = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');
    
    const elements = [heroWe, heroWarriors, heroTagline, heroDescription, heroActions];
    
    elements.forEach(element => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
        }
    });
    
    // Animate elements in sequence
    elements.forEach((element, index) => {
        if (element) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        }
    });
}

// Initialize Scroll-triggered Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(`
        .about-card,
        .story-card,
        .involvement-card,
        .support-category,
        .section-header,
        .faith-verse
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        observer.observe(element);
    });
}

// Animate Individual Elements
function animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Add special animations for specific elements
    if (element.classList.contains('about-card')) {
        // Cards slide in with a slight delay between them
        const cards = document.querySelectorAll('.about-card');
        const index = Array.from(cards).indexOf(element);
        element.style.transitionDelay = `${index * 0.1}s`;
    }
    
    if (element.classList.contains('involvement-card')) {
        // Involvement cards have a scale effect
        setTimeout(() => {
            element.style.transform = 'translateY(0) scale(1.02)';
            setTimeout(() => {
                element.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }, 100);
    }
    
    if (element.classList.contains('faith-verse')) {
        // Faith verse has a gentle glow effect
        setTimeout(() => {
            element.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.2)';
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 1000);
        }, 200);
    }
}

// Progressive Disclosure Animations
function animateProgressiveDisclosure() {
    // Animate content that should appear progressively
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        const delay = index * 100;
        setTimeout(() => {
            section.style.opacity = '1';
        }, delay);
    });
}

// Initialize Hover Effects
function initHoverEffects() {
    // Enhanced hover effects for interactive elements
    addHoverEffects('.about-card', {
        transform: 'translateY(-10px) scale(1.02)',
        boxShadow: '0 15px 35px rgba(139, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
    });
    
    addHoverEffects('.involvement-card', {
        transform: 'translateY(-8px) scale(1.01)',
        boxShadow: '0 12px 30px rgba(255, 215, 0, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
    });
    
    addHoverEffects('.story-card', {
        transform: 'translateX(10px)',
        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.15)',
        borderLeftColor: 'var(--faith-color)',
        borderLeftWidth: '6px',
        transition: 'all 0.3s ease-in-out'
    });
    
    addHoverEffects('.btn', {
        transform: 'translateY(-3px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
    });
    
    // Special journey step hover effects
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            if (!prefersReducedMotion.matches) {
                step.style.transform = 'scale(1.15) rotate(5deg)';
                step.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.4)';
                step.style.zIndex = '10';
            }
        });
        
        step.addEventListener('mouseleave', () => {
            step.style.transform = 'scale(1) rotate(0deg)';
            step.style.boxShadow = '0 4px 15px rgba(139, 0, 0, 0.2)';
            step.style.zIndex = '';
        });
    });
}

// Helper function to add hover effects
function addHoverEffects(selector, hoverStyles) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        const originalStyles = {
            transform: element.style.transform || '',
            boxShadow: element.style.boxShadow || '',
            borderLeftColor: element.style.borderLeftColor || '',
            borderLeftWidth: element.style.borderLeftWidth || ''
        };
        
        element.addEventListener('mouseenter', () => {
            if (!prefersReducedMotion.matches) {
                Object.assign(element.style, hoverStyles);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            Object.assign(element.style, originalStyles);
        });
    });
}

// Text Typing Animation for Special Messages
function initTypingAnimation(element, text, speed = 100) {
    if (!element || prefersReducedMotion.matches) {
        if (element) element.textContent = text;
        return;
    }
    
    element.textContent = '';
    let index = 0;
    
    const typeChar = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, speed);
        }
    };
    
    typeChar();
}

// Particle Animation for Special Occasions
function createHopeParticles() {
    if (prefersReducedMotion.matches) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hope-particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createHopeParticle(particleContainer);
    }
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(particleContainer);
    }, 5000);
}

function createHopeParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        border-radius: 50%;
        bottom: -10px;
        left: ${Math.random() * 100}%;
        animation: hopeFloat ${3 + Math.random() * 2}s ease-out forwards;
    `;
    
    container.appendChild(particle);
}

// Add CSS for hope particle animation
const hopeAnimationCSS = `
    @keyframes hopeFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;

// Inject animation styles
if (!document.querySelector('#hope-animations')) {
    const style = document.createElement('style');
    style.id = 'hope-animations';
    style.textContent = hopeAnimationCSS;
    document.head.appendChild(style);
}

// Disable All Animations
function disableAllAnimations() {
    // Remove all animation styles
    const animatedElements = document.querySelectorAll(`
        .journey-step,
        .hero-we,
        .hero-warriors,
        .hero-tagline,
        .hero-description,
        .hero-actions,
        .about-card,
        .story-card,
        .involvement-card,
        .support-category,
        .section-header,
        .faith-verse
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = '';
        element.style.transition = 'none';
        element.style.animation = 'none';
    });
    
    // Remove particle containers
    const particleContainers = document.querySelectorAll('.hope-particles');
    particleContainers.forEach(container => {
        container.remove();
    });
}

// Success Animation (for form submissions, etc.)
function showSuccessAnimation(message = "Success!") {
    if (prefersReducedMotion.matches) {
        // Just show a simple success message without animation
        console.log(message);
        return;
    }
    
    // Create hope particles for success
    createHopeParticles();
    
    // Show success message with fade-in
    const successDiv = document.createElement('div');
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #2C0A1A;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: 600;
        font-size: 1.2rem;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        z-index: 1001;
        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    `;
    
    document.body.appendChild(successDiv);
    
    // Animate in
    setTimeout(() => {
        successDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
        successDiv.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 2500);
}

// Export functions for external use
window.WeWarriorsAnimations = {
    initJourneyAnimations,
    initScrollAnimations,
    initHoverEffects,
    createHopeParticles,
    showSuccessAnimation,
    disableAllAnimations,
    initTypingAnimation
};