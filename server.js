const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Contact form submission endpoint
app.post('/submit-contact', (req, res) => {
    try {
        const { name, email, topic, message, recaptchaToken, timestamp } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Pflichtfelder fehlen'
            });
        }
        
        // Create log entry
        const logEntry = {
            timestamp: new Date().toISOString(),
            name: name,
            email: email,
            topic: topic || '',
            message: message,
            ip: req.ip,
            userAgent: req.get('User-Agent') || ''
        };
        
        // Write to log file
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync('contact_submissions.log', logLine);
        
        console.log('Contact form submission logged:', logEntry.timestamp, logEntry.name, logEntry.email);
        
        res.json({
            success: true,
            message: 'Daten erfolgreich verarbeitet',
            id: 'contact_' + Date.now()
        });
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            error: 'Serverfehler beim Verarbeiten der Anfrage'
        });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});