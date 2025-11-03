# Settings Panel Component Documentation

## Overview
The Settings Panel module provides comprehensive business configuration management for service-based businesses. It includes business information, availability scheduling, theme customization, and travel service configuration in a multi-section interface.

## Component Structure

### Settings.jsx
**Purpose**: Complete business settings management with tabbed navigation and real-time configuration updates.

## Key Features

### 🏢 Business Information Management
- **Company Details**: Name, contact information, address, website
- **Professional Forms**: Clean, validated input fields
- **Real-time Updates**: Immediate setting changes
- **Contact Integration**: Phone, email, address management

### 🕐 Availability Schedule Management
- **7-Day Week Configuration**: Individual day management
- **Enable/Disable Days**: Flexible working schedule
- **Time Range Controls**: Start and end times per day
- **Visual Schedule Layout**: Clear day-by-day organization
- **Business Hour Optimization**: Standard working hour defaults

### 🎨 Theme & Branding Customization
- **Primary Color Selection**: Custom color picker with presets
- **Logo Management**: URL-based logo integration with preview
- **Brand Name Configuration**: Business identity management
- **Color Palette**: Pre-defined professional color options
- **Real-time Preview**: Immediate visual feedback

### 🚗 Travel Service Configuration
- **Service Toggle**: Enable/disable mobile services
- **Distance Management**: Maximum travel radius settings
- **Fee Structure**: Travel fee configuration
- **Minimum Booking**: Required hours for travel services
- **Business Logic**: Conditional settings based on service enablement

## Component Architecture

### Multi-Section Navigation
```javascript
const sections = [
  { id: 'business', name: 'Business Info', icon: <BusinessIcon /> },
  { id: 'availability', name: 'Availability', icon: <ClockIcon /> },
  { id: 'theme', name: 'Theme & Brand', icon: <PaletteIcon /> },
  { id: 'travel', name: 'Travel Service', icon: <LocationIcon /> }
]
```

### State Management
```javascript
// Business Information
const [businessInfo, setBusinessInfo] = useState({
  name: 'Ink & Art Studio',
  phone: '(555) 123-4567',
  email: 'contact@inkandart.com',
  address: '123 Main Street, Downtown, NY 10001',
  website: 'www.inkandart.com'
})

// Availability Schedule
const [availability, setAvailability] = useState({
  monday: { enabled: true, start: '09:00', end: '17:00' },
  tuesday: { enabled: true, start: '09:00', end: '17:00' },
  // ... for each day
})

// Theme Configuration
const [theme, setTheme] = useState({
  primaryColor: '#2563eb',
  logoUrl: '',
  brandName: 'Ink & Art Studio'
})

// Travel Settings
const [travelSettings, setTravelSettings] = useState({
  enabled: false,
  maxDistance: 50,
  travelFee: 25,
  minimumBooking: 2
})
```

## Section Details

### 1. Business Information Section

#### Features
- **Company Name**: Primary business identifier
- **Contact Details**: Phone and email with validation
- **Physical Address**: Complete address management
- **Website URL**: Online presence integration

#### Form Layout
```javascript
// Two-column grid for contact information
<div className="grid grid-cols-2 gap-4">
  <PhoneInput />
  <EmailInput />
</div>
```

#### Validation
- Email format validation
- Phone number formatting
- Required field indicators
- Real-time input feedback

### 2. Availability Schedule Section

#### Day Management
```javascript
const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
```

#### Schedule Logic
```javascript
const updateAvailability = (day, field, value) => {
  setAvailability(prev => ({
    ...prev,
    [day]: {
      ...prev[day],
      [field]: value
    }
  }))
}
```

#### Features
- **Day Toggle**: Enable/disable individual days
- **Time Inputs**: HTML5 time inputs for start/end times
- **Visual Layout**: Card-based day organization
- **Closed Days**: Clear "Closed" indication for disabled days

### 3. Theme & Brand Section

#### Color Management
```javascript
const predefinedColors = [
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#dc2626', // Red
  '#059669', // Green
  '#d97706', // Orange
  '#4f46e5', // Indigo
  '#be185d', // Pink
  '#374151'  // Gray
]
```

#### Features
- **Color Picker**: Native HTML5 color input
- **Preset Palette**: Professional color options
- **Hex Code Input**: Manual color code entry
- **Logo Preview**: Real-time logo display
- **Brand Name**: Customizable business name

#### Logo Integration
- **URL-based**: Flexible logo source management
- **Preview System**: Immediate visual feedback
- **Error Handling**: Graceful logo loading failures
- **Size Constraints**: Optimal logo display sizing

### 4. Travel Service Section

#### Conditional Settings
```javascript
{travelSettings.enabled && (
  <>
    <DistanceInput />
    <FeeInput />
    <MinimumBookingInput />
  </>
)}
```

