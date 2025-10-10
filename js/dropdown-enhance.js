// Enhanced dropdown functionality for better user experience
document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const toggle = item.querySelector('.dropdown-toggle');
        const menu = item.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Add click functionality for mobile/touch devices
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                item.classList.toggle('active');
            });
            
            // Keyboard accessibility
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.classList.toggle('active');
                } else if (e.key === 'Escape') {
                    item.classList.remove('active');
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!item.contains(e.target)) {
                    item.classList.remove('active');
                }
            });
        }
    });
});

// Add CSS for JavaScript-enhanced dropdowns
const enhanceCSS = `
.nav-item.dropdown.active .dropdown-menu {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
}

.nav-item.dropdown.active .dropdown-toggle::after {
    transform: rotate(180deg) !important;
}
`;

const style = document.createElement('style');
style.textContent = enhanceCSS;
document.head.appendChild(style);