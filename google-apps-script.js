// Configuration - Update these values
const CONFIG = {
  SHEET_ID: '1ogJ1CY2zmljmUot6bXEKzqSEhpRXCz83Cp6WvkBbuyY',
  ADMIN_EMAIL: 'admin@babixgo.de',
  RECAPTCHA_SECRET: '6LfwTagrAAAAAK1BeAchqigAdSt-UZktgVul9S4K',
  COMPANY_NAME: 'babixGO',
  REPLY_EMAIL: 'support@babixgo-mail.de'
};

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return createResponse(false, 'Ungültige Anfrage');
    }

    const formData = e.parameter;
    
    const recaptchaValid = verifyRecaptcha(formData['g-recaptcha-response']);
    if (!recaptchaValid) {
      return createResponse(false, 'reCAPTCHA-Verifizierung fehlgeschlagen');
    }

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      return createResponse(false, validation.message);
    }

    const saveResult = saveToSheet(formData);
    if (!saveResult.success) {
      throw new Error('Fehler beim Speichern in Google Sheets: ' + saveResult.error);
    }

    sendEmailNotifications(formData, saveResult.rowNumber);
    return createResponse(true, 'Nachricht erfolgreich gesendet');

  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse(false, 'Serverfehler: ' + error.message);
  }
}

function verifyRecaptcha(recaptchaResponse) {
  if (!recaptchaResponse) {
    return false;
  }

  try {
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const payload = {
      'secret': CONFIG.RECAPTCHA_SECRET,
      'response': recaptchaResponse
    };

    const response = UrlFetchApp.fetch(url, {
      'method': 'POST',
      'payload': payload
    });

    const result = JSON.parse(response.getContentText());
    return result.success === true;

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

function validateFormData(data) {
  const requiredFields = ['name', 'email', 'subject', 'message', 'consent'];
  
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!data[field] || data[field].toString().trim() === '') {
      return {
        isValid: false,
        message: 'Pflichtfeld fehlt: ' + field
      };
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      isValid: false,
      message: 'Ungültige E-Mail-Adresse'
    };
  }

  if (data.consent !== 'true') {
    return {
      isValid: false,
      message: 'Datenschutz-Zustimmung erforderlich'
    };
  }

  return { isValid: true };
}

function saveToSheet(data) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Name', 'Email', 'Phone', 'Subject', 
        'Message', 'User Agent', 'Language', 'Status'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0A3A68');
      headerRange.setFontColor('white');
    }

    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || '',
      data.userAgent || '',
      data.language || '',
      'Neu'
    ];

    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    sheet.autoResizeColumns(1, rowData.length);

    return {
      success: true,
      rowNumber: newRow
    };

  } catch (error) {
    console.error('Error saving to sheet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function sendEmailNotifications(data, rowNumber) {
  try {
    sendAdminNotification(data, rowNumber);
    sendUserConfirmation(data);
  } catch (error) {
    console.error('Error sending email notifications:', error);
  }
}

function sendAdminNotification(data, rowNumber) {
  const subject = 'Neue Kontaktanfrage: ' + data.subject;
  const plainBody = 'Neue Kontaktanfrage von babixGO Kontaktformular\n\nName: ' + data.name + '\nE-Mail: ' + data.email + '\nTelefon: ' + (data.phone || 'Nicht angegeben') + '\nBetreff: ' + data.subject + '\n\nNachricht:\n' + data.message + '\n\nEingegangen am: ' + new Date().toLocaleString('de-DE') + '\nZeile in Google Sheets: ' + rowNumber;

  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, plainBody, {
    replyTo: data.email,
    name: CONFIG.COMPANY_NAME
  });
}

function sendUserConfirmation(data) {
  const subject = 'Bestätigung Ihrer Anfrage: ' + data.subject;
  const plainBody = 'Vielen Dank für Ihre Anfrage bei ' + CONFIG.COMPANY_NAME + '!\n\nLiebe/r ' + data.name + ',\n\nvielen Dank für Ihre Anfrage zum Thema "' + data.subject + '". Wir haben Ihre Nachricht erhalten und werden uns in Kürze bei Ihnen melden.\n\nIhre Nachricht:\n' + data.message + '\n\nUnsere Bearbeitungszeiten:\nMontag - Freitag: 9:00 - 17:00 Uhr\nWir antworten in der Regel innerhalb von 24 Stunden.\n\nBei dringenden Anfragen können Sie uns auch telefonisch erreichen.\n\nMit freundlichen Grüßen\nIhr ' + CONFIG.COMPANY_NAME + ' Team';

  GmailApp.sendEmail(data.email, subject, plainBody, {
    replyTo: CONFIG.ADMIN_EMAIL,
    name: CONFIG.COMPANY_NAME
  });
}

function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions() {
  return ContentService.createTextOutput('');
}

function testSetup() {
  console.log('Testing Google Apps Script setup...');
  
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    console.log('✓ Google Sheet access successful');
    console.log('Sheet name:', sheet.getName());
  } catch (error) {
    console.error('✗ Google Sheet access failed:', error.message);
  }
  
  console.log('✓ Admin email configured:', CONFIG.ADMIN_EMAIL);
  console.log('✓ reCAPTCHA secret configured');
  console.log('Test completed.');
}