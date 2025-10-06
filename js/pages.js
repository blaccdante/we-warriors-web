// We Warriors Website - Page-specific JavaScript
// From Pain comes Strength • Through Faith we Hope

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page-specific functionality
    initPageSpecific();
    initFormHandlers();
    initPageNavigation();
    initPageAnimations();
    
    console.log('Page-specific JavaScript loaded successfully');
});

// Page-specific initialization
function initPageSpecific() {
    // Get current page identifier from body class or URL
    const currentPage = document.body.className || getCurrentPageFromURL();
    
    switch(currentPage) {
        case 'gallery-page':
            initGallery();
            break;
        case 'volunteer-page':
            initVolunteerForm();
            break;
        case 'advocacy-page':
            initAdvocacyActions();
            break;
        case 'contact-page':
            initContactForm();
            break;
        case 'donate-page':
            initDonationForm();
            break;
        default:
            // Generic page initialization
            break;
    }
}

// Get current page from URL
function getCurrentPageFromURL() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename + '-page';
}

// Gallery functionality
function initGallery() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!categoryBtns.length || !galleryItems.length) return;
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Volunteer form functionality
function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteer-form');
    if (!volunteerForm) return;
    
    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleVolunteerSubmission(this);
    });
}

// Advocacy actions
function initAdvocacyActions() {
    // Initialize petition signing, campaign sharing, etc.
    const petitionBtns = document.querySelectorAll('.btn[href="#"]');
    
    petitionBtns.forEach(btn => {
        if (btn.textContent.includes('Sign Petition') || btn.textContent.includes('Join')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showComingSoonMessage('This feature will be available soon!');
            });
        }
    });
}

// Contact form functionality
function initContactForm() {
    // This is handled by main.js, but we can add page-specific enhancements here
}

// Donation form functionality
function initDonationForm() {
    // Initialize donation amount selection, payment processing, etc.
    const donationAmounts = document.querySelectorAll('.donation-amount');
    
    donationAmounts.forEach(amount => {
        amount.addEventListener('click', function() {
            donationAmounts.forEach(a => a.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Form handlers for all pages
function initFormHandlers() {
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error (from main.js but enhanced)
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

// Clear field error (from main.js but enhanced)
function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.removeAttribute('aria-describedby');
}

// Page navigation enhancements
function initPageNavigation() {
    // Highlight current page in navigation
    highlightCurrentPage();
    
    // Add page transition effects
    initPageTransitions();
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.includes(href) || currentPath.endsWith(href))) {
            link.classList.add('current-page');
            
            // If it's in a dropdown, also highlight the parent
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                dropdown.querySelector('.dropdown-toggle').classList.add('active');
            }
        }
    });
}

// Page transitions
function initPageTransitions() {
    // Add smooth transitions when navigating between pages
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href$=".html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's an anchor link or external link
            if (href.startsWith('#') || href.includes('http')) return;
            
            // Add loading state
            document.body.classList.add('page-loading');
            
            // Remove loading state after navigation
            setTimeout(() => {
                document.body.classList.remove('page-loading');
            }, 500);
        });
    });
}

// Page animations
function initPageAnimations() {
    // Fade in animations for page content
    const animatedElements = document.querySelectorAll('.hero-section, .section-header, .card, .form-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Handle volunteer form submission
function handleVolunteerSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.textContent = 'Submitting...';
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showSuccessMessage('Thank you for your interest in volunteering! We will contact you within 5-7 business days.');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.textContent = originalText;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Show success message
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
        fontWeight: '600',
        maxWidth: '400px'
    });
    
    document.body.appendChild(successElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(successElement);
            }, 300);
        }
    }, 5000);
}

// Show coming soon message
function showComingSoonMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'coming-soon-message';
    messageElement.textContent = message;
    messageElement.setAttribute('role', 'alert');
    
    // Style the message
    Object.assign(messageElement.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#f0f9ff',
        color: '#1e40af',
        padding: '20px 30px',
        borderRadius: '8px',
        border: '2px solid #3b82f6',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        zIndex: '2000',
        fontSize: '16px',
        fontWeight: '600',
        textAlign: 'center'
    });
    
    document.body.appendChild(messageElement);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }
    }, 3000);
}

// Utility functions
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
        initPageSpecific,
        initGallery,
        validateField,
        showSuccessMessage,
        debounce,
        throttle
    };
}