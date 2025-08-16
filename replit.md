# Overview

BabixGO is a German-language static website offering various services and products related to the mobile game "Monopoly GO". The site provides services including dice delivery, sticker collections, partner events, tycoon racers, premium accounts, and friendship bar optimization. The website is built as a multi-page static site with a focus on user engagement and clear service presentation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The website is built using vanilla HTML, CSS, and JavaScript with no frameworks or build tools. Key architectural decisions include:

- **Static Multi-Page Structure**: Each service has its own dedicated HTML page (wuerfelshop.html, sticker.html, partnerevent.html, etc.) for clear content organization
- **Component-Based Partials**: Header and footer are separated into reusable partial files loaded via JavaScript for consistency across pages
- **Mobile-First Responsive Design**: CSS uses modern techniques like CSS Grid and Flexbox with media queries for responsive behavior
- **Progressive Enhancement**: Core functionality works without JavaScript, with JavaScript enhancing user experience

## Backend Architecture (Added August 2025)
The project includes a simple Express.js server for serving static files:

- **Express Server**: Node.js server (server.js) serving static website files
- **Static File Serving**: All HTML, CSS, JavaScript, and assets served via Express middleware

## Styling System
- **CSS Custom Properties**: Consistent color palette and spacing using CSS variables (--primary: #0A3A68, --accent: #FF4C00, --cyan: #00CFFF)
- **Typography**: Google Fonts integration with Nunito Sans for body text and Baloo 2 for headings
- **Component-Based CSS**: Styles organized with BEM-like naming conventions for maintainability

## Content Management
- **German Language Focus**: All content is in German targeting German-speaking Monopoly GO players
- **Service-Oriented Pages**: Each page follows a consistent structure with hero section, navigation, product overview, pricing, and FAQ sections
- **Legal Compliance**: Dedicated pages for GDPR compliance (datenschutz.html), terms of service (agb.html), and other legal requirements

## Navigation Structure
- **Sticky Navigation**: Product pages include sticky navigation for easy section jumping
- **Mobile Drawer Menu**: JavaScript-powered mobile menu with clean animations
- **Comprehensive Sitemap**: Dedicated sitemap page for SEO and user navigation

# External Dependencies

## Order Processing
- **Simple Order Forms**: HTML-based order forms directing users to complete manual processing
- **Contact-Based Processing**: Orders processed manually through WhatsApp and email communication

## Font Services
- **Google Fonts**: Nunito Sans and Baloo 2 font families loaded from Google Fonts CDN
- **Material Icons**: Google's Material Icons library for consistent iconography

## Communication Channels
- **WhatsApp Integration**: Direct WhatsApp contact links for customer support (+49 152 23842897)
- **Facebook Messenger**: Integration for customer communication via Facebook Messenger (m.me/494670617055790)
- **Email**: Standard email contact (support@babixgo-mail.de)

## Third-Party Services
The architecture includes active integrations for:
- **Order Management System**: bestellformular.html order form for collecting customer orders
- **Customer Communication**: Multiple messaging platforms (WhatsApp, Facebook Messenger, Email)

## Recent Changes (August 2025)
- **PayPal Integration Removed**: Removed all PayPal payment processing components and dependencies at user request
- **Simplified Order Flow**: Replaced PayPal buttons with simple order form links directing to bestellformular.html
- **Cleaned Codebase**: Removed server/paypal.js, server/paypal-simple.js, and client/src/components/PayPalButton.js
- **Updated Navigation**: All product pages now use direct links to order form instead of payment integration
- **Express.js Server**: Simplified server.js to only handle static file serving
- **Design System Established (10. August 2025)**: Comprehensive design rules for Hero Section and Header styling implemented:
  - 33 detailed rules for consistent Hero Section design
  - Unified header styling with babix-info-header class for H1, H2, H3
  - Documented in DESIGN_RULES.md and CSS comments for maintainability
  - Consolidated duplicate CSS rules for better code organization
- **Hero Section Standardization (10. August 2025)**: Complete implementation of uniform hero design across all product pages:
  - All 4 main product pages now use standardized hero-section structure from index.html
  - Removed page-specific hero CSS styles from individual HTML files
  - Implemented consistent button layouts with service-specific icons and navigation
  - Unified color scheme using established brand colors (orange #FF4C00, cyan #00CFFF, dark blue #0A3A68)
- **Image Organization & Cleanup (15. August 2025)**: Complete reorganization of project images for better maintainability:
  - Created structured `/images` directory with subfolders: `/heroes`, `/icons`, `/pages`, `/logos`
  - Moved all image assets from root directory and attached_assets to organized structure
  - Updated all HTML file references to use new image paths
  - Removed duplicate and unused image files from attached_assets directory
  - Added favicon reference to HTML files using images/icons/favicon.ico
  - Cleaned up temporary files and old screenshots for improved project structure
  - Each page maintains its unique content while following the same visual structure and user experience patterns
- **Service Removal (10. August 2025)**: Removed tycoonracers.html and freundschaftsbalken.html pages and updated all documentation references
- **Mobile Menu Restructuring (10. August 2025)**: Reorganized mobile navigation with user-specified structure:
  - Main Navigation (3-column grid): Home, Kontakt, Rechtliches
  - Services Section (2-column grid): Würfelboost, Partnerevent, Sticker, Accounts  
  - Bestellungen Section (single column): Bestellungen
  - Improved mobile navigation experience with logical grouping and enhanced usability
- **Kontakt & Support Page Creation (10. August 2025)**: Created comprehensive contact page replacing bestellformular.html:
  - Custom hero section with kontakt-support-hero.png background
  - Integrated babixGO design system (colors, fonts, styling)
  - WhatsApp, Facebook Messenger, and Email contact options
  - Functional contact form with reCAPTCHA integration
  - Material Icons throughout for consistency with mobile menu
- **Contact Form Implementation & Google Sheets Integration (16. August 2025)**: Complete contact form system with Google Apps Script integration:
  - Direct embedding of contact form in kontakt-support.html (resolved partial loading issues)
  - Comprehensive form fields: name, email, phone, subject dropdown, message, data consent checkbox
  - Advanced JavaScript validation with real-time feedback and error states
  - reCAPTCHA integration for spam protection
  - Google Apps Script Web App integration for direct Google Sheets data storage
  - Local JSON backup system as fallback for data integrity
  - Professional styling with loading states, toast notifications, and responsive design
  - Form successfully captures and stores all submissions with proper error handling
  - Updated Google Apps Script URL: https://script.google.com/macros/s/AKfycbyDT5dMhCP5kBnfKQssNI_RJPq47974VSX7WbtOMFc7ldcJaS5gIBIcBY-7C3gQyt6e/exec

The site is designed for easy maintenance and updates while providing a professional service experience for Monopoly GO players seeking game enhancement services.