#### Business Logic
- **Toggle Control**: Master enable/disable
- **Distance Radius**: Maximum travel distance in miles
- **Fee Structure**: Travel fee in dollars
- **Minimum Booking**: Required hours for travel services
- **Conditional Display**: Settings only shown when enabled

## User Interface Design

### Navigation Sidebar
- **Vertical Layout**: Clean section organization
- **Active States**: Visual indication of current section
- **Icon Integration**: Professional iconography
- **Hover Effects**: Interactive feedback

### Form Design
- **Consistent Styling**: TailwindCSS form components
- **Input Validation**: Real-time feedback
- **Label Organization**: Clear field identification
- **Responsive Layout**: Mobile-friendly design

### Color Scheme
- **Primary Blue**: `#2563eb` for highlights and actions
- **Gray Tones**: Professional neutral backgrounds
- **Status Colors**: Success, warning, and error states
- **Accessibility**: WCAG compliant color contrast

## Business Integration

### 🔗 Calendar Integration
- **Availability Windows**: Calendar uses availability settings
- **Working Hours**: Booking constraints based on schedule
- **Business Days**: Only enabled days available for booking

### 🎨 Theme Application
- **Brand Consistency**: Theme colors applied throughout app
- **Logo Display**: Business logo in navigation and headers
- **Color Theming**: Primary color used for buttons and highlights

### 📍 Travel Service Integration
- **Service Options**: Travel services appear in booking options
- **Fee Calculation**: Automatic travel fee application
- **Distance Validation**: Booking radius enforcement

## Data Persistence

### Save Functionality
```javascript
const handleSaveSettings = () => {
  // In production, this would save to Strapi backend
  // Current implementation shows success message
  alert('Settings saved successfully!')
}
```

### Settings Structure for API
```javascript
{
  business: {
    name: string,
    phone: string,
    email: string,
    address: string,
    website: string
  },
  availability: {
    [dayName]: {
      enabled: boolean,
      start: string, // HH:MM format
      end: string    // HH:MM format
    }
  },
  theme: {
    primaryColor: string, // hex color
    logoUrl: string,
    brandName: string
  },
  travel: {
    enabled: boolean,
    maxDistance: number,
    travelFee: number,
    minimumBooking: number
  }
}
```

## Future Enhancements

### Advanced Business Settings
- **Multiple Locations**: Multi-location business support
- **Staff Management**: Individual staff availability
- **Holiday Management**: Special date handling
- **Booking Rules**: Advanced scheduling constraints

### Theme Enhancements
- **Theme Templates**: Pre-designed theme packages
- **Advanced Customization**: Font selection, additional colors
- **Preview Mode**: Live theme preview throughout app
- **Import/Export**: Theme sharing and backup

### Travel Service Expansion
- **Zone-based Pricing**: Different rates for different areas
- **Travel Time**: Account for travel time in scheduling
- **GPS Integration**: Automatic distance calculation
- **Service Area Maps**: Visual service area definition

## Strapi Integration Points

### Collections Needed
1. **`business-settings`** - Core business information
2. **`availability-schedules`** - Working hours configuration
3. **`theme-settings`** - Brand and appearance settings
4. **`travel-settings`** - Mobile service configuration

### API Endpoints
```javascript
// Settings management
GET /settings // Get all business settings
PUT /settings/business // Update business info
PUT /settings/availability // Update availability schedule
PUT /settings/theme // Update theme settings
PUT /settings/travel // Update travel settings

// Integration endpoints
GET /settings/availability/:date // Check availability for date
GET /settings/theme/current // Get current theme for app
GET /settings/travel/radius/:location // Check if location in range
```

### Settings Schema
```javascript
// business-settings
{
  name: { type: 'string', required: true },
  phone: { type: 'string' },
  email: { type: 'email' },
  address: { type: 'text' },
  website: { type: 'string' },
  timezone: { type: 'string', default: 'America/New_York' }
}

// availability-schedules
{
  dayOfWeek: { type: 'enumeration', values: ['monday', 'tuesday', ...] },
  enabled: { type: 'boolean', default: true },
  startTime: { type: 'time' },
  endTime: { type: 'time' },
  breakStart: { type: 'time' }, // Optional lunch break
  breakEnd: { type: 'time' }
}

// theme-settings
{
  primaryColor: { type: 'string', default: '#2563eb' },
  secondaryColor: { type: 'string' },
  logoUrl: { type: 'string' },
  brandName: { type: 'string' },
  customCSS: { type: 'text' } // Advanced customization
}
```

## Performance Considerations
- **Debounced Saves**: Prevent excessive API calls during editing
- **Setting Caching**: Cache frequently accessed settings
- **Validation**: Client-side validation before API submission
- **Progressive Enhancement**: Graceful degradation for settings features