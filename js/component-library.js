/**
 * We Warriors Component Library
 * Modular, reusable UI components for scalable development
 */

class ComponentLibrary {
    constructor() {
        this.components = new Map();
        this.init();
    }

    init() {
        this.registerComponents();
        this.initializeComponents();
        this.setupGlobalEvents();
    }

    registerComponents() {
        // Register all available components
        this.components.set('Modal', Modal);
        this.components.set('Toast', Toast);
        // this.components.set('Dropdown', Dropdown); // TODO: Implement Dropdown class
        // this.components.set('Tabs', Tabs); // TODO: Implement Tabs class
        // this.components.set('Accordion', Accordion); // TODO: Implement Accordion class
        this.components.set('SearchBar', SearchBar);
        // this.components.set('FilterableList', FilterableList); // TODO: Implement FilterableList class
        this.components.set('ImageGallery', ImageGallery);
        // this.components.set('LoadMore', LoadMore); // TODO: Implement LoadMore class
        // this.components.set('ProgressiveForm', ProgressiveForm); // TODO: Implement ProgressiveForm class
    }

    initializeComponents() {
        // Auto-initialize components found in the DOM
        this.components.forEach((ComponentClass, name) => {
            const elements = document.querySelectorAll(`[data-component="${name.toLowerCase()}"]`);
            elements.forEach(el => {
                new ComponentClass(el, this.getComponentOptions(el));
            });
        });
    }

    getComponentOptions(element) {
        const options = {};
        const dataset = element.dataset;
        
        Object.keys(dataset).forEach(key => {
            if (key.startsWith('option')) {
                const optionName = key.replace('option', '').toLowerCase();
                let value = dataset[key];
                
                // Parse JSON if it looks like JSON
                try {
                    if (value.startsWith('{') || value.startsWith('[')) {
                        value = JSON.parse(value);
                    }
                } catch (e) {
                    // Keep as string
                }
                
                options[optionName] = value;
            }
        });
        
        return options;
    }

    setupGlobalEvents() {
        // Global component event handling
        document.addEventListener('component:created', this.handleComponentCreated.bind(this));
        document.addEventListener('component:destroyed', this.handleComponentDestroyed.bind(this));
    }

    handleComponentCreated(event) {
        console.log('Component created:', event.detail);
    }

    handleComponentDestroyed(event) {
        console.log('Component destroyed:', event.detail);
    }

    // Static method to create components programmatically
    static create(componentName, container, options = {}) {
        const library = window.componentLibrary || new ComponentLibrary();
        const ComponentClass = library.components.get(componentName);
        
        if (ComponentClass) {
            return new ComponentClass(container, options);
        } else {
            console.warn(`Component ${componentName} not found`);
            return null;
        }
    }
}

/**
 * Modal Component
 */
class Modal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: false,
            ...options
        };
        
        this.isOpen = false;
        this.init();
        this.emitEvent('created', { component: 'Modal', element: this.element });
    }

    init() {
        this.createModal();
        this.bindEvents();
        
        if (this.options.show) {
            this.show();
        }
    }

    createModal() {
        if (!this.element.classList.contains('modal')) {
            this.element.classList.add('modal');
        }
        
        // Add modal structure if not present
        if (!this.element.querySelector('.modal-dialog')) {
            const content = this.element.innerHTML;
            this.element.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.options.title || 'Modal'}</h5>
                            <button type="button" class="modal-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    bindEvents() {
        // Close button
        this.element.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close, [data-dismiss="modal"]')) {
                this.hide();
            }
        });

        // Backdrop click
        if (this.options.backdrop) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) {
                    this.hide();
                }
            });
        }

        // Keyboard events
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.hide();
                }
            });
        }
    }

    show() {
        this.isOpen = true;
        this.element.style.display = 'flex';
        this.element.classList.add('show');
        document.body.classList.add('modal-open');
        
        if (this.options.focus) {
            this.element.focus();
        }
        
        this.emitEvent('shown');
    }

    hide() {
        this.isOpen = false;
        this.element.classList.remove('show');
        
        setTimeout(() => {
            this.element.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300);
        
        this.emitEvent('hidden');
    }

    emitEvent(type, detail = {}) {
        const event = new CustomEvent(`modal:${type}`, {
            detail: { ...detail, modal: this }
        });
        this.element.dispatchEvent(event);
    }
}

/**
 * Toast Notification Component
 */
class Toast {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            autohide: true,
            delay: 5000,
            position: 'top-right',
            type: 'info',
            ...options
        };
        
        this.init();
    }

    init() {
        this.setupToast();
        this.bindEvents();
        this.show();
    }

    setupToast() {
        this.element.classList.add('toast', `toast-${this.options.type}`);
        
        // Create toast container if it doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = `toast-container toast-${this.options.position}`;
            document.body.appendChild(container);
        }
        
        container.appendChild(this.element);
    }

    bindEvents() {
        const closeBtn = this.element.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }

    show() {
        this.element.classList.add('show');
        
        if (this.options.autohide) {
            setTimeout(() => this.hide(), this.options.delay);
        }
    }

    hide() {
        this.element.classList.add('hiding');
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }

    static show(message, type = 'info', options = {}) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="toast-close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        
        return new Toast(toast, { type, ...options });
    }
}

