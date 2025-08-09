const express = require('express');
const path = require('path');
const { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } = require('./server/paypal');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// PayPal routes
app.get('/paypal/setup', async (req, res) => {
    await loadPaypalDefault(req, res);
});

app.post('/paypal/order', async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
});

app.post('/paypal/order/:orderID/capture', async (req, res) => {
    await capturePaypalOrder(req, res);
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});