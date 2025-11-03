# Service Editor Component Documentation

## Overview
The Service Editor module provides comprehensive service management capabilities for service-based businesses. It allows business owners to create, edit, delete, and organize their service offerings with detailed pricing, duration, and form integration.

## Component Structure

### ServiceEditor.jsx
**Purpose**: Complete service management system with CRUD operations, categorization, and business logic integration.

## Key Features

### 🛠️ Complete Service Management (CRUD)
- **Create Services**: Add new services with full details
- **Read Services**: View all services in organized cards
- **Update Services**: Edit existing service information
- **Delete Services**: Remove services with confirmation
- **Activate/Deactivate**: Toggle service availability without deletion

### 📊 Service Organization
- **Category System**: Organize services by type (Tattoo, Maintenance, Consultation, etc.)
- **Search Functionality**: Real-time search across service names and categories
- **Status Management**: Active/inactive service states
- **Professional Display**: Card-based layout with comprehensive information

### 💼 Business Integration
- **Pricing Management**: Flexible pricing including free consultations
- **Duration Tracking**: Service time management in minutes
- **Form Integration**: Link services to specific form types
- **Category Color Coding**: Visual organization with color-coded categories

## Data Structure

### Service Model
```javascript
{
  id: 1,
  name: "Small Tattoo",
  duration: 120, // minutes
  price: 250, // dollars
  description: "Small tattoos up to 3 inches, simple designs",
  linkedForm: "Tattoo Consultation",
  category: "Tattoo",
  active: true
}
```

### Category System
```javascript
const categoryOptions = [
  'Tattoo',
  'Maintenance',
  'Consultation',
  'Esthetician',
  'Other'
]
```

### Form Integration Options
```javascript
const formOptions = [
  'Tattoo Consultation',
  'Touch-up Request',
  'Aftercare Form',
  'Cancellation Request',
  'Custom Form'
]
```

## User Interface Elements

### Main Service List
- **Service Cards**: Individual cards for each service
- **Service Information Display**:
  - Service name and category badge
  - Description and pricing
  - Duration and linked form
  - Active/inactive status indicators
- **Action Buttons**: Edit, Delete, Activate/Deactivate per service
- **Search Bar**: Real-time service filtering
- **Add Service Button**: Create new services

### Service Editor Sidebar
- **Slide-out Form**: 384px wide editing panel
- **Form Fields**:
  - Service Name (text input)
  - Category (dropdown selection)
  - Duration (number input with 15-minute increments)
  - Price (number input with decimal support)
  - Description (textarea)
  - Linked Form (dropdown selection)
  - Active Status (checkbox)

### Status & Category Indicators
- **Category Colors**:
  - Purple: Tattoo services
  - Blue: Maintenance services
  - Green: Consultation services
  - Pink: Esthetician services
  - Gray: Other services
- **Active/Inactive Badges**: Visual status indicators

## Business Logic Features

### 💰 Pricing Management
```javascript
const formatPrice = (price) => {
  return price === 0 ? 'Free' : `$${price}`
}
```
- **Free Services**: Handle $0 consultations
- **Decimal Support**: Precise pricing with cents
- **Currency Formatting**: Professional price display

