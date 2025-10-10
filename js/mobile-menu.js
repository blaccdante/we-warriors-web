// MODERN MOBILE MENU FUNCTIONALITY

class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createMobileMenu();
        this.bindEvents();
        this.handleResize();
        
        // Listen for window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Close menu on outside click
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    createMobileMenu() {
        // Check if mobile menu already exists
        if (document.getElementById('mobileMenuContainer')) {
            return;
        }

        // Detect current directory to create proper relative paths
        const pathPrefix = this.getPathPrefix();

        const menuHTML = `
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" id="mobileMenuBtn" onclick="mobileMenu.toggleMenu()">
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
            </button>

            <!-- Mobile Menu Overlay -->
            <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="mobileMenu.closeMenu()"></div>

            <!-- Mobile Menu Panel -->
            <div class="mobile-menu" id="mobileMenu">
                <!-- Menu Header -->
                <div class="mobile-menu-header">
                    <a href="${pathPrefix}index.html" class="mobile-menu-logo">We Warriors</a>
                </div>

                <!-- Navigation Links -->
                <nav class="mobile-menu-nav">
                    <a href="${pathPrefix}index.html" class="mobile-menu-link">Home</a>
                    <a href="${pathPrefix}support/about-sickle-cell.html" class="mobile-menu-link">About Sickle Cell</a>
                    <a href="${pathPrefix}information/what-is-sickle-cell.html" class="mobile-menu-link">What is Sickle Cell</a>
                    <a href="${pathPrefix}information/types.html" class="mobile-menu-link">Types & Symptoms</a>
                    <a href="${pathPrefix}information/diagnosis-treatment.html" class="mobile-menu-link">Diagnosis & Treatment</a>
                    <a href="${pathPrefix}support/support-groups.html" class="mobile-menu-link">Support Groups</a>
                    <a href="${pathPrefix}support/resources.html" class="mobile-menu-link">Resources</a>
                    <a href="${pathPrefix}support/counseling.html" class="mobile-menu-link">Counseling</a>
                    <a href="${pathPrefix}community/events.html" class="mobile-menu-link">Events</a>
                    <a href="${pathPrefix}community/blog.html" class="mobile-menu-link">Blog</a>
                    <a href="${pathPrefix}information/research.html" class="mobile-menu-link">Research</a>
                    <a href="${pathPrefix}pages/advocacy.html" class="mobile-menu-link">Advocacy</a>
                    <a href="${pathPrefix}pages/contact.html" class="mobile-menu-link">Contact Us</a>
                </nav>

                <!-- Theme Toggle -->
                <div class="mobile-theme-toggle">
                    <span>Dark Mode</span>
                    <div class="theme-switch" id="mobileThemeSwitch" onclick="mobileMenu.toggleTheme()"></div>
                </div>

                <!-- Action Buttons -->
                <div class="mobile-menu-actions">
                    <a href="${pathPrefix}pages/donate.html" class="mobile-action-btn primary">Donate Now</a>
                    <a href="${pathPrefix}pages/volunteer.html" class="mobile-action-btn secondary">Get Involved</a>
                </div>
            </div>
        `;

        // Create container and add to body
        const container = document.createElement('div');
        container.id = 'mobileMenuContainer';
        container.innerHTML = menuHTML;
        document.body.appendChild(container);

        // Initialize theme switch state
        this.updateThemeSwitch();
    }

    bindEvents() {
        // Prevent menu close when clicking inside menu
        const menu = document.getElementById('mobileMenu');
        if (menu) {
            menu.addEventListener('click', (e) => e.stopPropagation());
        }
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const overlay = document.getElementById('mobileMenuOverlay');
        const menu = document.getElementById('mobileMenu');

        if (btn && overlay && menu) {
            this.isOpen = true;
            btn.classList.add('active');
            overlay.classList.add('active');
            menu.classList.add('active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            console.log('Mobile menu opened');
        }
    }

    closeMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const overlay = document.getElementById('mobileMenuOverlay');
        const menu = document.getElementById('mobileMenu');

        if (btn && overlay && menu) {
            this.isOpen = false;
            btn.classList.remove('active');
            overlay.classList.remove('active');
            menu.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            console.log('Mobile menu closed');
        }
    }

    handleOutsideClick(e) {
        const menu = document.getElementById('mobileMenu');
        const btn = document.getElementById('mobileMenuBtn');
        
        if (this.isOpen && menu && btn) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                this.closeMenu();
            }
        }
    }

    handleResize() {
        const btn = document.getElementById('mobileMenuBtn');
        
        if (btn) {
            if (window.innerWidth <= 768) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
                if (this.isOpen) {
                    this.closeMenu();
                }
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateThemeSwitch();
        
        console.log('Theme changed to:', newTheme);
    }

    updateThemeSwitch() {
        const themeSwitch = document.getElementById('mobileThemeSwitch');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (themeSwitch) {
            if (currentTheme === 'dark') {
                themeSwitch.classList.add('active');
            } else {
                themeSwitch.classList.remove('active');
            }
        }
    }

    getPathPrefix() {
        // Get current path and determine how many levels deep we are
        const path = window.location.pathname;
        console.log('Current path:', path);
        
        // Remove trailing slash and filename to get directory path
        let dirPath = path.replace(/\/[^/]*\.html$/, '').replace(/\/$/, '');
        console.log('Directory path:', dirPath);
        
        // Count directory levels (excluding root)
        const levels = dirPath.split('/').filter(part => part !== '').length;
        console.log('Directory levels:', levels);
        
        // Create relative path prefix based on levels
        const prefix = '../'.repeat(levels);
        console.log('Path prefix:', prefix);
        
        return prefix;
    }
}

// Initialize mobile menu
let mobileMenu;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mobileMenu = new MobileMenu();
    });
} else {
    mobileMenu = new MobileMenu();
}

// Export for global access
window.mobileMenu = mobileMenu;
