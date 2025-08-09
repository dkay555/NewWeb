// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The PayPal integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
class PayPalButton {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.amount = options.amount || '0.00';
    this.currency = options.currency || 'EUR';
    this.intent = options.intent || 'CAPTURE';
    this.onSuccess = options.onSuccess || this.defaultOnSuccess;
    this.onError = options.onError || this.defaultOnError;
    this.onCancel = options.onCancel || this.defaultOnCancel;
    
    this.init();
  }

  async createOrder() {
    const orderPayload = {
      amount: this.amount,
      currency: this.currency,
      intent: this.intent,
    };
    
    try {
      const response = await fetch('/paypal/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const output = await response.json();
      return { orderId: output.id };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async captureOrder(orderId) {
    try {
      const response = await fetch(`/paypal/order/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error capturing order:', error);
      throw error;
    }
  }

  async onApprove(data) {
    console.log('onApprove', data);
    try {
      const orderData = await this.captureOrder(data.orderId);
      console.log('Capture result', orderData);
      this.onSuccess(orderData);
    } catch (error) {
      this.onError(error);
    }
  }

  onCancelHandler(data) {
    console.log('onCancel', data);
    this.onCancel(data);
  }

  onErrorHandler(error) {
    console.log('onError', error);
    this.onError(error);
  }

  async init() {
    try {
      await this.loadPayPalSDK();
      await this.initPayPal();
    } catch (error) {
      console.error('Failed to initialize PayPal:', error);
      this.onError(error);
    }
  }

  async loadPayPalSDK() {
    if ((window).paypal) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Get client ID from server for proper PayPal SDK loading
      fetch('/paypal/setup')
        .then(res => res.json())
        .then(data => {
          const script = document.createElement('script');
          script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId || 'demo_client_id'}&currency=EUR&intent=capture`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
          document.body.appendChild(script);
        })
        .catch(err => reject(err));
    });
  }

  async initPayPal() {
    try {
      if (this.container && (window).paypal) {
        // Clear container
        this.container.innerHTML = '';
        
        // Create PayPal button using the standard SDK
        (window).paypal.Buttons({
          createOrder: async () => {
            const orderData = await this.createOrder();
            return orderData.orderId;
          },
          onApprove: async (data) => {
            return this.onApprove(data);
          },
          onCancel: (data) => {
            this.onCancelHandler(data);
          },
          onError: (error) => {
            this.onErrorHandler(error);
          },
          style: {
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          }
        }).render(this.container);
      } else {
        // Fallback button if PayPal SDK fails
        this.container.innerHTML = '<button id="paypal-button" class="paypal-button">Mit PayPal bezahlen</button>';
        const paypalButton = this.container.querySelector('#paypal-button');
        if (paypalButton) {
          paypalButton.addEventListener('click', async () => {
            try {
              const orderData = await this.createOrder();
              await this.onApprove({ orderId: orderData.orderId });
            } catch (error) {
              this.onError(error);
            }
          });
        }
      }
    } catch (error) {
      console.error('PayPal initialization error:', error);
      this.onError(error);
    }
  }

  defaultOnSuccess(orderData) {
    alert('Zahlung erfolgreich! Bestellnummer: ' + orderData.id);
  }

  defaultOnError(error) {
    console.error('PayPal Error:', error);
    alert('Es gab einen Fehler bei der Zahlung. Bitte versuchen Sie es erneut.');
  }

  defaultOnCancel(data) {
    console.log('Payment cancelled:', data);
    alert('Zahlung wurde abgebrochen.');
  }
}

// Make it globally available
window.PayPalButton = PayPalButton;
// <END_EXACT_CODE>