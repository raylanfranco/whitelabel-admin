import { useState, useRef, useEffect } from 'react'

function ConsentForms({ customColors, backgroundImage }) {
  const [activeTab, setActiveTab] = useState('forms')
  const [selectedForm, setSelectedForm] = useState(null)
  const [isSignatureMode, setIsSignatureMode] = useState(false)
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signature, setSignature] = useState(null)

  // Mock consent forms data
  const [consentForms] = useState([
    {
      id: 1,
      title: 'Tattoo Consent & Waiver',
      serviceType: 'Tattoo',
      description: 'Standard consent form for all tattoo services',
      lastUpdated: new Date(2025, 8, 15),
      isActive: true,
      signaturesCount: 47,
      sections: [
        {
          title: 'Client Information',
          fields: ['Full Name', 'Date of Birth', 'Phone', 'Email', 'Emergency Contact']
        },
        {
          title: 'Health Declaration',
          fields: ['Medical Conditions', 'Medications', 'Allergies', 'Pregnancy Status']
        },
        {
          title: 'Tattoo Details',
          fields: ['Design Description', 'Placement', 'Size', 'Colors']
        },
        {
          title: 'Consent & Acknowledgment',
          fields: ['Risk Understanding', 'Aftercare Instructions', 'Photo Consent']
        }
      ]
    },
    {
      id: 2,
      title: 'Piercing Consent Form',
      serviceType: 'Piercing',
      description: 'Consent and safety form for body piercing services',
      lastUpdated: new Date(2025, 8, 12),
      isActive: true,
      signaturesCount: 23,
      sections: [
        {
          title: 'Client Information',
          fields: ['Full Name', 'Date of Birth', 'Phone', 'Email']
        },
        {
          title: 'Piercing Details',
          fields: ['Piercing Type', 'Jewelry Selection', 'Placement']
        },
        {
          title: 'Health & Safety',
          fields: ['Medical History', 'Allergies', 'Consent to Piercing']
        }
      ]
    },
    {
      id: 3,
      title: 'Touch-up Service Agreement',
      serviceType: 'Touch-up',
      description: 'Agreement for tattoo touch-up and maintenance services',
      lastUpdated: new Date(2025, 8, 10),
      isActive: false,
      signaturesCount: 8,
      sections: [
        {
          title: 'Original Work Information',
          fields: ['Original Tattoo Date', 'Artist', 'Issues Description']
        },
        {
          title: 'Touch-up Agreement',
          fields: ['Work Scope', 'Warranty Terms', 'Payment Agreement']
        }
      ]
    }
  ])

  // Mock signed forms data
  const [signedForms] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@email.com',
      formTitle: 'Tattoo Consent & Waiver',
      signedAt: new Date(2025, 8, 18, 14, 30),
      appointmentDate: new Date(2025, 8, 20, 14, 0),
      status: 'completed',
      pdfUrl: '/signatures/sarah-johnson-consent-2025-09-18.pdf'
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      clientEmail: 'mike.chen@email.com',
      formTitle: 'Piercing Consent Form',
      signedAt: new Date(2025, 8, 17, 16, 45),
      appointmentDate: new Date(2025, 8, 22, 10, 0),
      status: 'completed',
      pdfUrl: '/signatures/mike-chen-piercing-2025-09-17.pdf'
    },
    {
      id: 3,
      clientName: 'Emily Davis',
      clientEmail: 'emily.davis@email.com',
      formTitle: 'Tattoo Consent & Waiver',
      signedAt: null,
      appointmentDate: new Date(2025, 8, 25, 16, 0),
      status: 'pending',
      sentAt: new Date(2025, 8, 19, 9, 0)
    }
  ])

  // Canvas signature functionality
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
    }
  }, [isSignatureMode])

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    // Handle touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    // Account for canvas scaling
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    const { x, y } = getCoordinates(e)

    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()

    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    const signatureData = canvas.toDataURL()
    setSignature(signatureData)
    setIsSignatureMode(false)
    // In production, this would upload to Supabase and generate PDF
    alert('Signature saved! In production, this would generate a PDF.')
  }

  const formatDate = (date) => {
    if (!date) return 'Not signed'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Signed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
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

      {/* Main Content */}
      <div className="flex-1 p-6 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Sign Consent Forms</h1>
          <p className="text-gray-600">Manage digital consent forms and capture electronic signatures</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'forms'
                ? 'text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={activeTab === 'forms' ? {
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            } : {}}
          >
            Form Templates ({consentForms.length})
          </button>
          <button
            onClick={() => setActiveTab('signatures')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'signatures'
                ? 'text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={activeTab === 'signatures' ? {
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            } : {}}
          >
            Signed Forms ({signedForms.filter(f => f.status === 'completed').length})
          </button>
        </div>

        {/* Form Templates Tab */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Form Templates</h3>
                <div className="flex items-center space-x-3">
                  <button
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    style={{
                      background: customColors?.primary ?
                        `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                        'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                    }}
                  >
                    Create New Form
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm text-sm font-medium">
                    Import Template
                  </button>
                </div>
              </div>
            </div>

            {/* Form Templates Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {consentForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:bg-white/90 transition-all cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{
                          background: customColors?.primary ?
                            `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                            'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{form.title}</h4>
                        <p className="text-sm text-gray-600">{form.serviceType}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      form.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {form.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{form.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Sections:</span>
                      <p className="font-medium text-gray-900">{form.sections.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Signatures:</span>
                      <p className="font-medium text-gray-900">{form.signaturesCount}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated {formatDate(form.lastUpdated)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsSignatureMode(true)
                        }}
                        className="text-xs font-medium hover:opacity-80 transition-opacity"
                        style={{ color: customColors?.primary || '#3B82F6' }}
                      >
                        Test Sign →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signed Forms Tab */}
        {activeTab === 'signatures' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Signed Consent Forms</h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm text-sm font-medium">
                    Export Records
                  </button>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white/80 backdrop-blur-sm">
                    <option>All Forms</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Signed Forms List */}
            <div className="divide-y divide-gray-200">
              {signedForms.map((form) => (
                <div key={form.id} className="p-6 hover:bg-white/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{form.clientName}</h4>
                        {getStatusBadge(form.status)}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{form.formTitle}</p>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Client Email:</span>
                          <p className="font-medium text-gray-900">{form.clientEmail}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Appointment:</span>
                          <p className="font-medium text-gray-900">{formatDate(form.appointmentDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Signed:</span>
                          <p className="font-medium text-gray-900">{formatDate(form.signedAt)}</p>
                        </div>
                      </div>

                      {form.status === 'pending' && form.sentAt && (
                        <div className="mt-2 text-xs text-gray-500">
                          Form sent: {formatDate(form.sentAt)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      {form.status === 'completed' && (
                        <button
                          className="p-2 rounded-lg transition-colors hover:bg-white/60"
                          style={{ color: customColors?.primary || '#3B82F6' }}
                          title="Download PDF"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      )}
                      {form.status === 'pending' && (
                        <button
                          className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                          title="Resend Form"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Detail Sidebar */}
      {selectedForm && !isSignatureMode && (
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-white/50 p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Form Details</h2>
            <button
              onClick={() => setSelectedForm(null)}
              className="p-1 hover:bg-gray-200/60 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{selectedForm.title}</h3>
              <p className="text-sm text-gray-600">{selectedForm.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Form Sections</h4>
              <div className="space-y-3">
                {selectedForm.sections.map((section, index) => (
                  <div key={index} className="bg-white/60 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 text-sm mb-2">{section.title}</h5>
                    <p className="text-xs text-gray-600">{section.fields.length} fields</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsSignatureMode(true)}
                className="w-full px-4 py-2 text-white rounded-lg transition-colors shadow-sm"
                style={{
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                }}
              >
                Test Signature
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm">
                Edit Form
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm">
                Send to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Capture Modal */}
      {isSignatureMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Electronic Signature</h3>
              <p className="text-sm text-gray-600 mt-1">Please sign in the box below</p>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="w-full border rounded bg-white cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ touchAction: 'none' }}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Draw your signature above using your mouse or touch screen
                </p>
              </div>

              {signature && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ Signature captured successfully!</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={clearSignature}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsSignatureMode(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={saveSignature}
                className="px-6 py-2 text-white rounded-lg transition-colors shadow-sm"
                style={{
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                }}
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsentForms