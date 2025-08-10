# babixGO Design Rules - Hero Section & Header Styling

## Überblick
Diese Datei dokumentiert die einheitlichen Design-Regeln für die Hero-Section und Header-Styling der babixGO Website.

## Hero Section Design Rules

### Struktur-Regeln (Regeln 1-8)
1. **Hero Background**: Muss immer `position: relative` haben
2. **Mindesthöhe**: 10vh für mobile Geräte
3. **Layout**: Flex-Layout für vertikale Zentrierung
4. **Background Z-Index**: Immer mit `z-index: 0`
5. **Standard-Gradient**: `linear-gradient(to bottom, #78c6f7 0%, #5ba3d9 50%, #e0f7ff 100%)`
6. **Content Z-Index**: Immer mit `z-index: 10` über Background
7. **Max-Width**: 32rem für optimale Lesbarkeit
8. **Standard-Padding**: 1rem für mobile Geräte

### Logo Container Rules (Regeln 9-11)
9. **Logo Position**: Immer zentriert mit festem Abstand
10. **Mobile Logo-Größe**: 8rem x 8rem
11. **Desktop Logo-Größe**: 10rem x 10rem

### Welcome Box Rules (Regeln 12-18)
12. **Background**: Transparenter Hintergrund mit Blur-Effekt
13. **Schatten**: Standard-Schatten für Tiefe
14. **Responsive Padding**: Angepasst für Tablets
15. **Desktop Padding**: Erweiterte Padding für Desktop
16. **Titel-Farbe**: Accent-Farbe mit Baloo 2 Font
17. **Responsive Schrift**: Angepasste Schriftgrößen für bessere Lesbarkeit
18. **Subtitle**: Text-Farbe mit medium Gewicht

## Header Styling Rules (H1, H2, H3)

### Babix-Info-Header Klasse (Regeln 19-23)
19. **Einheitliches Styling**: Alle Header mit `babix-info-header` haben identisches Styling
20. **Markenfarbe**: Orange (#FF4C00) für Markenidentität
21. **Typografie**: Baloo 2 Font für konsistente Typografie
22. **Unterstrich**: Cyan-Gradient Unterstrich für alle Header
23. **Sichtbarkeit**: 3px Höhe für optimale Sichtbarkeit

### CSS-Implementierung
```css
h1.babix-info-header,
h2.babix-info-header,
h3.babix-info-header {
    display: inline-block;
    font-family: 'Baloo 2', cursive;
    font-size: 1.5rem;
    font-weight: bold;
    color: #FF4C00;
    position: relative;
    padding-bottom: 0.4rem;
    margin: 0 0 1rem 0;
}

h1.babix-info-header::after,
h2.babix-info-header::after,
h3.babix-info-header::after {
    content: "";
    display: block;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, var(--cyan), transparent);
    margin-top: 0.3rem;
    border-radius: 2px;
}
```

## Navigation Button Rules (Regeln 24-33)

### Layout Rules (Regeln 24-26)
24. **Button Container**: Gleiche Max-Width wie Logo Container (28rem)
25. **3er-Reihen**: Für Hauptnavigation
26. **2er-Reihen**: Für sekundäre Aktionen

### Button Styling (Regeln 27-33)
27. **Einheitlichkeit**: Alle Buttons haben einheitliche Höhe und Stil
28. **Hover-Effekt**: `translateY(-2px)` für alle Button-Typen
29. **Desktop Anpassung**: Höhere Buttons und größere Schrift auf Desktop
30. **Primäre Aktionen**: Primary-Farbe (Dunkelblau)
31. **Wichtige Aktionen**: Accent-Farbe (Orange)
32. **Sekundäre Aktionen**: Cyan-Farbe
33. **Icons**: Konsistent mit Button-Text-Größe

## Verwendung

### HTML-Struktur für Hero Section
```html
<section class="hero-section">
    <div class="hero-background"></div>
    <div class="hero-content">
        <div class="logo-container">
            <img src="logo.webp" alt="babixGO Logo" class="logo-image">
        </div>
        <div class="welcome-box">
            <h1 class="welcome-title">Willkommen bei babixGO</h1>
            <p class="welcome-subtitle">Dein Partner für Monopoly GO</p>
        </div>
        <div class="nav-buttons">
            <div class="button-row-3">
                <a href="#" class="button button-darkblue">Shop</a>
                <a href="#" class="button button-orange">Accounts</a>
                <a href="#" class="button button-cyan">Partner</a>
            </div>
        </div>
    </div>
</section>
```

### HTML für Headers
```html
<h1 class="babix-info-header">Hauptüberschrift</h1>
<h2 class="babix-info-header">Unterüberschrift</h2>
<h3 class="babix-info-header">Abschnittsüberschrift</h3>
```

## Wartung
- Diese Regeln sollten bei allen zukünftigen Hero-Sections angewendet werden
- Änderungen an den Regeln müssen in dieser Datei dokumentiert werden
- Neue Hero-Sections sollten die bestehenden CSS-Klassen wiederverwenden

Letzte Aktualisierung: 10. August 2025