### ⏱️ Duration Management
```javascript
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins}m`
  }
}
```
- **Smart Formatting**: Display hours and minutes appropriately
- **15-minute Increments**: Standard booking time blocks
- **Flexible Duration**: Support for various service lengths

### 🎨 Category Color Coding
```javascript
const getCategoryColor = (category) => {
  switch (category) {
    case 'Tattoo': return 'bg-purple-100 text-purple-800'
    case 'Maintenance': return 'bg-blue-100 text-blue-800'
    case 'Consultation': return 'bg-green-100 text-green-800'
    case 'Esthetician': return 'bg-pink-100 text-pink-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
```

## State Management

### Component State
```javascript
const [services, setServices] = useState([]) // Service list
const [editingService, setEditingService] = useState(null) // Current edit
const [isCreating, setIsCreating] = useState(false) // Create mode
const [searchTerm, setSearchTerm] = useState('') // Search filter
```

### Service Operations
```javascript
// Create new service
const handleCreateService = () => {
  setIsCreating(true)
  setEditingService(defaultServiceStructure)
}

// Edit existing service
const handleEditService = (service) => {
  setEditingService({ ...service })
  setIsCreating(false)
}

// Save service (create or update)
const handleSaveService = () => {
  if (isCreating) {
    // Add new service to list
  } else {
    // Update existing service
  }
}

// Delete service with confirmation
const handleDeleteService = (serviceId) => {
  if (window.confirm('Are you sure?')) {
    setServices(services.filter(s => s.id !== serviceId))
  }
}

// Toggle active status
const toggleServiceStatus = (serviceId) => {
  setServices(services.map(s =>
    s.id === serviceId ? { ...s, active: !s.active } : s
  ))
}
```

## Integration Points

### 📅 Calendar Integration
- **Duration Mapping**: Calendar uses service duration for booking blocks
- **Service Selection**: Appointment creation references available services
- **Pricing Display**: Calendar can show service pricing

### 📋 Forms Integration
- **Linked Forms**: Each service connects to specific form types
- **Consultation Flow**: Consultation forms link to consultation services
- **Touch-up Requests**: Touch-up forms connect to maintenance services

### 👥 Client Management
- **Service History**: Track which services clients have used
- **Preferences**: Client preferred services tracking
- **Recommendations**: Suggest services based on client history

## Visual Design & UX

### Professional Styling
- **Card Layout**: Clean, modern service cards
- **Typography Hierarchy**: Clear information organization
- **Color Coding**: Category-based visual organization
- **Status Indicators**: Immediate visual feedback for service status

### Interactive Elements
- **Hover Effects**: Card and button interactions
- **Smooth Transitions**: Professional state changes
- **Action Feedback**: Visual confirmation of user actions
- **Form Validation**: Real-time input validation

### Responsive Design
- **Flexible Grid**: Responsive service card layout
- **Mobile Considerations**: Touch-friendly interactions
- **Sidebar Adaptation**: Proper mobile sidebar behavior

## Business Value Features

### 📈 Service Portfolio Management
- **Comprehensive Catalog**: Complete service offering management
- **Professional Presentation**: Clean, organized service display
- **Easy Updates**: Quick service modification capabilities
- **Status Control**: Enable/disable services without deletion

### 💡 Business Intelligence
- **Service Categorization**: Organized service structure
- **Pricing Strategy**: Flexible pricing including free options
- **Form Integration**: Streamlined client intake process
- **Duration Planning**: Accurate scheduling capabilities

## Future Enhancements

### Advanced Features
- **Service Packages**: Bundle multiple services together
- **Seasonal Pricing**: Time-based pricing variations
- **Staff Assignments**: Link services to specific staff members
- **Skill Requirements**: Track required skills per service

### Business Logic
- **Prerequisite Services**: Services that require other services first
- **Upsell Suggestions**: Recommend additional services
- **Service Analytics**: Track popular services and revenue
- **Dynamic Pricing**: Demand-based pricing adjustments

### Integration Enhancements
- **Payment Processing**: Direct payment integration
- **Inventory Management**: Track supplies needed per service
- **Client Notifications**: Automated service-related communications
- **Booking Rules**: Advanced scheduling constraints

## Strapi Integration Points

### Collections Needed
1. **`services`** - Main service catalog
2. **`service-categories`** - Category management
3. **`form-types`** - Available form templates
4. **`pricing-tiers`** - Advanced pricing structures

### API Endpoints
```javascript
// Service management
GET /services // Get all services
GET /services/:id // Get specific service
POST /services // Create new service
PUT /services/:id // Update service
DELETE /services/:id // Delete service
PATCH /services/:id/toggle // Toggle active status

// Category management
GET /service-categories // Get all categories
POST /service-categories // Create category

// Integration
GET /services?category=:category // Filter by category
GET /services?active=true // Get only active services
GET /services/:id/bookings // Get service booking history
```

### Service Configuration Schema
```javascript
{
  name: { type: 'string', required: true },
  description: { type: 'text' },
  duration: { type: 'integer', required: true }, // minutes
  price: { type: 'decimal', required: true },
  category: { type: 'relation', target: 'service-categories' },
  linkedForm: { type: 'relation', target: 'form-types' },
  active: { type: 'boolean', default: true },
  requirements: { type: 'text' }, // Special requirements
  supplies: { type: 'json' }, // Required supplies list
  staffSkills: { type: 'json' } // Required staff skills
}
```

## Performance Considerations
- **Service Caching**: Cache frequently accessed service data
- **Search Optimization**: Debounced search for large service lists
- **Lazy Loading**: Load service details on demand
- **Bulk Operations**: Efficient multiple service updates