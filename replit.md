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
The project now includes an Express.js server for handling PayPal payment processing:

- **Express Server**: Node.js server (server.js) handling PayPal API integration and serving static files
- **PayPal Server SDK**: Secure server-side payment processing with @paypal/paypal-server-sdk
- **Client-Side Payment Components**: JavaScript PayPal button component for seamless payment experience
- **RESTful API Endpoints**: `/paypal/setup`, `/paypal/order`, `/paypal/order/:orderID/capture` for payment processing

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

## Payment Integration
- **PayPal Server SDK**: Fully integrated modern PayPal payment system (@paypal/paypal-server-sdk v1.1.0)
- **Secure Payment Processing**: Server-side order creation and capture with environment-based sandbox/production switching
- **Modern Payment UX**: Client-side PayPal button component with seamless checkout flow
- **Express.js Backend**: RESTful API endpoints for secure payment processing

## Font Services
- **Google Fonts**: Nunito Sans and Baloo 2 font families loaded from Google Fonts CDN
- **Material Icons**: Google's Material Icons library for consistent iconography

## Communication Channels
- **WhatsApp Integration**: Direct WhatsApp contact links for customer support (+49 152 37250453)
- **Facebook Messenger**: Integration for customer communication via Facebook Messenger
- **Email**: Standard email contact (info@babixgo.de)

## Third-Party Services
The architecture includes active integrations for:
- **PayPal Payment Processing**: Complete server-side integration with secure payment handling
- **Order Management System**: bestellformular.html order form with PayPal integration for payment confirmation
- **Customer Communication**: Multiple messaging platforms (WhatsApp, Facebook Messenger, Email)

## Recent Changes (August 2025)
- **Modern PayPal Integration**: Upgraded from legacy hosted buttons to full server-side PayPal SDK integration
- **Express.js Backend**: Added Node.js/Express server for handling payment processing
- **Component Architecture**: Created reusable PayPal button component for consistent payment experience
- **API Endpoints**: Implemented secure REST API for payment creation and capture
- **Enhanced UX**: Seamless payment flow with proper error handling and success redirects

The site is designed for easy maintenance and updates while providing a professional service experience for Monopoly GO players seeking game enhancement services.