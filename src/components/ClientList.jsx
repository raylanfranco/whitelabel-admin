import { useState, useEffect } from 'react'

const ClientList = ({ onSelectClient, customColors, backgroundImage }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('lastName')
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referralSource: 'manual',
    clientStatus: 'active',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch real clients from Strapi
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/clients?populate=*')
        if (response.ok) {
          const data = await response.json()
          // Transform Strapi data to our format
          // Strapi v5 returns flat objects, not nested under attributes
          const transformedClients = data.data?.map(client => ({
            id: client.id,
            firstName: client.firstName || client.name?.split(' ')[0] || 'Unknown',
            lastName: client.lastName || client.name?.split(' ').slice(1).join(' ') || '',
            email: client.email || 'N/A',
            phone: client.phone || 'N/A',
            clientStatus: client.clientStatus || 'active',
            totalSessions: 0, // We can calculate this later with appointments
            lastVisit: client.createdAt,
            totalSpent: 0, // We can calculate this later
            referralSource: client.referralSource || 'unknown',
            createdAt: client.createdAt,
            leadViewedAt: client.leadViewedAt
          })) || []
          setClients(transformedClients)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
    // Poll every 30 seconds to catch new leads
    const interval = setInterval(fetchClients, 30000)
    return () => clearInterval(interval)
  }, [])

  // Use real clients from Strapi
  const displayClients = clients

  // Check if client is a new lead (last 24 hours from website AND not viewed yet)
  const isNewLead = (client) => {
    if (client.referralSource !== 'website') return false
    if (client.leadViewedAt) return false // Already viewed, not a new lead anymore
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const clientCreatedAt = new Date(client.createdAt)
    return clientCreatedAt > twentyFourHoursAgo
  }

  // Mark a lead as viewed when clicked
  const handleClientClick = async (client) => {
    // If it's a new lead, mark it as viewed
    if (isNewLead(client)) {
      try {
        await fetch(`http://localhost:1337/api/clients/${client.id}/mark-viewed`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        // Refresh the clients list to update the UI
        const response = await fetch('http://localhost:1337/api/clients?populate=*')
        if (response.ok) {
          const data = await response.json()
          const transformedClients = data.data?.map(c => ({
            id: c.id,
            firstName: c.firstName || c.name?.split(' ')[0] || 'Unknown',
            lastName: c.lastName || c.name?.split(' ').slice(1).join(' ') || '',
            email: c.email || 'N/A',
            phone: c.phone || 'N/A',
            clientStatus: c.clientStatus || 'active',
            totalSessions: 0,
            lastVisit: c.createdAt,
            totalSpent: 0,
            referralSource: c.referralSource || 'unknown',
            createdAt: c.createdAt,
            leadViewedAt: c.leadViewedAt
          })) || []
          setClients(transformedClients)
        }
      } catch (error) {
        console.error('Error marking lead as viewed:', error)
      }
    }
    // Then navigate to client detail
    onSelectClient(client)
  }

  // Handle adding a new client
  const handleAddClient = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:1337/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newClient
        })
      })

      if (response.ok) {
        // Reset form
        setNewClient({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          referralSource: 'manual',
          clientStatus: 'active',
          notes: ''
        })
        setShowAddClientModal(false)

        // Refresh clients list
        const clientsResponse = await fetch('http://localhost:1337/api/clients?populate=*')
        if (clientsResponse.ok) {
          const data = await clientsResponse.json()
          const transformedClients = data.data?.map(c => ({
            id: c.id,
            firstName: c.firstName || c.name?.split(' ')[0] || 'Unknown',
            lastName: c.lastName || c.name?.split(' ').slice(1).join(' ') || '',
            email: c.email || 'N/A',
            phone: c.phone || 'N/A',
            clientStatus: c.clientStatus || 'active',
            totalSessions: 0,
            lastVisit: c.createdAt,
            totalSpent: 0,
            referralSource: c.referralSource || 'unknown',
            createdAt: c.createdAt,
            leadViewedAt: c.leadViewedAt
          })) || []
          setClients(transformedClients)
        }

        alert('Client added successfully!')
      } else {
        const errorData = await response.json()
        alert(`Error adding client: ${errorData.error?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Failed to add client. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredAndSortedClients = displayClients
    .filter(client => {
      const matchesSearch =
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || client.clientStatus === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'lastName':
          return a.lastName.localeCompare(b.lastName)
        case 'firstName':
          return a.firstName.localeCompare(b.firstName)
        case 'lastVisit':
          return new Date(b.lastVisit) - new Date(a.lastVisit)
        case 'totalSpent':
          return b.totalSpent - a.totalSpent
        default:
          return 0
      }
    })

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div
      className="relative h-full pt-6"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/85" />
      )}

    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl relative z-10 mx-6 h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Client Profiles</h1>
          <button
            onClick={() => setShowAddClientModal(true)}
            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            style={{
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            }}
          >
            Add Client
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                style={{
                  '--tw-ring-color': customColors?.primary || '#3B82F6'
                }}
                onFocus={(e) => {
                  if (customColors?.primary) {
                    e.target.style.setProperty('--tw-ring-color', customColors.primary)
                  }
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="lastName">Last Name</option>
              <option value="firstName">First Name</option>
              <option value="lastVisit">Last Visit</option>
              <option value="totalSpent">Total Spent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="px-6 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Loading clients...</p>
        </div>
      )}

      {/* Client List */}
      {!isLoading && (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Calls
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedClients.map((client) => (
              <tr
                key={client.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${isNewLead(client) ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                onClick={() => handleClientClick(client)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm"
                        style={{
                          background: isNewLead(client) ?
                            'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                            customColors?.primary ?
                              `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                              'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                        }}
                      >
                        {getInitials(client.firstName, client.lastName)}
                      </div>
                      {isNewLead(client) && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </span>
                        {isNewLead(client) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 animate-pulse">
                            🔥 NEW LEAD
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {client.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.email}</div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(client.clientStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.totalSessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(client.lastVisit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(client.totalSpent)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClientClick(client)
                    }}
                    className="hover:opacity-80 transition-opacity"
                    style={{
                      color: customColors?.primary || '#3B82F6'
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedClients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </div>
        )}
        </div>
      )}
    </div>

    {/* Add Client Modal */}
    {showAddClientModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Client</h2>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.firstName}
                    onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Source
                </label>
                <select
                  value={newClient.referralSource}
                  onChange={(e) => setNewClient({ ...newClient, referralSource: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newClient.clientStatus}
                  onChange={(e) => setNewClient({ ...newClient, clientStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Any additional notes about the client..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
                  style={{
                    background: customColors?.primary ?
                      `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                      'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                  }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default ClientList