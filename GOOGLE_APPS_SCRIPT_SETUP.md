# Google Apps Script Setup für BabixGO Kontaktformular

## Schritt 1: Google Apps Script Code implementieren

1. Gehen Sie zu [script.google.com](https://script.google.com)
2. Erstellen Sie ein neues Projekt oder öffnen Sie Ihr bestehendes
3. Kopieren Sie den gesamten Code aus `google-apps-script.js` in den Apps Script Editor
4. Speichern Sie das Projekt

## Schritt 2: reCAPTCHA Secret Key konfigurieren

1. In Google Apps Script, gehen Sie zu **Einstellungen** (⚙️ Symbol)
2. Klicken Sie auf **Script-Eigenschaften**
3. Fügen Sie eine neue Eigenschaft hinzu:
   - **Eigenschaft**: `RECAPTCHA_SECRET`
   - **Wert**: `6LfwTagrAAAAAK1BeAchqigAdSt-UZktgVul9S4K`

## Schritt 3: Als Web App bereitstellen

1. Klicken Sie auf **Bereitstellen** → **Neue Bereitstellung**
2. Wählen Sie **Typ**: Web-App
3. Konfiguration:
   - **Beschreibung**: BabixGO Kontaktformular
   - **Ausführen als**: Ich
   - **Wer hat Zugriff**: Jeder
4. Klicken Sie auf **Bereitstellen**
5. Kopieren Sie die **Web-App-URL** (sollte Ihre aktuelle URL sein: `https://script.google.com/macros/s/AKfycbyDT5dMhCP5kBnfKQssNI_RJPq47974VSX7WbtOMFc7ldcJaS5gIBIcBY-7C3gQyt6e/exec`)

## Schritt 4: Google Sheets konfigurieren

1. Erstellen Sie ein neues Google Sheet oder öffnen Sie Ihr bestehendes
2. Notieren Sie sich die Sheet-ID aus der URL (der Teil zwischen `/d/` und `/edit`)
3. Das Script erstellt automatisch ein Arbeitsblatt namens "Kontaktformular" mit den entsprechenden Spalten

## Schritt 5: Berechtigungen erteilen

1. Beim ersten Ausführen werden Sie aufgefordert, Berechtigungen zu erteilen
2. Bestätigen Sie alle erforderlichen Berechtigungen für:
   - Google Sheets Zugriff
   - UrlFetch für reCAPTCHA Verifizierung

## Aktuelle Konfiguration

- **Site Key**: `6LfwTagrAAAAADZWmwZSlKOF_Dui_zbBuvcGpFSZ`
- **Secret Key**: `6LfwTagrAAAAAK1BeAchqigAdSt-UZktgVul9S4K`
- **Apps Script URL**: `https://script.google.com/macros/s/AKfycbyDT5dMhCP5kBnfKQssNI_RJPq47974VSX7WbtOMFc7ldcJaS5gIBIcBY-7C3gQyt6e/exec`

## Test der Funktionalität

Nach der Einrichtung sollten Kontaktformular-Einträge:
1. reCAPTCHA validierung durchlaufen
2. In das Google Sheet "Kontaktformular" gespeichert werden
3. Lokale Backups als JSON und Log-Dateien erstellt werden

## Fehlerbehebung

- **reCAPTCHA-Fehler**: Überprüfen Sie, ob der Secret Key korrekt konfiguriert ist
- **Berechtigungsfehler**: Stellen Sie sicher, dass alle Google Apps Script Berechtigungen erteilt wurden
- **Sheet nicht gefunden**: Das Script erstellt automatisch das Arbeitsblatt "Kontaktformular"