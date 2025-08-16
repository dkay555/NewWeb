class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = document.getElementById('submitButton');
        this.formStatus = document.getElementById('form-status');
        this.isSubmitting = false;
        
        // Use Node.js server endpoint instead of Google Apps Script
        this.submitEndpoint = '/submit-contact';
        
        this.init();
    }

    init() {
        if (!this.form) return; // Exit if form not found
        
        this.bindEvents();
        this.setupValidation();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }
    }

    setupValidation() {
        // Set up custom validation messages
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(field, this.getValidationMessage(field));
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }

        // Validate all fields
        if (!this.validateForm()) {
            this.showStatus('error', 'Bitte korrigieren Sie die markierten Fehler und versuchen Sie es erneut.');
            return;
        }

        // Check reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            this.showFieldError(
                document.querySelector('.g-recaptcha'), 
                'Bitte bestätigen Sie, dass Sie kein Roboter sind.',
                'recaptcha-error'
            );
            return;
        }

        this.setSubmittingState(true);

        try {
            // Collect form data manually to avoid FormData constructor issues
            const data = {
                name: document.getElementById('name')?.value?.trim() || '',
                email: document.getElementById('email')?.value?.trim() || '',
                phone: document.getElementById('phone')?.value?.trim() || '',
                subject: document.getElementById('subject')?.value || '',
                message: document.getElementById('message')?.value?.trim() || '',
                consent: document.getElementById('consent')?.checked || false,
                recaptchaToken: recaptchaResponse,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: navigator.language
            };
            
            const response = await this.submitToServer(data);
            
            if (response.success) {
                this.showStatus('success', 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze bei Ihnen melden.');
                this.resetForm();
            } else {
                throw new Error(response.error || 'Unbekannter Fehler');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('error', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
        } finally {
            this.setSubmittingState(false);
        }
    }

    async submitToServer(data) {
        try {
            const response = await fetch(this.submitEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Network error:', error);
            throw new Error(`Netzwerkfehler: ${error.message}`);
        }
    }

    getFormData() {
        const formData = new FormData();
        
        // Add form fields
        formData.append('name', document.getElementById('name').value.trim());
        formData.append('email', document.getElementById('email').value.trim());
        formData.append('phone', document.getElementById('phone').value.trim());
        formData.append('subject', document.getElementById('subject').value);
        formData.append('message', document.getElementById('message').value.trim());
        formData.append('consent', document.getElementById('consent').checked);
        formData.append('timestamp', new Date().toISOString());
        formData.append('userAgent', navigator.userAgent);
        formData.append('language', navigator.language);
        
        return formData;
    }

    validateForm() {
        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message', 'consent'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            this.showFieldError(
                document.querySelector('.g-recaptcha'), 
                'Bitte bestätigen Sie, dass Sie kein Roboter sind.',
                'recaptcha-error'
            );
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Required field validation
        if (field.required && (!value || (field.type === 'checkbox' && !field.checked))) {
            errorMessage = this.getValidationMessage(field);
            isValid = false;
        }
        // Email validation
        else if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            isValid = false;
        }
        // Phone validation (optional but if provided should be valid)
        else if (fieldName === 'phone' && value && !this.isValidPhone(value)) {
            errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein.';
            isValid = false;
        }
        // Name validation
        else if (fieldName === 'name' && value && value.length < 2) {
            errorMessage = 'Der Name muss mindestens 2 Zeichen lang sein.';
            isValid = false;
        }
        // Message validation
        else if (fieldName === 'message' && value && value.length < 10) {
            errorMessage = 'Die Nachricht muss mindestens 10 Zeichen lang sein.';
            isValid = false;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldValid(field);
        }

        return isValid;
    }

    getValidationMessage(field) {
        const fieldName = field.name;
        const messages = {
            name: 'Bitte geben Sie Ihren Namen ein.',
            email: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
            subject: 'Bitte wählen Sie einen Betreff aus.',
            message: 'Bitte geben Sie Ihre Nachricht ein.',
            consent: 'Bitte stimmen Sie der Datenverarbeitung zu.'
        };
        
        return messages[fieldName] || 'Dieses Feld ist erforderlich.';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Remove all non-digit characters for validation
        const cleanPhone = phone.replace(/\D/g, '');
        // Allow 10-15 digits (international formats)
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Basic German phone number formatting
        if (value.startsWith('49')) {
            value = value.replace(/^49/, '+49 ');
        } else if (value.startsWith('0')) {
            value = value.replace(/^0/, '+49 ');
        }
        
        // Add spaces for readability
        if (value.startsWith('+49')) {
            value = value.replace(/(\+49\s?)(\d{3})(\d{3})(\d{4})/, '$1$2 $3 $4');
        }
        
        e.target.value = value;
    }

    showFieldError(field, message, errorId = null) {
        field.classList.add('error');
        field.classList.remove('valid');
        
        const errorElement = errorId ? 
            document.getElementById(errorId) : 
            field.parentNode.querySelector('.error-message');
            
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }

        // Clear reCAPTCHA error specifically
        if (field.closest('.g-recaptcha')) {
            const recaptchaError = document.getElementById('recaptcha-error');
            if (recaptchaError) {
                recaptchaError.classList.remove('show');
                recaptchaError.textContent = '';
            }
        }
    }

    showFieldValid(field) {
        if (field.value.trim() || field.checked) {
            field.classList.add('valid');
            field.classList.remove('error');
        }
    }

    showStatus(type, message) {
        this.formStatus.className = `form-status ${type}`;
        this.formStatus.querySelector('.status-text').textContent = message;
        this.formStatus.style.display = 'block';
        
        // Scroll to status message
        this.formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.formStatus.style.display = 'none';
            }, 10000);
        }
    }

    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        this.submitButton.disabled = isSubmitting;
        
        const buttonText = this.submitButton.querySelector('.button-text');
        const spinner = this.submitButton.querySelector('.loading-spinner');
        
        if (isSubmitting) {
            this.submitButton.classList.add('loading');
            buttonText.textContent = 'Wird gesendet...';
            spinner.style.display = 'block';
        } else {
            this.submitButton.classList.remove('loading');
            buttonText.textContent = 'Nachricht senden';
            spinner.style.display = 'none';
        }
    }

    resetForm() {
        this.form.reset();
        
        // Clear all validation states
        const fields = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'error');
        });
        
        // Clear all error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });
        
        // Reset reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for partials to load
    setTimeout(() => {
        const contactForm = new ContactForm();
    }, 500);
});