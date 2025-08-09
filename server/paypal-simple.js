const express = require('express');

// Simplified PayPal integration for testing
const paypalRoutes = {
  setup: async (req, res) => {
    // For sandbox testing, we'll use a simple token
    // In production, this should be replaced with proper PayPal SDK calls
    res.json({
      clientToken: 'sandbox_test_token_' + Date.now(),
      clientId: process.env.PAYPAL_CLIENT_ID
    });
  },

  createOrder: async (req, res) => {
    try {
      const { amount, currency, intent } = req.body;

      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          error: "Invalid amount. Amount must be a positive number.",
        });
      }

      // Simulate order creation for testing
      const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      res.json({
        id: orderId,
        status: 'CREATED',
        links: [
          {
            href: `${req.protocol}://${req.get('host')}/paypal/order/${orderId}/capture`,
            rel: 'capture',
            method: 'POST'
          }
        ]
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  },

  captureOrder: async (req, res) => {
    try {
      const { orderID } = req.params;
      
      // Simulate successful payment capture
      res.json({
        id: orderID,
        status: 'COMPLETED',
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: 'CAPTURE_' + Date.now(),
                  status: 'COMPLETED',
                  amount: {
                    currency_code: 'EUR',
                    value: '10.00'
                  }
                }
              ]
            }
          }
        ],
        payer: {
          email_address: 'test@example.com',
          payer_id: 'PAYER_' + Date.now()
        }
      });
    } catch (error) {
      console.error("Failed to capture order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  }
};

module.exports = paypalRoutes;