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

// Function to save data to Google Sheets via Apps Script Web App
async function saveToGoogleSheets(formData) {
    try {
        // Use Google Apps Script Web App URL (more reliable than direct API)
        const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDT5dMhCP5kBnfKQssNI_RJPq47974VSX7WbtOMFc7ldcJaS5gIBIcBY-7C3gQyt6e/exec";
        
        const payload = {
            timestamp: new Date().toISOString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            subject: formData.subject || '',
            message: formData.message,
            consent: formData.consent ? 'Ja' : 'Nein',
            recaptchaToken: formData.recaptchaToken || '',
            ip: formData.ip || '',
            userAgent: formData.userAgent || ''
        };

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Data successfully saved to Google Sheets via Apps Script:', result);
        return result;
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        throw error;
    }
}

// Alternative: Save to structured JSON file and provide easy export
async function saveFormDataStructured(formData) {
    try {
        const dataEntry = {
            id: 'contact_' + Date.now(),
            timestamp: new Date().toISOString(),
            submittedAt: new Date().toLocaleString('de-DE'),
            name: formData.name,
            email: formData.email,
            subject: formData.subject || '',
            phone: formData.phone || '',
            consent: formData.consent || false,
            message: formData.message,
            ip: formData.ip || '',
            userAgent: formData.userAgent || ''
        };
        
        // Save to JSON file for easy importing to Google Sheets
        let existingData = [];
        try {
            const existingFile = fs.readFileSync('contact_submissions.json', 'utf8');
            existingData = JSON.parse(existingFile);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }
        
        existingData.push(dataEntry);
        fs.writeFileSync('contact_submissions.json', JSON.stringify(existingData, null, 2));
        
        console.log('Contact form data saved to structured JSON:', dataEntry.name, dataEntry.email);
        return dataEntry;
    } catch (error) {
        console.error('Error saving structured data:', error);
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
        const { name, email, phone, subject, message, consent, recaptchaToken, timestamp } = req.body;
        
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
            phone: phone || '',
            subject: subject || '',
            message: message,
            consent: consent || false,
            recaptchaToken: recaptchaToken || '',
            ip: req.ip,
            userAgent: req.get('User-Agent') || ''
        };
        
        // Try to save directly to Google Sheets first
        let sheetsSuccess = false;
        let sheetsError = null;
        let savedEntry = null;
        
        try {
            await saveToGoogleSheets(formData);
            sheetsSuccess = true;
            console.log('Successfully saved to Google Sheets:', formData.name, formData.email);
        } catch (error) {
            sheetsError = error.message;
            console.error('Failed to save to Google Sheets, trying local backup:', error);
        }
        
        // Always save to local backup as well
        let localSaveSuccess = false;
        try {
            savedEntry = await saveFormDataStructured(formData);
            localSaveSuccess = true;
            console.log('Successfully saved contact form data locally:', formData.name, formData.email);
        } catch (error) {
            console.error('Failed to save locally:', error);
        }
        
        // Also save to simple log as additional backup
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...formData,
            sheetsSuccess: sheetsSuccess,
            localSaveSuccess: localSaveSuccess,
            sheetsError: sheetsError
        };
        
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync('contact_submissions.log', logLine);
        
        // Send response
        if (sheetsSuccess) {
            res.json({
                success: true,
                message: 'Deine Nachricht wurde erfolgreich in Google Sheets gespeichert!',
                id: savedEntry ? savedEntry.id : 'contact_' + Date.now(),
                savedToSheets: true
            });
        } else if (localSaveSuccess) {
            res.json({
                success: true,
                message: 'Deine Nachricht wurde lokal gespeichert. Google Sheets-Integration temporär nicht verfügbar.',
                id: savedEntry ? savedEntry.id : 'contact_' + Date.now(),
                savedToSheets: false,
                error: sheetsError
            });
        } else {
            res.json({
                success: true,
                message: 'Deine Nachricht wurde in der Backup-Datei gespeichert',
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

// Export contact submissions as CSV for Google Sheets import
app.get('/export-contacts-csv', (req, res) => {
    try {
        let contactData = [];
        
        // Try to read from JSON file first
        try {
            const jsonFile = fs.readFileSync('contact_submissions.json', 'utf8');
            contactData = JSON.parse(jsonFile);
        } catch (error) {
            // If JSON file doesn't exist, try log file
            try {
                const logFile = fs.readFileSync('contact_submissions.log', 'utf8');
                const logLines = logFile.split('\n').filter(line => line.trim());
                contactData = logLines.map(line => JSON.parse(line));
            } catch (error) {
                return res.status(404).json({ error: 'Keine Kontaktdaten gefunden' });
            }
        }
        
        if (contactData.length === 0) {
            return res.status(404).json({ error: 'Keine Kontaktdaten vorhanden' });
        }
        
        // Create CSV content
        const csvHeader = 'Zeitstempel,Name,E-Mail,Thema,Nachricht,IP,User Agent\n';
        const csvRows = contactData.map(entry => {
            const timestamp = entry.submittedAt || entry.timestamp || '';
            const name = (entry.name || '').replace(/"/g, '""');
            const email = (entry.email || '').replace(/"/g, '""');
            const topic = (entry.topic || '').replace(/"/g, '""');
            const message = (entry.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
            const ip = entry.ip || '';
            const userAgent = (entry.userAgent || '').replace(/"/g, '""');
            
            return `"${timestamp}","${name}","${email}","${topic}","${message}","${ip}","${userAgent}"`;
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="babixgo_kontakte.csv"');
        res.send('\ufeff' + csvContent); // Add BOM for Excel compatibility
        
        console.log('Exported', contactData.length, 'contact submissions to CSV');
        
    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).json({ error: 'Fehler beim CSV-Export' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});