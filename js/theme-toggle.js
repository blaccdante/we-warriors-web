// Theme Toggle Functionality - Fixed Version
(function() {
    'use strict';
    
    // Get current theme from localStorage or default to 'light'
    let currentTheme = localStorage.getItem('theme') || 'light';
    
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
