/**
 * Universal Header JavaScript
 * Handles all header interactions including mobile menu, dropdowns, theme toggle, and scroll effects
 */

class UniversalHeader {
    constructor() {
        this.header = document.querySelector('.universal-header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.nav = document.querySelector('.header-nav');
        this.themeToggle = document.querySelector('.theme-toggle');
        this.mobileThemeToggle = document.querySelector('#mobileThemeSwitch');
        this.dropdowns = document.querySelectorAll('.nav-item.dropdown');
        this.body = document.body;
        this.scrolled = false;
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupDropdowns();
        this.setupThemeToggle();
        this.setupScrollEffect();
        this.setupKeyboardNavigation();
        this.setupActiveNavigation();
        this.handleResize();
        
        // Load saved theme
        this.loadTheme();
        
        console.log('Universal Header initialized successfully');
    }
    
    /**
     * Mobile menu functionality
     */
    setupMobileMenu() {
        console.log('Setting up mobile menu...');
        console.log('Mobile toggle:', this.mobileToggle);
        console.log('Nav:', this.nav);
        
        if (!this.mobileToggle || !this.nav) {
            console.error('Mobile menu elements not found!');
            return;
        }
        
        this.mobileToggle.addEventListener('click', (e) => {
            console.log('Mobile toggle clicked!');
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking outside or on close button
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.nav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.nav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Handle clicks on the mobile nav close button
        if (this.nav) {
            this.nav.addEventListener('click', (e) => {
                // Close if clicking on the close button (pseudo-element area)
                const rect = this.nav.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Check if click is in the close button area (top-right)
                if (window.innerWidth <= 768 && x > rect.width - 60 && y < 60) {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Close mobile menu when clicking on nav links (except category toggles)
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item .nav-link:not(.mobile-category-toggle), .cta-button');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    setTimeout(() => this.closeMobileMenu(), 200);
                }
            });
        });
        
        // Setup mobile category toggles
        this.setupMobileCategoryToggles();
    }
    
    toggleMobileMenu() {
        console.log('Toggle mobile menu called, screen width:', window.innerWidth);
        
        const isOpen = this.nav.classList.contains('active');
        console.log('Menu currently open:', isOpen);
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        console.log('Opening mobile menu - screen width:', window.innerWidth);
        
        // Capture current structure for debugging
        this.captureMobileMenuStructure();
        
        try {
            // Create overlay
            let overlay = document.querySelector('.mobile-menu-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'mobile-menu-overlay';
                overlay.style.cssText = `
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    z-index: 999998 !important;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                document.body.appendChild(overlay);
                
                // Add click listener to overlay
                overlay.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }
            
            // Show menu and overlay immediately
            this.nav.classList.add('active');
            this.mobileToggle.classList.add('active');
        this.body.classList.add('mobile-menu-open');
        // Don't completely block scrolling, just add the class for styling
        // this.body.style.overflow = 'hidden';
            
            // Force overlay visibility
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
            
            this.mobileToggle.setAttribute('aria-expanded', 'true');
            console.log('Mobile menu opened successfully');
            
        } catch (error) {
            console.error('Error opening mobile menu:', error);
        }
    }
    
    closeMobileMenu() {
        console.log('Closing mobile menu');
        
        try {
            // Hide menu and overlay
            this.nav.classList.remove('active');
            const overlay = document.querySelector('.mobile-menu-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
            
            this.mobileToggle.classList.remove('active');
            this.body.classList.remove('mobile-menu-open');
            this.body.style.overflow = '';
            // Ensure page can scroll after closing menu
            document.documentElement.style.overflowY = 'auto';
            this.body.style.overflowY = 'auto';
            
            // Close all mobile dropdowns
            if (this.dropdowns) {
                this.dropdowns.forEach(dropdown => {
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) menu.classList.remove('active');
                });
            }
            
            this.mobileToggle.setAttribute('aria-expanded', 'false');
            console.log('Mobile menu closed successfully');
            
        } catch (error) {
            console.error('Error closing mobile menu:', error);
        }
    }
    
    /**
     * Mobile category toggle functionality
     */
    setupMobileCategoryToggles() {
        const mobileCategories = document.querySelectorAll('.mobile-category');
        console.log('Found mobile categories:', mobileCategories.length);
        
        mobileCategories.forEach((category, index) => {
            const toggle = category.querySelector('.mobile-category-toggle');
            const submenu = category.querySelector('.mobile-submenu');
            
            console.log(`Category ${index}:`, {
                category: category,
                toggle: toggle,
                submenu: submenu,
                toggleText: toggle ? toggle.textContent.trim() : 'N/A'
            });
            
            if (!toggle) {
                console.warn(`No toggle found for category ${index}`);
                return;
            }
            
            if (!submenu) {
                console.warn(`No submenu found for category ${index}`);
                return;
            }
            
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle the active state of this category
                const wasActive = category.classList.contains('active');
                category.classList.toggle('active');
                const isActive = category.classList.contains('active');
                
                console.log(`Mobile category "${toggle.textContent.trim()}" toggled:`, {
                    wasActive: wasActive,
                    isActive: isActive,
                    submenuDisplay: window.getComputedStyle(submenu).display
                });
            });
        });
        
        console.log('Mobile category toggles setup complete for', mobileCategories.length, 'categories');
    }
    
    
    /**
     * Diagnostic function to capture current mobile menu structure
     */
    captureMobileMenuStructure() {
        const nav = document.querySelector('.header-nav');
        if (nav) {
            console.log('=== CURRENT MOBILE MENU STRUCTURE ===');
            console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
            console.log('Full nav HTML:', nav.innerHTML);
            console.log('Mobile nav items:', nav.querySelectorAll('.mobile-nav-item').length);
            
            const mobileItems = nav.querySelectorAll('.mobile-nav-item');
            mobileItems.forEach((item, index) => {
                console.log(`Item ${index}:`, {
                    classes: item.className,
                    html: item.outerHTML.substring(0, 200) + '...'
                });
            });
            
            console.log('=== END STRUCTURE ===');
        }
    }
    
    /**
     * Mobile dropdown functionality
     */
    setupMobileDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;
            
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    this.dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                            if (otherMenu) otherMenu.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    menu.classList.toggle('active');
                }
            });
        });
    }
    
    /**
     * Desktop dropdown functionality
     */
    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;
            
            let timeoutId = null;
            
            // Show dropdown on hover (desktop only)
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    clearTimeout(timeoutId);
                    menu.style.display = 'block';
                }
            });
            
            // Hide dropdown with delay
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    timeoutId = setTimeout(() => {
                        menu.style.display = '';
                    }, 100);
                }
            });
            
            // Keep dropdown open when hovering over menu
            menu.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    clearTimeout(timeoutId);
                }
            });
            
            menu.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    timeoutId = setTimeout(() => {
                        menu.style.display = '';
                    }, 100);
                }
            });
        });
    }
    
    /**
     * Theme toggle functionality
     */
    setupThemeToggle() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // Mobile theme toggle
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add instant theme switching class
        document.documentElement.classList.add('theme-instant');
        
        // Apply theme immediately with no transitions
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle icon immediately
        this.updateThemeToggleIcon(newTheme);
        
        // Update screen reader text
        const statusElement = document.getElementById('theme-status');
        if (statusElement) {
            statusElement.textContent = `Current theme: ${newTheme} mode`;
        }
        
        // Force a repaint to ensure instant theme switch
        document.documentElement.offsetHeight;
        
        // Re-enable transitions after a brief delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('theme-instant');
                document.documentElement.classList.add('theme-transition-end');
                
                // Remove transition end class after animation
                setTimeout(() => {
                    document.documentElement.classList.remove('theme-transition-end');
                }, 150);
            });
        });
        
        // Emit custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }));
        
        console.log(`Theme switched to: ${newTheme}`);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggleIcon(savedTheme);
        
        // Update screen reader text
        const statusElement = document.getElementById('theme-status');
        if (statusElement) {
            statusElement.textContent = `Current theme: ${savedTheme} mode`;
        }
    }
    
    updateThemeToggleIcon(theme) {
        // Update desktop theme toggle
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'light' ? '☀' : '☾';
            }
        }
        
        // Update mobile theme switch
        if (this.mobileThemeToggle) {
            if (theme === 'dark') {
                this.mobileThemeToggle.classList.add('active');
            } else {
                this.mobileThemeToggle.classList.remove('active');
            }
        }
    }
    
    /**
     * Scroll effect for header
     */
    setupScrollEffect() {
        if (!this.header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldBeScrolled = scrollTop > 50;
            
            if (shouldBeScrolled !== this.scrolled) {
                this.scrolled = shouldBeScrolled;
                this.header.classList.toggle('scrolled', this.scrolled);
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
    
    /**
     * Keyboard navigation support
     */
    setupKeyboardNavigation() {
        // Handle Tab navigation through dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Close dropdowns when tabbing away
                setTimeout(() => {
                    if (window.innerWidth > 768) {
                        this.dropdowns.forEach(dropdown => {
                            const menu = dropdown.querySelector('.dropdown-menu');
                            if (menu && !dropdown.contains(document.activeElement)) {
                                menu.style.display = '';
                            }
                        });
                    }
                }, 0);
            }
        });
        
        // Handle Enter and Space for dropdown toggles
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (window.innerWidth <= 768) {
                            const menu = dropdown.querySelector('.dropdown-menu');
                            if (menu) menu.classList.toggle('active');
                        }
                    }
                });
            }
        });
    }
    
    /**
     * Set active navigation based on current page
     */
    setupActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Skip Home links and mobile nav items from getting active state
            if (href && href !== '#' && href !== 'index.html' && !link.closest('.mobile-nav-item') && currentPath.includes(href)) {
                link.classList.add('active');
                
                // Also mark parent dropdown as active
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) dropdownToggle.classList.add('active');
                }
            }
        });
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        let resizeTimer = null;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close mobile menu if switching to desktop
                if (window.innerWidth > 768 && this.nav.classList.contains('active')) {
                    this.closeMobileMenu();
                }
                
                // Reset dropdown display on resize
                this.dropdowns.forEach(dropdown => {
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) {
                        if (window.innerWidth <= 768) {
                            menu.classList.remove('active');
                        } else {
                            menu.style.display = '';
                        }
                    }
                });
            }, 250);
        });
    }
    
    /**
     * Smooth scroll to anchor links
     */
    setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = this.header ? this.header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after navigation
                    if (this.nav.classList.contains('active')) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }
    
    /**
     * Add loading animation
     */
    addLoadingAnimation() {
        if (this.header) {
            this.header.style.animation = 'slideInDown 0.6s ease-out';
        }
    }
    
    /**
     * Destroy instance and clean up event listeners
     */
    destroy() {
        // Remove event listeners and clean up
        if (this.mobileToggle) {
            this.mobileToggle.replaceWith(this.mobileToggle.cloneNode(true));
        }
        if (this.themeToggle) {
            this.themeToggle.replaceWith(this.themeToggle.cloneNode(true));
        }
        
        this.body.style.overflow = '';
        
        console.log('Universal Header destroyed');
    }
}

/**
 * Utility functions
 */

// Debounce function for performance optimization
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

// Throttle function for scroll events
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

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all styles are loaded
    setTimeout(() => {
        window.universalHeader = new UniversalHeader();
        window.universalHeader.addLoadingAnimation();
        window.universalHeader.setupSmoothScroll();
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.universalHeader) {
        // Close mobile menu when page becomes hidden
        if (window.universalHeader.nav.classList.contains('active')) {
            window.universalHeader.closeMobileMenu();
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalHeader;
}