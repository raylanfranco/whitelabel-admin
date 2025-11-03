import { useState } from 'react'
import { defaultTheme, createThemeCSS } from '../styles/theme'
import ModernSidebar from './ModernSidebar'
import BusinessDashboard from './BusinessDashboard'
import ClientList from './ClientList'
import ClientDetail from './ClientDetail'
import Calendar from './Calendar'
import ServiceEditor from './ServiceEditor'
import Settings from './Settings'
import SMSReminders from './SMSReminders'

function AdminPanel() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [theme, setTheme] = useState(defaultTheme)
  const [customColors, setCustomColors] = useState({})
  const [backgroundImage, setBackgroundImage] = useState(null)

  // Mock business info - in production, this would come from Settings/Strapi
  const [businessInfo, setBusinessInfo] = useState({
    name: "Bob's Pest Control",
    email: 'contact@bobspestcontrol.com',
    phone: '(555) 123-4567',
    logo: null
  })

  // Apply theme CSS variables
  const themeCSS = createThemeCSS(theme, customColors, backgroundImage)

  return (
    <div className="flex h-screen" style={themeCSS}>
      {/* Modern Sidebar */}
      <ModernSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        businessInfo={businessInfo}
      />

      {/* Main Content */}
      {currentView === 'dashboard' ? (
        <BusinessDashboard
          businessInfo={businessInfo}
          theme={theme}
          customColors={customColors}
          backgroundImage={backgroundImage}
          onNavigateToClients={() => setCurrentView('clients')}
          onNavigateToEarnings={() => setCurrentView('earnings')}
        />
      ) : currentView === 'clients' ? (
        <div className="flex-1">
          {selectedClient ? (
            <ClientDetail
              client={selectedClient}
              onBack={() => setSelectedClient(null)}
            />
          ) : (
            <ClientList
              onSelectClient={setSelectedClient}
              customColors={customColors}
              backgroundImage={backgroundImage}
            />
          )}
        </div>
      ) : currentView === 'calendar' ? (
        <div className="flex-1">
          <Calendar
            customColors={customColors}
            backgroundImage={backgroundImage}
          />
        </div>
      ) : currentView === 'services' ? (
        <div className="flex-1">
          <ServiceEditor
            customColors={customColors}
            backgroundImage={backgroundImage}
          />
        </div>
      ) : currentView === 'sms' ? (
        <div className="flex-1">
          <SMSReminders
            customColors={customColors}
            backgroundImage={backgroundImage}
          />
        </div>
      ) : currentView === 'settings' ? (
        <div className="flex-1">
          <Settings
            theme={theme}
            setTheme={setTheme}
            customColors={customColors}
            setCustomColors={setCustomColors}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            businessInfo={businessInfo}
            setBusinessInfo={setBusinessInfo}
          />
        </div>
      ) : null}
    </div>
  )
}

export default AdminPanel