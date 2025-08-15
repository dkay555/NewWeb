const express = require('express');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 5000;

// Google Sheets configuration
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: GOOGLE_SHEETS_API_KEY });

// Function to append data to Google Sheets
async function appendToGoogleSheets(formData) {
    try {
        const values = [[
            new Date().toLocaleString('de-DE'),
            formData.name,
            formData.email,
            formData.topic || '',
            formData.message,
            formData.ip || '',
            formData.userAgent || ''
        ]];

        const request = {
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'Sheet1!A:G', // Adjust range as needed
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: values,
            },
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log('Successfully added to Google Sheets:', response.data);
        return response.data;
    } catch (error) {
        console.error('Google Sheets API error:', error);
        throw error;
    }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Contact form submission endpoint
app.post('/submit-contact', async (req, res) => {
    try {
        const { name, email, topic, message, recaptchaToken, timestamp } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Pflichtfelder fehlen'
            });
        }
        
        // Create form data object
        const formData = {
            name: name,
            email: email,
            topic: topic || '',
            message: message,
            ip: req.ip,
            userAgent: req.get('User-Agent') || ''
        };
        
        // Try to save to Google Sheets first
        let sheetsSuccess = false;
        let sheetsError = null;
        
        try {
            await appendToGoogleSheets(formData);
            sheetsSuccess = true;
            console.log('Successfully saved to Google Sheets:', formData.name, formData.email);
        } catch (error) {
            sheetsError = error.message;
            console.error('Failed to save to Google Sheets, falling back to local log:', error);
        }
        
        // Always also save to local log as backup
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...formData,
            sheetsSuccess: sheetsSuccess,
            sheetsError: sheetsError
        };
        
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync('contact_submissions.log', logLine);
        
        // Send response
        if (sheetsSuccess) {
            res.json({
                success: true,
                message: 'Daten erfolgreich in Google Sheets gespeichert',
                id: 'contact_' + Date.now(),
                savedToSheets: true
            });
        } else {
            res.json({
                success: true,
                message: 'Daten gespeichert (lokale Sicherung), Google Sheets Verbindung fehlgeschlagen',
                id: 'contact_' + Date.now(),
                savedToSheets: false,
                error: sheetsError
            });
        }
        
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