import { useState, useEffect } from 'react'

function SMSReminders({ customColors, backgroundImage }) {
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    reminderTime: 24, // hours before appointment
    messageTemplate: 'Hi {clientName}! This is a reminder about your {serviceName} appointment tomorrow at {time}. Reply Y to confirm or N to cancel. Thanks! - {businessName}',
    autoConfirmEnabled: true,
    sendTestMessage: false
  })

  const [usage, setUsage] = useState({
    monthlyLimit: 100,
    currentUsage: 23,
    lastReset: '2025-09-01'
  })

  const [recentMessages, setRecentMessages] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      phone: '+1234567890',
      message: 'Hi Sarah! This is a reminder about your Small Tattoo appointment tomorrow at 2:00 PM. Reply Y to confirm or N to cancel. Thanks! - Ink Studio',
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'delivered',
      response: 'Y',
      responseAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      phone: '+0987654321',
      message: 'Hi Mike! This is a reminder about your Consultation appointment tomorrow at 10:00 AM. Reply Y to confirm or N to cancel. Thanks! - Ink Studio',
      sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'delivered',
      response: null,
      responseAt: null
    },
    {
      id: 3,
      clientName: 'Emily Davis',
      phone: '+5555555555',
      message: 'Hi Emily! This is a reminder about your Touch-up appointment tomorrow at 4:00 PM. Reply Y to confirm or N to cancel. Thanks! - Ink Studio',
      sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'delivered',
      response: 'N',
      responseAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ])

  const handleSettingChange = (field, value) => {
    setReminderSettings(prev => ({ ...prev, [field]: value }))
  }

  const sendTestMessage = async () => {
    // In production, this would send a test SMS via Twilio
    setReminderSettings(prev => ({ ...prev, sendTestMessage: true }))

    // Simulate API call
    setTimeout(() => {
      setReminderSettings(prev => ({ ...prev, sendTestMessage: false }))
      alert('Test message sent successfully!')
    }, 2000)
  }

  const saveSettings = async () => {
    // In production, this would save settings to Strapi
    alert('SMS reminder settings saved successfully!')
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getResponseColor = (response) => {
    switch (response) {
      case 'Y':
        return 'text-green-700 bg-green-100'
      case 'N':
        return 'text-red-700 bg-red-100'
      default:
        return 'text-gray-500'
    }
  }

  const usagePercentage = (usage.currentUsage / usage.monthlyLimit) * 100

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SMS Reminders</h1>
        <p className="text-gray-600">Automate appointment reminders and confirmations via SMS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</h2>

            <div className="space-y-4">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable SMS Reminders</label>
                  <p className="text-sm text-gray-500">Send automatic reminders to clients</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderSettings.enabled}
                    onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Reminder Timing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send reminder how many hours before appointment?
                </label>
                <select
                  value={reminderSettings.reminderTime}
                  onChange={(e) => handleSettingChange('reminderTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!reminderSettings.enabled}
                >
                  <option value={1}>1 hour before</option>
                  <option value={2}>2 hours before</option>
                  <option value={4}>4 hours before</option>
                  <option value={12}>12 hours before</option>
                  <option value={24}>24 hours before</option>
                  <option value={48}>48 hours before</option>
                </select>
              </div>

              {/* Auto-confirm */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoConfirm"
                  checked={reminderSettings.autoConfirmEnabled}
                  onChange={(e) => handleSettingChange('autoConfirmEnabled', e.target.checked)}
                  disabled={!reminderSettings.enabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoConfirm" className="ml-2 text-sm text-gray-700">
                  Enable two-way messaging (clients can reply Y/N to confirm/cancel)
                </label>
              </div>
            </div>
          </div>

          {/* Message Template */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Template</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Message Template
              </label>
              <textarea
                value={reminderSettings.messageTemplate}
                onChange={(e) => handleSettingChange('messageTemplate', e.target.value)}
                rows={4}
                disabled={!reminderSettings.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter your SMS message template"
              />
              <div className="mt-2 text-xs text-gray-500">
                <p className="mb-1">Available variables:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span>• {'{clientName}'} - Client's name</span>
                  <span>• {'{serviceName}'} - Service name</span>
                  <span>• {'{time}'} - Appointment time</span>
                  <span>• {'{date}'} - Appointment date</span>
                  <span>• {'{businessName}'} - Your business name</span>
                  <span>• {'{duration}'} - Appointment duration</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              <p className="text-sm text-gray-600">
                Hi Sarah! This is a reminder about your Small Tattoo appointment tomorrow at 2:00 PM. Reply Y to confirm or N to cancel. Thanks! - Ink Studio
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={sendTestMessage}
              disabled={!reminderSettings.enabled || reminderSettings.sendTestMessage}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                !reminderSettings.enabled || reminderSettings.sendTestMessage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {reminderSettings.sendTestMessage ? 'Sending...' : 'Send Test Message'}
            </button>

            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Usage & Activity Sidebar */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Usage</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Messages sent</span>
                  <span className="font-medium">{usage.currentUsage} / {usage.monthlyLimit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      usagePercentage > 90 ? 'bg-red-500' :
                      usagePercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Resets on {new Date(usage.lastReset).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Free tier includes:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 100 SMS messages/month</li>
                  <li>• Two-way messaging</li>
                  <li>• Delivery confirmations</li>
                  <li>• Template customization</li>
                </ul>
              </div>

              {usagePercentage > 75 && (
                <div className={`p-3 rounded-lg ${
                  usagePercentage > 90 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <p className="text-sm font-medium">
                    {usagePercentage > 90 ? 'Usage limit almost reached!' : 'High usage detected'}
                  </p>
                  <p className="text-xs mt-1">
                    Consider upgrading for unlimited messages
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>

            <div className="space-y-4">
              {recentMessages.map(message => (
                <div key={message.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">{message.clientName}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {message.message}
                  </p>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{formatDate(message.sentAt)}</span>
                    {message.response && (
                      <span className={`px-2 py-1 rounded ${getResponseColor(message.response)}`}>
                        Replied: {message.response === 'Y' ? 'Confirmed' : 'Cancelled'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all messages →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SMSReminders