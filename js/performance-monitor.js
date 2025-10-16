/**
 * Performance Monitoring & Optimization Suite
 * Monitors site performance and provides optimization insights
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            themeToggleSpeed: [],
            scrollPerformance: [],
            memoryUsage: [],
            interactionTimes: []
        };
        
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.monitorThemeToggle();
        this.monitorScrollPerformance();
        this.monitorMemoryUsage();
        this.monitorInteractions();
        this.createPerformanceDashboard();
        
        console.log('Performance Monitor initialized');
    }

    measurePageLoad() {
        if (performance && performance.timing) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.metrics.loadTime = loadTime;
                
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Show performance notification
                this.showPerformanceNotification(loadTime);
            });
        }
    }

    monitorThemeToggle() {
        let themeToggleStart = 0;
        
        // Monitor theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle, .mobile-theme-switch')) {
                themeToggleStart = performance.now();
            }
        });
        
        // Monitor theme change completion
        document.addEventListener('themeChanged', () => {
            if (themeToggleStart > 0) {
                const toggleTime = performance.now() - themeToggleStart;
                this.metrics.themeToggleSpeed.push(toggleTime);
                
                console.log(`Theme toggle completed in ${toggleTime.toFixed(2)}ms`);
                themeToggleStart = 0;
            }
        });
    }

    monitorScrollPerformance() {
        let scrollStart = 0;
        let frameCount = 0;
        let lastFrameTime = performance.now();
        
        const measureScrollFPS = () => {
            const now = performance.now();
            frameCount++;
            
            if (now - lastFrameTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
                this.metrics.scrollPerformance.push(fps);
                
                if (fps < 30) {
                    console.warn(`Low scroll FPS detected: ${fps}`);
                }
                
                frameCount = 0;
                lastFrameTime = now;
            }
            
            requestAnimationFrame(measureScrollFPS);
        };
        
        window.addEventListener('scroll', () => {
            if (scrollStart === 0) {
                scrollStart = performance.now();
                measureScrollFPS();
            }
        });
    }

    monitorMemoryUsage() {
        if (performance.memory) {
            const checkMemory = () => {
                const memInfo = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                };
                
                this.metrics.memoryUsage.push(memInfo);
                
                if (memInfo.used > memInfo.total * 0.8) {
                    console.warn('High memory usage detected:', memInfo);
                }
            };
            
            // Check memory usage every 30 seconds
            checkMemory();
            setInterval(checkMemory, 30000);
        }
    }

    monitorInteractions() {
        const interactionElements = [
            '.btn-modern',
            '.slide-btn',
            '.modern-card',
            '.nav-link',
            '.dropdown-toggle'
        ];
        
        interactionElements.forEach(selector => {
            document.addEventListener('click', (e) => {
                if (e.target.closest(selector)) {
                    const interactionTime = performance.now();
                    this.metrics.interactionTimes.push({
                        element: selector,
                        time: interactionTime
                    });
                }
            });
        });
    }

    createPerformanceDashboard() {
        // Create floating performance indicator
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 200px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: none;
        `;
        
        // Toggle dashboard visibility with Ctrl+Shift+P
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
                if (dashboard.style.display === 'block') {
                    this.updateDashboard(dashboard);
                }
            }
        });
        
        document.body.appendChild(dashboard);
        
        // Update dashboard every 2 seconds when visible
        setInterval(() => {
            if (dashboard.style.display === 'block') {
                this.updateDashboard(dashboard);
            }
        }, 2000);
    }

    updateDashboard(dashboard) {
        const avgThemeToggle = this.metrics.themeToggleSpeed.length > 0 
            ? (this.metrics.themeToggleSpeed.reduce((a, b) => a + b, 0) / this.metrics.themeToggleSpeed.length).toFixed(2)
            : 'N/A';
            
        const avgScrollFPS = this.metrics.scrollPerformance.length > 0
            ? Math.round(this.metrics.scrollPerformance.reduce((a, b) => a + b, 0) / this.metrics.scrollPerformance.length)
            : 'N/A';
            
        const currentMemory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
        
        dashboard.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #8B4513;">⚡ We Warriors Performance</div>
            <div>🚀 Load Time: ${this.metrics.loadTime}ms</div>
            <div>🌙 Avg Theme Toggle: ${avgThemeToggle}ms</div>
            <div>📊 Avg Scroll FPS: ${avgScrollFPS}</div>
            ${currentMemory ? `<div>🧠 Memory: ${currentMemory.used}/${currentMemory.total}MB</div>` : ''}
            <div style="margin-top: 8px; font-size: 10px; opacity: 0.7;">Press Ctrl+Shift+P to toggle</div>
        `;
    }

    showPerformanceNotification(loadTime) {
        let message = '';
        let type = 'success';
        
        if (loadTime < 1000) {
            message = `🚀 Blazing fast! Loaded in ${loadTime}ms`;
            type = 'success';
        } else if (loadTime < 2000) {
            message = `⚡ Great performance! Loaded in ${loadTime}ms`;
            type = 'success';
        } else if (loadTime < 3000) {
            message = `✅ Good performance. Loaded in ${loadTime}ms`;
            type = 'info';
        } else {
            message = `⏰ Performance could be better. Loaded in ${loadTime}ms`;
            type = 'warning';
        }
        
        // Show toast notification if Toast component is available
        if (window.Toast && window.Toast.show) {
            window.Toast.show(message, type, { delay: 3000 });
        } else {
            console.log(message);
        }
    }

    // Progressive Web App optimizations
    enablePWAOptimizations() {
        // Service worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Enable resource hints
        this.addResourceHints();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/modern-slideshow.css', as: 'style' },
            { href: '/css/theme-optimization.css', as: 'style' },
            { href: '/js/modern-slideshow.js', as: 'script' },
            { href: '/assets/images/hero/AdobeStock_1132382728.jpeg', as: 'image' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    addResourceHints() {
        // DNS prefetch for external resources
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];
        
        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    // Image optimization utilities
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" if not already present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add proper sizing attributes
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                img.addEventListener('load', function() {
                    this.setAttribute('width', this.naturalWidth);
                    this.setAttribute('height', this.naturalHeight);
                }, { once: true });
            }
        });
    }

    // Generate performance report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            recommendations: this.getOptimizationRecommendations(),
            score: this.calculatePerformanceScore()
        };
        
        console.log('Performance Report:', report);
        return report;
    }

    getOptimizationRecommendations() {
        const recommendations = [];
        
        if (this.metrics.loadTime > 3000) {
            recommendations.push('Consider optimizing images and reducing bundle size');
        }
        
        const avgThemeToggle = this.metrics.themeToggleSpeed.length > 0 
            ? this.metrics.themeToggleSpeed.reduce((a, b) => a + b, 0) / this.metrics.themeToggleSpeed.length
            : 0;
            
        if (avgThemeToggle > 100) {
            recommendations.push('Theme toggle performance could be improved');
        }
        
        const avgScrollFPS = this.metrics.scrollPerformance.length > 0
            ? this.metrics.scrollPerformance.reduce((a, b) => a + b, 0) / this.metrics.scrollPerformance.length
            : 60;
            
        if (avgScrollFPS < 30) {
            recommendations.push('Scroll performance needs optimization - consider reducing complex animations');
        }
        
        return recommendations;
    }

    calculatePerformanceScore() {
        let score = 100;
        
        // Deduct points for slow load time
        if (this.metrics.loadTime > 3000) score -= 20;
        else if (this.metrics.loadTime > 2000) score -= 10;
        else if (this.metrics.loadTime > 1000) score -= 5;
        
        // Deduct points for poor scroll performance
        const avgScrollFPS = this.metrics.scrollPerformance.length > 0
            ? this.metrics.scrollPerformance.reduce((a, b) => a + b, 0) / this.metrics.scrollPerformance.length
            : 60;
            
        if (avgScrollFPS < 30) score -= 15;
        else if (avgScrollFPS < 45) score -= 10;
        else if (avgScrollFPS < 55) score -= 5;
        
        return Math.max(0, score);
    }
}

// Critical performance optimization for immediate load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitor
    window.performanceMonitor = new PerformanceMonitor();
    
    // Enable PWA optimizations
    window.performanceMonitor.enablePWAOptimizations();
    
    // Optimize images
    window.performanceMonitor.optimizeImages();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}