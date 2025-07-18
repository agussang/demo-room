# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Start: `npm start` - Serves the app using the serve package

## Project Structure
- `assets/` - Static assets
  - `css/` - CSS stylesheets (main.css, form.css, login.css)
  - `js/` - JavaScript files
  - `fonts/` - Font files
  - `images/` - Image files
- Form-related pages in separate directories:
  - `form/` - Hotel information form
  - `form-venue/` - Venue information form
  - `mice-management/` - MICE management forms 
- Dashboard pages:
  - `dashboard/` - Hotel dashboard view (index.html, hotel-dashboard.html)
  - `dashboard-venue/` - Venue dashboard view
- `room/` - Room detail and management pages

## Code Style Guidelines
- **JavaScript**: Vanilla JavaScript for functionality
- **Naming**: camelCase for variables/functions
- **Colors**:
  - Use consistent color variables defined in stylesheets (--primary, --accent, etc.)
  - Primary color: #2A4061 (blue)
  - Accent color: #E5BC6D (gold)
- **CSS**: Include appropriate classes for styling
- **Icons**: Use Font Awesome icons for UI elements
- **Error Handling**: Use proper error handling in async operations

## Application Features
- **Hotel Management**: Forms and dashboard for managing hotel information
- **Venue Management**: Forms and dashboard for MICE venues
- **Location Services**: Google Maps integration for location selection
- **Form Navigation**: Multi-step forms with progress tracking
- **Data Validation**: Form validation with proper error messages

## External Integrations
- **Google Maps**: Used for location selection and geocoding
- **Google Places API**: For nearby places recommendations and address autocomplete
- **Bootstrap**: For responsive UI components
- **Chart.js**: For dashboard analytics and charts