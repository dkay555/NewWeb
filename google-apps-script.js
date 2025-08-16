// Google Apps Script Code for Contact Form Submissions
// Deploy this as a Web App in Google Apps Script

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (create one if needed)
    const spreadsheet = SpreadsheetApp.openById('1ogJ1CY2zmljmUot6bXEKzqSEhpRXCz83Cp6WvkBbuyY'); // Replace with your Sheet ID
    let sheet = spreadsheet.getSheetByName('Kontaktformular');
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Kontaktformular');
      // Add headers
      const headers = [
        'Zeitstempel', 'Name', 'E-Mail', 'Telefon', 'Betreff', 
        'Nachricht', 'Datenschutz zugestimmt', 'IP-Adresse', 'User Agent'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Prepare the data row
    const timestamp = new Date();
    const row = [
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || '',
      data.consent || 'Nein',
      data.ip || '',
      data.userAgent || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(row);
    
    // Format the new row (optional)
    const lastRow = sheet.getLastRow();
    const dataRange = sheet.getRange(lastRow, 1, 1, row.length);
    dataRange.setBorder(true, true, true, true, false, false);
    
    // Auto-resize columns (optional)
    sheet.autoResizeColumns(1, row.length);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Kontaktformular erfolgreich in Google Sheets gespeichert',
        timestamp: timestamp.toISOString(),
        rowNumber: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Fehler beim Speichern in Google Sheets'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Google Apps Script für babixGO Kontaktformular ist aktiv',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function (run this in Apps Script editor to test)
function testFormSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test Name',
        email: 'test@example.com',
        phone: '+49 123 456789',
        subject: 'Test Betreff',
        message: 'Test Nachricht für das Kontaktformular',
        consent: 'Ja',
        ip: '127.0.0.1',
        userAgent: 'Test Browser'
      })
    }
  };
  
  const result = doPost(testData);
  console.log('Test result:', result.getContent());
}