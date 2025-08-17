// Main JavaScript for babixGO Website
// Load Analytics and SEO scripts
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src.startsWith('http') ? src : (window.location.pathname.includes('/') && !window.location.pathname.endsWith('/') ? '../' : '') + src;
    script.async = true;
    document.head.appendChild(script);
}

// Load analytics and SEO enhancement scripts
loadScript('js/analytics.js');
loadScript('js/seo-enhancements.js');
loadScript('js/performance-optimizations.js');

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer partials
    loadPartials();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize mobile menu if header is loaded
    setTimeout(initMobileMenu, 500);
});

// Load header, footer, and contact form partials
async function loadPartials() {
    try {
        // Load header
        const headerResponse = await fetch('partials/header.html');
        if (headerResponse.ok) {
            const headerHTML = await headerResponse.text();
            document.getElementById('header-placeholder').innerHTML = headerHTML;
        }
        
        // Load footer
        const footerResponse = await fetch('partials/footer.html');
        if (footerResponse.ok) {
            const footerHTML = await footerResponse.text();
            document.getElementById('footer-placeholder').innerHTML = footerHTML;
        }
        
        // Load contact form partial if placeholder exists
        const contactFormPlaceholder = document.getElementById('contact-form-placeholder');
        if (contactFormPlaceholder) {
            console.log('Loading contact form partial...');
            const contactFormResponse = await fetch('partials/contact-form.html');
            console.log('Contact form response status:', contactFormResponse.status);
            
            if (contactFormResponse.ok) {
                const contactFormHTML = await contactFormResponse.text();
                contactFormPlaceholder.innerHTML = contactFormHTML;
                console.log('Contact form HTML loaded successfully');
                
                // Load contact form script after a brief delay
                setTimeout(() => {
                    const script = document.createElement('script');
                    script.src = 'js/contact-form.js';
                    script.onload = () => console.log('Contact form script loaded');
                    script.onerror = (e) => console.error('Error loading contact form script:', e);
                    document.head.appendChild(script);
                }, 100);
            } else {
                console.error('Failed to load contact form partial:', contactFormResponse.status, contactFormResponse.statusText);
                // Fallback: show a simple message
                contactFormPlaceholder.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">Kontaktformular wird geladen...</p>';
            }
        }
    } catch (error) {
        console.error('Error loading partials:', error);
    }
}

// Initialize contact form (contactForm on kontakt-support.html has its own handler)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return; // Skip if contactForm (kontakt-support) is being used
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }
        
        // Show success message (in real implementation, send to server)
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.');
        contactForm.reset();
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize FAQ functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Toggle active class
            answer.classList.toggle('active');
            if (icon) {
                icon.classList.toggle('active');
            }
            
            // Close other open FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    otherAnswer.classList.remove('active');
                    if (otherIcon) {
                        otherIcon.classList.remove('active');
                    }
                }
            });
        });
    });
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize mobile menu (called after header is loaded)
function initMobileMenu() {
    const drawer = document.getElementById('babixgo-mobile-drawer');
    const menuBtn = document.getElementById('babixgo-menu-btn');
    const closeBtn = document.getElementById('drawer-close');
    
    if (!drawer || !menuBtn) return;
    
    // Open menu
    menuBtn.addEventListener('click', function() {
        drawer.style.display = 'flex';
    });
    
    // Close menu
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            drawer.style.display = 'none';
        });
    }
    
    // Close menu when clicking outside
    window.addEventListener('click', function(e) {
        if (drawer.style.display === 'flex' && 
            !drawer.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            drawer.style.display = 'none';
        }
    });
}

// Order form functionality
function initOrderForm() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.playerName || !data.email) {
            showMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            return;
        }
        
        if (!validateEmail(data.email)) {
            showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }
        
        // Show success message
        showMessage('Vielen Dank für Ihre Bestellung! Wir werden Ihren Service innerhalb von 24 Stunden bearbeiten.', 'success');
        orderForm.reset();
    });
}

// Show message function
function showMessage(text, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = text;
    
    const form = document.getElementById('order-form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    }
}





// Get URL parameters
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Initialize page based on URL
function initPage() {
    const params = getURLParams();
    
    // If on order form page, populate product info
    if (window.location.pathname.includes('bestellformular.html')) {
        const productNameElement = document.getElementById('product-name');
        const productPriceElement = document.getElementById('product-price');
        
        if (params.product && productNameElement) {
            productNameElement.textContent = decodeURIComponent(params.product);
        }
        
        if (params.price && productPriceElement) {
            productPriceElement.textContent = `€${params.price}`;
        }
        
        initOrderForm();
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});
