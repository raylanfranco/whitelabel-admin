import { useState } from 'react'

const ClientDetail = ({ client, onBack, onStartConversation }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No client selected</h3>
          <p className="text-sm text-gray-500">Choose a client from the list to view their profile</p>
        </div>
      </div>
    )
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Mock data for additional client details
  const extendedClientData = {
    ...client,
    dateOfBirth: '1990-05-15',
    emergencyContact: 'John Johnson (Brother)',
    emergencyPhone: '(555) 987-6543',
    allergies: 'None known',
    skinType: 'normal',
    notes: 'Regular client, prefers afternoon appointments. Very happy with previous work.',
    firstVisit: '2023-08-15',
    preferredAppointmentTime: 'afternoon'
  }

  // Mock conversation data
  const recentMessages = [
    {
      id: 1,
      text: 'Thank you for the consultation!',
      timestamp: '2:30 PM',
      sender: 'client'
    },
    {
      id: 2,
      text: 'You\'re welcome! Don\'t forget to follow the aftercare instructions.',
      timestamp: '2:35 PM',
      sender: 'business'
    }
  ]

  // Mock appointment history
  const appointmentHistory = [
    {
      id: 1,
      date: '2024-03-15',
      service: 'Tattoo Touch-up',
      duration: '2 hours',
      amount: 200.00,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-02-20',
      service: 'New Tattoo Design',
      duration: '4 hours',
      amount: 600.00,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-04-10',
      service: 'Consultation',
      duration: '30 minutes',
      amount: 0.00,
      status: 'scheduled'
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'messages', name: 'Messages' },
    { id: 'forms', name: 'Forms' }
  ]

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
                {getInitials(client.firstName, client.lastName)}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.firstName} {client.lastName}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  {getStatusBadge(client.clientStatus)}
                  <span className="text-sm text-gray-500">
                    Client since {formatDate(extendedClientData.firstVisit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onStartConversation(client)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{client.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{client.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(extendedClientData.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <p className="mt-1 text-sm text-gray-900">{extendedClientData.emergencyContact}</p>
                    <p className="text-sm text-gray-500">{extendedClientData.emergencyPhone}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allergies</label>
                    <p className="mt-1 text-sm text-gray-900">{extendedClientData.allergies}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skin Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{extendedClientData.skinType}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                <p className="text-sm text-gray-700">{extendedClientData.notes}</p>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Client Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Sessions</span>
                    <span className="text-sm text-gray-900">{client.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Spent</span>
                    <span className="text-sm text-gray-900">{formatCurrency(client.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Last Visit</span>
                    <span className="text-sm text-gray-900">{formatDate(client.lastVisit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Referral Source</span>
                    <span className="text-sm text-gray-900 capitalize">{client.referralSource.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Preferred Time</span>
                    <span className="text-sm text-gray-900 capitalize">{extendedClientData.preferredAppointmentTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Appointment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointmentHistory.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.amount > 0 ? formatCurrency(appointment.amount) : 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>
              <button
                onClick={() => onStartConversation(client)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Open Chat
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'business' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className={`mt-1 text-xs ${message.sender === 'business' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Form Submissions</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No forms submitted</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Form submissions will appear here once the client completes any intake or consent forms.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientDetail