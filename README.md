# Whitelabel Admin Panel

A comprehensive React-based admin panel designed for service-based businesses, specifically tailored for tattoo artists and estheticians. This project provides a complete management system for client relationships, appointments, services, and business operations.

## 🚀 Project Overview

This admin panel was built following a modular approach, implementing six core modules that cover all aspects of running a service-based business:

1. **Messages/DM Inbox** - Client communication system
2. **Client Profiles** - Customer relationship management
3. **Calendar/Scheduler** - Appointment management
4. **Forms & Submissions** - Client form handling
5. **Service Editor** - Service catalog management
6. **Settings Panel** - Business configuration

## 🛠️ Technology Stack

- **Frontend**: React 18 with hooks
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Backend**: Designed for Strapi integration
- **State Management**: React useState/useEffect
- **Icons**: Heroicons (SVG)

## 📦 Project Structure

```
whitelabel-admin-panel/
├── src/
│   ├── components/
│   │   ├── ConversationSidebar.jsx
│   │   ├── ChatView.jsx
│   │   ├── MessageInput.jsx
│   │   ├── ClientList.jsx
│   │   ├── ClientDetail.jsx
│   │   ├── Calendar.jsx
│   │   ├── Forms.jsx
│   │   ├── ServiceEditor.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   ├── MESSAGES_COMPONENTS.md
│   ├── CLIENT_COMPONENTS.md
│   ├── CALENDAR_COMPONENT.md
│   ├── FORMS_COMPONENT.md
│   ├── SERVICE_EDITOR_COMPONENT.md
│   └── SETTINGS_COMPONENT.md
└── README.md
```

## 🎯 Key Features

### 💬 Messages & Communication
- WhatsApp-style messaging interface
- Client conversation management
- File attachment support
- Real-time message threading
- Professional sidebar layout

### 👥 Client Management
- Comprehensive client profiles
- Advanced search and filtering
- Appointment history tracking
- Form submission integration
- Direct messaging from profiles

### 📅 Calendar & Scheduling
- Monthly calendar view with navigation
- Color-coded appointment status
- Click-to-view appointment details
- Event management sidebar
- Today highlighting and quick navigation

### 📋 Forms & Submissions
- Multiple form type support
- Status tracking (New, Reviewed, Processed)
- Searchable submission history
- JSON export functionality
- Client-linked form data

### 🛠️ Service Management
- Complete CRUD operations for services
- Category-based organization
- Pricing and duration management
- Form integration per service
- Active/inactive status control

### ⚙️ Business Settings
- Business information management
- 7-day availability scheduling
- Theme and branding customization
- Travel service configuration
- Multi-section settings interface

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` - Actions and highlights
- **Status Colors**:
  - Green (`#059669`) - Confirmed/Active
  - Yellow (`#d97706`) - Pending/Warning
  - Red (`#dc2626`) - Cancelled/Error
- **Neutral Grays**: Professional backgrounds and text

### UI Patterns
- **Card-based Layouts**: Modern, clean information display
- **Sidebar Navigation**: Consistent navigation patterns
- **Modal/Sidebar Details**: Non-intrusive detail views
- **Professional Icons**: Heroicons for consistency
- **Responsive Design**: Mobile-friendly layouts

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd whitelabel-admin-panel

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Component Documentation

Each major component has detailed documentation in the `docs/` directory:

- **[Messages Components](./docs/MESSAGES_COMPONENTS.md)** - ConversationSidebar, ChatView, MessageInput
- **[Client Components](./docs/CLIENT_COMPONENTS.md)** - ClientList, ClientDetail
- **[Calendar Component](./docs/CALENDAR_COMPONENT.md)** - Calendar scheduler and event management
- **[Forms Component](./docs/FORMS_COMPONENT.md)** - Form submission management
- **[Service Editor Component](./docs/SERVICE_EDITOR_COMPONENT.md)** - Service catalog management
- **[Settings Component](./docs/SETTINGS_COMPONENT.md)** - Business configuration panel

## 🔗 Strapi Integration

This admin panel is designed for seamless integration with Strapi CMS. Each component documentation includes:

- Required Strapi collections
- API endpoint specifications
- Data model schemas
- Integration points between modules

### Required Collections
- `clients` - Client profiles and information
- `appointments` - Calendar appointments
- `messages` - Conversation messages
- `conversations` - Message threads
- `form-submissions` - Client form data
- `services` - Business service catalog
- `business-settings` - Configuration data

## 🚀 Deployment

### Environment Variables
```env
VITE_API_URL=your-strapi-backend-url
VITE_APP_NAME=Your Business Name
```

### Build Process
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔄 Repurposing & Customization

This admin panel is designed to be easily repurposed for different service-based businesses:

### Business Types
- **Tattoo Artists** - Current implementation
- **Estheticians/Skincare** - Minor form/service adjustments
- **Hair Salons** - Service and scheduling modifications
- **Massage Therapy** - Duration and service type changes
- **Personal Training** - Equipment and session management
- **Consultancy Services** - Meeting and project focus

### Customization Points
- **Service Categories** - Modify service types in ServiceEditor
- **Form Types** - Adjust form templates in Forms component
- **Branding** - Theme colors and business information
- **Terminology** - Update labels and descriptions
- **Business Logic** - Modify scheduling rules and constraints

## 🎯 Business Value

### For Service Providers
- **Streamlined Operations** - All business management in one place
- **Professional Client Experience** - Modern, polished interface
- **Time Savings** - Automated workflows and organization
- **Growth Support** - Scalable architecture for business expansion

### For Developers
- **Clean Architecture** - Modular, maintainable code structure
- **Documentation** - Comprehensive component documentation
- **Flexibility** - Easy customization and repurposing
- **Modern Stack** - Current best practices and technologies

## 🛣️ Roadmap

### Immediate Enhancements
- [ ] Real-time WebSocket integration
- [ ] Advanced calendar views (week/day)
- [ ] Bulk operations for forms and clients
- [ ] Enhanced search capabilities

### Future Features
- [ ] Mobile app companion
- [ ] Advanced analytics and reporting
- [ ] Multi-location business support
- [ ] Staff management and permissions
- [ ] Payment processing integration
- [ ] Automated client communications

## 📄 License

This project is designed as a whitelabel solution for service-based businesses. Contact for licensing and commercial use information.

## 🤝 Contributing

This project follows a structured development approach:

1. **Module-based Development** - Each feature is a complete module
2. **Documentation-first** - Comprehensive docs for each component
3. **Business-focused** - Features aligned with real business needs
4. **Quality Standards** - Professional code and design standards

## 📞 Support

For questions about implementation, customization, or business use cases, please refer to the component documentation or contact the development team.

---

**Built with ❤️ for service-based businesses**
