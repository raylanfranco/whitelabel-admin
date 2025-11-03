import { useState } from 'react'

function ServiceEditor({ customColors, backgroundImage }) {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'General Pest Inspection',
      duration: 60,
      price: 95,
      depositPercentage: 0,
      requiresDeposit: false,
      description: 'Comprehensive property inspection for common pests',
      linkedForm: 'Service Request',
      category: 'Inspection',
      active: true
    },
    {
      id: 2,
      name: 'Termite Treatment',
      duration: 180,
      price: 850,
      depositPercentage: 50,
      requiresDeposit: true,
      description: 'Full termite treatment with 1-year warranty',
      linkedForm: 'Service Request',
      category: 'Treatment',
      active: true
    },
    {
      id: 3,
      name: 'Rodent Removal',
      duration: 120,
      price: 275,
      depositPercentage: 30,
      requiresDeposit: true,
      description: 'Humane rodent removal and entry point sealing',
      linkedForm: 'Service Request',
      category: 'Removal',
      active: true
    },
    {
      id: 4,
      name: 'Quarterly Maintenance',
      duration: 45,
      price: 125,
      depositPercentage: 0,
      requiresDeposit: false,
      description: 'Preventative quarterly pest treatment service',
      linkedForm: 'Service Request',
      category: 'Maintenance',
      active: true
    },
    {
      id: 5,
      name: 'Free Quote',
      duration: 30,
      price: 0,
      depositPercentage: 0,
      requiresDeposit: false,
      description: 'Free on-site inspection and quote',
      linkedForm: 'Quote Request',
      category: 'Consultation',
      active: true
    }
  ])

  const [editingService, setEditingService] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const formOptions = [
    'Service Request',
    'Quote Request',
    'Emergency Request',
    'Warranty Claim',
    'Custom Form'
  ]

  const categoryOptions = [
    'Inspection',
    'Treatment',
    'Removal',
    'Maintenance',
    'Consultation',
    'Emergency',
    'Other'
  ]

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateService = () => {
    setIsCreating(true)
    setEditingService({
      id: null,
      name: '',
      duration: 60,
      price: 0,
      depositPercentage: 50,
      requiresDeposit: true,
      description: '',
      linkedForm: 'Tattoo Consultation',
      category: 'Tattoo',
      active: true
    })
  }

  const handleEditService = (service) => {
    setEditingService({ ...service })
    setIsCreating(false)
  }

  const handleSaveService = () => {
    if (isCreating) {
      const newService = {
        ...editingService,
        id: Math.max(...services.map(s => s.id)) + 1
      }
      setServices([...services, newService])
    } else {
      setServices(services.map(s =>
        s.id === editingService.id ? editingService : s
      ))
    }
    setEditingService(null)
    setIsCreating(false)
  }

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId))
    }
  }

  const toggleServiceStatus = (serviceId) => {
    setServices(services.map(s =>
      s.id === serviceId ? { ...s, active: !s.active } : s
    ))
  }

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

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tattoo':
        return 'bg-purple-100 text-purple-800'
      case 'Maintenance':
        return 'bg-blue-100 text-blue-800'
      case 'Consultation':
        return 'bg-green-100 text-green-800'
      case 'Esthetician':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
      {/* Services List */}
      <div className="flex-1 p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service Editor</h1>
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Add Service Button */}
            <button
              onClick={handleCreateService}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className={`border rounded-lg p-6 transition-all ${
                service.active
                  ? 'border-gray-200 bg-white'
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    {!service.active && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Duration</span>
                      <p className="font-medium">{formatDuration(service.duration)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Price</span>
                      <p className="font-medium">{formatPrice(service.price)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Deposit</span>
                      <p className="font-medium">
                        {service.requiresDeposit
                          ? `${service.depositPercentage}% ($${Math.round((service.price * service.depositPercentage) / 100)})`
                          : 'Not required'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Linked Form</span>
                      <p className="font-medium">{service.linkedForm}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleServiceStatus(service.id)}
                    className={`p-2 rounded transition-colors ${
                      service.active
                        ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        : 'text-yellow-600 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title={service.active ? 'Deactivate' : 'Activate'}
                  >
                    {service.active ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500">No services found</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Editor Sidebar */}
      {editingService && (
        <div className="w-96 bg-gray-50 border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {isCreating ? 'Create Service' : 'Edit Service'}
            </h2>
            <button
              onClick={() => setEditingService(null)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                value={editingService.name}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter service name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editingService.category}
                onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={editingService.duration}
                onChange={(e) => setEditingService({ ...editingService, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="15"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={editingService.price}
                onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            {/* Deposit Settings */}
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="requiresDeposit"
                  checked={editingService.requiresDeposit}
                  onChange={(e) => setEditingService({ ...editingService, requiresDeposit: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requiresDeposit" className="ml-2 block text-sm font-medium text-gray-700">
                  Require deposit for booking
                </label>
              </div>

              {editingService.requiresDeposit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Percentage (%)</label>
                  <input
                    type="number"
                    value={editingService.depositPercentage}
                    onChange={(e) => setEditingService({ ...editingService, depositPercentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deposit amount: ${editingService.price ? Math.round((editingService.price * editingService.depositPercentage) / 100) : 0}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editingService.description}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter service description"
              />
            </div>

            {/* Linked Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Linked Form</label>
              <select
                value={editingService.linkedForm}
                onChange={(e) => setEditingService({ ...editingService, linkedForm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {formOptions.map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={editingService.active}
                onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                Active service
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
              <button
                onClick={handleSaveService}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isCreating ? 'Create Service' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditingService(null)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceEditor