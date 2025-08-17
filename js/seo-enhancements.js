// SEO Enhancements for BabixGO Website
// Structured Data, Meta Tags, and Performance Optimizations

// Add structured data for organization
function addOrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BabixGO",
        "description": "Professionelle Monopoly GO Services - Würfel, Sticker, Accounts und mehr",
        "url": window.location.origin,
        "logo": window.location.origin + "/images/logos/babixgo-logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+49-152-23842897",
            "contactType": "customer service",
            "availableLanguage": "German"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "DE"
        },
        "sameAs": [
            "https://www.facebook.com/babixgo",
            "https://wa.me/4915223842897"
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Add service-specific structured data
function addServiceSchema(serviceName, description, price = null) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceName,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "BabixGO"
        }
    };
    
    if (price) {
        schema.offers = {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "EUR"
        };
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Add FAQ structured data
function addFAQSchema(faqs) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Optimize meta tags
function optimizeMetaTags() {
    // Add Open Graph tags if not present
    if (!document.querySelector('meta[property="og:title"]')) {
        const ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', document.title);
        document.head.appendChild(ogTitle);
    }
    
    if (!document.querySelector('meta[property="og:description"]')) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const ogDesc = document.createElement('meta');
            ogDesc.setAttribute('property', 'og:description');
            ogDesc.setAttribute('content', metaDesc.getAttribute('content'));
            document.head.appendChild(ogDesc);
        }
    }
    
    if (!document.querySelector('meta[property="og:image"]')) {
        const ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.setAttribute('content', window.location.origin + '/images/logos/babixgo-logo.png');
        document.head.appendChild(ogImage);
    }
    
    if (!document.querySelector('meta[property="og:url"]')) {
        const ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        ogUrl.setAttribute('content', window.location.href);
        document.head.appendChild(ogUrl);
    }
    
    if (!document.querySelector('meta[property="og:type"]')) {
        const ogType = document.createElement('meta');
        ogType.setAttribute('property', 'og:type');
        ogType.setAttribute('content', 'website');
        document.head.appendChild(ogType);
    }
    
    // Add Twitter Card tags
    if (!document.querySelector('meta[name="twitter:card"]')) {
        const twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        twitterCard.setAttribute('content', 'summary_large_image');
        document.head.appendChild(twitterCard);
    }
}

// Add canonical URL
function addCanonicalURL() {
    if (!document.querySelector('link[rel="canonical"]')) {
        const canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', window.location.href);
        document.head.appendChild(canonical);
    }
}

// Add hreflang for German
function addHrefLang() {
    if (!document.querySelector('link[rel="alternate"]')) {
        const hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', 'de');
        hreflang.setAttribute('href', window.location.href);
        document.head.appendChild(hreflang);
    }
}

// Optimize images for SEO
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Ensure alt text exists
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
            const src = img.getAttribute('src');
            if (src) {
                const filename = src.split('/').pop().split('.')[0];
                img.setAttribute('alt', `BabixGO ${filename.replace(/[_-]/g, ' ')}`);
            }
        }
    });
}

// Add breadcrumb schema
function addBreadcrumbSchema(breadcrumbs) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
        }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Initialize SEO enhancements
function initSEO() {
    addOrganizationSchema();
    optimizeMetaTags();
    addCanonicalURL();
    addHrefLang();
    optimizeImages();
    
    // Page-specific SEO
    const pathname = window.location.pathname;
    
    if (pathname.includes('wuerfelshop')) {
        addServiceSchema('Monopoly GO Würfel Service', 'Professionelle Würfel-Lieferung für Monopoly GO Accounts - schnell und sicher', '25');
    } else if (pathname.includes('sticker')) {
        addServiceSchema('Monopoly GO Sticker Service', 'Vollständige Sticker-Alben und einzelne Sticker für Monopoly GO', '10');
    } else if (pathname.includes('accounts')) {
        addServiceSchema('Monopoly GO Premium Accounts', 'Premium Monopoly GO Accounts mit hohen Levels und Ressourcen');
    } else if (pathname.includes('partnerevent')) {
        addServiceSchema('Monopoly GO Partner Events', 'Exklusive Partner Events und Event-Teilnahme für Monopoly GO');
    } else if (pathname.includes('faq')) {
        // Add FAQ schema for FAQ page
        const faqItems = Array.from(document.querySelectorAll('.faq-item')).map(item => {
            const question = item.querySelector('.faq-question')?.textContent.trim();
            const answer = item.querySelector('.faq-answer')?.textContent.trim();
            return { question, answer };
        }).filter(item => item.question && item.answer);
        
        if (faqItems.length > 0) {
            addFAQSchema(faqItems);
        }
    }
    
    // Add breadcrumbs based on URL structure
    const pathParts = pathname.split('/').filter(part => part);
    if (pathParts.length > 0) {
        const breadcrumbs = [
            { name: 'Home', url: window.location.origin + '/' }
        ];
        
        let currentPath = '';
        pathParts.forEach(part => {
            currentPath += '/' + part;
            let name = part.replace('.html', '');
            
            // Translate path segments to German
            const translations = {
                'shop': 'Shop',
                'service': 'Services',
                'hilfe': 'Hilfe',
                'recht': 'Rechtliches',
                'wuerfelshop': 'Würfel Shop',
                'sticker': 'Sticker',
                'accounts': 'Accounts',
                'partnerevent': 'Partner Event',
                'kontakt-support': 'Kontakt & Support',
                'faq': 'FAQ',
                'loginmoeglichkeiten': 'Login-Möglichkeiten'
            };
            
            name = translations[name] || name;
            breadcrumbs.push({
                name: name,
                url: window.location.origin + currentPath
            });
        });
        
        if (breadcrumbs.length > 1) {
            addBreadcrumbSchema(breadcrumbs);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSEO);

// Export functions for manual use
window.addServiceSchema = addServiceSchema;
window.addFAQSchema = addFAQSchema;
window.optimizeImages = optimizeImages;