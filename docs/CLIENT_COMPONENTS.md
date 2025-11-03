# Client Management Components Documentation

## Overview
The Client Management module provides comprehensive client relationship management for service-based businesses. It consists of two main components that handle client listing, detailed views, and client interactions.

## Components

### 1. ClientList.jsx
**Purpose**: Main dashboard for viewing and managing all clients with search and filtering capabilities.

**Key Features**:
- Grid-based client card layout
- Real-time search functionality
- Advanced filtering by status, service type, and date ranges
- Client statistics and metrics
- Quick action buttons for each client
- Professional card-based design

**Props**:
- `onSelectClient` (function): Callback when a client is selected for detailed view

**Search & Filter Options**:
- **Search**: Name, email, phone number
- **Status Filter**: Active, Inactive, Pending, All
- **Service Filter**: Tattoo, Touch-up, Consultation, All
- **Date Range**: Last visit, upcoming appointments

**Client Card Information**:
- Client name with avatar/initials
- Contact information (email, phone)
- Last appointment date
- Next scheduled appointment
- Total appointments count
- Client status with color coding
- Quick action buttons (View, Message, Schedule)

**Mock Data Structure**:
```javascript
{
  id: 1,
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.j@email.com",
  phone: "(555) 123-4567",
  lastAppointment: "2025-08-15",
  nextAppointment: "2025-09-20",
  totalAppointments: 3,
  status: "active",
  preferredService: "Tattoo",
  notes: "Prefers afternoon appointments"
}
```

---

### 2. ClientDetail.jsx
**Purpose**: Comprehensive client profile view with detailed information and interaction options.

**Key Features**:
- Complete client profile display
- Appointment history with visual timeline
- Form submissions linked to client
- Direct messaging integration
- Client notes and preferences
- Contact information management
- Action buttons for common tasks

**Props**:
- `client` (object): The selected client data
- `onBack` (function): Callback to return to client list
- `onStartConversation` (function): Callback to initiate messaging

**Information Sections**:

#### Contact Information
- Full name and contact details
- Profile avatar/initials
- Preferred contact method
- Emergency contact (if provided)

#### Appointment History
- Chronological list of past appointments
- Service type and duration
- Date and time information
- Appointment status and outcomes
- Associated files/photos

#### Form Submissions
- Linked consultation forms
- Aftercare forms
- Touch-up requests
- Cancellation forms
- Downloadable form data

#### Client Preferences
- Preferred appointment times
- Service preferences
- Special requirements
- Communication preferences
- Payment method preferences

#### Notes & History
- Staff notes about the client
- Special instructions
- Allergy information
- Previous conversations summary

**Action Buttons**:
- Start Conversation - Opens messaging interface
- Schedule Appointment - Quick scheduling
- Edit Profile - Modify client information
- View Forms - Access form submissions
- Send Email - Direct email communication

## State Management
Both components use React hooks for state management:

```javascript
// ClientList state
const [clients, setClients] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const [statusFilter, setStatusFilter] = useState('all')
const [serviceFilter, setServiceFilter] = useState('all')

// ClientDetail state
const [activeTab, setActiveTab] = useState('overview')
const [showNotes, setShowNotes] = useState(false)
```

## Integration with Other Modules

### Messages Integration
- Direct conversation starter from client detail
- Creates new conversation or opens existing one
- Seamless transition to messaging interface

### Calendar Integration
- Quick appointment scheduling
- View client's upcoming appointments
- Reschedule existing appointments

### Forms Integration
- Access client's form submissions
- View consultation requests
- Download form data

## Styling & UX
- **Card-based Layout**: Modern, clean client cards
- **Color Coding**: Status-based color indicators
- **Responsive Design**: Works on all screen sizes
- **Search Highlighting**: Real-time search result highlighting
- **Smooth Transitions**: Hover effects and state changes
- **Professional Icons**: Consistent iconography throughout

## Data Relationships

### Client Model
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address?: object,
  preferences: object,
  status: 'active' | 'inactive' | 'pending',
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Relationship
```javascript
{
  clientId: number,
  date: Date,
  service: string,
  duration: number,
  status: 'scheduled' | 'completed' | 'cancelled',
  notes?: string
}
```

## Future Enhancements
- Client import/export functionality
- Advanced analytics and reporting
- Client communication history
- Automated follow-up reminders
- Client referral tracking
- Payment history integration
- Photo gallery for client work
- Client loyalty program integration

## Strapi Integration Points

**Collections Needed**:
1. `clients` - Main client profiles
2. `appointments` - Client appointment history
3. `client-notes` - Staff notes about clients
4. `client-preferences` - Client preferences and settings

**API Endpoints**:
- GET `/clients` - Fetch all clients with filters
- GET `/clients/:id` - Fetch specific client details
- PUT `/clients/:id` - Update client information
- POST `/clients` - Create new client
- GET `/clients/:id/appointments` - Client appointment history
- GET `/clients/:id/forms` - Client form submissions

**Search & Filter API**:
- GET `/clients?search=:term` - Search clients
- GET `/clients?status=:status` - Filter by status
- GET `/clients?service=:service` - Filter by preferred service