/**
 * Search Bar Component
 */
class SearchBar {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            placeholder: 'Search...',
            minLength: 2,
            debounce: 300,
            showSuggestions: true,
            ...options
        };
        
        this.searchTimeout = null;
        this.suggestions = [];
        
        this.init();
    }

    init() {
        this.createSearchBar();
        this.bindEvents();
    }

    createSearchBar() {
        this.element.innerHTML = `
            <div class="search-bar">
                <div class="search-input-container">
                    <input type="text" class="search-input" placeholder="${this.options.placeholder}">
                    <div class="search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </div>
                </div>
                ${this.options.showSuggestions ? '<div class="search-suggestions"></div>' : ''}
            </div>
        `;
        
        this.input = this.element.querySelector('.search-input');
        this.suggestionsContainer = this.element.querySelector('.search-suggestions');
    }

    bindEvents() {
        this.input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (query.length >= this.options.minLength) {
                    this.performSearch(query);
                } else {
                    this.hideSuggestions();
                }
            }, this.options.debounce);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    performSearch(query) {
        this.emitEvent('search', { query });
        
        if (this.options.showSuggestions) {
            this.loadSuggestions(query);
        }
    }

    loadSuggestions(query) {
        // This would typically make an API call
        // For now, we'll simulate with sample data
        const sampleSuggestions = [
            'Sickle Cell Treatment Options',
            'Gene Therapy Clinical Trials',
            'Pain Management Strategies',
            'Support Groups Near Me',
            'Healthcare Providers'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        
        this.showSuggestions(sampleSuggestions);
    }

    showSuggestions(suggestions) {
        if (!this.suggestionsContainer) return;
        
        this.suggestions = suggestions;
        this.suggestionsContainer.innerHTML = suggestions.map(suggestion => 
            `<div class="search-suggestion" data-value="${suggestion}">${suggestion}</div>`
        ).join('');
        
        this.suggestionsContainer.classList.add('show');
        
        // Bind suggestion click events
        this.suggestionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-suggestion')) {
                const value = e.target.dataset.value;
                this.input.value = value;
                this.hideSuggestions();
                this.emitEvent('suggestion-selected', { value });
            }
        });
    }

    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.classList.remove('show');
        }
    }

    emitEvent(type, detail = {}) {
        const event = new CustomEvent(`searchbar:${type}`, {
            detail: { ...detail, searchBar: this }
        });
        this.element.dispatchEvent(event);
    }
}

/**
 * Image Gallery Component
 */
class ImageGallery {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            thumbnails: true,
            navigation: true,
            autoplay: false,
            autoplaySpeed: 5000,
            lightbox: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.images = [];
        
