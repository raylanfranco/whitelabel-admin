import { useState } from 'react'

function Waitlist({ customColors, backgroundImage }) {
  const [activeTab, setActiveTab] = useState('current')
  const [selectedWaitlistEntry, setSelectedWaitlistEntry] = useState(null)

  // Mock waitlist data
  const [waitlistEntries] = useState([
    {
      id: 1,
      clientName: 'Jessica Parker',
      clientEmail: 'jessica.p@email.com',
      clientPhone: '(555) 123-9876',
      preferredDate: '2025-09-25',
      preferredTime: '2:00 PM',
      serviceRequested: 'Medium Tattoo',
      requestedAt: new Date(2025, 8, 18, 10, 30),
      priority: 1,
      status: 'active',
      notes: 'Flexible with time, prefers afternoon slots'
    },
    {
      id: 2,
      clientName: 'Michael Torres',
      clientEmail: 'mtorres@email.com',
      clientPhone: '(555) 987-6543',
      preferredDate: '2025-09-22',
      preferredTime: '10:00 AM',
      serviceRequested: 'Small Tattoo',
      requestedAt: new Date(2025, 8, 19, 14, 15),
      priority: 2,
      status: 'active',
      notes: 'Only available weekday mornings'
    },
    {
      id: 3,
      clientName: 'Lisa Chen',
      clientEmail: 'lisa.chen@email.com',
      clientPhone: '(555) 456-7890',
      preferredDate: '2025-09-20',
      preferredTime: '4:00 PM',
      serviceRequested: 'Touch-up',
      requestedAt: new Date(2025, 8, 16, 11, 45),
      priority: 3,
      status: 'notified',
      notifiedAt: new Date(2025, 8, 19, 9, 0),
      notes: 'Previous client, quick touch-up needed'
    }
  ])

  // Mock recent notifications
  const [recentNotifications] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      originalDate: '2025-09-20',
      originalTime: '2:00 PM',
      notifiedAt: new Date(2025, 8, 19, 14, 30),
      status: 'accepted',
      acceptedAt: new Date(2025, 8, 19, 14, 45),
      responseTime: '15 minutes'
    },
    {
      id: 2,
      clientName: 'Mike Rodriguez',
      originalDate: '2025-09-18',
      originalTime: '11:00 AM',
      notifiedAt: new Date(2025, 8, 17, 16, 20),
      status: 'declined',
      declinedAt: new Date(2025, 8, 17, 17, 10),
      responseTime: '50 minutes'
    },
    {
      id: 3,
      clientName: 'Emma Davis',
      originalDate: '2025-09-15',
      originalTime: '3:30 PM',
      notifiedAt: new Date(2025, 8, 14, 12, 15),
      status: 'expired',
      expiredAt: new Date(2025, 8, 14, 18, 15),
      responseTime: 'No response (6 hours)'
    }
  ])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Active' },
      notified: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Notified' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
      declined: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expired' }
    }

    const config = statusConfig[status] || statusConfig.active

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const notifyNextClient = (availableSlot) => {
    // Mock notification logic - in production this would trigger SMS/Email
    alert(`Notifying next waitlisted client about ${availableSlot.date} at ${availableSlot.time}`)
  }

  return (
    <div
      className="flex h-full relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/85" />
      )}

      {/* Main Waitlist View */}
      <div className="flex-1 p-6 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Waitlist Management</h1>
          <p className="text-gray-600">Manage client waitlists and automatic notifications for cancellations</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'current'
                ? 'text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={activeTab === 'current' ? {
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            } : {}}
          >
            Current Waitlist ({waitlistEntries.filter(e => e.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'notifications'
                ? 'text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={activeTab === 'notifications' ? {
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            } : {}}
          >
            Recent Notifications ({recentNotifications.length})
          </button>
        </div>

        {/* Current Waitlist Tab */}
        {activeTab === 'current' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            {/* Quick Actions */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Active Waitlist</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => notifyNextClient({ date: 'Sept 25', time: '2:00 PM' })}
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    style={{
                      background: customColors?.accent ?
                        customColors.accent :
                        '#10B981'
                    }}
                  >
                    Notify Next Client
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm text-sm font-medium">
                    Export List
                  </button>
                </div>
              </div>
            </div>

            {/* Waitlist Entries */}
            <div className="divide-y divide-gray-200">
              {waitlistEntries.filter(entry => entry.status === 'active' || entry.status === 'notified').map((entry) => (
                <div key={entry.id} className="p-6 hover:bg-white/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm"
                          style={{
                            background: customColors?.primary ?
                              `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                              'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                          }}
                        >
                          #{entry.priority}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{entry.clientName}</h4>
                          <p className="text-sm text-gray-600">{entry.clientEmail} • {entry.clientPhone}</p>
                        </div>
                        {getStatusBadge(entry.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Preferred Date:</span>
                          <p className="font-medium text-gray-900">{formatDate(entry.preferredDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-medium text-gray-900">{entry.preferredTime}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Service:</span>
                          <p className="font-medium text-gray-900">{entry.serviceRequested}</p>
                        </div>
                      </div>

                      {entry.notes && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Notes:</span>
                          <p className="text-sm text-gray-700 italic">{entry.notes}</p>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Requested: {formatDateTime(entry.requestedAt)}
                        {entry.notifiedAt && (
                          <span className="ml-4">Notified: {formatDateTime(entry.notifiedAt)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => setSelectedWaitlistEntry(entry)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => notifyNextClient({ date: entry.preferredDate, time: entry.preferredTime })}
                        className="p-2 rounded-lg transition-colors hover:bg-white/60"
                        style={{ color: customColors?.primary || '#3B82F6' }}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {waitlistEntries.filter(entry => entry.status === 'active' || entry.status === 'notified').length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Waitlist</h3>
                  <p className="text-gray-500">Clients will be added here when they join waitlists</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Track waitlist notification responses and timing</p>
            </div>

            <div className="divide-y divide-gray-200">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{notification.clientName}</h4>
                        {getStatusBadge(notification.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Available Slot:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(notification.originalDate)} at {notification.originalTime}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Response Time:</span>
                          <p className="font-medium text-gray-900">{notification.responseTime}</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Notified: {formatDateTime(notification.notifiedAt)}
                        {notification.acceptedAt && (
                          <span className="ml-4 text-green-600">Accepted: {formatDateTime(notification.acceptedAt)}</span>
                        )}
                        {notification.declinedAt && (
                          <span className="ml-4 text-red-600">Declined: {formatDateTime(notification.declinedAt)}</span>
                        )}
                        {notification.expiredAt && (
                          <span className="ml-4 text-gray-600">Expired: {formatDateTime(notification.expiredAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Waitlist Entry Detail Sidebar */}
      {selectedWaitlistEntry && (
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-white/50 p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Waitlist Details</h2>
            <button
              onClick={() => setSelectedWaitlistEntry(null)}
              className="p-1 hover:bg-gray-200/60 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <p className="text-gray-900 font-medium">{selectedWaitlistEntry.clientName}</p>
              <p className="text-sm text-gray-600">{selectedWaitlistEntry.clientEmail}</p>
              <p className="text-sm text-gray-600">{selectedWaitlistEntry.clientPhone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Requested</label>
              <p className="text-gray-900">{selectedWaitlistEntry.serviceRequested}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Slot</label>
              <p className="text-gray-900">
                {formatDate(selectedWaitlistEntry.preferredDate)} at {selectedWaitlistEntry.preferredTime}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">#{selectedWaitlistEntry.priority}</span>
                {getStatusBadge(selectedWaitlistEntry.status)}
              </div>
            </div>

            {selectedWaitlistEntry.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900">{selectedWaitlistEntry.notes}</p>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <button
                className="w-full px-4 py-2 text-white rounded-lg transition-colors shadow-sm"
                style={{
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                }}
              >
                Notify Client
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm">
                Edit Preferences
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50/60 transition-colors backdrop-blur-sm">
                Remove from Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Waitlist