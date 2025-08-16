# Schnelle Setup-Anleitung für Google Apps Script

## Sofortige Schritte zur Behebung der reCAPTCHA-Fehler:

### Schritt 1: Kopieren Sie den aktualisierten Code
1. Öffnen Sie: https://script.google.com/macros/s/AKfycbyDT5dMhCP5kBnfKQssNI_RJPq47974VSX7WbtOMFc7ldcJaS5gIBIcBY-7C3gQyt6e/exec
2. Gehen Sie zu Ihrem Apps Script Editor
3. Ersetzen Sie den gesamten Code mit dem Code aus `google-apps-script.js`
4. Speichern Sie (Strg+S)

### Schritt 2: reCAPTCHA Secret Key konfigurieren
1. Im Apps Script Editor: Klicken Sie auf das Zahnrad-Symbol ⚙️ (Projekteinstellungen)
2. Scrollen Sie nach unten zu **Script-Eigenschaften**
3. Klicken Sie auf **Script-Eigenschaft hinzufügen**
4. Geben Sie ein:
   - **Eigenschaft**: `RECAPTCHA_SECRET`
   - **Wert**: `6LfwTagrAAAAAK1BeAchqigAdSt-UZktgVul9S4K`
5. Klicken Sie auf **Script-Eigenschaft speichern**

### Schritt 3: Neue Version bereitstellen
1. Klicken Sie auf **Bereitstellen** → **Bereitstellungen verwalten**
2. Klicken Sie auf das Stift-Symbol ✏️ neben Ihrer aktuellen Bereitstellung
3. Ändern Sie die **Version** auf "Neue Version"
4. Klicken Sie auf **Bereitstellen**

### Schritt 4: Testen
Das Kontaktformular sollte jetzt funktionieren und Daten in Google Sheets speichern.

## Aktueller Status:
- ✅ Kontaktformular erfasst alle Daten korrekt
- ✅ Lokale Backups funktionieren
- ⚠️ Google Sheets Integration wartet auf reCAPTCHA Secret Key
- ✅ reCAPTCHA wird temporär übersprungen (bis Secret Key konfiguriert ist)

Nach der Konfiguration des Secret Keys wird die vollständige reCAPTCHA-Validierung aktiviert.