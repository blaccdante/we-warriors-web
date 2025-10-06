// We Warriors Website - Main JavaScript
// From Pain comes Strength • Through Faith we Hope

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initKeyboardNavigation();
    initAccessibilityFeatures();
    initContactForms();
    
    console.log('We Warriors website loaded successfully');
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuToggle || !navMenu) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        navMenu.classList.toggle('active');
        
        // Update aria-expanded
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Animate hamburger lines
        const hamburgerLines = mobileMenuToggle.querySelectorAll('.hamburger-line');
        hamburgerLines.forEach((line, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                line.style.transform = '';
                line.style.opacity = '';
            }
        });
        
        // Focus management
        if (navMenu.classList.contains('active')) {
            navLinks[0]?.focus();
        }
    });
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // Reset hamburger animation
            const hamburgerLines = mobileMenuToggle.querySelectorAll('.hamburger-line');
            hamburgerLines.forEach(line => {
                line.style.transform = '';
                line.style.opacity = '';
            });
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            const hamburgerLines = mobileMenuToggle.querySelectorAll('.hamburger-line');
            hamburgerLines.forEach(line => {
                line.style.transform = '';
                line.style.opacity = '';
            });
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.focus();
            
            const hamburgerLines = mobileMenuToggle.querySelectorAll('.hamburger-line');
            hamburgerLines.forEach(line => {
                line.style.transform = '';
                line.style.opacity = '';
            });
        }
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target && href !== '#') {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(href);
                
                // Focus management for accessibility
                setTimeout(() => {
                    target.focus();
                    target.scrollIntoView({ block: 'nearest' });
                }, 500);
            }
        });
    });
}

// Update Active Navigation Link
function updateActiveNavLink(activeHref) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

// Keyboard Navigation Enhancement
function initKeyboardNavigation() {
    // Trap focus in mobile menu when open
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navMenu || !navLinks.length) return;
    
    navMenu.addEventListener('keydown', function(e) {
        if (!navMenu.classList.contains('active')) return;
        
        const focusableElements = Array.from(navLinks);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // Arrow key navigation for nav menu
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' && index < navLinks.length - 1) {
                e.preventDefault();
                navLinks[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                navLinks[index - 1].focus();
            }
        });
    });
}

// Accessibility Features
function initAccessibilityFeatures() {
    // Add skip to content functionality
    const skipLink = document.querySelector('.skip-to-main');
    const mainContent = document.querySelector('#main-content');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Announce page changes for screen readers
    announcePageLoad();
    
    // High contrast mode detection
    detectHighContrastMode();
    
    // Reduced motion preference detection
    respectReducedMotion();
    
    // Add focus indicators for better accessibility
    enhanceFocusIndicators();
}

// Announce Page Load for Screen Readers
function announcePageLoad() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'We Warriors website loaded. Supporting sickle cell warriors and their families.';
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Detect High Contrast Mode
function detectHighContrastMode() {
    // Create a test element to detect high contrast mode
    const testElement = document.createElement('div');
    testElement.style.border = '1px solid';
    testElement.style.border = '1px solid rgb(0, 0, 0)';
    testElement.style.position = 'absolute';
    testElement.style.height = '5px';
    testElement.style.top = '-999px';
    testElement.style.backgroundColor = 'rgb(255, 255, 255)';
    
    document.body.appendChild(testElement);
    
    let detected = false;
    if (window.getComputedStyle) {
        const computedStyle = window.getComputedStyle(testElement);
        detected = computedStyle.backgroundColor !== 'rgb(255, 255, 255)' ||
                  computedStyle.borderTopColor === computedStyle.backgroundColor;
    }
    
    document.body.removeChild(testElement);
    
    if (detected) {
        document.documentElement.classList.add('high-contrast-mode');
    }
}

// Respect Reduced Motion Preference
function respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(e) {
        if (e.matches) {
            document.documentElement.classList.add('reduced-motion');
            // Disable smooth scrolling
            document.documentElement.style.scrollBehavior = 'auto';
        } else {
            document.documentElement.classList.remove('reduced-motion');
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }
    
    // Check on load and listen for changes
    handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addListener(handleReducedMotion);
}

// Enhance Focus Indicators
function enhanceFocusIndicators() {
    // Add focus-visible polyfill behavior for older browsers
    let hadKeyboardEvent = true;
    
    document.addEventListener('mousedown', () => hadKeyboardEvent = false);
    document.addEventListener('keydown', () => hadKeyboardEvent = true);
    
    document.addEventListener('focusin', (e) => {
        if (hadKeyboardEvent) {
            e.target.classList.add('focus-visible');
        }
    });
    
    document.addEventListener('focusout', (e) => {
        e.target.classList.remove('focus-visible');
    });
}

// Contact Forms (for future implementation)
function initContactForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });
            
            // Email validation
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Form is valid, handle submission
                handleFormSubmission(form);
            }
        });
    });
}

// Form Validation Helpers
function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.id = field.id + '-error';
    field.setAttribute('aria-describedby', errorElement.id);
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.removeAttribute('aria-describedby');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleFormSubmission(form) {
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.textContent = 'Sending...';
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showSuccessMessage('Thank you! Your message has been sent.');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.textContent = originalText;
    }, 2000);
}

function showSuccessMessage(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.setAttribute('role', 'alert');
    successElement.setAttribute('aria-live', 'polite');
    
    // Style the success message
    Object.assign(successElement.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#006600',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '1000',
        fontSize: '14px',
        fontWeight: '600'
    });
    
    document.body.appendChild(successElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successElement.parentNode) {
            document.body.removeChild(successElement);
        }
    }, 5000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initSmoothScrolling,
        initKeyboardNavigation,
        initAccessibilityFeatures,
        isValidEmail,
        debounce,
        throttle
    };
}