        this.init();
    }

    init() {
        this.loadImages();
        this.createGallery();
        this.bindEvents();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    loadImages() {
        const imgs = this.element.querySelectorAll('img');
        this.images = Array.from(imgs).map(img => ({
            src: img.src,
            alt: img.alt || '',
            caption: img.dataset.caption || ''
        }));
    }

    createGallery() {
        this.element.classList.add('image-gallery');
        this.element.innerHTML = `
            <div class="gallery-main">
                <div class="gallery-image-container">
                    ${this.images.map((img, index) => `
                        <img src="${img.src}" alt="${img.alt}" 
                             class="gallery-image ${index === 0 ? 'active' : ''}"
                             data-index="${index}">
                    `).join('')}
                </div>
                ${this.options.navigation ? `
                    <button class="gallery-nav gallery-prev" aria-label="Previous image">‹</button>
                    <button class="gallery-nav gallery-next" aria-label="Next image">›</button>
                ` : ''}
            </div>
            ${this.options.thumbnails ? `
                <div class="gallery-thumbnails">
                    ${this.images.map((img, index) => `
                        <img src="${img.src}" alt="${img.alt}" 
                             class="gallery-thumbnail ${index === 0 ? 'active' : ''}"
                             data-index="${index}">
                    `).join('')}
                </div>
            ` : ''}
        `;
    }

    bindEvents() {
        // Navigation buttons
        if (this.options.navigation) {
            this.element.querySelector('.gallery-prev')?.addEventListener('click', () => this.prev());
            this.element.querySelector('.gallery-next')?.addEventListener('click', () => this.next());
        }

        // Thumbnail clicks
        if (this.options.thumbnails) {
            this.element.addEventListener('click', (e) => {
                if (e.target.classList.contains('gallery-thumbnail')) {
                    const index = parseInt(e.target.dataset.index);
                    this.goTo(index);
                }
            });
        }

        // Lightbox
        if (this.options.lightbox) {
            this.element.addEventListener('click', (e) => {
                if (e.target.classList.contains('gallery-image')) {
                    this.openLightbox(this.currentIndex);
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.element.contains(e.target)) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.next();
                        break;
                }
            }
        });
    }

    prev() {
        const newIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.goTo(newIndex);
    }

    next() {
        const newIndex = (this.currentIndex + 1) % this.images.length;
        this.goTo(newIndex);
    }

    goTo(index) {
        if (index < 0 || index >= this.images.length) return;
        
        // Update active states
        this.element.querySelectorAll('.gallery-image, .gallery-thumbnail').forEach(el => {
            el.classList.remove('active');
        });
        
        this.element.querySelector(`[data-index="${index}"]`).classList.add('active');
        const thumbnail = this.element.querySelector(`.gallery-thumbnail[data-index="${index}"]`);
        if (thumbnail) thumbnail.classList.add('active');
        
        this.currentIndex = index;
        this.emitEvent('slide-changed', { index, image: this.images[index] });
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    openLightbox(index) {
        // Create lightbox modal
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${this.images[index].src}" alt="${this.images[index].alt}">
                <button class="lightbox-close">&times;</button>
                ${this.images[index].caption ? `<div class="lightbox-caption">${this.images[index].caption}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Bind close events
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.remove();
            }
        });
        
        document.addEventListener('keydown', function closeLightbox(e) {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', closeLightbox);
            }
        });
    }

    emitEvent(type, detail = {}) {
        const event = new CustomEvent(`gallery:${type}`, {
            detail: { ...detail, gallery: this }
        });
        this.element.dispatchEvent(event);
    }
}

// CSS for components
const componentStyles = `
/* Modal Styles */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.modal.show {
    display: flex;
}

.modal-dialog {
    max-width: 500px;
    width: 90%;
    margin: 1.75rem auto;
}

.modal-content {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-title {
    margin: 0;
    font-size: 1.25rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body {
    padding: 1.5rem;
}

/* Toast Styles */
.toast-container {
    position: fixed;
    z-index: 1060;
    pointer-events: none;
}

.toast-container.toast-top-right {
    top: 1rem;
    right: 1rem;
}

.toast {
    background: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    pointer-events: auto;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.toast.show {
    opacity: 1;
    transform: translateX(0);
}

.toast.hiding {
    opacity: 0;
    transform: translateX(100%);
}

.toast-header {
    padding: 0.5rem 0.75rem;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    border-radius: 0.375rem 0.375rem 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.toast-body {
    padding: 0.75rem;
}

.toast-success { border-left: 4px solid #28a745; }
.toast-error { border-left: 4px solid #dc3545; }
.toast-warning { border-left: 4px solid #ffc107; }
.toast-info { border-left: 4px solid #17a2b8; }

/* Search Bar Styles */
.search-bar {
    position: relative;
    width: 100%;
    max-width: 400px;
}

.search-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #e9ecef;
    border-radius: 2rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #8B4513;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: #6c757d;
    pointer-events: none;
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e9ecef;
    border-top: none;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.search-suggestions.show {
    display: block;
}

.search-suggestion {
    padding: 0.75rem 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
    transition: background-color 0.2s ease;
}

.search-suggestion:hover {
    background-color: #f8f9fa;
}

.search-suggestion:last-child {
    border-bottom: none;
}

/* Gallery Styles */
.image-gallery {
    width: 100%;
}

.gallery-main {
    position: relative;
    margin-bottom: 1rem;
}

.gallery-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 0.5rem;
}

.gallery-image {
    width: 100%;
    height: auto;
    display: none;
}

.gallery-image.active {
    display: block;
}

.gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.gallery-nav:hover {
    background: rgba(0, 0, 0, 0.7);
}

.gallery-prev {
    left: 1rem;
}

.gallery-next {
    right: 1rem;
}

.gallery-thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
}

.gallery-thumbnail {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.25rem;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s ease;
}

.gallery-thumbnail.active,
.gallery-thumbnail:hover {
    opacity: 1;
}

/* Lightbox Styles */
.lightbox-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.lightbox-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
}

.lightbox-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 1rem;
    text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-dialog {
        margin: 1rem;
    }
    
    .toast-container.toast-top-right {
        top: 1rem;
        right: 0.5rem;
        left: 0.5rem;
    }
    
    .search-input {
        padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    }
    
    .search-icon {
        left: 0.75rem;
    }
    
    .gallery-nav {
        width: 35px;
        height: 35px;
        font-size: 1.25rem;
    }
    
    .gallery-prev {
        left: 0.5rem;
    }
    
    .gallery-next {
        right: 0.5rem;
    }
}
`;

// Inject component styles
const styleSheet = document.createElement('style');
styleSheet.textContent = componentStyles;
document.head.appendChild(styleSheet);

// Initialize component library
document.addEventListener('DOMContentLoaded', () => {
    window.componentLibrary = new ComponentLibrary();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ComponentLibrary,
        Modal,
        Toast,
        SearchBar,
        ImageGallery
    };
}