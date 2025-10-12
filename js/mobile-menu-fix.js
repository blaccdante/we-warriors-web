// MOBILE MENU FIX - Simple functionality for HTML-based menu
// This replaces the complex mobile-menu.js system

class SimpleMobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.bindEvents();
        this.handleResize();
        
        // Listen for window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    bindEvents() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
            
            // Close menu when clicking menu links
            const menuLinks = menu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Small delay to allow navigation
                    setTimeout(() => this.closeMenu(), 100);
                });
            });
        }

        // Handle dropdown toggles
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                dropdown.classList.toggle('active');
            });
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            this.isOpen = true;
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            menu.classList.add('active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            console.log('Mobile menu opened');
        }
    }

    closeMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            this.isOpen = false;
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
            
            // Close all dropdowns
            const dropdowns = menu.querySelectorAll('.dropdown.active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            console.log('Mobile menu closed');
        }
    }

    handleResize() {
        // Close menu on desktop
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle text in status
        const themeStatus = document.getElementById('theme-status');
        if (themeStatus) {
            themeStatus.textContent = `Current theme: ${newTheme} mode`;
        }
        
        console.log('Theme changed to:', newTheme);
    }
}

// Initialize the mobile menu
let simpleMobileMenu;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        simpleMobileMenu = new SimpleMobileMenu();
    });
} else {
    simpleMobileMenu = new SimpleMobileMenu();
}

// Export for global access
window.simpleMobileMenu = simpleMobileMenu;

// Also handle the theme toggle button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && simpleMobileMenu) {
        themeToggle.addEventListener('click', () => {
            simpleMobileMenu.toggleTheme();
        });
    }
});