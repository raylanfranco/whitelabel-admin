import { useState } from 'react'
import { themePresets } from '../styles/theme'

function Settings({
  theme,
  setTheme,
  customColors,
  setCustomColors,
  backgroundImage,
  setBackgroundImage,
  businessInfo,
  setBusinessInfo
}) {
  const [activeSection, setActiveSection] = useState('business')

  // Local business form state (separate from global businessInfo)
  const [localBusinessInfo, setLocalBusinessInfo] = useState({
    name: businessInfo?.name || 'Ink & Art Studio',
    phone: businessInfo?.phone || '(555) 123-4567',
    email: businessInfo?.email || 'contact@inkandart.com',
    address: '123 Main Street, Downtown, NY 10001',
    website: 'www.inkandart.com'
  })

  // Availability State
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: true, start: '10:00', end: '16:00' },
    sunday: { enabled: false, start: '10:00', end: '16:00' }
  })

  // Logo upload state
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  // Handle logo upload
  const handleLogoUpload = (file) => {
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoUrl = e.target.result
        setLogoPreview(logoUrl)
        // Update business info with logo
        setBusinessInfo(prev => ({
          ...prev,
          logo: logoUrl
        }))
        // In production, this would upload to Supabase Storage
        // For now, we'll use the preview URL
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle background image upload
  const handleBackgroundUpload = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle theme preset selection
  const handleThemePresetChange = (presetName) => {
    setTheme(themePresets[presetName])
    setCustomColors({}) // Reset custom colors when changing preset
  }

  // Handle custom color changes
  const handleCustomColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const sections = [
    {
      id: 'business',
      name: 'Business Info',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'availability',
      name: 'Availability',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'theme',
      name: 'Theme & Brand',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    }
  ]

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const updateAvailability = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    // Update business info in parent component
    setBusinessInfo(localBusinessInfo)

    // In a real app, this would save to the backend/Strapi
    // For now, just show success message
    alert('Settings saved successfully! Your theme and business information have been updated.')
  }

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

  return (
    <div className="flex h-full bg-white">
      {/* Settings Navigation */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>
        <nav className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.icon}
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8">
        {/* Business Info Section */}
        {activeSection === 'business' && (
          <div className="max-w-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
              <p className="text-gray-600">Manage your business details and contact information.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={localBusinessInfo.name}
                  onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={localBusinessInfo.phone}
                    onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={localBusinessInfo.email}
                    onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={localBusinessInfo.address}
                  onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={localBusinessInfo.website}
                  onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Availability Section */}
        {activeSection === 'availability' && (
          <div className="max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability Schedule</h2>
              <p className="text-gray-600">Set your working hours for each day of the week.</p>
            </div>

            <div className="space-y-4">
              {dayNames.map((day, index) => (
                <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={availability[day].enabled}
                        onChange={(e) => updateAvailability(day, 'enabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {dayLabels[index]}
                      </span>
                    </label>
                  </div>

                  {availability[day].enabled ? (
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={availability[day].start}
                          onChange={(e) => updateAvailability(day, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End Time</label>
                        <input
                          type="time"
                          value={availability[day].end}
                          onChange={(e) => updateAvailability(day, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Theme Section */}
        {activeSection === 'theme' && (
          <div className="max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Theme & Branding</h2>
              <p className="text-gray-600">Customize your dashboard appearance, colors, and branding.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Theme Presets & Colors */}
              <div className="space-y-6">
                {/* Theme Presets */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Presets</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(themePresets).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => handleThemePresetChange(key)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme.name === preset.name
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{
                              background: preset.gradients.primary
                            }}
                          />
                          <span className="font-medium text-gray-900">{preset.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Colors</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={customColors.primary || theme.colors.primary}
                            onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.primary || theme.colors.primary}
                            onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={customColors.secondary || theme.colors.secondary}
                            onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.secondary || theme.colors.secondary}
                            onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={customColors.accent || theme.colors.accent}
                            onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.accent || theme.colors.accent}
                            onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={customColors.background || theme.colors.background}
                            onChange={(e) => handleCustomColorChange('background', e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.background || theme.colors.background}
                            onChange={(e) => handleCustomColorChange('background', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Branding & Background */}
              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Logo</h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e.target.files[0])}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-400 transition-colors cursor-pointer"
                      >
                        {logoPreview ? (
                          <div>
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-h-20 mx-auto object-contain mb-2"
                            />
                            <p className="text-sm text-gray-600">Click to change logo</p>
                          </div>
                        ) : (
                          <div>
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className="text-gray-600 mb-2">Upload your business logo</p>
                            <p className="text-sm text-gray-400">PNG, JPG up to 2MB</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {logoPreview && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Dashboard Preview</h4>
                        <div
                          className="rounded-lg p-4 text-white"
                          style={{
                            background: customColors?.primary ?
                              `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                              'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded bg-white/10 p-1 flex items-center justify-center">
                              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <p className="font-bold">{businessInfo?.name || 'Your Studio'}</p>
                              <p className="text-sm text-white/60">Business Dashboard</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Background Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Image</h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBackgroundUpload(e.target.files[0])}
                        className="hidden"
                        id="background-upload"
                      />
                      <label
                        htmlFor="background-upload"
                        className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-400 transition-colors cursor-pointer"
                      >
                        {backgroundImage ? (
                          <div>
                            <img
                              src={backgroundImage}
                              alt="Background preview"
                              className="max-h-20 w-full object-cover rounded mb-2"
                            />
                            <p className="text-sm text-gray-600">Click to change background</p>
                          </div>
                        ) : (
                          <div>
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 mb-2">Upload background image</p>
                            <p className="text-sm text-gray-400">Subtle patterns work best</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {backgroundImage && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Background applied</span>
                        <button
                          onClick={() => setBackgroundImage(null)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                  <div
                    className="p-4 rounded-lg border-2 border-gray-200"
                    style={{
                      backgroundColor: customColors.background || theme.colors.background,
                      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: customColors.primary || theme.colors.primary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: customColors.secondary || theme.colors.secondary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: customColors.accent || theme.colors.accent }}
                        />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">Your Dashboard Preview</p>
                      <p className="text-xs text-gray-500">This is how your theme will look</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setCustomColors({})
                  setBackgroundImage(null)
                  setLogoPreview(null)
                  setBusinessInfo(prev => ({
                    ...prev,
                    logo: null
                  }))
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Reset to Default
              </button>
              <p className="text-sm text-gray-500">Changes are applied instantly</p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings