// Theme Toggle Functionality - Fixed Version
(function() {
    'use strict';
    
    // Get system preference or saved theme
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // Get current theme from localStorage, or system preference, or default to 'light'
    let currentTheme = localStorage.getItem('theme') || getSystemPreference();
    
    // Apply theme function
    function applyTheme(theme) {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update mobile theme switch if it exists
        const mobileThemeSwitch = document.getElementById('mobileThemeSwitch');
        if (mobileThemeSwitch) {
            if (theme === 'dark') {
                mobileThemeSwitch.classList.add('active');
            } else {
                mobileThemeSwitch.classList.remove('active');
            }
        }
    }
    
    // Toggle theme function
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    }
    
    // Initialize on DOM load
    function init() {
        // Apply current theme immediately
        applyTheme(currentTheme);
        
        // Find theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        const mobileThemeSwitch = document.getElementById('mobileThemeSwitch');
        
        // Add click listeners
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });
            
            // Keyboard support
            themeToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
        
        if (mobileThemeSwitch) {
            mobileThemeSwitch.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });
        }
        
        // Listen for system theme changes (only if user hasn't manually set preference)
        if (window.matchMedia && !localStorage.getItem('theme')) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', function(e) {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    currentTheme = e.matches ? 'dark' : 'light';
                    applyTheme(currentTheme);
                }
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for external use
    window.themeToggle = {
        toggle: toggleTheme,
        apply: applyTheme,
        current: () => currentTheme
    };
    
})();
