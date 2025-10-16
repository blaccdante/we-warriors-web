/**
 * ============================================================================
 * CONSOLIDATED HEADER JAVASCRIPT - We Warriors
 * Unified mobile menu and desktop functionality
 * ============================================================================
 */

class ConsolidatedHeader {
    constructor() {
        this.header = document.querySelector('.universal-header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.nav = document.querySelector('.header-nav');
        this.themeToggle = document.querySelector('.theme-toggle');
        this.mobileThemeToggle = document.querySelector('#mobileThemeSwitch');
        this.dropdowns = document.querySelectorAll('.nav-item.dropdown');
        this.body = document.body;
        this.scrolled = false;
        this.mobileMenuOpen = false;
        this.overlay = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Consolidated Header...');
        
        this.setupMobileMenu();
        this.setupDesktopDropdowns();
        this.setupThemeToggle();
        this.setupScrollEffect();
        this.setupKeyboardNavigation();
        this.setupActiveNavigation();
        this.handleResize();
        this.loadTheme();
        
        console.log('Consolidated Header initialized successfully');
    }
    
    /**
     * ========================================================================
     * MOBILE MENU FUNCTIONALITY
     * ========================================================================
     */
    
    setupMobileMenu() {
        if (!this.mobileToggle || !this.nav) {
            console.error('Mobile menu elements not found');
            return;
        }
        
        // Mobile toggle click
        this.mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && !this.header.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu when clicking nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item .nav-link, .mobile-action-btn');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 200);
            });
        });
        
        console.log('Mobile menu setup complete');
    }
    
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        console.log('Opening mobile menu');
        
        // Create overlay if it doesn't exist
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(this.overlay);
            
            this.overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Show menu
        this.nav.classList.add('active');
        this.mobileToggle.classList.add('active');
        this.overlay.classList.add('active');
        this.body.classList.add('mobile-menu-open');
        
        this.mobileMenuOpen = true;
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        this.body.style.overflow = 'hidden';
        
        console.log('Mobile menu opened');
    }
    
    closeMobileMenu() {
        console.log('Closing mobile menu');
        
        // Hide menu
        this.nav.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        this.body.classList.remove('mobile-menu-open');
        
        this.mobileMenuOpen = false;
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        this.body.style.overflow = '';
        
        console.log('Mobile menu closed');
    }
    
    /**
     * ========================================================================
     * DESKTOP DROPDOWN FUNCTIONALITY
     * ========================================================================
     */
    
    setupDesktopDropdowns() {
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
        
        console.log('Desktop dropdowns setup complete');
    }
    
    /**
     * ========================================================================
     * THEME TOGGLE FUNCTIONALITY
     * ========================================================================
     */
    
    setupThemeToggle() {
        // Desktop theme toggle
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
        
        console.log('Theme toggle setup complete');
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle icons
        this.updateThemeToggleIcon(newTheme);
        
        // Update screen reader text
        const statusElement = document.getElementById('theme-status');
        if (statusElement) {
            statusElement.textContent = `Current theme: ${newTheme} mode`;
        }
        
        // Emit custom event
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
     * ========================================================================
     * SCROLL EFFECT
     * ========================================================================
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
     * ========================================================================
     * KEYBOARD NAVIGATION
     * ========================================================================
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
     * ========================================================================
     * ACTIVE NAVIGATION
     * ========================================================================
     */
    
    setupActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Skip certain links and mobile nav items
            if (href && href !== '#' && href !== 'index.html' && !link.closest('.mobile-nav-item') && currentPath.includes(href)) {
                link.classList.add('active');
                
                // Mark parent dropdown as active
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) dropdownToggle.classList.add('active');
                }
            }
        });
    }
    
    /**
     * ========================================================================
     * WINDOW RESIZE HANDLER
     * ========================================================================
     */
    
    handleResize() {
        let resizeTimer = null;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close mobile menu if switching to desktop
                if (window.innerWidth > 768 && this.mobileMenuOpen) {
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
     * ========================================================================
     * SMOOTH SCROLL
     * ========================================================================
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
                    if (this.mobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }
    
    /**
     * ========================================================================
     * LOADING ANIMATION
     * ========================================================================
     */
    
    addLoadingAnimation() {
        if (this.header) {
            this.header.style.animation = 'slideInDown 0.6s ease-out';
        }
    }
    
    /**
     * ========================================================================
     * CLEANUP
     * ========================================================================
     */
    
    destroy() {
        // Clean up event listeners and reset state
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        
        this.body.style.overflow = '';
        this.body.classList.remove('mobile-menu-open');
        
        console.log('Consolidated Header destroyed');
    }
}

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
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

/**
 * ============================================================================
 * INITIALIZATION
 * ============================================================================
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all styles are loaded
    setTimeout(() => {
        window.consolidatedHeader = new ConsolidatedHeader();
        window.consolidatedHeader.addLoadingAnimation();
        window.consolidatedHeader.setupSmoothScroll();
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.consolidatedHeader && window.consolidatedHeader.mobileMenuOpen) {
        window.consolidatedHeader.closeMobileMenu();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsolidatedHeader;
}