const express = require('express');
const path = require('path');
// Use simplified PayPal routes for now to avoid authentication issues
const paypalRoutes = require('./server/paypal-simple');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// PayPal routes
app.get('/paypal/setup', paypalRoutes.setup);
app.post('/paypal/order', paypalRoutes.createOrder);
app.post('/paypal/order/:orderID/capture', paypalRoutes.captureOrder);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});