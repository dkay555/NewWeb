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
- **PayPal Server SDK**: Integrated for payment processing (@paypal/paypal-server-sdk v1.1.0) suggesting e-commerce functionality

## Font Services
- **Google Fonts**: Nunito Sans and Baloo 2 font families loaded from Google Fonts CDN
- **Material Icons**: Google's Material Icons library for consistent iconography

## Communication Channels
- **WhatsApp Integration**: Direct WhatsApp contact links for customer support (+49 152 37250453)
- **Facebook Messenger**: Integration for customer communication via Facebook Messenger
- **Email**: Standard email contact (info@babixgo.de)

## Third-Party Services
The architecture suggests integration points for:
- Payment processing through PayPal
- Potential order management system (evidenced by bestellformular.html order form)
- Customer communication through multiple messaging platforms

The site is designed for easy maintenance and updates while providing a professional service experience for Monopoly GO players seeking game enhancement services.