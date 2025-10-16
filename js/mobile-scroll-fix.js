/**
 * Mobile Scroll Fix - Ensures immediate scrolling capability on mobile devices
 * This script runs immediately to prevent any scroll blocking during page load
 */

(function() {
    'use strict';
    
    // Function to enable scrolling
    function enableScrolling() {
        if (window.innerWidth <= 768) {
            document.documentElement.style.overflowY = 'auto';
            document.body.style.overflowY = 'auto';
            document.documentElement.style.webkitOverflowScrolling = 'touch';
            document.body.style.webkitOverflowScrolling = 'touch';
            document.documentElement.style.touchAction = 'pan-y';
            document.body.style.touchAction = 'pan-y';
            
            // Remove any position fixed that might block scrolling
            document.body.style.position = 'relative';
            document.documentElement.style.position = 'relative';
        }
    }
    
    // Enable scrolling immediately
    enableScrolling();
    
    // Ensure scrolling is enabled when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableScrolling);
    }
    
    // Re-enable scrolling after page load in case something disabled it
    window.addEventListener('load', function() {
        setTimeout(enableScrolling, 100);
    });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(enableScrolling, 200);
    });
    
    // Prevent any script from disabling scrolling on mobile
    if (window.innerWidth <= 768) {
        const originalStyle = document.body.style.overflow;
        Object.defineProperty(document.body.style, 'overflow', {
            set: function(value) {
                // Only allow 'hidden' for very brief moments
                if (value === 'hidden') {
                    setTimeout(() => {
                        if (document.body.style.overflow === 'hidden') {
                            document.body.style.overflow = 'auto';
                        }
                    }, 100);
                }
                return value;
            },
            get: function() {
                return originalStyle;
            }
        });
    }
    
})();