import { useState } from 'react'

function Forms({ customColors, backgroundImage }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock form submissions data
  const mockSubmissions = [
    {
      id: 1,
      formType: 'Tattoo Consultation',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@email.com',
      submittedAt: new Date(2025, 8, 15, 14, 30),
      status: 'new',
      data: {
        'Design Description': 'Small butterfly on wrist, black and grey style',
        'Preferred Size': '2-3 inches',
        'Previous Tattoos': 'None',
        'Budget Range': '$200-400',
        'Medical Conditions': 'None',
        'Preferred Appointment Time': 'Weekday afternoons'
      }
    },
    {
      id: 2,
      formType: 'Aftercare Form',
      clientName: 'Mike Chen',
      clientEmail: 'mike.chen@email.com',
      submittedAt: new Date(2025, 8, 18, 16, 45),
      status: 'reviewed',
      data: {
        'Healing Progress': 'Good, no issues',
        'Pain Level': '2/10',
        'Following Instructions': 'Yes',
        'Additional Questions': 'When can I go swimming?',
        'Photos Uploaded': '3 images'
      }
    },
    {
      id: 3,
      formType: 'Touch-up Request',
      clientName: 'Emily Davis',
      clientEmail: 'emily.davis@email.com',
      submittedAt: new Date(2025, 8, 20, 11, 15),
      status: 'new',
      data: {
        'Original Tattoo Date': 'March 2025',
        'Issue Description': 'Some lines appear faded on the left side',
        'Photos Provided': 'Yes, 2 images',
        'Preferred Schedule': 'Weekend mornings',
        'Additional Notes': 'Healed completely, just needs minor touch-up'
      }
    },
    {
      id: 4,
      formType: 'Cancellation Request',
      clientName: 'Alex Thompson',
      clientEmail: 'alex.t@email.com',
      submittedAt: new Date(2025, 8, 12, 9, 20),
      status: 'processed',
      data: {
        'Appointment Date': 'September 25, 2025',
        'Reason for Cancellation': 'Family emergency',
        'Reschedule Request': 'Yes, preferably next month',
        'Deposit Refund': 'Transfer to new appointment',
        'Contact Preference': 'Email'
      }
    }
  ]

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus
    const matchesSearch = submission.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.formType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'processed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const downloadSubmission = (submission) => {
    const dataStr = JSON.stringify(submission, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${submission.formType.replace(/\s+/g, '_')}_${submission.clientName.replace(/\s+/g, '_')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
      {/* Form Submissions List */}
      <div className="flex-1 p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent backdrop-blur-sm bg-white/80"
                style={{
                  '--tw-ring-color': customColors?.primary || '#3B82F6'
                }}
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

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="processed">Processed</option>
            </select>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-4">
          {filteredSubmissions.map(submission => (
            <div
              key={submission.id}
              onClick={() => setSelectedSubmission(submission)}
              className="border border-white/30 rounded-2xl p-6 hover:bg-white/60 cursor-pointer transition-colors bg-white/50 backdrop-blur-sm shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">{submission.formType}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(submission.submittedAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">{submission.clientName}</p>
                  <p className="text-sm text-gray-500">{submission.clientEmail}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadSubmission(submission)
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Download"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No form submissions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Details Sidebar */}
      {selectedSubmission && (
        <div className="w-96 bg-gray-50 border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Submission Details</h2>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">{selectedSubmission.formType}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Client:</span>
                  <span className="text-sm font-medium">{selectedSubmission.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email:</span>
                  <span className="text-sm">{selectedSubmission.clientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Submitted:</span>
                  <span className="text-sm">{formatDate(selectedSubmission.submittedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Data */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Form Responses</h4>
              <div className="space-y-4">
                {Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                    <p className="text-sm text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => downloadSubmission(selectedSubmission)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download</span>
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Mark as Reviewed
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Contact Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Forms