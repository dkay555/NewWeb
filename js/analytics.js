// Analytics and Tracking Implementation for BabixGO
// Google Analytics 4 and Facebook Pixel Integration

// Initialize Google Analytics
function initGoogleAnalytics() {
    const gaId = 'GTM-KLG7LZ55';
    
    if (!gaId || gaId === 'GTM-KLG7LZ55') {
        console.warn('Google Analytics Measurement ID not configured');
        return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Make gtag globally available
    window.gtag = gtag;
}

// Initialize Facebook Pixel
function initFacebookPixel() {
    const pixelId = '877965457871970';
    
    if (!pixelId || pixelId === '877965457871970') {
        console.warn('Facebook Pixel ID not configured');
        return;
    }

    // Facebook Pixel Code
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
    fbq('track', 'PageView');
}

// Track page views for Single Page Applications
function trackPageView(url = window.location.pathname) {
    // Google Analytics
    if (window.gtag) {
        gtag('config', 'GTM-KLG7LZ55', {
            page_path: url,
            page_title: document.title
        });
    }
    
    // Facebook Pixel
    if (window.fbq) {
        fbq('track', 'PageView');
    }
}

// Track custom events
function trackEvent(eventName, category = 'engagement', parameters = {}) {
    // Google Analytics Event
    if (window.gtag) {
        gtag('event', eventName, {
            event_category: category,
            ...parameters
        });
    }
    
    // Facebook Pixel Custom Event
    if (window.fbq) {
        fbq('trackCustom', eventName, parameters);
    }
}

// Track form submissions
function trackFormSubmission(formName) {
    trackEvent('form_submit', 'form', {
        form_name: formName
    });
    
    // Facebook Pixel Lead event
    if (window.fbq) {
        fbq('track', 'Lead', {
            content_name: formName
        });
    }
}

// Track button clicks and conversions
function trackConversion(action, value = null) {
    const params = {
        event_category: 'conversion',
        event_label: action
    };
    
    if (value) {
        params.value = value;
    }
    
    trackEvent('conversion', 'conversion', params);
    
    // Facebook Pixel Purchase or Lead
    if (window.fbq) {
        if (action.includes('purchase') || action.includes('order')) {
            fbq('track', 'Purchase', { value: value, currency: 'EUR' });
        } else {
            fbq('track', 'Lead');
        }
    }
}

// Track contact interactions
function trackContactInteraction(method) {
    trackEvent('contact', 'engagement', {
        contact_method: method
    });
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initGoogleAnalytics();
    initFacebookPixel();
    
    // Track form submissions
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function() {
            trackFormSubmission(form.id || 'contact_form');
        });
    });
    
    // Track WhatsApp clicks
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackContactInteraction('whatsapp');
        });
    });
    
    // Track Facebook Messenger clicks
    const messengerLinks = document.querySelectorAll('a[href*="m.me"], a[href*="messenger"]');
    messengerLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackContactInteraction('messenger');
        });
    });
    
    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackContactInteraction('email');
        });
    });
    
    // Track order button clicks
    const orderButtons = document.querySelectorAll('a[href*="bestellformular"], .button[href*="order"]');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackConversion('order_initiation');
        });
    });
});

// Export functions for manual tracking
window.trackPageView = trackPageView;
window.trackEvent = trackEvent;
window.trackFormSubmission = trackFormSubmission;
window.trackConversion = trackConversion;
window.trackContactInteraction = trackContactInteraction;