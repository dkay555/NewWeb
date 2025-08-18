// Performance Optimizations for BabixGO Website
// Image lazy loading, font loading optimizations, and core web vitals improvements

// Optimize image loading
function optimizeImages() {
    // Add intersection observer for better lazy loading control
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load the actual image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Add loaded class for smooth transitions
                img.onload = () => {
                    img.classList.add('loaded');
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before the image enters viewport
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Add loading states to existing images
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            };
        }
    });
}

// Optimize font loading
function optimizeFonts() {
    // Use font-display: swap for better performance
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('display', 'swap');
        link.href = url.toString();
    });
}

// Minimize layout shifts
function minimizeLayoutShifts() {
    // Add aspect ratios to images without dimensions
    document.querySelectorAll('img').forEach(img => {
        if (!img.width && !img.height && !img.style.aspectRatio) {
            // Default aspect ratio for content images
            img.style.aspectRatio = '16/9';
            img.style.width = '100%';
            img.style.height = 'auto';
        }
    });
}

// Optimize critical rendering path
function optimizeCriticalPath() {
    // Remove unused CSS for initial viewport
    const criticalCSS = `
        /* Critical CSS for above-the-fold content */
        .hero-section { min-height: 100vh; }
        .hero-content { opacity: 1; }
        .babixgo-header { position: fixed; top: 0; width: 100%; z-index: 1000; }
        body { margin: 0; font-family: 'Nunito Sans', sans-serif; }
    `;
    
    // Inject critical CSS inline
    const criticalStyle = document.createElement('style');
    criticalStyle.textContent = criticalCSS;
    document.head.insertBefore(criticalStyle, document.head.firstChild);
}

// Preload important resources
function preloadResources() {
    const resourcestoPreload = [
        { href: 'js/analytics.js', as: 'script' },
        { href: 'js/seo-enhancements.js', as: 'script' },
        { href: 'partials/header.html', as: 'fetch', crossorigin: 'anonymous' },
        { href: 'partials/footer.html', as: 'fetch', crossorigin: 'anonymous' }
    ];
    
    resourcestoPreload.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
function initPerformanceOptimizations() {
    optimizeFonts();
    minimizeLayoutShifts();
    
    // Run image optimization after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeImages);
    } else {
        optimizeImages();
    }
    
    // Preload resources early
    preloadResources();
}

// Service Worker registration for caching (disabled - no sw.js file)
function registerServiceWorker() {
    // Service worker disabled - would require sw.js file implementation
    // Can be enabled later when sw.js is created
    return;
}

// Initialize immediately
initPerformanceOptimizations();

// Service worker registration disabled for now
// registerServiceWorker();

// Export functions
window.optimizeImages = optimizeImages;
window.minimizeLayoutShifts = minimizeLayoutShifts;