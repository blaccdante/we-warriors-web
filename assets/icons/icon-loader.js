/**
 * SVG Icon Management System for Sickle Cell Support Website
 * Handles loading, displaying, and fallback for SVG icons
 */

class IconLoader {
    constructor() {
        this.loaded = false;
        this.iconSets = [
            'assets/icons/medical-icons.svg',
            'assets/icons/activity-icons.svg', 
            'assets/icons/emotional-icons.svg'
        ];
        this.fallbackMap = {
            // Medical icons
            'icon-hospital': '🏥',
            'icon-pills': '💊',
            'icon-stethoscope': '🩺',
            'icon-blood-cell': '🩸',
            'icon-warning': '⚠️',
            'icon-emergency': '🚨',
            'icon-microscope': '🔬',
            'icon-dna': '🧬',
            'icon-syringe': '💉',
            
            // Activity icons
            'icon-handshake': '🤝',
            'icon-books': '📚',
            'icon-celebration': '🎉',
            'icon-computer': '💻',
            'icon-art': '🎨',
            'icon-graduation': '🎓',
            'icon-scales': '⚖️',
            'icon-trophy': '🏆',
            'icon-target': '🎯',
            
            // Emotional icons
            'icon-heart': '❤️',
            'icon-star': '⭐',
            'icon-lightbulb': '💡',
            'icon-people': '👥',
            'icon-strength': '💪',
            'icon-brain': '🧠',
            'icon-support': '🤝',
            'icon-unity': '🔗',
            'icon-wellness': '🌟',
            'icon-hope': '☀️'
        };
        this.init();
    }

    async init() {
        try {
            await this.loadIconSets();
            this.loaded = true;
            this.replaceEmojiIcons();
        } catch (error) {
            console.warn('Failed to load SVG icons, using fallbacks:', error);
            this.useFallbacks();
        }
    }

    async loadIconSets() {
        const promises = this.iconSets.map(async (iconSet) => {
            try {
                const response = await fetch(iconSet);
                if (!response.ok) throw new Error(`Failed to fetch ${iconSet}`);
                const svgContent = await response.text();
                
                // Create a div to hold the SVG content
                const div = document.createElement('div');
                div.innerHTML = svgContent;
                div.style.display = 'none';
                document.body.appendChild(div);
                
                return iconSet;
            } catch (error) {
                console.warn(`Failed to load icon set: ${iconSet}`, error);
                throw error;
            }
        });

        await Promise.all(promises);
    }

    replaceEmojiIcons() {
        // Find all elements with emoji icons and replace with SVG
        const emojiElements = document.querySelectorAll('[class*="icon"], .card-icon, .benefit-icon, .management-icon');
        
        emojiElements.forEach(element => {
            const iconId = this.detectIconFromContent(element);
            if (iconId) {
                this.replacWithSVG(element, iconId);
            }
        });
    }

    detectIconFromContent(element) {
        const content = element.textContent.trim();
        
        // Map emoji content to icon IDs
        const emojiToIcon = {
            '🏥': 'icon-hospital',
            '💊': 'icon-pills', 
            '🩺': 'icon-stethoscope',
            '🩸': 'icon-blood-cell',
            '⚠️': 'icon-warning',
            '🚨': 'icon-emergency',
            '🔬': 'icon-microscope',
            '🧬': 'icon-dna',
            '💉': 'icon-syringe',
            '🤝': 'icon-handshake',
            '📚': 'icon-books',
            '🎉': 'icon-celebration',
            '💻': 'icon-computer',
            '🎨': 'icon-art',
            '🎓': 'icon-graduation',
            '⚖️': 'icon-scales',
            '🏆': 'icon-trophy',
            '🎯': 'icon-target',
            '❤️': 'icon-heart',
            '⭐': 'icon-star',
            '🌟': 'icon-star',
            '💡': 'icon-lightbulb',
            '👥': 'icon-people',
            '💪': 'icon-strength',
            '🧠': 'icon-brain'
        };

        return emojiToIcon[content] || null;
    }

    replacWithSVG(element, iconId) {
        try {
            // Create SVG use element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            
            svg.setAttribute('class', 'icon');
            svg.setAttribute('aria-hidden', 'true');
            use.setAttribute('href', `#${iconId}`);
            
            svg.appendChild(use);
            
            // Replace the emoji content with SVG
            element.innerHTML = '';
            element.appendChild(svg);
            
            // Add appropriate classes for styling
            element.classList.add('svg-icon-container');
            
        } catch (error) {
            console.warn(`Failed to replace with SVG, using fallback for ${iconId}:`, error);
            this.useTextFallback(element, iconId);
        }
    }

    useTextFallback(element, iconId) {
        const fallback = this.fallbackMap[iconId];
        if (fallback) {
            element.textContent = fallback;
        }
    }

    useFallbacks() {
        // If SVG loading fails completely, keep existing emojis but ensure they're clean
        const emojiElements = document.querySelectorAll('[class*="icon"], .card-icon, .benefit-icon, .management-icon');
        
        emojiElements.forEach(element => {
            const iconId = this.detectIconFromContent(element);
            if (iconId) {
                this.useTextFallback(element, iconId);
            }
        });
    }

    // Method to create an SVG icon programmatically
    createIcon(iconId, className = 'icon') {
        if (!this.loaded) {
            // Fallback if not loaded
            const span = document.createElement('span');
            span.textContent = this.fallbackMap[iconId] || '●';
            span.className = className;
            return span;
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        
        svg.setAttribute('class', className);
        svg.setAttribute('aria-hidden', 'true');
        use.setAttribute('href', `#${iconId}`);
        
        svg.appendChild(use);
        return svg;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.iconLoader = new IconLoader();
    });
} else {
    window.iconLoader = new IconLoader();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconLoader;
}