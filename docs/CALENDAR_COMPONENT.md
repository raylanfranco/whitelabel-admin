# Calendar/Scheduler Component Documentation

## Overview
The Calendar/Scheduler module provides a comprehensive appointment management system with a visual monthly calendar interface. It allows service-based businesses to view, manage, and interact with appointments in an intuitive calendar format.

## Component Structure

### Calendar.jsx
**Purpose**: Main calendar interface for viewing and managing appointments with detailed event information.

## Key Features

### 📅 Calendar Grid View
- **Monthly Calendar Layout**: Full month display with proper date calculations
- **Navigation Controls**: Previous/Next month navigation with arrow buttons
- **Today Highlighting**: Current date highlighted with blue accent
- **Responsive Grid**: 7-column layout for days of the week
- **Smart Date Calculations**: Handles month boundaries and leap years correctly

### 📋 Appointment Display
- **Event Cards**: Appointments shown as colored cards on calendar dates
- **Time Display**: Start time shown for each appointment
- **Client Names**: Client identification on appointment cards
- **Status Color Coding**:
  - Green: Confirmed appointments
  - Yellow: Pending appointments
- **Multiple Events**: Supports multiple appointments per day

### 🔍 Event Details Sidebar
- **Click-to-View**: Click any appointment to open detailed sidebar
- **Comprehensive Information**:
  - Client name and contact
  - Service type and description
  - Date, time, and duration
  - Appointment status
  - Special notes or requirements

### ⚡ Interactive Features
- **Today Button**: Quick navigation to current date
- **Event Interaction**: Click appointments for detailed view
- **Action Buttons**: Edit, Message, Cancel appointment options
- **Status Management**: Visual status indicators throughout

## Data Structure

### Event/Appointment Model
```javascript
{
  id: 1,
  title: "Sarah Johnson - Tattoo Session",
  date: new Date(2025, 8, 20, 14, 0), // September 20, 2025 at 2:00 PM
  duration: 120, // minutes
  client: "Sarah Johnson",
  service: "Tattoo Session",
  status: "confirmed" | "pending" | "cancelled",
  notes?: "Client prefers afternoon appointments",
  clientContact?: {
    email: "sarah@email.com",
    phone: "(555) 123-4567"
  }
}
```

### Calendar State Management
```javascript
const [currentDate, setCurrentDate] = useState(new Date())
const [selectedEvent, setSelectedEvent] = useState(null)
const [events, setEvents] = useState([])
```

## Calendar Logic Functions

### Date Calculation
```javascript
const getDaysInMonth = (date) => {
  // Calculates all days to display in calendar grid
  // Includes padding days from previous/next month
  // Returns array of Date objects
}
```

### Event Filtering
```javascript
const getEventsForDate = (date) => {
  // Filters appointments for specific date
  // Returns array of events for that day
}
```

### Time Formatting
```javascript
const formatTime = (date) => {
  // Converts to 12-hour format with AM/PM
  // Example: "2:00 PM"
}
```

## User Interface Elements

### Calendar Header
- **Month/Year Display**: Current month and year prominently shown
- **Navigation Arrows**: Previous/next month controls
- **Today Button**: Quick return to current date
- **Professional Styling**: Clean, modern appearance

### Calendar Grid
- **Day Headers**: Sun, Mon, Tue, Wed, Thu, Fri, Sat
- **Date Numbers**: Properly positioned in each cell
- **Event Cards**: Appointments displayed as clickable cards
- **Hover Effects**: Interactive feedback on dates and events
- **Empty States**: Clean appearance for days without appointments

### Event Detail Sidebar
- **Slide-out Panel**: 320px wide sidebar with event details
- **Close Button**: Easy dismissal with X button
- **Organized Information**: Sectioned event details
- **Action Buttons**:
  - Edit Appointment (blue)
  - Send Message (gray)
  - Cancel Appointment (red)

## Styling & Design

### Color Scheme
- **Primary Blue**: `#2563eb` for highlights and actions
- **Green Status**: `#059669` for confirmed appointments
- **Yellow Status**: `#d97706` for pending appointments
- **Gray Tones**: Professional neutral background colors

### Layout
- **Flex Layout**: Responsive calendar with sidebar
- **Grid System**: CSS Grid for calendar dates
- **Card Design**: Modern card-based appointment display
- **Typography**: Clear, readable font hierarchy

### Responsive Behavior
- **Desktop Optimized**: Full calendar with sidebar
- **Mobile Considerations**: Responsive grid adjustments
- **Touch Interactions**: Proper button sizing and spacing

## Integration Points

### Client Management Integration
- **Client Names**: Links to client profiles
- **Client Contact**: Direct access to client information
- **Appointment History**: Context from client records

### Messaging Integration
- **Send Message Button**: Direct link to messaging interface
- **Client Communication**: Seamless transition to chat

### Service Management Integration
- **Service Types**: Integration with service definitions
- **Duration Mapping**: Uses service duration settings
- **Pricing Information**: Could integrate service pricing

## Future Enhancements

### Advanced Features
- **Week/Day Views**: Alternative calendar layouts
- **Drag & Drop**: Move appointments between dates
- **Recurring Appointments**: Repeat appointment functionality
- **Availability Blocks**: Mark unavailable time periods
- **Multiple Staff**: Support for multiple practitioners

### Business Logic
- **Booking Rules**: Prevent double-booking
- **Buffer Times**: Automatic spacing between appointments
- **Service Duration**: Dynamic event sizing based on service
- **Break Times**: Lunch/break period management

### User Experience
- **Keyboard Navigation**: Arrow key support
- **Calendar Shortcuts**: Quick date jumping
- **Print View**: Printable calendar format
- **Export Options**: iCal, Google Calendar integration

## Strapi Integration Points

### Collections Needed
1. **`appointments`** - Main appointment storage
2. **`clients`** - Client information for appointments
3. **`services`** - Service types and durations
4. **`availability`** - Staff availability windows
5. **`calendar-settings`** - Business calendar preferences

### API Endpoints
```javascript
// Calendar data
GET /appointments?month=2025-09 // Get month's appointments
GET /appointments/:id // Get specific appointment
POST /appointments // Create new appointment
PUT /appointments/:id // Update appointment
DELETE /appointments/:id // Cancel appointment

// Integration endpoints
GET /clients/:id/appointments // Client appointment history
GET /services // Available services for booking
GET /availability?date=2025-09-20 // Available time slots
```

### Real-time Updates
- **WebSocket Integration**: Live appointment updates
- **Conflict Prevention**: Real-time booking conflict detection
- **Status Changes**: Live status updates across users

## Performance Considerations
- **Month-based Loading**: Only load current month data
- **Event Caching**: Cache frequently accessed appointments
- **Lazy Loading**: Load event details on demand
- **Optimistic Updates**: Instant UI feedback for user actions