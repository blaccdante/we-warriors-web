/**
 * Mobile Performance Optimization and Theme Toggle Fix
 * Ensures smooth operation on mobile devices
 */

(function() {
    'use strict';
    
    // Detect mobile and performance characteristics
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isSlowDevice = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;
    const hasLimitedBandwidth = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');
    
    // Optimize for mobile performance
    if (isMobile) {
        // Reduce animation duration for better performance
        document.documentElement.style.setProperty('--transition-fast', '0.15s ease');
        document.documentElement.style.setProperty('--transition-normal', '0.2s ease');
        
        // Disable smooth scrolling on slow devices
        if (isSlowDevice) {
            document.documentElement.style.scrollBehavior = 'auto';
        }
        
    // Optimize touch targets - with error handling
        try {
            const buttons = document.querySelectorAll('button, a, [role="button"]');
            buttons.forEach(button => {
                if (button && button.offsetHeight < 44 || button.offsetWidth < 44) {
                    button.style.minHeight = '44px';
                    button.style.minWidth = '44px';
                    button.style.display = 'inline-flex';
                    button.style.alignItems = 'center';
                    button.style.justifyContent = 'center';
                }
            });
        } catch (error) {
            console.log('Touch target optimization error:', error);
        }
    }
    
    // Enhanced theme toggle fix for mobile
    function fixThemeToggle() {
        const themeToggles = document.querySelectorAll('.theme-toggle, .mobile-theme-switch, #mobileThemeSwitch');
        
        themeToggles.forEach(toggle => {
            if (!toggle) return;
            
            // Prevent double-tap zoom
            toggle.style.touchAction = 'manipulation';
            toggle.style.userSelect = 'none';
            toggle.style.webkitUserSelect = 'none';
            toggle.style.webkitTouchCallout = 'none';
            
            // Remove existing listeners to prevent conflicts
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            // Add optimized touch handling
            let touchStartTime = 0;
            let touchHandled = false;
            
            newToggle.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchHandled = false;
            }, { passive: true });
            
            newToggle.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                
                // Only handle quick taps (not long presses)
                if (touchDuration < 500 && !touchHandled) {
                    e.preventDefault();
                    e.stopPropagation();
                    touchHandled = true;
                    
                    // Add visual feedback
                    newToggle.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        newToggle.style.transform = '';
                    }, 100);
                    
                    // Trigger theme change
                    if (window.universalHeader && window.universalHeader.handleThemeToggle) {
                        window.universalHeader.handleThemeToggle();
                    } else {
                        // Fallback theme toggle
                        toggleThemeFallback();
                    }
                    
                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(10);
                    }
                }
            }, { passive: false });
            
            // Fallback click handler for non-touch devices
            newToggle.addEventListener('click', (e) => {
                if (!touchHandled) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (window.universalHeader && window.universalHeader.handleThemeToggle) {
                        window.universalHeader.handleThemeToggle();
                    } else {
                        toggleThemeFallback();
                    }
                }
            });
        });
    }
    
    // Fallback theme toggle function
    function toggleThemeFallback() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle icons
        const themeIcons = document.querySelectorAll('.theme-icon');
        themeIcons.forEach(icon => {
            icon.textContent = newTheme === 'light' ? '☀' : '☾';
        });
        
        // Update mobile theme switches
        const mobileSwitches = document.querySelectorAll('.mobile-theme-switch');
        mobileSwitches.forEach(sw => {
            if (newTheme === 'dark') {
                sw.classList.add('active');
            } else {
                sw.classList.remove('active');
            }
        });
    }
    
    // Initialize fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixThemeToggle);
    } else {
        fixThemeToggle();
    }
    
    // Re-apply fixes when new content is loaded
    const observer = new MutationObserver((mutations) => {
        let shouldFix = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldFix = true;
            }
        });
        if (shouldFix) {
            setTimeout(fixThemeToggle, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Optimize images for mobile
    if (isMobile || hasLimitedBandwidth) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }
    
    console.log('Mobile performance optimizations applied:', {
        isMobile,
        isSlowDevice,
        hasLimitedBandwidth
    });
    
})();